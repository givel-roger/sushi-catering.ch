import { notFound } from "next/navigation";
import { getTenantBySlug, toTenantConfig } from "@/lib/tenant";
import LegalPage from "@/components/LegalPage";

export async function generateMetadata({ params }: { params: Promise<{ tenantSlug: string }> }) {
  return { title: "AGB" };
}

export default async function AGB({ params }: { params: Promise<{ tenantSlug: string }> }) {
  const { tenantSlug } = await params;
  const tenant = getTenantBySlug(tenantSlug);
  if (!tenant) notFound();
  const config = toTenantConfig(tenant);

  return (
    <LegalPage tenantSlug={tenantSlug} tenantName={config.name} title="Allgemeine Geschäftsbedingungen">
      <h2 className="text-foreground text-lg font-semibold">1. Geltungsbereich</h2>
      <p>Diese AGB gelten für den Kauf von Gutscheinen über gutschein-schenken.ch, betrieben für {config.name}{config.addressStreet ? `, ${config.addressStreet}` : ""}{config.addressZip && config.addressCity ? `, ${config.addressZip} ${config.addressCity}` : ""}.</p>

      <h2 className="text-foreground text-lg font-semibold">2. Gutscheine</h2>
      <p>Die Gutscheine sind bei {config.name} einlösbar. Gutscheine haben kein Verfalldatum. Teilbeträge können eingelöst werden, das Restguthaben bleibt bestehen. Eine Barauszahlung ist ausgeschlossen.</p>

      <h2 className="text-foreground text-lg font-semibold">3. Bezahlung</h2>
      <p>Die Bezahlung erfolgt online zum Zeitpunkt des Kaufs. Der Gutschein wird nach erfolgter Zahlung per E-Mail als PDF zugestellt.</p>

      <h2 className="text-foreground text-lg font-semibold">4. Stornierung</h2>
      <p>Eine Stornierung oder Rückerstattung nach dem Kauf ist nicht möglich, es sei denn, es liegt ein technischer Fehler vor.</p>

      <h2 className="text-foreground text-lg font-semibold">5. Haftung</h2>
      <p>Die Haftung beschränkt sich auf den Wert des Gutscheins. Für den Verlust des Gutscheins (PDF/Ausdruck) übernehmen wir keine Haftung.</p>

      <h2 className="text-foreground text-lg font-semibold">6. Gerichtsstand</h2>
      <p>Es gilt Schweizer Recht. Gerichtsstand ist {config.addressCity || "Luzern"}.</p>
    </LegalPage>
  );
}
