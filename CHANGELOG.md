# Changelog

## v2.7.0
- Anmeldung: Hinweis "Alle Stände sind ausverkauft", Formular ausgeblendet, Server lehnt Anmeldungen ab (410).
  Wieder öffnen: `ANMELDUNG_OFFEN` in lib/anmeldung.ts auf true setzen.
- Kontaktseite: Hinweis zur Standvergabe auf "ausverkauft" angepasst
- Kontaktformular Spamschutz: verstecktes Fangfeld, Mindest-Ausfüllzeit 3 s, max. 3 Anfragen pro IP in 10 Min.,
  Nachrichten mit mehr als 2 Links werden verworfen, E-Mail-Format und Feldlängen werden geprüft

## v2.6.1
- Programm: Serenade Avenue (Harfe) am Samstag 5.12. um 13:30 gestrichen (übrige Termine bleiben)

## v2.6.0
### Sicherheit
- **next von 16.2.1 auf 16.4.5 angehoben.** 16.2.1 war von einer kritischen Meldung betroffen, darunter eine ohne Anmeldung ausnutzbare Codeausfuehrung in der Bildoptimierung sowie mehrere Umgehungen der Middleware. Kein Hauptversionswechsel, nur ein Flicken-Sprung innerhalb von 16.
- Damit sind auch postcss, sharp, nanoid, source-map-js und baseline-browser-mapping geflickt, die alle ueber next hereinkamen.
- **Von 6 gemeldeten Luecken (1 kritisch, 4 hoch, 1 mittel) sind jetzt 0 uebrig**, gemessen mit `npm audit --omit=dev`.
- Die Dateien `.env.production` und `.env.local` standen auf 644 und waren damit fuer jeden Benutzer auf dem Server lesbar. Sie enthalten den Brevo-Schluessel fuer den Mailversand. Auf dem Server auf 600 gesetzt, Besitzer root, Inhalt unveraendert.

### Geprueft
- Typpruefung 0 Fehler, Bau gruen, 19 Seiten.

## v2.5.2
- Hero-Slider: Bilder mit Gesichtern entfernt (jetzt Rentier, Geschenke, Engel-Figur und Plakat)

## v2.5.1
- Startseite: nur noch ein Fenster im Plakat-Format (Desktop 16:9, Mobile quadratisch)
- Slider darin: zuerst Bilder, dann Plakat Marc Pircher, wieder Bilder, Plakat, von vorne

## v2.5.0
- Startseite: zuerst Foto vom Franziskanerplatz, darunter der Foto-Slider
- Plakat mit Marc Pircher nach unten verschoben (nach "Nächste Veranstaltungen")
- Programm und Rahmenprogramm zusammengelegt: /rahmenprogramm leitet auf das Programm der Startseite weiter

## v2.4.3
- Standplan: neuer Plan 2026 (PDF-Konvertierung, 2121x3000px)

## v2.4.2
- Cache-Busting für Banner-Bilder (?v=2), damit Browser das neue Mobile-Banner laden

## v2.4.1
- Mobile-Banner: neues quadratisches Bild (1080x1080) mit Marc Pircher, QR-Code und Kinderstiftung-Tasse

## v2.4.0
- Hero-Banner: neues Werbebanner mit Marc Pircher (Desktop 1920x1080, Mobile 750x1334)
- Slider durch statisches Banner ersetzt

## v2.3.6
- E-Mail-Sender auf givel@marktindex.ch geändert (bei Brevo verifiziert, sekretariat@ war nicht verifiziert)

## v2.3.4
- Kontakt- und Anmeldeformular: E-Mails gehen jetzt an sekretariat@ UND givel@marktindex.ch

## v2.3.3
- Kontakt- und Anmeldeformular: Kontrast verbessert (Eingabefelder weiss, Fehler-/Erfolgsmeldungen dunkel auf hell)

## v2.3.2
- Original Lozärner Schäller & Trychler: falsches Foto ersetzt (zeigte Blasorchester statt Schäller & Trychler vor Kapellbrücke)

## v2.3.1
- Samichlaus zu Besuch in der Franziskanerkirche (17:15): Foto entfernt, es zeigte einen anderen Samichlaus
  (das Bild bleibt bei der Lozärner Samichlausgesellschaft)
- Brass and Pipes (19:00): Foto aus dem Quellordner hinzugefügt
- Line Dance (20:15): Gruppenfoto der Red Lake Dancers hinzugefügt
- Marc Pircher (18:00): Foto hinzugefügt, leere Seitenränder weggeschnitten

## v2.3.0
- Tubas de Noël: falsches Foto korrigiert (zeigte Sixtett statt Tubas)
- Luca Di Felice: Foto aus Quellordner hinzugefügt
- Hauptseite: 11 fehlende Künstler-Fotos in KUENSTLER_BILDER ergänzt

## v2.2.0
- Kontakt- und Anmeldeformular: mailto durch Brevo API ersetzt
- Tasse 2026 Foto hinzugefügt
- "täglichen" aus Datum-und-Zeit entfernt
- Alle Künstlerfotos im Rahmenprogramm ergänzt (10 neue Performer)
- Tubas de Noël: korrektes Foto zugewiesen
- Dockerfile, docker-compose.yml und deploy.sh für Server-Deployment
- .env.example für Brevo API Key

## v2.1.0
- Alle Unterseiten 1:1 wie alte Website nachgebaut
- Anmeldung: 2-Schritt-Formular mit mailto-Versand
- Kontakt: Kontaktformular mit mailto-Versand
- Teilnehmer: Vollständige Liste mit Weblinks, IG LHMM Einträge ergänzt
- Weihnachtstassen: Fotogalerie aller Tassen (2006–2025)
- Häuschenmasse: Technische Zeichnungen (Standmasse, Einfaches Haus, Doppelhaus)
- Künstlerfotos auf Hauptseite und Rahmenprogramm bei jedem Auftritt
- Bilder ohne Zuschnitt (native img statt object-cover)
- Responsive: Mobile, Tablet und Desktop getestet

## v2.0.0
- Komplettes Redesign: von Sushi-Catering zu Lozärner Wiehnachtsmärt
- Vollbild-Hero mit Playfair Display Typografie
- Schneefall-Animation (Canvas)
- Bilder-Slider mit Auto-Play, Pfeilen und Dots
- Adventskalender mit 24 Türchen (durchmischte Nummern)
- Scroll-Animationen (FadeIn bei Sichtbarkeit)
- Fotos von Scrappbook-Album integriert
- Programm, Öffnungszeiten, Anreise mit Google Maps
- Farbschema: Weinrot, Gold, Tannengrün, Cream
- Responsive Layout (Mobile + Desktop)
- SEO: Schema.org Event, Open Graph, Meta-Tags
- Projekt umbenannt: weihnachtsmarkt-luzern.com

## v1.4.2
- Überall "Yorokobi AG" korrekt geschrieben (Impressum, Datenschutz, Footer)
- Datenschutz-Seite: Adresse und E-Mail aktualisiert

## v1.4.1
- Impressum komplett von kaiten.ch übernommen (yorokobi ag, Adresse, UID, Betriebe)
- Telefonnummer korrigiert: 041 244 99 99
- E-Mail korrigiert: info@yorokobi.ch
- Footer und Structured Data aktualisiert

## v1.4.0
- Alle Bilder komprimiert (~12 MB → ~3 MB, 75% kleiner)
- Dropdown-Select mit Chevron-Pfeil gestylt
- Logo vergrössert (Nav + Footer)

## v1.3.2
- Logo in Navigation und Footer vergrössert

## v1.3.1
- Option "Catering (ohne Koch)" im Anfrageformular ergänzt

## v1.3.0
- Anfrageformular an Yorokobi-Portal angebunden (POST /personal/api/extern/anfrage)
- Anfragen landen direkt im Yorokobi-System unter Rubrik CATERING
- Lokale JSON-Speicherung entfernt

## v1.2.1
- "ab" vor allen Preisangaben ergänzt (ab CHF 12, ab CHF 32, etc.)

## v1.2.0
- Preise auf exakte kaiten.ch-Preise zurückgesetzt (Apéro CHF 12, Lunch CHF 32, Dinner CHF 48, Workshop CHF 125)
- Neue Sektion "Personal & Anfahrt" mit transparenter Kostenaufstellung
- Sushikoch CHF 80/Std., Servicepersonal CHF 60/Std., Kurier CHF 60/Std.
- Kilometerpreis CHF 1.20/km für Anfahrt
- Geschirrpauschale ab CHF 50
- Lieferpauschale durch Kilometerpreis ersetzt

## v1.1.2
- Workshop: Getränke nicht inbegriffen

## v1.1.1
- Workshop-Preis korrigiert (CHF 150/Pers. ab 17 Personen)

## v1.1.0
- Preise +20% über kaiten.ch, Pauschalen für alle Angebote

## v1.0.0
- Erste Version mit Live Catering, Sushi Platten, Workshop
- Anfrageformular, Ablauf, Referenzen
- SSL, Autodeploy auf Server 8
