import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getDb } from "@/lib/db";
import { tenants } from "@/lib/schema";
import { eq } from "drizzle-orm";
import type { TenantBranding } from "@/lib/schema";

export const metadata: Metadata = {
  title: "gutschein-schenken.ch — Gutscheine online schenken",
  description:
    "Gutscheine für Restaurants, Hotels und Shops — online kaufen, sofort per Mail, ohne Verfalldatum.",
};

const MOTIF_PREVIEWS = [
  { src: "/images/motifs/elegant.jpg", label: "Edel" },
  { src: "/images/motifs/geburtstag.jpg", label: "Geburtstag" },
  { src: "/images/motifs/weihnachten.jpg", label: "Weihnachten" },
  { src: "/images/motifs/valentinstag.jpg", label: "Valentinstag" },
  { src: "/images/motifs/gratulation.jpg", label: "Gratulation" },
];

export default async function LandingPage() {
  const db = getDb();
  const activeTenants = await db
    .select()
    .from(tenants)
    .where(eq(tenants.active, true));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-lg sm:text-xl font-semibold text-accent">
            gutschein-schenken.ch
          </Link>
          <div className="flex items-center gap-4 sm:gap-6 text-sm">
            <Link
              href="/mitmachen"
              className="text-muted hover:text-foreground transition-colors"
            >
              Für Betriebe
            </Link>
            <a
              href="#gutscheine"
              className="bg-accent text-white px-4 sm:px-5 py-2 rounded-lg font-medium hover:bg-accent-hover transition-colors"
            >
              Gutschein kaufen
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2a2520] to-[#1a1a1a]" />
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/images/motifs/elegant.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-5 sm:px-10 py-16 sm:py-24 lg:py-32">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
              Gutscheine{" "}
              <span className="text-accent italic">schenken.</span>
            </h1>
            <p className="text-base sm:text-xl text-white/70 mb-8 leading-relaxed">
              Online kaufen, sofort per Mail erhalten, ohne Verfalldatum.
              Für Restaurants, Hotels und Erlebnisse in der Schweiz.
            </p>
            <a
              href="#gutscheine"
              className="inline-block bg-accent text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-accent-hover transition-colors"
            >
              Jetzt Gutschein schenken
            </a>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="bg-surface border-b border-border py-5">
        <div className="max-w-6xl mx-auto px-5 sm:px-10 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted">
          <span>✓ Sofort per Mail</span>
          <span>✓ Ohne Verfalldatum</span>
          <span>✓ Mit persönlicher Widmung</span>
          <span>✓ Sicher bezahlen</span>
        </div>
      </section>

      {/* So geht's */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-12">
            So einfach geht&apos;s
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { nr: "1", title: "Betrieb wählen", text: "Wählen Sie den Betrieb, für den Sie einen Gutschein schenken möchten." },
              { nr: "2", title: "Gestalten", text: "Betrag, Motiv und persönliche Widmung — Ihr Gutschein, Ihr Design." },
              { nr: "3", title: "Verschenken", text: "Sofort per Mail an Sie oder direkt an die beschenkte Person." },
            ].map((step) => (
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

      {/* Gutschein-Shops */}
      <section id="gutscheine" className="py-16 sm:py-20 bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-3">
            Gutscheine entdecken
          </h2>
          <p className="text-muted text-center mb-12 max-w-lg mx-auto">
            Wählen Sie einen Betrieb und schenken Sie Genuss, Erholung oder Freude.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTenants.map((t) => {
              const branding = t.branding as TenantBranding | null;
              return (
                <Link
                  key={t.id}
                  href={`/r/${t.slug}`}
                  className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Hero image */}
                  <div className="relative h-44 overflow-hidden">
                    {branding?.heroImageUrl ? (
                      <Image
                        src={branding.heroImageUrl}
                        alt={t.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(135deg, ${branding?.primaryColor || '#c8962e'} 0%, #1a1a1a 100%)` }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {branding?.logoUrl && (
                      <div className="absolute bottom-3 left-4">
                        <Image
                          src={branding.logoUrl}
                          alt={t.name}
                          width={120}
                          height={40}
                          className="h-8 w-auto brightness-0 invert"
                        />
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-1">{t.name}</h3>
                    {(t.addressCity || t.addressZip) && (
                      <p className="text-muted text-sm mb-3">
                        {[t.addressZip, t.addressCity].filter(Boolean).join(" ")}
                      </p>
                    )}
                    <span className="text-accent font-medium text-sm group-hover:underline">
                      Gutschein schenken →
                    </span>
                  </div>
                </Link>
              );
            })}

            {/* Platzhalter "Bald verfügbar" */}
            <div className="bg-white/50 rounded-2xl border border-dashed border-border p-8 flex flex-col items-center justify-center text-center min-h-[280px]">
              <div className="text-4xl mb-3 opacity-30">🎁</div>
              <p className="font-semibold text-muted/60 mb-1">Weitere Betriebe</p>
              <p className="text-sm text-muted/40">Bald verfügbar</p>
            </div>
          </div>
        </div>
      </section>

      {/* Motiv-Vorschau */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-3">
            Wunderschöne Gutscheine
          </h2>
          <p className="text-muted text-center mb-10 max-w-lg mx-auto">
            Für jeden Anlass das passende Motiv — vom Geburtstag bis zur Gratulation.
          </p>
          <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory -mx-5 px-5 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-5 sm:overflow-visible">
            {MOTIF_PREVIEWS.map((m) => (
              <div
                key={m.label}
                className="relative aspect-[3/4] min-w-[160px] sm:min-w-0 rounded-xl overflow-hidden snap-center"
              >
                <Image
                  src={m.src}
                  alt={m.label}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 left-3 text-white text-sm font-medium">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA für Betriebe */}
      <section className="py-16 sm:py-20 bg-[#1a1a1a] text-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-10 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
            Sie haben einen Betrieb?
          </h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            Verkaufen Sie Gutscheine über gutschein-schenken.ch — ohne Setup-Kosten,
            mit eigenem Branding, QR-Code-Einlösung und Online-Zahlung.
            Sie zahlen nur 5% Provision pro verkauftem Gutschein.
          </p>
          <Link
            href="/mitmachen"
            className="inline-block bg-accent text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-accent-hover transition-colors"
          >
            Mehr erfahren
          </Link>
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
            <p className="text-muted/40 text-xs">v3.0.7</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
