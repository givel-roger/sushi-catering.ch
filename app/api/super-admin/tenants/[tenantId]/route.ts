import { NextRequest, NextResponse } from "next/server";
import { getDb, schema } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { eq } from "drizzle-orm";

async function requireSuperAdmin() {
  const user = await getAuthUser();
  if (!user || user.role !== "superadmin") return null;
  return user;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  const user = await requireSuperAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { tenantId } = await params;
  const db = getDb();

  const tenant = db.select().from(schema.tenants).where(eq(schema.tenants.id, tenantId)).get();
  if (!tenant) return NextResponse.json({ error: "Tenant nicht gefunden." }, { status: 404 });

  const admins = db
    .select({ id: schema.admins.id, email: schema.admins.email, name: schema.admins.name, role: schema.admins.role })
    .from(schema.admins)
    .where(eq(schema.admins.tenantId, tenantId))
    .all();

  const gutscheine = db.select().from(schema.gutscheine).where(eq(schema.gutscheine.tenantId, tenantId)).all();

  return NextResponse.json({ ...tenant, admins, gutscheinCount: gutscheine.length });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  const user = await requireSuperAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { tenantId } = await params;
  const body = await req.json();
  const db = getDb();

  const tenant = db.select().from(schema.tenants).where(eq(schema.tenants.id, tenantId)).get();
  if (!tenant) return NextResponse.json({ error: "Tenant nicht gefunden." }, { status: 404 });

  const updates: Record<string, unknown> = {};
  const allowed = ["name", "website", "phone", "email", "addressStreet", "addressCity", "addressZip", "active", "branding", "platformFeePercent", "minAmount", "maxAmount", "amountPresets"];

  for (const key of allowed) {
    if (key in body) {
      updates[key] = body[key];
    }
  }

  if (Object.keys(updates).length > 0) {
    updates.updatedAt = new Date().toISOString();
    db.update(schema.tenants).set(updates).where(eq(schema.tenants.id, tenantId)).run();
  }

  return NextResponse.json({ success: true });
}
