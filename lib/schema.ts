import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const tenants = sqliteTable("tenants", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  codePrefix: text("code_prefix").notNull().unique(),
  domain: text("domain"),
  website: text("website"),
  phone: text("phone"),
  email: text("email"),
  addressStreet: text("address_street"),
  addressCity: text("address_city"),
  addressZip: text("address_zip"),
  addressCountry: text("address_country").default("CH"),
  stripeAccountId: text("stripe_account_id"),
  stripeOnboarded: integer("stripe_onboarded", { mode: "boolean" }).default(false),
  platformFeePercent: real("platform_fee_percent").default(5.0),
  branding: text("branding", { mode: "json" }).$type<TenantBranding>(),
  legalTexts: text("legal_texts", { mode: "json" }).$type<TenantLegalTexts>(),
  motifs: text("motifs", { mode: "json" }).$type<TenantMotif[]>(),
  amountPresets: text("amount_presets", { mode: "json" }).$type<number[]>(),
  minAmount: real("min_amount").default(20),
  maxAmount: real("max_amount").default(1000),
  active: integer("active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export const admins = sqliteTable("admins", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["admin", "staff", "superadmin"] }).notNull().default("admin"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const gutscheine = sqliteTable("gutscheine", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id),
  code: text("code").notNull().unique(),
  amount: real("amount").notNull(),
  remainingAmount: real("remaining_amount").notNull(),
  motif: text("motif").notNull().default("elegant"),
  widmungFuer: text("widmung_fuer"),
  widmungVon: text("widmung_von"),
  widmungNachricht: text("widmung_nachricht"),
  zustellung: text("zustellung", { enum: ["selbst", "direkt"] }).default("selbst"),
  empfaengerEmail: text("empfaenger_email"),
  kaeuferName: text("kaeufer_name").notNull(),
  kaeuferEmail: text("kaeufer_email").notNull(),
  status: text("status", { enum: ["pending", "paid", "partial", "redeemed"] }).notNull().default("pending"),
  stripeSessionId: text("stripe_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  pdfUrl: text("pdf_url"),
  qrData: text("qr_data"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  paidAt: text("paid_at"),
});

export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  gutscheinId: text("gutschein_id").notNull().references(() => gutscheine.id),
  tenantId: text("tenant_id").notNull().references(() => tenants.id),
  amount: real("amount").notNull(),
  note: text("note").default(""),
  redeemedBy: text("redeemed_by").references(() => admins.id),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  adminId: text("admin_id").notNull().references(() => admins.id),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export type TenantBranding = {
  logoUrl?: string;
  logoDarkUrl?: string;
  heroImageUrl?: string;
  primaryColor: string;
  primaryHoverColor: string;
  backgroundColor: string;
  foregroundColor: string;
  surfaceColor: string;
  borderColor: string;
  displayFont: string;
  heroTitle: string;
  heroSubtitle: string;
  featureList: string[];
};

export type TenantLegalTexts = {
  agb?: string;
  impressum?: string;
  datenschutz?: string;
};

export type TenantMotif = {
  id: string;
  name: string;
  gradient: string;
  icon: string;
};
