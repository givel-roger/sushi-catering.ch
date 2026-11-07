import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getDb } from "@/lib/db";
import { tenants } from "@/lib/schema";
import { eq } from "drizzle-orm";
import type { TenantBranding } from "@/lib/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "gutschein-schenken.ch — Gutscheine online schenken",
  description:
    "Gutscheine für Restaurants, Hotels und Shops — online kaufen, sofort per Mail, ohne Verfalldatum.",
};

export default async function LandingPage() {
  const db = getDb();
  const activeTenants = await db
    .select()
    .from(tenants)
    .where(eq(tenants.active, true));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav — minimal, transparent */}
      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 h-20 flex items-center justify-between">
          <Link href="/" className="font-display text-xl sm:text-2xl font-semibold text-white/90 tracking-wide">
            gutschein-schenken.ch
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/mitmachen"
              className="text-white/60 hover:text-white transition-colors hidden sm:block"
            >
              Für Betriebe
            </Link>
            <a
              href="#gutscheine"
              className="border border-white/30 text-white px-5 py-2.5 rounded-full text-sm hover:bg-white/10 transition-all"
            >
              Gutschein schenken
            </a>
          </div>
        </div>
      </nav>

      {/* Hero — fullscreen, cinematic */}
      <section className="relative h-[100svh] min-h-[600px] flex items-end overflow-hidden">
        <Image
          src="/images/motifs/elegant.jpg"
          alt="Festlich gedeckter Tisch"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-12 pb-16 sm:pb-24">
          <p className="text-accent font-display italic text-lg sm:text-xl mb-4 tracking-wide">
            Online kaufen · Sofort erhalten · Ohne Verfalldatum
          </p>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold text-white leading-[0.95] mb-8">
            Gutscheine<br />
            <span className="text-accent italic">schenken.</span>
          </h1>
          <a
            href="#gutscheine"
            className="inline-flex items-center gap-3 bg-accent text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-accent-hover transition-colors group"
          >
            Jetzt entdecken
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </section>

      {/* So funktioniert's — elegant, horizontal */}
      <section className="py-20 sm:py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <p className="text-accent text-sm font-medium tracking-[0.2em] uppercase mb-4">So einfach geht&apos;s</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-16 max-w-md">
            In drei Schritten zum perfekten Geschenk.
          </h2>
          <div className="grid sm:grid-cols-3 gap-12 sm:gap-8">
            {[
              { nr: "01", title: "Betrieb wählen", text: "Restaurant, Hotel oder Erlebnis — wählen Sie, wohin der Gutschein führt." },
              { nr: "02", title: "Gestalten", text: "Betrag bestimmen, Motiv wählen, persönliche Widmung schreiben." },
              { nr: "03", title: "Verschenken", text: "Sofort per E-Mail — an Sie selbst oder direkt an die beschenkte Person." },
            ].map((step) => (
              <div key={step.nr} className="group">
                <p className="text-accent font-display text-4xl sm:text-5xl font-bold mb-4 opacity-30 group-hover:opacity-60 transition-opacity">{step.nr}</p>
                <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gutschein-Shops — editorial cards */}
      <section id="gutscheine" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-16">
            <div>
              <p className="text-accent text-sm font-medium tracking-[0.2em] uppercase mb-4">Unsere Partner</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold max-w-lg">
                Gutscheine entdecken.
              </h2>
            </div>
            <p className="text-muted max-w-sm">
              Genuss, Erholung oder Freude verschenken — wählen Sie einen Betrieb.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {activeTenants.map((t) => {
              const branding = t.branding as TenantBranding | null;
              return (
                <Link
                  key={t.id}
                  href={`/r/${t.slug}`}
                  className="group relative rounded-2xl overflow-hidden bg-[#1a1a1a] aspect-[16/10] flex items-end"
                >
                  {branding?.heroImageUrl ? (
                    <Image
                      src={branding.heroImageUrl}
                      alt={t.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      quality={85}
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{ background: `linear-gradient(135deg, ${branding?.primaryColor || '#c8962e'} 0%, #1a1a1a 100%)` }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="relative w-full p-6 sm:p-8 flex items-end justify-between">
                    <div>
                      {branding?.logoUrl && (
                        <Image
                          src={branding.logoUrl}
                          alt=""
                          width={140}
                          height={45}
                          className="h-7 sm:h-9 w-auto brightness-0 invert mb-3"
                        />
                      )}
                      <h3 className="text-white font-display text-2xl sm:text-3xl font-bold">{t.name}</h3>
                      {(t.addressCity || t.addressZip) && (
                        <p className="text-white/50 text-sm mt-1">
                          {[t.addressZip, t.addressCity].filter(Boolean).join(" ")}
                        </p>
                      )}
                    </div>
                    <span className="flex-shrink-0 w-12 h-12 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <p className="text-center text-muted/40 text-sm mt-12 font-display italic">
            Weitere Betriebe folgen bald.
          </p>
        </div>
      </section>

      {/* Motiv-Galerie — immersive */}
      <section className="py-20 sm:py-28 bg-[#1a1a1a] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-12">
          <p className="text-accent text-sm font-medium tracking-[0.2em] uppercase mb-4">Für jeden Anlass</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold max-w-md">
            Wunderschöne Gutschein-Motive.
          </h2>
        </div>
        <div className="flex gap-4 pl-6 sm:pl-12 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
          {[
            { src: "/images/motifs/elegant.jpg", label: "Edel" },
            { src: "/images/motifs/geburtstag.jpg", label: "Geburtstag" },
            { src: "/images/motifs/weihnachten.jpg", label: "Weihnachten" },
            { src: "/images/motifs/valentinstag.jpg", label: "Valentinstag" },
            { src: "/images/motifs/danke.jpg", label: "Danke" },
            { src: "/images/motifs/genuss.jpg", label: "Genussmoment" },
            { src: "/images/motifs/gratulation.jpg", label: "Gratulation" },
          ].map((m) => (
            <div
              key={m.label}
              className="relative flex-shrink-0 w-[260px] sm:w-[300px] aspect-[3/4] rounded-2xl overflow-hidden snap-center group"
            >
              <Image
                src={m.src}
                alt={m.label}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white font-display text-lg italic">{m.label}</p>
              </div>
            </div>
          ))}
          <div className="flex-shrink-0 w-6 sm:w-12" aria-hidden />
        </div>
      </section>

      {/* Trust-Sektion */}
      <section className="py-20 sm:py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { title: "Sofortige Zustellung", text: "Gutschein kommt per E-Mail — in Sekunden beim Empfänger." },
              { title: "Ohne Verfalldatum", text: "Kein Stress — einlösen, wann immer es passt." },
              { title: "Persönliche Widmung", text: "Ihre Worte machen den Gutschein zum persönlichen Geschenk." },
              { title: "Sichere Bezahlung", text: "Verschlüsselt über Stripe — Visa, Mastercard, Twint." },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="font-display text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA für Betriebe */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="bg-[#1a1a1a] rounded-3xl px-8 sm:px-16 py-16 sm:py-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <Image src="/images/motifs/genuss.jpg" alt="" fill className="object-cover" />
            </div>
            <div className="relative">
              <p className="text-accent text-sm font-medium tracking-[0.2em] uppercase mb-4">Für Betriebe</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 max-w-lg mx-auto">
                Gutscheine verkaufen — ohne Aufwand.
              </h2>
              <p className="text-white/50 mb-10 max-w-md mx-auto leading-relaxed">
                Eigenes Branding, QR-Einlösung, Online-Zahlung.
                Nur 5% Provision — kein Abo, keine Setup-Kosten.
              </p>
              <Link
                href="/mitmachen"
                className="inline-block border border-accent text-accent px-8 py-4 rounded-full text-lg font-medium hover:bg-accent hover:text-white transition-all"
              >
                Mehr erfahren
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer — minimal */}
      <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-sm text-muted">
            <p className="font-display text-foreground text-lg">gutschein-schenken.ch</p>
            <div className="flex gap-8">
              <Link href="/impressum" className="hover:text-foreground transition-colors">Impressum</Link>
              <Link href="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</Link>
              <Link href="/agb" className="hover:text-foreground transition-colors">AGB</Link>
              <Link href="/mitmachen" className="hover:text-foreground transition-colors">Für Betriebe</Link>
            </div>
            <p className="text-muted/30 text-xs">v3.0.8</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
