import { notFound } from "next/navigation";
import { getTenantBySlug, toTenantConfig } from "@/lib/tenant";
import LegalPage from "@/components/LegalPage";

export async function generateMetadata({ params }: { params: Promise<{ tenantSlug: string }> }) {
  return { title: "Impressum" };
}

export default async function Impressum({ params }: { params: Promise<{ tenantSlug: string }> }) {
  const { tenantSlug } = await params;
  const tenant = getTenantBySlug(tenantSlug);
  if (!tenant) notFound();
  const config = toTenantConfig(tenant);

  return (
    <LegalPage tenantSlug={tenantSlug} tenantName={config.name} title="Impressum">
      <p className="text-foreground font-semibold text-base">{config.name}</p>
      {config.addressStreet && (
        <p>{config.addressStreet}<br />CH-{config.addressZip} {config.addressCity}</p>
      )}
      {config.phone && (
        <p>Telefon: <a href={`tel:${config.phone.replace(/\s/g, "")}`} className="underline hover:text-foreground">{config.phone}</a></p>
      )}
      {config.website && (
        <p>Web: <a href={config.website} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">{config.website.replace(/^https?:\/\//, "")}</a></p>
      )}

      <h2 className="text-foreground text-lg font-semibold pt-6">Haftungsausschluss</h2>
      <p>
        Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit,
        Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen.
      </p>

      <h2 className="text-foreground text-lg font-semibold pt-6">Urheberrechte</h2>
      <p>
        Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen
        Dateien auf dieser Website gehören ausschliesslich dem Betreiber oder den
        speziell genannten Rechteinhabern.
      </p>
    </LegalPage>
  );
}
