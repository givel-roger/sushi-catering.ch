/**
 * Seed-Script: Initialisiert die Datenbank und migriert bestehende JSON-Daten.
 * Ausführen: npx tsx scripts/seed.ts
 */
import { initDatabase } from "../lib/migrate";

console.log("[Seed] Starte Datenbank-Initialisierung...");
const tenantId = initDatabase();
console.log(`[Seed] Fertig. Daniele Tenant ID: ${tenantId}`);
