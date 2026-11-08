import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Onboarding — gutschein-schenken.ch",
  description: "Alle Informationen für die Einrichtung Ihres Gutschein-Shops.",
};

const CHECKLIST = [
  {
    category: "Betriebsdaten",
    items: [
      { label: "Betriebsname", hint: "Offizieller Name wie er auf dem Gutschein erscheinen soll", required: true },
      { label: "Strasse + Nr.", hint: "", required: true },
      { label: "PLZ + Ort", hint: "", required: true },
      { label: "Telefon", hint: "Wird auf der Shop-Seite angezeigt", required: false },
      { label: "E-Mail", hint: "Für Kundenanfragen zum Gutschein", required: true },
      { label: "Website", hint: "Falls vorhanden — wird verlinkt", required: false },
    ],
  },
  {
    category: "Branding",
    items: [
      { label: "Logo (PNG oder SVG)", hint: "Transparenter Hintergrund, mind. 400px breit", required: true },
      { label: "Logo für dunklen Hintergrund", hint: "Falls Logo auf Dunkel anders aussehen soll (z.B. weiss)", required: false },
      { label: "Hauptfarbe (Hex-Code)", hint: "z.B. #c8962e — wird für Buttons und Akzente verwendet", required: true },
      { label: "Hero-Bild", hint: "Grosses Foto für die Shop-Startseite, mind. 1200×800px, Querformat", required: true },
    ],
  },
  {
    category: "Gutschein-Einstellungen",
    items: [
      { label: "Betrags-Vorschläge", hint: "z.B. 50, 100, 150, 200, 250 CHF — Kunde kann auch frei wählen", required: true },
      { label: "Mindestbetrag", hint: "Standard: 20 CHF", required: false },
      { label: "Maximalbetrag", hint: "Standard: 1'000 CHF", required: false },
      { label: "Gutschein-Kürzel", hint: "2-3 Buchstaben für den Code, z.B. DN → DN-A3K2-B8M1", required: true },
    ],
  },
  {
    category: "Texte",
    items: [
      { label: "Shop-Titel", hint: "z.B. «Schenken Sie Genuss» — Hauptüberschrift auf Ihrer Shop-Seite", required: true },
      { label: "Shop-Untertitel", hint: "Kurzer Beschrieb, z.B. «Gutscheine für unser Restaurant in Luzern»", required: true },
      { label: "3–4 Stichworte", hint: "z.B. «Sofort per Mail», «Ohne Verfalldatum», «Persönliche Widmung»", required: false },
    ],
  },
  {
    category: "Admin-Zugang",
    items: [
      { label: "Admin E-Mail", hint: "Login für das Verwaltungs-Panel — dort sehen Sie verkaufte Gutscheine", required: true },
      { label: "Name der Kontaktperson", hint: "", required: true },
    ],
  },
];

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a]">
      {/* Nav */}
      <nav className="border-b border-[#e8e3d8]">
        <div className="max-w-[800px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-[15px] font-medium tracking-[-0.01em]">
            gutschein-schenken.ch
          </Link>
          <Link href="/mitmachen" className="text-[13px] text-[#999] hover:text-[#1a1a1a] transition-colors">
            Übersicht
          </Link>
        </div>
      </nav>

      <main className="max-w-[800px] mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.02em] mb-4">
            Shop einrichten.
          </h1>
          <p className="text-[#777] text-[16px] leading-[1.7] max-w-[560px]">
            Damit wir Ihren Gutschein-Shop aufsetzen können, brauchen wir
            folgende Informationen. Füllen Sie die Liste aus und senden Sie
            alles an{" "}
            <a href="mailto:info@marktindex.ch?subject=Onboarding%20Gutschein-Shop" className="text-[#1a1a1a] underline">
              info@marktindex.ch
            </a>.
          </p>
        </div>

        {/* Prozess */}
        <div className="grid sm:grid-cols-3 gap-8 mb-20 pb-16 border-b border-[#e8e3d8]">
          {[
            { nr: "1", title: "Sie liefern", text: "Logo, Farben, Texte und ein schönes Foto — alles was unten steht." },
            { nr: "2", title: "Wir richten ein", text: "Innerhalb von 24h ist Ihr Shop online — mit eigenem Branding." },
            { nr: "3", title: "Sie verkaufen", text: "Teilen Sie den Link, betten Sie ihn ein. 5% Provision pro Verkauf." },
          ].map((step) => (
            <div key={step.nr}>
              <div className="w-8 h-8 bg-[#1a1a1a] text-white text-[13px] font-medium flex items-center justify-center mb-4">
                {step.nr}
              </div>
              <h3 className="text-[16px] font-medium mb-2">{step.title}</h3>
              <p className="text-[#999] text-[14px] leading-[1.6]">{step.text}</p>
            </div>
          ))}
        </div>

        {/* Checkliste */}
        <h2 className="font-display text-2xl mb-10">Was wir von Ihnen brauchen</h2>

        <div className="space-y-12">
          {CHECKLIST.map((group) => (
            <div key={group.category}>
              <h3 className="text-[13px] font-medium uppercase tracking-[0.1em] text-[#999] mb-5">
                {group.category}
              </h3>
              <div className="space-y-0 border-t border-[#e8e3d8]">
                {group.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-4 py-4 border-b border-[#e8e3d8]"
                  >
                    <div className="w-5 h-5 mt-0.5 border border-[#ccc] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <p className="text-[15px] font-medium">{item.label}</p>
                        {item.required && (
                          <span className="text-accent text-[12px]">Pflicht</span>
                        )}
                      </div>
                      {item.hint && (
                        <p className="text-[#aaa] text-[13px] mt-0.5">{item.hint}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Dateien-Hinweis */}
        <div className="mt-16 bg-[#f3f0ea] p-8">
          <h3 className="font-medium text-[16px] mb-3">Dateien-Formate</h3>
          <ul className="text-[#777] text-[14px] leading-[1.8] space-y-1">
            <li><strong>Logo:</strong> PNG mit transparentem Hintergrund oder SVG. Mindestens 400px breit.</li>
            <li><strong>Hero-Bild:</strong> JPG oder PNG, Querformat, mindestens 1200 &times; 800 Pixel.</li>
            <li><strong>Farbe:</strong> Hex-Code (z.B. #c8962e). Fragen Sie Ihren Grafiker oder nutzen Sie ein Tool wie <span className="text-[#1a1a1a]">coolors.co</span>.</li>
          </ul>
        </div>

        {/* Was Sie bekommen */}
        <div className="mt-12 mb-16">
          <h3 className="font-medium text-[16px] mb-4">Was Sie von uns bekommen</h3>
          <ul className="text-[#777] text-[14px] leading-[1.8] space-y-1">
            <li>&#10003; Eigene Shop-Seite mit Ihrem Branding</li>
            <li>&#10003; Admin-Panel zum Verwalten und Einlösen der Gutscheine</li>
            <li>&#10003; QR-Code Scanner-App für Ihr Personal</li>
            <li>&#10003; iframe-Code zum Einbetten auf Ihrer Website</li>
            <li>&#10003; PDF-Gutscheine mit Ihrem Logo, automatisch per Mail versandt</li>
            <li>&#10003; Online-Bezahlung via Stripe (Geld direkt auf Ihr Konto)</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center py-12 border-t border-[#e8e3d8]">
          <p className="text-[#777] text-[15px] mb-6">
            Alles zusammen? Senden Sie uns die Infos und Dateien per E-Mail.
          </p>
          <a
            href="mailto:info@marktindex.ch?subject=Onboarding%20Gutschein-Shop"
            className="inline-block text-[14px] font-medium bg-[#1a1a1a] text-white px-7 py-3.5 hover:bg-[#333] transition-colors"
          >
            info@marktindex.ch
          </a>
          <p className="text-[#ccc] text-[13px] mt-6">
            Innerhalb von 24 Stunden ist Ihr Shop online.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e8e3d8] py-8">
        <div className="max-w-[800px] mx-auto px-6 flex justify-between items-center text-[12px] text-[#ccc]">
          <p>Ein Angebot der Marktindex AG, Luzern</p>
          <div className="flex gap-6">
            <Link href="/impressum" className="hover:text-[#777] transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-[#777] transition-colors">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
