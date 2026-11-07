import { notFound } from "next/navigation";
import { getTenantBySlug, toTenantConfig } from "@/lib/tenant";
import PurchaseWizard from "@/components/PurchaseWizard";
import EmbedHeightReporter from "@/components/EmbedHeightReporter";

type Props = {
  params: Promise<{ tenantSlug: string }>;
};

export default async function EmbedPage({ params }: Props) {
  const { tenantSlug } = await params;
  const tenant = getTenantBySlug(tenantSlug);
  if (!tenant) notFound();
  const config = toTenantConfig(tenant);

  return (
    <div className="bg-transparent px-1 py-2">
      <PurchaseWizard tenant={config} embedded />
      <EmbedHeightReporter />
      <p className="text-center text-xs text-gray-400 mt-6">
        Powered by{" "}
        <a
          href="https://www.gutschein-schenken.ch"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-300"
        >
          gutschein-schenken.ch
        </a>
      </p>
    </div>
  );
}
