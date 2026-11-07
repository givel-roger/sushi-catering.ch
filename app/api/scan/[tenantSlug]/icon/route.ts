import { NextRequest, NextResponse } from "next/server";
import { getTenantBySlug, toTenantConfig } from "@/lib/tenant";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tenantSlug: string }> }
) {
  const { tenantSlug } = await params;
  const size = parseInt(req.nextUrl.searchParams.get("size") || "192");
  const tenant = getTenantBySlug(tenantSlug);
  const config = tenant ? toTenantConfig(tenant) : null;
  const accent = config?.branding.primaryColor || "#3b82f6";
  const initial = config?.name.charAt(0).toUpperCase() || "G";

  // Generate a simple SVG icon
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="${accent}"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
          font-family="system-ui,-apple-system,sans-serif" font-weight="700"
          font-size="${size * 0.5}" fill="white">${initial}</text>
  </svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
