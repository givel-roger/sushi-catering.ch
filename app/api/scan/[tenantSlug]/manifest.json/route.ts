import { NextRequest, NextResponse } from "next/server";
import { getTenantBySlug, toTenantConfig } from "@/lib/tenant";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ tenantSlug: string }> }
) {
  const { tenantSlug } = await params;
  const tenant = getTenantBySlug(tenantSlug);

  const name = tenant ? `${tenant.name} Scanner` : "Gutschein Scanner";
  const shortName = tenant ? tenant.name : "Scanner";
  const config = tenant ? toTenantConfig(tenant) : null;
  const themeColor = "#030712";
  const bgColor = "#030712";

  const manifest = {
    name,
    short_name: shortName,
    description: `Gutscheine scannen und einlösen${tenant ? ` für ${tenant.name}` : ""}`,
    start_url: `/scan/${tenantSlug}`,
    scope: `/scan/${tenantSlug}`,
    display: "standalone",
    orientation: "portrait",
    theme_color: themeColor,
    background_color: bgColor,
    icons: [
      {
        src: `/api/scan/${tenantSlug}/icon?size=192`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: `/api/scan/${tenantSlug}/icon?size=512`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
