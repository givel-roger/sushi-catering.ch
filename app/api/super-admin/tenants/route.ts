import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { hashSync } from "bcryptjs";
import { getDb, schema } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { DEFAULT_BRANDING, DEFAULT_AMOUNTS, DEFAULT_MOTIFS } from "@/lib/types";

async function requireSuperAdmin() {
  const user = await getAuthUser();
  if (!user || user.role !== "superadmin") return null;
  return user;
}

export async function GET() {
  const user = await requireSuperAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const allTenants = db.select().from(schema.tenants).all();
  const allAdmins = db
    .select({ id: schema.admins.id, email: schema.admins.email, name: schema.admins.name, role: schema.admins.role, tenantId: schema.admins.tenantId })
    .from(schema.admins)
    .all();

  const gutscheinCounts = db
    .select({ tenantId: schema.gutscheine.tenantId })
    .from(schema.gutscheine)
    .all();

  return NextResponse.json(
    allTenants.map((t) => ({
      ...t,
      admins: allAdmins.filter((a) => a.tenantId === t.id),
      gutscheinCount: gutscheinCounts.filter((g) => g.tenantId === t.id).length,
    }))
  );
}

export async function POST(req: NextRequest) {
  const user = await requireSuperAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { slug, name, codePrefix, website, phone, email, addressStreet, addressCity, addressZip, adminEmail, adminPassword, adminName, branding } = body;

  if (!slug || !name || !codePrefix) {
    return NextResponse.json({ error: "Slug, Name und Code-Prefix sind Pflichtfelder." }, { status: 400 });
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten." }, { status: 400 });
  }

  const db = getDb();

  const existing = db.select().from(schema.tenants).where(eq(schema.tenants.slug, slug)).get();
  if (existing) {
    return NextResponse.json({ error: "Ein Tenant mit diesem Slug existiert bereits." }, { status: 409 });
  }

  const prefixExists = db.select().from(schema.tenants).where(eq(schema.tenants.codePrefix, codePrefix.toUpperCase())).get();
  if (prefixExists) {
    return NextResponse.json({ error: "Dieses Code-Prefix wird bereits verwendet." }, { status: 409 });
  }

  const tenantId = randomBytes(16).toString("hex");

  const tenantBranding = branding ? { ...DEFAULT_BRANDING, ...branding } : DEFAULT_BRANDING;

  db.insert(schema.tenants).values({
    id: tenantId,
    slug,
    name,
    codePrefix: codePrefix.toUpperCase(),
    website: website || null,
    phone: phone || null,
    email: email || null,
    addressStreet: addressStreet || null,
    addressCity: addressCity || null,
    addressZip: addressZip || null,
    branding: tenantBranding,
    motifs: null,
    amountPresets: DEFAULT_AMOUNTS,
    minAmount: 20,
    maxAmount: 1000,
    active: true,
  }).run();

  if (adminEmail && adminPassword) {
    const adminId = randomBytes(16).toString("hex");
    db.insert(schema.admins).values({
      id: adminId,
      tenantId,
      email: adminEmail,
      passwordHash: hashSync(adminPassword, 10),
      name: adminName || name,
      role: "admin",
    }).run();
  }

  return NextResponse.json({ success: true, tenantId, slug });
}
