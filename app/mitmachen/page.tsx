import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Für Betriebe — gutschein-schenken.ch",
  description:
    "Verkaufen Sie Gutscheine online über gutschein-schenken.ch. Nur 5% Provision, kein Abo, sofort starten.",
};

const VORTEILE = [
  { text: "Mehr Umsatz durch digitale Gutscheine — direkt über Ihre Website oder unsere Plattform" },
  { text: "Sofortige Zustellung per E-Mail als PDF — kein Drucken, kein Versand, kein Warten" },
  { text: "Weniger Aufwand für Ihr Team — automatisierte Abläufe von Verkauf bis Einlösung" },
  { text: "Neue Kunden gewinnen — Ihre Gutscheine sind auf unserer Plattform sichtbar" },
];

const PAIN_POINTS = [
  "Gutscheine werden noch auf Papier verkauft und von Hand verwaltet",
  "Keine Online-Bestelloption — Kunden müssen vorbeikommen",
  "Kein Überblick über verkaufte und eingelöste Gutscheine",
  "Einlösung ist mühsam — Codes abtippen, Beträge nachschlagen",
  "Keine Integration mit der eigenen Website",
];

const PRODUKTE = [
  { icon: "🎫", title: "Gutschein-Shop", text: "Individuelle Shop-Seite mit Ihrem Branding. Kunden wählen Betrag, Motiv und Widmung." },
  { icon: "📱", title: "QR-Scanner App", text: "Ihr Personal scannt den QR-Code auf dem Gutschein — Einlösung in Sekunden, auch Teilbeträge." },
  { icon: "🖼", title: "iframe-Einbettung", text: "Betten Sie den Gutschein-Shop direkt in Ihre bestehende Website ein. Nahtlos integriert." },
  { icon: "📊", title: "Admin-Panel", text: "Übersicht über alle Verkäufe, Einlösungen und offene Gutscheine. Alles in Echtzeit." },
];

export default function MitmachenPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">
          <Link href="/" className="text-[14px] text-white/80 hover:text-white transition-colors">
            gutschein-schenken.ch
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-[13px] text-white/50 hover:text-white transition-colors hidden sm:block">
              Gutscheine
            </Link>
            <a
              href="#kontakt"
              className="text-[13px] font-medium bg-white text-[#1a1a1a] px-5 py-2 hover:bg-white/90 transition-colors"
            >
              Jetzt starten
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-14 min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/motifs/genuss.jpg"
            alt="Gastronomie"
            fill
            className="object-cover"
            priority
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a]/90 via-[#1a1a1a]/70 to-[#1a1a1a]/40" />
        </div>
        <div className="relative max-w-[1200px] mx-auto px-6 sm:px-10 py-20">
          <div className="max-w-[600px]">
            <p className="text-[#c8962e] text-[13px] font-medium uppercase tracking-[0.15em] mb-6">
              Für Restaurants, Hotels &amp; Erlebnisse
            </p>
            <h1 className="text-white font-display text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1] tracking-[-0.03em] mb-6">
              Mehr Umsatz,<br />
              mehr Gäste,<br />
              <em className="text-[#c8962e]">weniger Aufwand.</em>
            </h1>
            <p className="text-white/60 text-[17px] leading-[1.7] mb-10 max-w-[440px]">
              Verkaufen Sie Gutscheine digital — einfach, flexibel und professionell.
              Nur 5% Provision, kein Abo, keine Fixkosten.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#kontakt"
                className="text-[14px] font-medium bg-white text-[#1a1a1a] px-8 py-4 hover:bg-white/90 transition-colors"
              >
                Kostenlos starten
              </a>
              <a
                href="#so-funktionierts"
                className="text-[14px] font-medium border border-white/30 text-white px-8 py-4 hover:bg-white/10 transition-colors"
              >
                So funktioniert&apos;s
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Vorteile mit Häkchen */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 items-center">
            <div>
              <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.1] tracking-[-0.02em] mb-5">
                Genuss digital verkaufen — einfach und erfolgreich.
              </h2>
              <p className="text-[#777] text-[15px] leading-[1.7]">
                In der Gastronomie zählt jeder Gast. Digitale Gutscheine bringen
                neue Kunden, stärken die Bindung und schaffen Umsatz — ohne Mehraufwand.
              </p>
            </div>
            <div className="space-y-6">
              {VORTEILE.map((v) => (
                <div key={v.text} className="flex gap-4">
                  <div className="w-6 h-6 mt-0.5 flex-shrink-0">
                    <svg className="w-6 h-6 text-[#c8962e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <p className="text-[15px] leading-[1.6]">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 sm:py-28 bg-[#f3f0ea]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.1] tracking-[-0.02em] mb-5 max-w-[500px]">
            Kennen Sie das?
          </h2>
          <p className="text-[#777] text-[15px] leading-[1.7] mb-14 max-w-[500px]">
            Die meisten Betriebe verschenken Potenzial, weil Gutscheine noch analog laufen.
          </p>
          <div className="space-y-5 max-w-[700px]">
            {PAIN_POINTS.map((p) => (
              <div key={p} className="flex gap-4 items-start">
                <div className="w-6 h-6 mt-0.5 flex-shrink-0 rounded-full border-2 border-[#c8962e]/40 flex items-center justify-center">
                  <span className="text-[#c8962e] text-[13px] font-bold">!</span>
                </div>
                <p className="text-[15px] leading-[1.6]">{p}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 pt-10 border-t border-[#e0dbd2]">
            <p className="text-[17px] font-medium max-w-[500px]">
              Mit gutschein-schenken.ch lösen Sie alle diese Probleme — <em className="text-[#c8962e]">in einem System</em>.
            </p>
          </div>
        </div>
      </section>

      {/* Produkte / Features */}
      <section id="so-funktionierts" className="py-20 sm:py-28">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.1] tracking-[-0.02em] mb-5">
            Alles aus einer Hand.
          </h2>
          <p className="text-[#777] text-[15px] leading-[1.7] mb-14 max-w-[500px]">
            Ein System für den gesamten Gutschein-Prozess — vom Verkauf über die Zustellung bis zur Einlösung.
          </p>

          <div className="grid sm:grid-cols-2 gap-5">
            {PRODUKTE.map((p) => (
              <div key={p.title} className="bg-white border border-[#e8e3d8] p-8 hover:border-[#c8962e]/30 transition-colors">
                <span className="text-3xl mb-4 block">{p.icon}</span>
                <h3 className="text-[17px] font-semibold mb-2">{p.title}</h3>
                <p className="text-[#777] text-[14px] leading-[1.7]">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bild + Text: So funktioniert's */}
      <section className="py-20 sm:py-28 bg-[#1a1a1a] text-white">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/motifs/elegant.jpg"
                alt="Gutschein-Erlebnis"
                fill
                className="object-cover"
                quality={85}
              />
            </div>
            <div>
              <p className="text-[#c8962e] text-[13px] font-medium uppercase tracking-[0.15em] mb-6">
                In 3 Schritten online
              </p>
              <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.5rem)] leading-[1.1] tracking-[-0.02em] mb-10">
                Ihr Shop ist in 24 Stunden live.
              </h2>
              <div className="space-y-8">
                {[
                  { nr: "01", title: "Anmelden", text: "Senden Sie uns Logo, Farben und Texte — oder füllen Sie unser Onboarding-Formular aus." },
                  { nr: "02", title: "Wir richten ein", text: "Innerhalb von 24h ist Ihr Shop online — mit eigenem Branding und Stripe-Anbindung." },
                  { nr: "03", title: "Sie verkaufen", text: "Teilen Sie den Link, betten Sie ihn ein. Geld fliesst direkt auf Ihr Konto." },
                ].map((step) => (
                  <div key={step.nr} className="flex gap-5">
                    <span className="text-[#c8962e] text-[14px] font-medium mt-1 flex-shrink-0">{step.nr}</span>
                    <div>
                      <h3 className="text-[16px] font-medium mb-1">{step.title}</h3>
                      <p className="text-white/50 text-[14px] leading-[1.7]">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-16 items-center">
            <div>
              <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.1] tracking-[-0.02em] mb-5">
                Transparent &amp; fair.
              </h2>
              <p className="text-[#777] text-[15px] leading-[1.7] mb-8">
                Kein Abo, keine versteckten Kosten. Sie zahlen nur, wenn Sie verkaufen.
                Das Geld fliesst direkt auf Ihr Bankkonto via Stripe.
              </p>
              <ul className="space-y-3">
                {[
                  "Keine Setup-Kosten",
                  "Kein monatliches Abo",
                  "Kein Mindestumsatz",
                  "Eigenes Branding inklusive",
                  "QR-Einlösung inklusive",
                  "Support inklusive",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[14px]">
                    <span className="text-[#c8962e]">&#10003;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-[#e8e3d8] p-10 text-center">
              <p className="text-[56px] sm:text-[72px] font-bold text-[#1a1a1a] leading-none mb-2">5%</p>
              <p className="text-[18px] font-semibold mb-1">Provision</p>
              <p className="text-[#999] text-[14px] mb-8">pro verkauftem Gutschein</p>
              <a
                href="#kontakt"
                className="block w-full text-[14px] font-medium bg-[#1a1a1a] text-white py-4 hover:bg-[#333] transition-colors text-center"
              >
                Kostenlos starten
              </a>
              <p className="text-[#ccc] text-[12px] mt-4">
                zzgl. Stripe-Gebühren (ca. 2.9% + CHF 0.30)
              </p>
            </div>
          </div>

          {/* Marketing Pool */}
          <div className="mt-8 bg-[#f3f0ea] border border-dashed border-[#d8d0c4] p-8 max-w-[500px]">
            <p className="font-medium text-[15px] mb-1">Optional: Marketing-Pool</p>
            <p className="text-[#777] text-[14px] leading-[1.7]">
              Für zusätzliche 2% erscheint Ihr Betrieb prominent auf der Startseite
              und in unseren Marketing-Kampagnen.
            </p>
          </div>
        </div>
      </section>

      {/* CTA / Kontakt */}
      <section id="kontakt" className="py-20 sm:py-28 bg-[#1a1a1a] text-white">
        <div className="max-w-[700px] mx-auto px-6 sm:px-10 text-center">
          <p className="text-[#c8962e] text-[13px] font-medium uppercase tracking-[0.15em] mb-6">
            Loslegen
          </p>
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.1] tracking-[-0.02em] mb-5">
            Bereit für digitale Gutscheine?
          </h2>
          <p className="text-white/50 text-[15px] leading-[1.7] mb-10">
            Schreiben Sie uns eine E-Mail — oder füllen Sie direkt unser
            Onboarding-Formular aus. Innerhalb von 24 Stunden ist Ihr Shop online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@marktindex.ch?subject=Gutschein-Shop%20einrichten"
              className="text-[14px] font-medium bg-white text-[#1a1a1a] px-8 py-4 hover:bg-white/90 transition-colors"
            >
              info@marktindex.ch
            </a>
            <Link
              href="/onboarding"
              className="text-[14px] font-medium border border-white/30 text-white px-8 py-4 hover:bg-white/10 transition-colors"
            >
              Onboarding-Formular
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e8e3d8] py-8 bg-[#faf8f5]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[13px] text-[#bbb]">
            <p className="text-[#777]">Ein Angebot der Marktindex AG, Luzern</p>
            <div className="flex gap-6">
              <Link href="/impressum" className="hover:text-[#555] transition-colors">Impressum</Link>
              <Link href="/datenschutz" className="hover:text-[#555] transition-colors">Datenschutz</Link>
              <Link href="/agb" className="hover:text-[#555] transition-colors">AGB</Link>
            </div>
            <p className="text-[#ddd] text-[11px]">v3.5.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
