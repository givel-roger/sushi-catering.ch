import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { generateGutscheinPdf } from "@/lib/pdf";
import { toTenantConfig } from "@/lib/tenant";
import { DEFAULT_MOTIFS } from "@/lib/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  const gutschein = db
    .select()
    .from(schema.gutscheine)
    .where(eq(schema.gutscheine.id, id))
    .get();

  if (!gutschein) {
    return NextResponse.json({ error: "Gutschein nicht gefunden." }, { status: 404 });
  }

  if (gutschein.status === "pending") {
    return NextResponse.json({ error: "Gutschein noch nicht bezahlt." }, { status: 402 });
  }

  const tenant = db
    .select()
    .from(schema.tenants)
    .where(eq(schema.tenants.id, gutschein.tenantId))
    .get();

  if (!tenant) {
    return NextResponse.json({ error: "Tenant nicht gefunden." }, { status: 404 });
  }

  const config = toTenantConfig(tenant);
  const motif = config.motifs.find(m => m.id === gutschein.motif) || DEFAULT_MOTIFS[0];

  const pdfBytes = await generateGutscheinPdf({
    code: gutschein.code,
    amount: gutschein.amount,
    motifLabel: motif.label,
    widmungFuer: gutschein.widmungFuer || "",
    widmungVon: gutschein.widmungVon || "",
    widmungNachricht: gutschein.widmungNachricht || "",
    tenantSlug: config.slug,
    tenantName: config.name,
    tenantAddress: [config.addressStreet, config.addressZip && config.addressCity ? `${config.addressZip} ${config.addressCity}` : ""].filter(Boolean).join(", "),
    tenantPhone: config.phone || "",
    tenantWebsite: config.website || "",
    accentColor: config.branding.primaryColor,
    foregroundColor: config.branding.foregroundColor,
  });

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="gutschein-${gutschein.code}.pdf"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
