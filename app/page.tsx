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
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a]">

      {/* ─── Nav ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#faf8f5]/90 backdrop-blur-sm">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="text-[15px] font-medium tracking-[-0.01em]">
            gutschein-schenken.ch
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/mitmachen"
              className="text-[13px] text-[#999] hover:text-[#1a1a1a] transition-colors hidden sm:block"
            >
              Für Betriebe
            </Link>
            <a
              href="#gutscheine"
              className="text-[13px] font-medium bg-[#1a1a1a] text-white px-5 py-2.5 hover:bg-[#333] transition-colors"
            >
              Gutscheine
            </a>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="pt-16">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
          <div className="grid lg:grid-cols-[1fr_0.9fr] gap-0 min-h-[80vh] items-center">
            {/* Text */}
            <div className="py-16 lg:py-0 lg:pr-20">
              <h1 className="font-display text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.03em] mb-8">
                Gutscheine<br />
                <em className="text-accent">schenken.</em>
              </h1>
              <p className="text-[#777] text-[17px] leading-[1.7] max-w-[380px] mb-12">
                Online kaufen, sofort per Mail erhalten.
                Persönlich gestaltet, ohne Verfalldatum.
              </p>
              <div className="flex items-center gap-8">
                <a
                  href="#gutscheine"
                  className="text-[14px] font-medium bg-[#1a1a1a] text-white px-7 py-3.5 hover:bg-[#333] transition-colors"
                >
                  Jetzt schenken
                </a>
                <span className="text-[13px] text-[#bbb]">
                  Für Restaurants, Hotels &amp; Erlebnisse
                </span>
              </div>
            </div>

            {/* Photo */}
            <div className="relative aspect-[4/5] lg:aspect-auto lg:self-stretch">
              <Image
                src="/images/motifs/elegant.jpg"
                alt="Festlich gedeckter Tisch mit Kerzen"
                fill
                className="object-cover"
                priority
                quality={85}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Vorteile ─── */}
      <section className="py-5 border-y border-[#e8e3d8]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 flex flex-wrap justify-center gap-x-10 gap-y-2 text-[13px] text-[#999]">
          <span>Sofort per Mail</span>
          <span>Ohne Verfalldatum</span>
          <span>Persönliche Widmung</span>
          <span>Sichere Bezahlung</span>
        </div>
      </section>

      {/* ─── Gutschein-Shops ─── */}
      <section id="gutscheine" className="py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
          <div className="max-w-[520px] mb-16">
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.02em] mb-4">
              Gutscheine entdecken.
            </h2>
            <p className="text-[#999] text-[15px] leading-[1.7]">
              Wählen Sie einen Betrieb und schenken Sie Genuss,
              Erholung oder unvergessliche Momente.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {activeTenants.map((t) => {
              const branding = t.branding as TenantBranding | null;
              return (
                <Link
                  key={t.id}
                  href={`/r/${t.slug}`}
                  className="group relative block overflow-hidden bg-[#1a1a1a] aspect-[3/2]"
                >
                  {branding?.heroImageUrl ? (
                    <Image
                      src={branding.heroImageUrl}
                      alt={t.name}
                      fill
                      className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700 ease-out"
                      quality={85}
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{ background: `linear-gradient(160deg, ${branding?.primaryColor || '#c8962e'} 0%, #1a1a1a 100%)` }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    {branding?.logoUrl && (
                      <Image
                        src={branding.logoUrl}
                        alt=""
                        width={140}
                        height={45}
                        className="h-5 sm:h-7 w-auto brightness-0 invert opacity-60 mb-3"
                      />
                    )}
                    <h3 className="text-white font-display text-xl sm:text-2xl tracking-[-0.01em]">
                      {t.name}
                    </h3>
                    {(t.addressCity || t.addressZip) && (
                      <p className="text-white/40 text-[13px] mt-1">
                        {[t.addressZip, t.addressCity].filter(Boolean).join(" ")}
                      </p>
                    )}
                  </div>

                  <div className="absolute top-5 right-5 w-10 h-10 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>

          <p className="text-center text-[#ccc] text-[13px] mt-10 italic">
            Weitere Betriebe folgen
          </p>
        </div>
      </section>

      {/* ─── So funktioniert's ─── */}
      <section className="py-24 sm:py-32 bg-[#1a1a1a] text-white">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.02em] mb-16">
            So einfach geht&apos;s.
          </h2>

          <div className="grid sm:grid-cols-3 gap-12 sm:gap-16">
            {[
              { nr: "01", title: "Betrieb wählen", text: "Restaurant, Hotel oder Erlebnis — wählen Sie, wohin Ihr Gutschein führt." },
              { nr: "02", title: "Persönlich gestalten", text: "Betrag, Motiv und eine persönliche Widmung — ganz nach Ihrem Geschmack." },
              { nr: "03", title: "Sofort verschenken", text: "Der Gutschein kommt per E-Mail — an Sie oder direkt an die beschenkte Person." },
            ].map((step) => (
              <div key={step.nr}>
                <p className="text-accent text-[13px] font-medium mb-4">{step.nr}</p>
                <h3 className="text-[18px] font-medium mb-3 tracking-[-0.01em]">{step.title}</h3>
                <p className="text-white/40 text-[15px] leading-[1.7]">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Motiv-Galerie ─── */}
      <section className="py-24 sm:py-32 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 mb-12">
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.02em] mb-4">
            Für jeden Anlass.
          </h2>
          <p className="text-[#999] text-[15px] leading-[1.7] max-w-[380px]">
            Sieben handverlesene Motive — vom Geburtstag
            bis zur Gratulation.
          </p>
        </div>

        <div className="flex gap-3 pl-6 sm:pl-10 overflow-x-auto pb-4 scrollbar-hide">
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
              className="relative flex-shrink-0 w-[200px] sm:w-[240px] aspect-[3/4] overflow-hidden group"
            >
              <Image
                src={m.src}
                alt={m.label}
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 text-white/80 text-[14px] font-medium">{m.label}</p>
            </div>
          ))}
          <div className="flex-shrink-0 w-10" aria-hidden />
        </div>
      </section>

      {/* ─── CTA Betriebe ─── */}
      <section className="py-24 sm:py-32 bg-[#f3f0ea]">
        <div className="max-w-[600px] mx-auto px-6 sm:px-10 text-center">
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.5rem)] leading-[1.15] tracking-[-0.02em] mb-4">
            Sie haben einen Betrieb?
          </h2>
          <p className="text-[#999] text-[15px] leading-[1.7] mb-8">
            Eigenes Branding, QR-Einlösung, Online-Zahlung.
            Nur 5&thinsp;% Provision — kein Abo, keine Fixkosten.
          </p>
          <Link
            href="/mitmachen"
            className="inline-block text-[14px] font-medium bg-[#1a1a1a] text-white px-7 py-3.5 hover:bg-[#333] transition-colors"
          >
            Mehr erfahren
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[#e8e3d8] py-8">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[13px] text-[#bbb]">
            <p className="text-[#777]">gutschein-schenken.ch</p>
            <div className="flex gap-6">
              <Link href="/impressum" className="hover:text-[#555] transition-colors">Impressum</Link>
              <Link href="/datenschutz" className="hover:text-[#555] transition-colors">Datenschutz</Link>
              <Link href="/agb" className="hover:text-[#555] transition-colors">AGB</Link>
              <Link href="/mitmachen" className="hover:text-[#555] transition-colors">Für Betriebe</Link>
            </div>
            <p className="text-[#ddd] text-[11px]">v3.2.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
