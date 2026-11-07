import Database from "better-sqlite3";
import { join } from "path";
import { readFileSync, existsSync, mkdirSync } from "fs";
import { randomBytes } from "crypto";
import { hashSync } from "bcryptjs";

const DB_PATH = join(process.cwd(), "data", "gutschein.db");
const JSON_PATH = join(process.cwd(), "data", "gutscheine.json");

function createTables(db: InstanceType<typeof Database>) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tenants (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      code_prefix TEXT NOT NULL UNIQUE,
      domain TEXT UNIQUE,
      website TEXT,
      phone TEXT,
      email TEXT,
      address_street TEXT,
      address_city TEXT,
      address_zip TEXT,
      address_country TEXT DEFAULT 'CH',
      stripe_account_id TEXT,
      stripe_onboarded INTEGER DEFAULT 0,
      platform_fee_percent REAL DEFAULT 5.0,
      branding TEXT,
      legal_texts TEXT,
      motifs TEXT,
      amount_presets TEXT,
      min_amount REAL DEFAULT 20,
      max_amount REAL DEFAULT 1000,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      tenant_id TEXT REFERENCES tenants(id),
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS gutscheine (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      code TEXT NOT NULL UNIQUE,
      amount REAL NOT NULL,
      remaining_amount REAL NOT NULL,
      motif TEXT NOT NULL DEFAULT 'elegant',
      widmung_fuer TEXT,
      widmung_von TEXT,
      widmung_nachricht TEXT,
      zustellung TEXT DEFAULT 'selbst',
      empfaenger_email TEXT,
      kaeufer_name TEXT NOT NULL,
      kaeufer_email TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      stripe_session_id TEXT,
      stripe_payment_intent_id TEXT,
      pdf_url TEXT,
      qr_data TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      paid_at TEXT
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      gutschein_id TEXT NOT NULL REFERENCES gutscheine(id),
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      amount REAL NOT NULL,
      note TEXT DEFAULT '',
      redeemed_by TEXT REFERENCES admins(id),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL REFERENCES admins(id),
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

function seedDanieleTenant(db: InstanceType<typeof Database>) {
  const existing = db.prepare("SELECT id FROM tenants WHERE slug = ?").get("daniele");
  if (existing) return;

  const tenantId = randomBytes(16).toString("hex");

  const branding = JSON.stringify({
    logoUrl: "/images/daniele-logo.png",
    heroImageUrl: "/images/daniele-hero.jpg",
    primaryColor: "#c8962e",
    primaryHoverColor: "#b0831f",
    backgroundColor: "#ffffff",
    foregroundColor: "#1a1a1a",
    surfaceColor: "#f9f7f3",
    borderColor: "#e8e3d8",
    displayFont: "Playfair Display",
    heroTitle: "Genuss verschenken.",
    heroSubtitle: "Italienische Küche, erlesene Weine und unvergessliche Momente – jetzt als Gutschein.",
    featureList: [
      "Sofort per Mail zugestellt",
      "Ohne Verfalldatum",
      "Für alle Angebote einlösbar",
      "Auch als Geschenk versendbar",
    ],
  });

  const motifs = JSON.stringify([
    { id: "elegant", name: "Edel", gradient: "from-amber-900 via-yellow-800 to-amber-900", icon: "✦" },
    { id: "geburtstag", name: "Geburtstag", gradient: "from-pink-500 via-rose-400 to-pink-500", icon: "🎂" },
    { id: "weihnachten", name: "Weihnachten", gradient: "from-red-800 via-red-700 to-green-800", icon: "🎄" },
    { id: "danke", name: "Danke", gradient: "from-emerald-600 via-teal-500 to-emerald-600", icon: "💚" },
    { id: "valentinstag", name: "Valentinstag", gradient: "from-red-500 via-pink-500 to-rose-400", icon: "💕" },
    { id: "genuss", name: "Genuss", gradient: "from-orange-700 via-amber-600 to-orange-700", icon: "🍷" },
    { id: "gratulation", name: "Gratulation", gradient: "from-indigo-600 via-purple-500 to-indigo-600", icon: "🎉" },
  ]);

  const amountPresets = JSON.stringify([50, 100, 125, 150, 200, 250, 300]);

  db.prepare(`
    INSERT INTO tenants (id, slug, name, code_prefix, website, phone, email,
      address_street, address_city, address_zip, branding, motifs, amount_presets)
    VALUES (?, 'daniele', 'Daniele Restaurant & Winebar', 'DN',
      'https://daniele.swiss', '+41 41 410 53 53', 'info@daniele.swiss',
      'Löwengraben 7', 'Luzern', '6004', ?, ?, ?)
  `).run(tenantId, branding, motifs, amountPresets);

  // Admin password comes from ADMIN_PASSWORD env var or defaults for first setup
  const adminPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET || "change-me-immediately";
  const adminId = randomBytes(16).toString("hex");
  const passwordHash = hashSync(adminPassword, 10);
  db.prepare(`
    INSERT INTO admins (id, tenant_id, email, password_hash, name, role)
    VALUES (?, ?, 'admin@daniele.swiss', ?, 'Daniele Admin', 'admin')
  `).run(adminId, tenantId, passwordHash);

  return tenantId;
}

function migrateJsonData(db: InstanceType<typeof Database>, tenantId: string) {
  if (!existsSync(JSON_PATH)) return 0;

  const raw = readFileSync(JSON_PATH, "utf-8");
  const gutscheineJson = JSON.parse(raw);

  if (!Array.isArray(gutscheineJson) || gutscheineJson.length === 0) return 0;

  const insertGutschein = db.prepare(`
    INSERT OR IGNORE INTO gutscheine (id, tenant_id, code, amount, remaining_amount, motif,
      widmung_fuer, widmung_von, widmung_nachricht, zustellung, empfaenger_email,
      kaeufer_name, kaeufer_email, status, created_at, paid_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertTransaction = db.prepare(`
    INSERT INTO transactions (id, gutschein_id, tenant_id, amount, note, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  let count = 0;
  const migrate = db.transaction(() => {
    for (const g of gutscheineJson) {
      insertGutschein.run(
        g.id,
        tenantId,
        g.code,
        g.amount,
        g.remainingAmount,
        g.motif || "elegant",
        g.widmung?.fuer || "",
        g.widmung?.von || "",
        g.widmung?.nachricht || "",
        g.widmung?.zustellung || "selbst",
        g.widmung?.empfaengerEmail || "",
        g.kaeufer?.name || "",
        g.kaeufer?.email || "",
        g.status,
        g.createdAt,
        g.paidAt || null
      );

      if (g.transactions) {
        for (const t of g.transactions) {
          insertTransaction.run(
            randomBytes(16).toString("hex"),
            g.id,
            tenantId,
            t.amount,
            t.note || "",
            t.date
          );
        }
      }
      count++;
    }
  });

  migrate();
  return count;
}

function updateDanieleBranding(db: InstanceType<typeof Database>) {
  const tenant = db.prepare("SELECT branding FROM tenants WHERE slug = 'daniele'").get() as { branding: string } | undefined;
  if (!tenant) return;
  const branding = JSON.parse(tenant.branding);
  if (branding.logoUrl === "/images/daniele-logo.svg" || !branding.heroImageUrl) {
    branding.logoUrl = "/images/daniele-logo.png";
    branding.heroImageUrl = "/images/daniele-hero.jpg";
    db.prepare("UPDATE tenants SET branding = ? WHERE slug = 'daniele'").run(JSON.stringify(branding));
    console.log("[DB] Daniele Branding aktualisiert (Logo PNG + Hero Image).");
  }
}

function seedSuperAdmin(db: InstanceType<typeof Database>) {
  const existing = db.prepare("SELECT id FROM admins WHERE role = 'superadmin'").get();
  if (existing) return;

  const superAdminPassword = process.env.SUPERADMIN_PASSWORD || process.env.ADMIN_SECRET || "change-me-immediately";
  const superAdminEmail = process.env.SUPERADMIN_EMAIL || "admin@gutschein-schenken.ch";
  const adminId = randomBytes(16).toString("hex");
  const passwordHash = hashSync(superAdminPassword, 10);

  db.prepare(`
    INSERT INTO admins (id, tenant_id, email, password_hash, name, role)
    VALUES (?, NULL, ?, ?, 'Super Admin', 'superadmin')
  `).run(adminId, superAdminEmail, passwordHash);

  console.log(`[DB] Super-Admin angelegt: ${superAdminEmail}`);
}

function seedKroneBlatten(db: InstanceType<typeof Database>) {
  const existing = db.prepare("SELECT id FROM tenants WHERE slug = ?").get("krone-blatten");
  if (existing) return;

  const tenantId = randomBytes(16).toString("hex");

  const branding = JSON.stringify({
    primaryColor: "#8B4513",
    primaryHoverColor: "#723810",
    backgroundColor: "#ffffff",
    foregroundColor: "#2d2d2d",
    surfaceColor: "#faf8f5",
    borderColor: "#e5ddd0",
    displayFont: "Playfair Display",
    heroTitle: "Genuss verschenken.",
    heroSubtitle: "Walliser Gastfreundschaft und traditionelle Küche – jetzt als Gutschein.",
    featureList: [
      "Sofort per Mail zugestellt",
      "Ohne Verfalldatum",
      "Für alle Angebote einlösbar",
      "Auch als Geschenk versendbar",
    ],
  });

  const amountPresets = JSON.stringify([50, 100, 150, 200, 250, 300]);

  db.prepare(`
    INSERT INTO tenants (id, slug, name, code_prefix, website, phone, email,
      address_street, address_city, address_zip, branding, amount_presets)
    VALUES (?, 'krone-blatten', 'Restaurant Krone Blatten', 'KR',
      'https://krone-blatten.ch', '+41 27 923 65 56', 'info@krone-blatten.ch',
      'Dorfstrasse 1', 'Blatten', '3919', ?, ?)
  `).run(tenantId, branding, amountPresets);

  const adminPassword = process.env.KRONE_ADMIN_PASSWORD || process.env.ADMIN_SECRET || "change-me-immediately";
  const adminId = randomBytes(16).toString("hex");
  const passwordHash = hashSync(adminPassword, 10);
  db.prepare(`
    INSERT INTO admins (id, tenant_id, email, password_hash, name, role)
    VALUES (?, ?, 'admin@krone-blatten.ch', ?, 'Krone Admin', 'admin')
  `).run(adminId, tenantId, passwordHash);

  console.log("[DB] Krone Blatten Tenant + Admin angelegt.");
}

export function initDatabase() {
  mkdirSync(join(process.cwd(), "data"), { recursive: true });

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  createTables(db);

  const tenant = db.prepare("SELECT id FROM tenants WHERE slug = 'daniele'").get() as { id: string } | undefined;
  let tenantId: string;

  if (!tenant) {
    tenantId = seedDanieleTenant(db)!;
    const migrated = migrateJsonData(db, tenantId);
    console.log(`[DB] Daniele-Tenant angelegt, ${migrated} Gutscheine migriert.`);
  } else {
    tenantId = tenant.id;
    console.log("[DB] Datenbank bereits initialisiert.");
  }

  updateDanieleBranding(db);
  seedSuperAdmin(db);
  seedKroneBlatten(db);

  db.close();
  return tenantId;
}

if (require.main === module) {
  initDatabase();
}
