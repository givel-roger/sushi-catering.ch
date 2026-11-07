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
    title: {
      default: `Gutschein schenken — ${tenant.name}`,
      template: `%s | ${tenant.name}`,
    },
    description: `Gutschein kaufen und verschenken für ${tenant.name}. In wenigen Minuten gekauft, sofort per Mail, ohne Verfalldatum.`,
  };
}

export default async function TenantLayout({ params, children }: Props) {
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: config.name,
    description: `Gutscheine online kaufen und verschenken für ${config.name}.`,
    ...(config.website && { url: config.website }),
    ...(config.phone && { telephone: config.phone.replace(/\s/g, "") }),
    ...(config.addressStreet && {
      address: {
        "@type": "PostalAddress",
        streetAddress: config.addressStreet,
        addressLocality: config.addressCity,
        postalCode: config.addressZip,
        addressCountry: "CH",
      },
    }),
  };

  return (
    <div style={themeVars as React.CSSProperties}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </div>
  );
}
