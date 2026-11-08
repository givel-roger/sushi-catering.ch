"use client";

import Image from "next/image";
import Link from "next/link";
import type { TenantConfig } from "@/lib/types";

export default function TenantFooter({ tenant }: { tenant: TenantConfig }) {
  const logoUrl = tenant.branding.logoUrl;
  const basePath = `/r/${tenant.slug}`;

  return (
    <footer className="border-t border-border py-10">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-10">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-6">
          <div>
            {logoUrl ? (
              <Image src={logoUrl} alt={tenant.name} width={120} height={37} className="h-6 w-auto mb-3" />
            ) : (
              <p className="font-semibold text-foreground mb-3">{tenant.name}</p>
            )}
            <p className="text-sm text-muted">
              Gutscheine von{" "}
              {tenant.website ? (
                <a href={tenant.website} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">
                  {tenant.name}
                </a>
              ) : (
                tenant.name
              )}
            </p>
          </div>
          <div className="text-sm text-muted space-y-1 sm:text-right">
            {tenant.addressStreet && tenant.addressZip && tenant.addressCity && (
              <p>{tenant.addressStreet}, {tenant.addressZip} {tenant.addressCity}</p>
            )}
            {tenant.phone && (
              <p><a href={`tel:${tenant.phone.replace(/\s/g, "")}`} className="hover:text-foreground transition-colors">{tenant.phone}</a></p>
            )}
          </div>
        </div>
        <div className="border-t border-border pt-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted/50">
          <p>© {new Date().getFullYear()} {tenant.name} · <span className="text-muted/30">v3.2.0</span></p>
          <div className="flex gap-6">
            <Link href={`${basePath}/impressum`} className="hover:text-foreground transition-colors">Impressum</Link>
            <Link href={`${basePath}/datenschutz`} className="hover:text-foreground transition-colors">Datenschutz</Link>
            <Link href={`${basePath}/agb`} className="hover:text-foreground transition-colors">AGB</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
