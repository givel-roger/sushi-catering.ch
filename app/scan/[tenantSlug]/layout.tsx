import type { Metadata, Viewport } from "next";

type Props = {
  params: Promise<{ tenantSlug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: { params: Promise<{ tenantSlug: string }> }): Promise<Metadata> {
  const { tenantSlug } = await params;
  const { getTenantBySlug } = await import("@/lib/tenant");
  const tenant = getTenantBySlug(tenantSlug);

  return {
    title: tenant ? `Scanner — ${tenant.name}` : "Gutschein Scanner",
    description: "Gutscheine scannen und einlösen",
    manifest: `/api/scan/${tenantSlug}/manifest.json`,
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: tenant ? `${tenant.name} Scanner` : "Gutschein Scanner",
    },
  };
}

export function generateViewport(): Viewport {
  return {
    themeColor: "#030712",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  };
}

export default function ScanLayout({ children }: Props) {
  return <>{children}</>;
}
