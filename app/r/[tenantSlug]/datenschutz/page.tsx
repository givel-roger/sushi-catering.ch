import { notFound } from "next/navigation";
import { getTenantBySlug, toTenantConfig } from "@/lib/tenant";
import LegalPage from "@/components/LegalPage";

export async function generateMetadata({ params }: { params: Promise<{ tenantSlug: string }> }) {
  return { title: "Datenschutz" };
}

export default async function Datenschutz({ params }: { params: Promise<{ tenantSlug: string }> }) {
  const { tenantSlug } = await params;
  const tenant = getTenantBySlug(tenantSlug);
  if (!tenant) notFound();
  const config = toTenantConfig(tenant);

  return (
    <LegalPage tenantSlug={tenantSlug} tenantName={config.name} title="Datenschutzerklärung">
      <section>
        <h2 className="text-foreground text-lg font-semibold mb-3">Verantwortliche Stelle</h2>
        <p>{config.name}{config.addressStreet ? <><br />{config.addressStreet}, {config.addressZip} {config.addressCity}</> : ""}</p>
      </section>

      <section>
        <h2 className="text-foreground text-lg font-semibold mb-3">Erhebung und Verwendung von Daten</h2>
        <p>
          Beim Kauf eines Gutscheins erheben wir die von Ihnen angegebenen Daten
          (Name, E-Mail-Adresse, Widmungstexte). Diese Daten verwenden wir
          ausschliesslich zur Erstellung und Zustellung des Gutscheins sowie
          zur Abwicklung der Zahlung.
        </p>
      </section>

      <section>
        <h2 className="text-foreground text-lg font-semibold mb-3">Rechtsgrundlage</h2>
        <p>
          Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung sowie zur
          Durchführung des Kaufvertrags. In der Schweiz gilt das Bundesgesetz
          über den Datenschutz (DSG).
        </p>
      </section>

      <section>
        <h2 className="text-foreground text-lg font-semibold mb-3">Speicherdauer</h2>
        <p>
          Gutschein-Daten werden gespeichert, solange der Gutschein gültig ist
          und offenes Guthaben besteht, sowie gemäss gesetzlichen Aufbewahrungspflichten.
        </p>
      </section>

      <section>
        <h2 className="text-foreground text-lg font-semibold mb-3">Weitergabe an Dritte</h2>
        <p>
          Ihre Daten werden nicht an Dritte weitergegeben, es sei denn, dies ist
          zur Zahlungsabwicklung erforderlich (z.B. Zahlungsdienstleister).
        </p>
      </section>

      <section>
        <h2 className="text-foreground text-lg font-semibold mb-3">Ihre Rechte</h2>
        <p>
          Sie haben jederzeit das Recht auf Auskunft, Berichtigung und Löschung
          Ihrer personenbezogenen Daten. Kontaktieren Sie uns unter{" "}
          {config.website ? (
            <a href={config.website} className="text-foreground underline">{config.website.replace(/^https?:\/\//, "")}</a>
          ) : (
            config.name
          )}.
        </p>
      </section>

      <section>
        <h2 className="text-foreground text-lg font-semibold mb-3">Cookies</h2>
        <p>
          Diese Website verwendet keine Tracking-Cookies und keine Analyse-Tools.
          Es werden nur technisch notwendige Cookies verwendet.
        </p>
      </section>
    </LegalPage>
  );
}
