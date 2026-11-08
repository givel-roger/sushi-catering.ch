import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mitmachen — gutschein-schenken.ch",
  description:
    "Verkaufen Sie Gutscheine online über gutschein-schenken.ch. Nur 5% Provision, kein Abo, sofort starten.",
};

const FEATURES = [
  {
    icon: "🎨",
    title: "Eigenes Branding",
    text: "Ihr Logo, Ihre Farben, Ihre Texte — der Gutschein-Shop sieht aus wie Ihrer.",
  },
  {
    icon: "📱",
    title: "QR-Code Einlösung",
    text: "Staff scannt den QR-Code mit dem Handy — Einlösung in Sekunden, auch Teilbeträge.",
  },
  {
    icon: "💳",
    title: "Online-Bezahlung",
    text: "Stripe-Integration für sichere Kartenzahlung. Geld direkt auf Ihr Konto.",
  },
  {
    icon: "📧",
    title: "Sofort-Zustellung",
    text: "Gutscheine werden sofort per E-Mail als PDF versendet — kein Warten, kein Drucken.",
  },
  {
    icon: "🖼",
    title: "Schöne Motive",
    text: "7 professionelle Motiv-Karten für jeden Anlass — Geburtstag, Weihnachten, Valentinstag und mehr.",
  },
  {
    icon: "🔗",
    title: "Website-Integration",
    text: "Per iframe in Ihre bestehende Website einbetten oder als eigene Seite nutzen.",
  },
];

const STEPS = [
  {
    nr: "1",
    title: "Anmelden",
    text: "Schreiben Sie uns — wir richten Ihren Shop innerhalb von 24 Stunden ein.",
  },
  {
    nr: "2",
    title: "Branding",
    text: "Logo, Farben und Texte — wir passen den Shop an Ihren Betrieb an.",
  },
  {
    nr: "3",
    title: "Live",
    text: "Ihr Gutschein-Shop ist online. Teilen Sie den Link oder betten Sie ihn ein.",
  },
];

export default function MitmachenPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-lg sm:text-xl font-semibold text-accent">
            gutschein-schenken.ch
          </Link>
          <div className="flex items-center gap-4 sm:gap-6 text-sm">
            <Link href="/" className="text-muted hover:text-foreground transition-colors">
              Gutscheine
            </Link>
            <a
              href="#kontakt"
              className="bg-accent text-white px-4 sm:px-5 py-2 rounded-lg font-medium hover:bg-accent-hover transition-colors"
            >
              Jetzt starten
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#2a2520] to-[#1a1a1a] text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-10 py-16 sm:py-24 lg:py-32">
          <div className="max-w-2xl">
            <p className="text-accent font-medium mb-3 text-sm tracking-wide uppercase">
              Für Restaurants, Hotels & Shops
            </p>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5">
              Gutscheine verkaufen.{" "}
              <span className="text-accent italic">Einfach.</span>
            </h1>
            <p className="text-base sm:text-xl text-white/70 mb-8 leading-relaxed">
              Ohne Setup-Kosten, ohne Abo. Nur 5% Provision pro verkauftem Gutschein.
              Eigenes Branding, QR-Einlösung, Online-Zahlung — alles dabei.
            </p>
            <a
              href="#kontakt"
              className="inline-block bg-accent text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-accent-hover transition-colors"
            >
              Kostenlos starten
            </a>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 sm:py-20 bg-surface border-b border-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-3">
            Transparent & fair
          </h2>
          <p className="text-muted text-center mb-12 max-w-lg mx-auto">
            Kein Abo, keine versteckten Kosten. Sie zahlen nur, wenn Sie verkaufen.
          </p>
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-border p-8 text-center">
            <p className="text-5xl sm:text-6xl font-bold text-accent mb-2">5%</p>
            <p className="text-lg font-semibold mb-1">Provision</p>
            <p className="text-muted text-sm mb-6">pro verkauftem Gutschein</p>
            <ul className="text-sm text-left space-y-3 mb-8">
              {[
                "Keine Setup-Kosten",
                "Kein monatliches Abo",
                "Kein Mindestumsatz",
                "Eigenes Branding inklusive",
                "QR-Einlösung inklusive",
                "Support inklusive",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="#kontakt"
              className="block w-full bg-accent text-white py-3 rounded-xl font-semibold hover:bg-accent-hover transition-colors"
            >
              Jetzt starten
            </a>
          </div>

          {/* Marketing Pool */}
          <div className="max-w-md mx-auto mt-6 bg-white/60 rounded-2xl border border-dashed border-border p-6 text-center">
            <p className="font-semibold mb-1">Optional: Marketing-Pool</p>
            <p className="text-muted text-sm leading-relaxed">
              Für zusätzliche 2% erscheint Ihr Betrieb prominent auf der Startseite
              und in unseren Marketing-Kampagnen.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-12">
            Alles, was Sie brauchen
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div key={f.title}>
                <span className="text-3xl mb-3 block">{f.icon}</span>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* So geht's */}
      <section className="py-16 sm:py-20 bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-12">
            In 3 Schritten online
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {STEPS.map((step) => (
              <div key={step.nr} className="text-center">
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.nr}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Kontakt */}
      <section id="kontakt" className="py-16 sm:py-20 bg-[#1a1a1a] text-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-10 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
            Bereit? Schreiben Sie uns.
          </h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            Wir richten Ihren Gutschein-Shop innerhalb von 24 Stunden ein.
            Schreiben Sie uns eine E-Mail mit Ihrem Betriebsnamen und Logo.
          </p>
          <a
            href="mailto:info@gutschein-schenken.ch?subject=Gutschein-Shop%20einrichten"
            className="inline-block bg-accent text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-accent-hover transition-colors"
          >
            info@gutschein-schenken.ch
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted">
            <p className="font-display text-foreground font-semibold">gutschein-schenken.ch</p>
            <div className="flex gap-6">
              <Link href="/impressum" className="hover:text-foreground transition-colors">Impressum</Link>
              <Link href="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</Link>
              <Link href="/agb" className="hover:text-foreground transition-colors">AGB</Link>
            </div>
            <p className="text-muted/40 text-xs">v3.2.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
