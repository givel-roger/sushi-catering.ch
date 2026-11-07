import { notFound } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { getTenantBySlug, toTenantConfig } from "@/lib/tenant";
import { getDb, schema } from "@/lib/db";
import TenantNav from "@/components/TenantNav";
import TenantFooter from "@/components/TenantFooter";

type Props = {
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{ code?: string }>;
};

export default async function EinloesenPage({ params, searchParams }: Props) {
  const { tenantSlug } = await params;
  const { code } = await searchParams;
  const tenant = getTenantBySlug(tenantSlug);
  if (!tenant) notFound();
  const config = toTenantConfig(tenant);

  let gutschein = null;
  if (code) {
    const db = getDb();
    gutschein = db
      .select()
      .from(schema.gutscheine)
      .where(eq(schema.gutscheine.code, code))
      .get();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TenantNav tenant={config} />

      <div className="flex-1 flex items-center justify-center px-5 py-20">
        <div className="max-w-md w-full">
          {gutschein ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="font-display text-3xl text-foreground mb-6">Gutschein von {config.name}</h1>

              <div className="bg-surface rounded-xl p-6 text-left space-y-4 border border-border">
                <div className="flex justify-between">
                  <span className="text-muted text-sm">Code</span>
                  <span className="font-mono font-bold text-foreground">{gutschein.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted text-sm">Guthaben</span>
                  <span className="font-bold text-foreground text-lg">
                    CHF {gutschein.remainingAmount.toFixed(2)}
                    {gutschein.remainingAmount < gutschein.amount && (
                      <span className="text-muted text-sm font-normal ml-1">
                        von CHF {gutschein.amount.toFixed(2)}
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted text-sm">Status</span>
                  <span
                    className={`text-sm font-medium ${
                      gutschein.status === "paid"
                        ? "text-green-600"
                        : gutschein.status === "partial"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {gutschein.status === "paid"
                      ? "Gültig"
                      : gutschein.status === "partial"
                      ? "Teilweise eingelöst"
                      : "Vollständig eingelöst"}
                  </span>
                </div>
                {gutschein.widmungFuer && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm text-muted">
                      Für: <span className="text-foreground">{gutschein.widmungFuer}</span>
                    </p>
                    {gutschein.widmungVon && (
                      <p className="text-sm text-muted">
                        Von: <span className="text-foreground">{gutschein.widmungVon}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              <p className="text-muted text-sm mt-6">
                Zeigen Sie diesen Gutschein im Restaurant vor, um ihn einzulösen.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="font-display text-3xl text-foreground mb-4">Gutschein einlösen</h1>
              <p className="text-muted mb-6">
                Bitte zeigen Sie den QR-Code auf Ihrem Gutschein dem Servicepersonal.
              </p>
              {!code && (
                <p className="text-muted text-sm">
                  Kein Gutschein-Code angegeben.
                </p>
              )}
              {code && (
                <p className="text-red-500 text-sm">
                  Gutschein mit Code &quot;{code}&quot; nicht gefunden.
                </p>
              )}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              href={`/r/${tenantSlug}`}
              className="text-sm text-muted hover:text-foreground transition-colors underline"
            >
              Gutschein kaufen
            </Link>
          </div>
        </div>
      </div>

      <TenantFooter tenant={config} />
    </div>
  );
}
