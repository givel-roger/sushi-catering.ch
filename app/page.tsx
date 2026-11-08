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
      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-16 h-24 flex items-center justify-between">
          <Link href="/" className="font-display text-[22px] text-white tracking-[0.02em]">
            gutschein-schenken
          </Link>
          <div className="flex items-center gap-8">
            <Link
              href="/mitmachen"
              className="text-white/50 text-[13px] tracking-[0.15em] uppercase hover:text-white/80 transition-colors hidden sm:block"
            >
              Für Betriebe
            </Link>
            <a
              href="#gutscheine"
              className="text-[13px] tracking-[0.1em] uppercase border border-white/25 text-white/90 px-6 py-2.5 hover:bg-white/10 transition-all"
            >
              Schenken
            </a>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative h-[100svh] min-h-[700px] flex items-end">
        <Image
          src="/images/motifs/elegant.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/40" />

        {/* decorative line */}
        <div className="absolute top-24 left-6 sm:left-16 w-px h-16 bg-white/20" />

        <div className="relative w-full max-w-[1400px] mx-auto px-6 sm:px-16 pb-20 sm:pb-28">
          <div className="fade-up">
            <p className="text-[13px] tracking-[0.25em] uppercase text-accent mb-8">
              Für Restaurants &middot; Hotels &middot; Erlebnisse
            </p>
          </div>
          <h1 className="fade-up fade-up-d1">
            <span className="block font-display text-[clamp(3rem,8vw,7.5rem)] text-white leading-[0.92] tracking-[-0.02em]">
              Gutscheine
            </span>
            <span className="block font-display italic text-[clamp(3rem,8vw,7.5rem)] text-accent leading-[0.92] tracking-[-0.02em]">
              schenken.
            </span>
          </h1>
          <div className="mt-10 flex flex-col sm:flex-row sm:items-end gap-8 sm:gap-16 fade-up fade-up-d2">
            <p className="text-white/45 max-w-[340px] text-[15px] leading-[1.7]">
              Online kaufen, sofort per Mail erhalten.
              Persönlich gestaltet, ohne Verfalldatum.
            </p>
            <a
              href="#gutscheine"
              className="group inline-flex items-center gap-4"
            >
              <span className="w-14 h-14 rounded-full border border-accent/40 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-300">
                <svg className="w-5 h-5 text-accent group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </span>
              <span className="text-white/40 text-[13px] tracking-[0.15em] uppercase group-hover:text-white/70 transition-colors">
                Entdecken
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── Intro-Band ─── */}
      <section className="py-6 border-b border-[#e0dbd2]">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-16 flex flex-wrap justify-between gap-4 text-[12px] tracking-[0.2em] uppercase text-[#999]">
          <span>Sofort per Mail</span>
          <span className="hidden sm:block">&middot;</span>
          <span>Ohne Verfalldatum</span>
          <span className="hidden sm:block">&middot;</span>
          <span>Persönliche Widmung</span>
          <span className="hidden sm:block">&middot;</span>
          <span>Sichere Bezahlung</span>
        </div>
      </section>

      {/* ─── Gutschein-Shops ─── */}
      <section id="gutscheine" className="py-24 sm:py-32">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-16">
          {/* Section header — asymmetric */}
          <div className="grid sm:grid-cols-[1fr_1fr] gap-6 mb-20">
            <div>
              <div className="w-10 h-px bg-accent mb-8" />
              <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] tracking-[-0.01em]">
                Gutscheine<br />entdecken.
              </h2>
            </div>
            <div className="flex items-end">
              <p className="text-[#888] text-[15px] leading-[1.8] max-w-[380px]">
                Wählen Sie einen Betrieb und schenken Sie Genuss,
                Erholung oder unvergessliche Momente.
              </p>
            </div>
          </div>

          {/* Tenant cards — large, photographic */}
          <div className="grid lg:grid-cols-2 gap-5">
            {activeTenants.map((t) => {
              const branding = t.branding as TenantBranding | null;
              return (
                <Link
                  key={t.id}
                  href={`/r/${t.slug}`}
                  className="group relative block overflow-hidden bg-[#1a1a1a]"
                >
                  <div className="aspect-[4/3] relative">
                    {branding?.heroImageUrl ? (
                      <Image
                        src={branding.heroImageUrl}
                        alt={t.name}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-[800ms] ease-out"
                        quality={85}
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(160deg, ${branding?.primaryColor || '#c8962e'} 0%, #1a1a1a 100%)` }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  </div>

                  {/* Card content — bottom overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-9 flex items-end justify-between">
                    <div>
                      {branding?.logoUrl && (
                        <Image
                          src={branding.logoUrl}
                          alt=""
                          width={140}
                          height={45}
                          className="h-6 sm:h-8 w-auto brightness-0 invert opacity-70 mb-4"
                        />
                      )}
                      <h3 className="text-white font-display text-2xl sm:text-[28px] tracking-[-0.01em]">
                        {t.name}
                      </h3>
                      {(t.addressCity || t.addressZip) && (
                        <p className="text-white/40 text-[13px] mt-1.5 tracking-[0.05em]">
                          {[t.addressZip, t.addressCity].filter(Boolean).join(" ")}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 w-12 h-12 border border-white/20 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-300">
                      <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <p className="text-center text-[#bbb] text-[13px] mt-14 tracking-[0.15em] uppercase font-display italic">
            Weitere Betriebe folgen bald
          </p>
        </div>
      </section>

      {/* ─── So funktioniert's ─── */}
      <section className="py-24 sm:py-32 bg-[#f3f0ea] border-y border-[#e0dbd2]">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-16">
          <div className="w-10 h-px bg-accent mb-8" />
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] tracking-[-0.01em] mb-20">
            So einfach<br />geht&apos;s.
          </h2>

          <div className="grid sm:grid-cols-3 gap-px bg-[#ddd8ce]">
            {[
              { nr: "01", title: "Betrieb wählen", text: "Restaurant, Hotel oder Erlebnis — wählen Sie, wohin Ihr Gutschein führt." },
              { nr: "02", title: "Persönlich gestalten", text: "Betrag, Motiv und Widmung wählen — Ihr Gutschein, Ihr Design." },
              { nr: "03", title: "Sofort verschenken", text: "Per E-Mail an Sie oder direkt an die beschenkte Person." },
            ].map((step) => (
              <div key={step.nr} className="bg-[#f3f0ea] p-8 sm:p-10">
                <p className="font-display text-accent text-[40px] leading-none mb-6 opacity-40">{step.nr}</p>
                <h3 className="font-display text-xl mb-3">{step.title}</h3>
                <p className="text-[#888] text-[15px] leading-[1.7]">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Motiv-Galerie ─── */}
      <section className="py-24 sm:py-32 bg-[#141211] text-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-16 mb-14">
          <div className="grid sm:grid-cols-[1fr_1fr] gap-6">
            <div>
              <div className="w-10 h-px bg-accent mb-8" />
              <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] tracking-[-0.01em]">
                Für jeden<br />Anlass.
              </h2>
            </div>
            <div className="flex items-end">
              <p className="text-white/35 text-[15px] leading-[1.8] max-w-[360px]">
                Sieben handverlesene Motive — vom Geburtstag
                bis zur Gratulation. Jedes Bild erzählt eine Geschichte.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pl-6 sm:pl-16 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
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
              className="relative flex-shrink-0 w-[240px] sm:w-[280px] aspect-[3/4] overflow-hidden snap-center group"
            >
              <Image
                src={m.src}
                alt={m.label}
                fill
                className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-display italic text-white/80 text-lg">{m.label}</p>
              </div>
            </div>
          ))}
          <div className="flex-shrink-0 w-16" aria-hidden />
        </div>
      </section>

      {/* ─── CTA Betriebe ─── */}
      <section className="py-24 sm:py-32">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-16">
          <div className="relative overflow-hidden bg-[#1a1816] px-8 sm:px-20 py-20 sm:py-28">
            <div className="absolute inset-0 opacity-[0.07]">
              <Image src="/images/motifs/genuss.jpg" alt="" fill className="object-cover" />
            </div>
            {/* decorative border */}
            <div className="absolute inset-4 border border-white/[0.06]" />

            <div className="relative max-w-xl mx-auto text-center">
              <div className="w-10 h-px bg-accent mx-auto mb-8" />
              <h2 className="font-display text-[clamp(1.8rem,3.5vw,3rem)] text-white leading-[1.15] tracking-[-0.01em] mb-5">
                Sie haben einen Betrieb?
              </h2>
              <p className="text-white/35 text-[15px] leading-[1.8] mb-10">
                Eigenes Branding, QR-Einlösung, Online-Zahlung.
                Nur 5% Provision — kein Abo, keine Setup-Kosten.
              </p>
              <Link
                href="/mitmachen"
                className="inline-block text-[13px] tracking-[0.15em] uppercase border border-accent/40 text-accent px-10 py-4 hover:bg-accent hover:text-white transition-all duration-300"
              >
                Mehr erfahren
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[#e0dbd2] py-10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-16">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-[13px] text-[#aaa]">
            <p className="font-display text-[#555] text-lg tracking-[0.02em]">gutschein-schenken</p>
            <div className="flex gap-8 tracking-[0.05em]">
              <Link href="/impressum" className="hover:text-[#555] transition-colors">Impressum</Link>
              <Link href="/datenschutz" className="hover:text-[#555] transition-colors">Datenschutz</Link>
              <Link href="/agb" className="hover:text-[#555] transition-colors">AGB</Link>
              <Link href="/mitmachen" className="hover:text-[#555] transition-colors">Für Betriebe</Link>
            </div>
            <p className="text-[#ccc] text-[11px]">v3.0.9</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
