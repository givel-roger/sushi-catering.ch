# gutschein-schenken.ch

Gutschein-Tool für Daniele Restaurant & Winebar, Luzern.

## Features

- 4-Schritte-Kaufflow: Betrag → Motiv → Widmung → Bezahlen
- 7 Gutschein-Motive
- Admin-Panel unter `/admin` (Gutscheine verwalten, einlösen)
- Ohne Verfalldatum, Teilbeträge möglich

## Setup

```bash
npm install
cp .env.example .env.local  # ADMIN_SECRET setzen
npm run dev
```

## Admin

Admin-Panel: `/admin` — Login mit dem in `.env.local` gesetzten `ADMIN_SECRET`.

## Tech Stack

- Next.js 16, React 19, Tailwind CSS 4
- JSON-basierte Datenspeicherung (`data/gutscheine.json`)
