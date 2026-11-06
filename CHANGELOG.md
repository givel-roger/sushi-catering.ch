# Changelog

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
