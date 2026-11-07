import { notFound } from "next/navigation";
import { getTenantBySlug, toTenantConfig } from "@/lib/tenant";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ tenantSlug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: { params: Promise<{ tenantSlug: string }> }): Promise<Metadata> {
  const { tenantSlug } = await params;
  const tenant = getTenantBySlug(tenantSlug);
  if (!tenant) return {};
  return {
    title: `Gutschein kaufen — ${tenant.name}`,
    robots: { index: false, follow: false },
  };
}

export default async function EmbedLayout({ params, children }: Props) {
  const { tenantSlug } = await params;
  const tenant = getTenantBySlug(tenantSlug);
  if (!tenant) notFound();
  const config = toTenantConfig(tenant);
  const branding = config.branding;

  const themeVars: Record<string, string> = {
    "--color-accent": branding.primaryColor,
    "--color-accent-hover": branding.primaryHoverColor,
    "--color-background": branding.backgroundColor,
    "--color-foreground": branding.foregroundColor,
    "--color-surface": branding.surfaceColor,
    "--color-border": branding.borderColor,
    "--font-display": branding.displayFont,
  };

  return (
    <div style={themeVars as React.CSSProperties}>
      {children}
    </div>
  );
}
