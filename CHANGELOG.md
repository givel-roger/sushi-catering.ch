# Changelog

## v3.0.6 — Adobe Stock Premium-Fotos

- 7 lizenzierte Adobe Stock Fotos ersetzen Unsplash-Bilder
- Elegant: Festliche Tafel mit Kerzen (andrey, #331122477)
- Geburtstag: Pastelltorte mit Sparkler (Ruth Black, #635614848)
- Weihnachten: Geschmückter Christbaum (Aditya, #2175716006)
- Danke: Herbstblumen in Glasvasen (annanahabed, #288575973)
- Valentinstag: Rote Rosen in stimmungsvollem Licht (#2223437628)
- Genussmoment: Lachs-Filet vom Chef (Hihitetlin, #1860074298)
- Gratulation: Champagner-Toast (asife, #293552025)
- Alle Fotos auf 1200px resized für schnelles Laden (90-337KB)

## v3.0.5 — Echte Stock-Fotos für Motiv-Karten

- 7 hochwertige Unsplash-Fotos als Hintergründe für Motiv-Auswahl und Gutschein-Vorschau
- Elegant (Dinner-Tisch), Geburtstag (Torte), Weihnachten (Christbaum), Danke (Blumen), Valentinstag (Rosen), Genuss (Gourmet), Gratulation (Champagner)
- Fotos als Next.js Image mit Overlay für Lesbarkeit
- Motiv-Auswahl: Label als Pill mit Backdrop-Blur über dem Foto
- Gutschein-Vorschau: Foto mit 40% Deckkraft hinter dem Gradient

## v3.0.4 — Motiv-Icons besser sichtbar

- Icons grösser (text-4xl) und in Akzentfarbe statt unsichtbar dunkel
- Text-Labels heller (white/80 statt white/60)

## v3.0.3 — Motiv-Karten mit Gradienten und Icons

- Motive mit CSS-Gradienten statt einfarbigen Hintergründen
- Thematische Emojis: 🎂 Geburtstag, 🎄 Weihnachten, 💚 Danke, 💕 Valentinstag, 🍷 Genuss, 🎉 Gratulation, ✦ Edel
- Hover/Select-Animation (scale) auf Motiv-Karten
- Icon auch in Gutschein-Vorschau sichtbar

## v3.0.2 — Kompakteres Layout + Sidebar-Fix

- Hero-Bereich verkleinert (weniger Padding, kleinere Texte)
- Doppelte Steps-Anzeige entfernt (nur noch Tab-Bar im Wizard)
- Logo nur noch in Navbar (nicht doppelt im Hero)
- Gutschein-Vorschau als Sidebar rechts neben dem Formular (ab md Breakpoint)
- Grid-Syntax-Fix: Tailwind `grid-cols-[1fr_280px]` statt fehlerhaftem Komma-Separator
- MotifCard kompakter (aspect-[1.8/1], kleinere Schrift)
- Mobile Gutschein-Vorschau kleiner (max-w-260px)

## v3.0.0 — Multi-Tenant SaaS Platform

### Multi-Tenant Architektur
- Drizzle ORM + better-sqlite3 (ersetzt JSON-Datei und Prisma)
- 5 DB-Tabellen: tenants, admins, gutscheine, transactions, sessions
- Slug-basiertes Tenant-Routing: `/r/[tenantSlug]`
- Pro-Tenant Branding (Farben, Fonts, Texte) via CSS Custom Properties
- Pro-Tenant Legal-Seiten (AGB, Impressum, Datenschutz)
- JSON-LD Schema.org pro Tenant

### Auth (Phase 4)
- JWT-basierte Authentifizierung (jose + bcryptjs)
- HttpOnly Cookies (7 Tage)
- Rollen: superadmin, admin, staff
- Abwärtskompatibles ADMIN_SECRET Fallback

### Stripe Connect (Phase 5)
- Stripe Checkout Sessions mit Connect-Vorbereitung
- Destination Charges mit application_fee_amount
- Graceful Degradation ohne STRIPE_SECRET_KEY
- Webhook-Handler (checkout.session.completed)

### QR-Code + PDF (Phase 6)
- PDF-Gutschein (A5 Landscape) mit pdf-lib
- QR-Code mit Einlöse-URL pro Tenant
- PDF-Download-Endpoint: `/api/gutschein/[id]/pdf`
- Erfolgs-Seite mit PDF-Download-Button

### PWA Scan-App (Phase 7)
- `/scan/[tenantSlug]`: Kamera-QR-Scanner für Restaurant-Staff
- BarcodeDetector + html5-qrcode Fallback
- Login, Gutschein-Details, Einlösen mit Betrag + Notiz
- Dynamisches manifest.json + Icon pro Tenant (Add-to-Home)

### iframe Embed (Phase 7)
- `/embed/[tenantSlug]`: Kauf-Wizard ohne Nav/Footer
- PostMessage Height-Resize (MutationObserver + ResizeObserver)
- CORS/Frame-Headers (frame-ancestors * für /embed/*)
- "Powered by gutschein-schenken.ch" Branding

### Einlöse-Seite (Phase 7)
- `/r/[tenantSlug]/einloesen?code=...`: QR-Code Landing
- Zeigt Guthaben, Status, Widmung mit Tenant-Branding

### Super-Admin (Phase 8)
- `/super-admin`: Dashboard mit Stats (Tenants, Gutscheine, Umsatz)
- Tenant-Liste mit Shop/Admin/Deaktivieren-Links
- Neuen Tenant erstellen (mit Admin-Benutzer + Branding)
- API: CRUD für Tenants

### Zweiter Tenant: Krone Blatten
- Restaurant Krone Blatten (slug: krone-blatten, prefix: KR)
- Eigenes Branding (braun), Walliser Texte
- Eigener Admin: admin@krone-blatten.ch

## v1.0.0

### Gutschein-Tool
- Gutschein-Tool für gutschein-schenken.ch komplett neu gebaut
- 4-Schritte-Kaufflow: Betrag → Motiv → Widmung → Bezahlen
- 7 Gutschein-Motive (Edel, Geburtstag, Weihnachten, Danke, Valentinstag, Genuss, Gratulation)
- Beträge: 50/100/125/150/200/250/300 CHF oder frei (20–1000)
- Persönliche Widmung mit Zustellung (an mich / direkt an Empfänger)
- Gutschein-Vorschau-Karte mit Live-Aktualisierung
- Admin-Panel: Übersicht, Gutschein suchen, einlösen, Transaktionshistorie
- API: Gutschein erstellen, abrufen, einlösen (mit Teilbeträgen)
- Gutschein-Codes im Format DN-XXXX-XXXX
- Responsive Design (Mobile + Desktop)
- Branding: Daniele Restaurant & Winebar, Luzern
- AGB, Impressum, Datenschutz
- SEO: Sitemap, Robots, Structured Data

### Deploy & Infrastruktur
- Deploy auf Server 5 (Hetzner, 157.90.153.103)
- Dockerfile (Multi-Stage Build, Node 20 Alpine)
- docker-compose.yml (Port 3010, Volume für data/)
- deploy.sh (rsync + Docker, schützt data/ und .env.local)
- setup-server.sh (Docker, Certbot installieren)
- Nginx Reverse Proxy konfiguriert
- SSL via Certbot vorbereitet (wartet auf DNS)
