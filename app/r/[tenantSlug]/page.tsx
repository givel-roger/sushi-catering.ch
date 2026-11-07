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

      {/* Hero with optional background image */}
      <section className="relative bg-foreground text-white pt-20 pb-10 sm:pt-24 sm:pb-12 overflow-hidden">
        {branding.heroImageUrl && (
          <Image
            src={branding.heroImageUrl}
            alt=""
            fill
            className="object-cover opacity-30"
            priority
          />
        )}
        <div className="relative max-w-[1100px] mx-auto px-5 sm:px-10">
          {branding.logoUrl && (
            <div className="mb-4">
              <Image
                src={branding.logoUrl}
                alt={config.name}
                width={140}
                height={43}
                className="h-8 sm:h-10 w-auto brightness-0 invert"
              />
            </div>
          )}
          <h1 className="font-display text-3xl sm:text-4xl text-white mb-2 leading-tight">
            {branding.heroTitle}
          </h1>
          <p className="text-white/70 text-base max-w-lg leading-relaxed">
            {branding.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Steps indicator */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-10 py-4">
          <div className="flex items-center justify-center gap-2 sm:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-semibold">1</span>
              <span className="text-foreground font-medium hidden sm:inline">Betrag wählen</span>
            </div>
            <div className="w-6 sm:w-10 h-px bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-border text-muted flex items-center justify-center text-xs font-semibold">2</span>
              <span className="text-muted hidden sm:inline">Gestalten</span>
            </div>
            <div className="w-6 sm:w-10 h-px bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-border text-muted flex items-center justify-center text-xs font-semibold">3</span>
              <span className="text-muted hidden sm:inline">Widmung</span>
            </div>
            <div className="w-6 sm:w-10 h-px bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-border text-muted flex items-center justify-center text-xs font-semibold">4</span>
              <span className="text-muted hidden sm:inline">Bezahlen</span>
            </div>
          </div>
        </div>
      </div>

      <PurchaseWizard tenant={config} />

      <TenantFooter tenant={config} />
    </div>
  );
}
