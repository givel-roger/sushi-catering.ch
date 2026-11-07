import { notFound } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { getTenantBySlug, toTenantConfig } from "@/lib/tenant";
import { getDb, schema } from "@/lib/db";
import TenantNav from "@/components/TenantNav";
import TenantFooter from "@/components/TenantFooter";

type Props = {
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{ id?: string; session_id?: string }>;
};

export default async function ErfolgPage({ params, searchParams }: Props) {
  const { tenantSlug } = await params;
  const { id, session_id } = await searchParams;
  const tenant = getTenantBySlug(tenantSlug);
  if (!tenant) notFound();
  const config = toTenantConfig(tenant);

  let gutscheinId = id || null;

  if (!gutscheinId && session_id) {
    const db = getDb();
    const g = db
      .select({ id: schema.gutscheine.id })
      .from(schema.gutscheine)
      .where(eq(schema.gutscheine.stripeSessionId, session_id))
      .get();
    gutscheinId = g?.id || null;
  }

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
            Dein Gutschein für {config.name} wurde erfolgreich erstellt.
          </p>
          <p className="text-muted mb-8">
            Du erhältst in Kürze eine E-Mail mit dem Gutschein als PDF.
          </p>

          {gutscheinId && (
            <a
              href={`/api/gutschein/${gutscheinId}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-8 py-3 text-sm tracking-wide uppercase rounded-md transition-colors mb-4"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Gutschein als PDF herunterladen
            </a>
          )}

          <div className="mt-4">
            <Link
              href={`/r/${tenantSlug}`}
              className="text-sm text-muted hover:text-foreground transition-colors underline"
            >
              Weiteren Gutschein kaufen
            </Link>
          </div>
        </div>
      </div>

      <TenantFooter tenant={config} />
    </div>
  );
}
