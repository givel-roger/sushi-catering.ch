import { eq } from "drizzle-orm";
import { getDb, schema } from "./db";
import { DEFAULT_BRANDING, DEFAULT_MOTIFS, DEFAULT_AMOUNTS } from "./types";
import type { TenantConfig } from "./types";

export type Tenant = typeof schema.tenants.$inferSelect;

export function getTenantBySlug(slug: string): Tenant | null {
  const db = getDb();
  const result = db.select().from(schema.tenants).where(eq(schema.tenants.slug, slug)).get();
  return result ?? null;
}

export function getTenantByDomain(domain: string): Tenant | null {
  const db = getDb();
  const result = db.select().from(schema.tenants).where(eq(schema.tenants.domain, domain)).get();
  return result ?? null;
}

export function getAllTenants(): Tenant[] {
  const db = getDb();
  return db.select().from(schema.tenants).all();
}

export function toTenantConfig(tenant: Tenant): TenantConfig {
  return {
    id: tenant.id,
    slug: tenant.slug,
    name: tenant.name,
    codePrefix: tenant.codePrefix,
    website: tenant.website,
    phone: tenant.phone,
    email: tenant.email,
    addressStreet: tenant.addressStreet,
    addressCity: tenant.addressCity,
    addressZip: tenant.addressZip,
    branding: tenant.branding ?? DEFAULT_BRANDING,
    motifs: DEFAULT_MOTIFS,
    amountPresets: tenant.amountPresets ?? DEFAULT_AMOUNTS,
    minAmount: tenant.minAmount ?? 20,
    maxAmount: tenant.maxAmount ?? 1000,
  };
}
