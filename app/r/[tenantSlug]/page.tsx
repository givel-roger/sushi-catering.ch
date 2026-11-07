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

      {/* Compact Hero with background image */}
      <section className="relative bg-foreground text-white pt-16 pb-6 sm:pt-20 sm:pb-8 overflow-hidden">
        {branding.heroImageUrl && (
          <Image
            src={branding.heroImageUrl}
            alt=""
            fill
            className="object-cover opacity-25"
            priority
          />
        )}
        <div className="relative max-w-[1100px] mx-auto px-5 sm:px-10">
          <h1 className="font-display text-2xl sm:text-3xl text-white mb-1 leading-tight">
            {branding.heroTitle}
          </h1>
          <p className="text-white/70 text-sm max-w-lg leading-relaxed">
            {branding.heroSubtitle}
          </p>
        </div>
      </section>

      <PurchaseWizard tenant={config} />

      <TenantFooter tenant={config} />
    </div>
  );
}
