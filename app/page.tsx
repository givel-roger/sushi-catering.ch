"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    guests: "",
    typ: "live",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/anfrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Fehler beim Senden");
      setSent(true);
    } catch {
      setError("Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder rufen Sie uns an.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <Image src="/images/logo-black.png" alt="Kaiten by Yorokobi" width={200} height={44} className="h-8 w-auto" />
          </a>
          <div className="hidden sm:flex items-center gap-10 text-base text-muted">
            <a href="#angebot" className="hover:text-foreground transition-colors">Angebot</a>
            <a href="#ablauf" className="hover:text-foreground transition-colors">Ablauf</a>
            <a href="#referenzen" className="hover:text-foreground transition-colors">Referenzen</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="#anfrage" className="hidden sm:inline-block bg-accent hover:bg-accent-hover text-white px-7 py-3 text-sm tracking-[0.12em] uppercase transition-colors rounded-sm">
              Anfrage
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden flex flex-col gap-[5px] p-2 cursor-pointer"
              aria-label="Menü"
            >
              <span className={`block w-6 h-[2px] bg-foreground transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block w-6 h-[2px] bg-foreground transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-[2px] bg-foreground transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-8 flex flex-col gap-8 sm:hidden">
          <a href="#angebot" onClick={() => setMenuOpen(false)} className="text-2xl font-display text-foreground">Angebot</a>
          <a href="#ablauf" onClick={() => setMenuOpen(false)} className="text-2xl font-display text-foreground">Ablauf</a>
          <a href="#referenzen" onClick={() => setMenuOpen(false)} className="text-2xl font-display text-foreground">Referenzen</a>
          <a href="#anfrage" onClick={() => setMenuOpen(false)} className="mt-4 bg-accent text-white px-8 py-4 text-sm tracking-[0.15em] uppercase text-center rounded-sm">
            Anfrage senden
          </a>
          <div className="mt-auto pb-10 text-sm text-muted">
            <p><a href="tel:+41412409999">041 240 99 99</a></p>
            <p>info@sushi-catering.ch</p>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-end pb-20 sm:pb-28 overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-sushi.jpg"
            alt="Sushi Catering Platte"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-5 sm:px-10 w-full">
          <p className="text-white/80 text-sm tracking-[0.35em] uppercase mb-8">
            Kaiten Sushi · Luzern · Kriens · Sursee
          </p>

          <h1 className="font-display leading-[0.88] mb-10">
            <span className="block text-[clamp(3.5rem,11vw,10rem)] text-white">
              Frisch
            </span>
            <span className="block text-[clamp(3.5rem,11vw,10rem)] text-white/30" style={{ WebkitTextStroke: '2.5px white' }}>
              gerollt,
            </span>
            <span className="block text-[clamp(2.2rem,5.5vw,4.5rem)] text-white/80 font-sans font-light mt-3">
              direkt zu Ihnen.
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-10 mt-14">
            <p className="max-w-lg text-base text-white/85 leading-relaxed">
              Sushi Catering für die Schweiz — Firmenevents, Hochzeiten, Privatanlässe.
              Mit Live-Koch oder als fertige Platten. Ab 8 Personen.
            </p>
            <a
              href="#anfrage"
              className="shrink-0 border-2 border-white/40 hover:bg-white hover:text-foreground text-white px-10 py-5 text-sm tracking-[0.18em] uppercase transition-all"
            >
              Jetzt anfragen
            </a>
          </div>
        </div>
      </section>

      {/* ── ANGEBOTE ── */}
      <section id="angebot" className="border-t border-border">
        <div className="max-w-[1400px] mx-auto">

          {/* Live Catering */}
          <div className="grid md:grid-cols-2 border-b border-border">
            <FadeIn className="p-10 sm:p-20 flex flex-col justify-center">
              <span className="text-accent text-sm tracking-[0.3em] uppercase mb-5 block font-medium">01</span>
              <h2 className="font-display text-5xl sm:text-6xl text-foreground mb-5 leading-tight">
                Live Catering
              </h2>
              <p className="text-base text-muted leading-relaxed mb-8 max-w-md">
                Unser Sushi-Koch kommt zu Ihnen und rollt frisches Sushi direkt
                vor Ihren Gästen. Ein Show-Element, das jeden Event aufwertet.
              </p>
              <ul className="space-y-3 text-sm text-muted">
                <li>— Sushikoch-Pauschale CHF 700 (3 Std.)</li>
                <li>— Plus Pauschale pro Person nach Paket</li>
                <li>— Apéro CHF 12 · Lunch CHF 32 · Dinner CHF 48</li>
              </ul>
            </FadeIn>
            <div className="relative min-h-[350px] md:min-h-[500px]">
              <Image src="/images/live-catering.jpg" alt="Frisch gerolltes Sushi auf dem Teller" fill className="object-cover" />
            </div>
          </div>

          {/* Sushi Platten */}
          <div className="grid md:grid-cols-2 border-b border-border">
            <div className="relative min-h-[350px] md:min-h-[500px] order-2 md:order-1">
              <Image src="/images/sushi-platten.jpg" alt="Grosse Sushi Catering Platten" fill className="object-cover" />
            </div>
            <FadeIn className="p-10 sm:p-20 flex flex-col justify-center order-1 md:order-2">
              <span className="text-accent text-sm tracking-[0.3em] uppercase mb-5 block font-medium">02</span>
              <h2 className="font-display text-5xl sm:text-6xl text-foreground mb-5 leading-tight">
                Sushi Platten
              </h2>
              <p className="text-base text-muted leading-relaxed mb-8 max-w-md">
                Wunderschön angerichtete Platten, fertig geliefert. Maki, Nigiri,
                Inside-Out und Spezialitäten — kein Koch nötig, einfach geniessen.
              </p>
              <ul className="space-y-3 text-sm text-muted">
                <li>— Apéro (4 Stk.) CHF 12 · Apéro Riche (8 Stk.) CHF 23</li>
                <li>— Lunch (12 Stk.) CHF 32 · Dinner (18 Stk.) CHF 48</li>
                <li>— Lieferung & Geschirr nach Absprache</li>
              </ul>
            </FadeIn>
          </div>

          {/* Workshop */}
          <div className="grid md:grid-cols-2 border-b border-border">
            <FadeIn className="p-10 sm:p-20 flex flex-col justify-center">
              <span className="text-accent text-sm tracking-[0.3em] uppercase mb-5 block font-medium">03</span>
              <h2 className="font-display text-5xl sm:text-6xl text-foreground mb-5 leading-tight">
                Sushi Workshop
              </h2>
              <p className="text-base text-muted leading-relaxed mb-8 max-w-md">
                Teambuilding der besonderen Art. Ihre Gruppe lernt unter Anleitung
                unseres Sushi-Meisters, selbst zu rollen — und isst das Ergebnis.
              </p>
              <ul className="space-y-3 text-sm text-muted">
                <li>— Alle Zutaten & Utensilien gestellt</li>
                <li>— Perfekt für Teams & Gruppen</li>
                <li>— Ab 8 Personen · ab CHF 95/Pers.</li>
              </ul>
            </FadeIn>
            <div className="relative min-h-[350px] md:min-h-[500px]">
              <Image src="/images/workshop-sushi.jpg" alt="Sushi Spezialitäten Workshop" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── ABLAUF ── */}
      <section id="ablauf" className="py-28 sm:py-36">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-10">
          <FadeIn>
            <p className="text-accent text-sm tracking-[0.3em] uppercase mb-5 font-medium">So gehts</p>
            <h2 className="font-display text-5xl sm:text-6xl text-foreground mb-20 leading-tight">
              In vier Schritten<br />zum Sushi-Erlebnis.
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-x-20 gap-y-16">
            {[
              { n: "01", t: "Anfrage senden", d: "Erzählen Sie uns von Ihrem Event — Datum, Gästeanzahl und Ihre Wünsche." },
              { n: "02", t: "Offerte erhalten", d: "Innerhalb von 24 Stunden erhalten Sie ein massgeschneidertes Angebot." },
              { n: "03", t: "Details klären", d: "Wir besprechen Menü, Allergien, Aufbau und alle Details persönlich." },
              { n: "04", t: "Geniessen", d: "Wir liefern, bauen auf und sorgen für ein unvergessliches Erlebnis." },
            ].map((s, i) => (
              <FadeIn key={s.n} delay={i * 0.1}>
                <div className="flex gap-7">
                  <span className="font-display text-5xl text-accent/15 shrink-0">{s.n}</span>
                  <div>
                    <h3 className="text-foreground text-xl font-semibold mb-3">{s.t}</h3>
                    <p className="text-muted text-base leading-relaxed">{s.d}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATEMENT with Kaiten Box ── */}
      <section className="relative py-24 sm:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/kaiten-box.jpg" alt="Kaiten Sushi Box" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/55" />
        </div>
        <FadeIn className="relative max-w-[1400px] mx-auto px-5 sm:px-10">
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl text-white leading-tight text-center">
            Über <span className="text-accent">500 Events.</span><br />
            Drei Standorte.<br />
            <span className="italic text-white/50">Zwanzig Jahre Erfahrung.</span>
          </h2>
        </FadeIn>
      </section>

      {/* ── REFERENZEN ── */}
      <section id="referenzen" className="py-24 sm:py-32">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-10">
          <p className="text-accent text-sm tracking-[0.3em] uppercase mb-14 font-medium">Stimmen</p>

          <div className="space-y-20">
            {[
              { q: "Das Live-Catering war der Höhepunkt unserer Firmenfeier. Jeder Gast war begeistert.", who: "Sandra M., Eventmanagerin" },
              { q: "Wir buchen seit drei Jahren für unsere Weihnachtsfeier. Jedes Mal perfekt.", who: "Thomas K., CEO TechStart Zürich" },
              { q: "Der Workshop war das beste Teambuilding, das wir je organisiert haben.", who: "Lisa W., HR Lead" },
            ].map((t, i) => (
              <FadeIn key={t.who} delay={i * 0.1}>
                <blockquote className="border-l-[3px] border-accent/30 pl-10">
                  <p className="font-display text-2xl sm:text-3xl text-foreground/80 italic leading-relaxed mb-4">
                    {t.q}
                  </p>
                  <cite className="text-muted text-sm not-italic tracking-wide">{t.who}</cite>
                </blockquote>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANFRAGE ── */}
      <section id="anfrage" className="border-t border-border bg-surface py-24 sm:py-32">
        <div className="max-w-[900px] mx-auto px-5 sm:px-10">
          <FadeIn>
            <div className="mb-14">
              <p className="text-accent text-sm tracking-[0.3em] uppercase mb-5 font-medium">Anfrage</p>
              <h2 className="font-display text-5xl sm:text-6xl text-foreground mb-4 leading-tight">
                Ihr Event, unser Sushi.
              </h2>
              <p className="text-muted text-lg">
                Unverbindlich — wir melden uns innert 24 Stunden.
              </p>
            </div>
          </FadeIn>

          {sent ? (
            <FadeIn>
              <div className="py-24 text-center">
                <p className="font-display text-4xl text-foreground mb-4">Merci!</p>
                <p className="text-muted text-lg">Wir melden uns bei Ihnen.</p>
              </div>
            </FadeIn>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-8">
                <input required type="text" placeholder="Name *"
                  value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white border-b-2 border-border px-0 py-4 text-foreground text-base focus:outline-none focus:border-accent transition-colors placeholder:text-muted/50 w-full" />
                <input required type="email" placeholder="E-Mail *"
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white border-b-2 border-border px-0 py-4 text-foreground text-base focus:outline-none focus:border-accent transition-colors placeholder:text-muted/50 w-full" />
                <input type="tel" placeholder="Telefon"
                  value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-white border-b-2 border-border px-0 py-4 text-foreground text-base focus:outline-none focus:border-accent transition-colors placeholder:text-muted/50 w-full" />
                <input type="text" placeholder="Datum (z.B. 15. März 2025)"
                  value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-white border-b-2 border-border px-0 py-4 text-foreground text-base focus:outline-none focus:border-accent transition-colors placeholder:text-muted/50 w-full" />
                <input type="text" placeholder="Anzahl Gäste"
                  value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  className="bg-white border-b-2 border-border px-0 py-4 text-foreground text-base focus:outline-none focus:border-accent transition-colors placeholder:text-muted/50 w-full" />
                <select value={formData.typ} onChange={(e) => setFormData({ ...formData, typ: e.target.value })}
                  className="bg-white border-b-2 border-border px-0 py-4 text-foreground text-base focus:outline-none focus:border-accent transition-colors w-full appearance-none">
                  <option value="live">Live Catering (mit Koch)</option>
                  <option value="platte">Sushi Platten (ohne Koch)</option>
                  <option value="workshop">Sushi Workshop</option>
                  <option value="beratung">Weiss noch nicht — beraten Sie mich</option>
                </select>
              </div>
              <textarea rows={4} placeholder="Was dürfen wir wissen?"
                value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-white border-b-2 border-border px-0 py-4 text-foreground text-base focus:outline-none focus:border-accent transition-colors placeholder:text-muted/50 w-full resize-none" />
              {error && <p className="text-accent text-sm">{error}</p>}
              <button type="submit" disabled={sending}
                className="mt-6 bg-accent hover:bg-accent-hover text-white px-12 py-5 text-sm tracking-[0.18em] uppercase transition-colors cursor-pointer rounded-sm disabled:opacity-60">
                {sending ? "Wird gesendet..." : "Anfrage senden"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border py-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-10 mb-10">
            <div>
              <Image src="/images/logo-black.png" alt="Kaiten by Yorokobi" width={180} height={40} className="h-7 w-auto mb-4" />
              <p className="text-sm text-muted">
                Sushi Catering von{" "}
                <a href="https://www.kaiten.ch" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">
                  kaiten.ch
                </a>
              </p>
            </div>
            <div className="text-sm text-muted space-y-2 sm:text-right">
              <p>info@sushi-catering.ch · <a href="tel:+41412409999" className="hover:text-foreground transition-colors">041 240 99 99</a></p>
              <p>Luzern · Kriens · Sursee</p>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted/50">
            <p>© {new Date().getFullYear()} Kaiten by Yorokobi</p>
            <div className="flex gap-6">
              <Link href="/impressum" className="hover:text-foreground transition-colors">Impressum</Link>
              <Link href="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ── WHATSAPP BUTTON ── */}
      <a
        href="https://wa.me/41412449910?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20Sushi%20Catering."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25d366] hover:bg-[#1ebe57] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
