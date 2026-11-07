"use client";

import Image from "next/image";
import type { TenantConfig } from "@/lib/types";

export default function TenantNav({ tenant }: { tenant: TenantConfig }) {
  const logoUrl = tenant.branding.logoUrl;
  const logoInvert = tenant.branding.logoDarkUrl ? false : true;

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-foreground">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-10 h-14 flex items-center justify-between">
        <a href={`/r/${tenant.slug}`} className="flex items-center">
          {logoUrl ? (
            <Image
              src={logoInvert ? logoUrl : (tenant.branding.logoDarkUrl || logoUrl)}
              alt={tenant.name}
              width={140}
              height={43}
              className={`h-7 w-auto ${logoInvert ? "invert" : ""}`}
            />
          ) : (
            <span className="text-white font-semibold">{tenant.name}</span>
          )}
        </a>
        <div className="flex items-center gap-6 text-sm text-white/60">
          {tenant.website && (
            <a href={tenant.website} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors hidden sm:block">
              {tenant.website.replace(/^https?:\/\//, "")}
            </a>
          )}
          {tenant.phone && (
            <a href={`tel:${tenant.phone.replace(/\s/g, "")}`} className="hover:text-white transition-colors hidden sm:block">
              {tenant.phone}
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
