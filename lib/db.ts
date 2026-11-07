import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { join } from "path";
import * as schema from "./schema";

const DB_PATH = join(process.cwd(), "data", "gutschein.db");

let _db: ReturnType<typeof drizzle> | null = null;
let _initialized = false;

function runMigrations(sqlite: InstanceType<typeof Database>) {
  if (_initialized) return;
  _initialized = true;

  try {
    const tenant = sqlite.prepare("SELECT branding FROM tenants WHERE slug = 'daniele'").get() as { branding: string } | undefined;
    if (tenant) {
      const branding = JSON.parse(tenant.branding);
      if (branding.logoUrl === "/images/daniele-logo.svg" || !branding.heroImageUrl) {
        branding.logoUrl = "/images/daniele-logo.png";
        branding.heroImageUrl = "/images/daniele-hero.jpg";
        sqlite.prepare("UPDATE tenants SET branding = ? WHERE slug = 'daniele'").run(JSON.stringify(branding));
        console.log("[DB] Daniele Branding aktualisiert.");
      }
    }
  } catch {
    // table might not exist yet
  }
}

export function getDb() {
  if (!_db) {
    const sqlite = new Database(DB_PATH);
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");
    runMigrations(sqlite);
    _db = drizzle(sqlite, { schema });
  }
  return _db;
}

export { schema };
