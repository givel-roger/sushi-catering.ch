import { notFound } from "next/navigation";
import Link from "next/link";
import { getTenantBySlug, toTenantConfig } from "@/lib/tenant";
import TenantNav from "@/components/TenantNav";
import TenantFooter from "@/components/TenantFooter";

type Props = {
  params: Promise<{ tenantSlug: string }>;
};

export default async function ErfolgPage({ params }: Props) {
  const { tenantSlug } = await params;
  const tenant = getTenantBySlug(tenantSlug);
  if (!tenant) notFound();
  const config = toTenantConfig(tenant);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TenantNav tenant={config} />

      <div className="flex-1 flex items-center justify-center px-5 py-20">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-4xl text-foreground mb-4">Vielen Dank!</h1>
          <p className="text-muted text-lg mb-2">
            Dein Gutschein für {config.name} wurde erfolgreich bezahlt.
          </p>
          <p className="text-muted mb-8">
            Du erhältst in Kürze eine E-Mail mit dem Gutschein als PDF.
          </p>
          <Link
            href={`/r/${tenantSlug}`}
            className="inline-block bg-accent hover:bg-accent-hover text-white px-8 py-3 text-sm tracking-wide uppercase rounded-md transition-colors"
          >
            Weiteren Gutschein kaufen
          </Link>
        </div>
      </div>

      <TenantFooter tenant={config} />
    </div>
  );
}
