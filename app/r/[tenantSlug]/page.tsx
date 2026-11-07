import { notFound } from "next/navigation";
import Image from "next/image";
import { getTenantBySlug, toTenantConfig } from "@/lib/tenant";
import TenantNav from "@/components/TenantNav";
import TenantFooter from "@/components/TenantFooter";
import PurchaseWizard from "@/components/PurchaseWizard";

type Props = {
  params: Promise<{ tenantSlug: string }>;
};

export default async function TenantPage({ params }: Props) {
  const { tenantSlug } = await params;
  const tenant = getTenantBySlug(tenantSlug);
  if (!tenant) notFound();

  const config = toTenantConfig(tenant);
  const branding = config.branding;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TenantNav tenant={config} />

      {/* Hero */}
      <section className="bg-foreground text-white pt-24 pb-14 sm:pt-28 sm:pb-16">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-10">
          {branding.logoUrl && (
            <div className="flex items-center gap-3 mb-6">
              <Image src={branding.logoUrl} alt={config.name} width={160} height={49} className="h-8 w-auto invert" />
            </div>
          )}
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-4 leading-tight">
            {branding.heroTitle}
          </h1>
          <p className="text-white/70 text-lg max-w-xl leading-relaxed">
            {branding.heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-2 mt-6 text-sm text-white/50">
            <span>{config.name}</span>
            {config.addressStreet && config.addressCity && (
              <span>{config.addressStreet}, {config.addressCity}</span>
            )}
          </div>
        </div>
      </section>

      <PurchaseWizard tenant={config} />

      <TenantFooter tenant={config} />
    </div>
  );
}
