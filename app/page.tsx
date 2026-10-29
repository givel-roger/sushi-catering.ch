"use client";

import { useState } from "react";

function MakiIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none">
      <circle cx="40" cy="40" r="36" stroke="#c41e2a" strokeWidth="2" opacity="0.3" />
      <circle cx="40" cy="40" r="24" fill="#faf7f4" stroke="#e5e2de" strokeWidth="1" />
      <circle cx="40" cy="40" r="16" fill="#c41e2a" opacity="0.08" />
      <circle cx="34" cy="36" r="4" fill="#c41e2a" opacity="0.25" />
      <circle cx="46" cy="38" r="3.5" fill="#c41e2a" opacity="0.2" />
      <circle cx="40" cy="46" r="3" fill="#c41e2a" opacity="0.3" />
    </svg>
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

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <a href="#" className="font-display text-lg text-foreground tracking-wide">
            寿司<span className="text-xs ml-2 tracking-[0.25em] uppercase text-muted">catering.ch</span>
          </a>
          <div className="hidden sm:flex items-center gap-8 text-sm text-muted">
            <a href="#angebot" className="hover:text-foreground transition-colors">Angebot</a>
            <a href="#ablauf" className="hover:text-foreground transition-colors">Ablauf</a>
            <a href="#referenzen" className="hover:text-foreground transition-colors">Referenzen</a>
          </div>
          <a href="#anfrage" className="bg-accent hover:bg-accent-hover text-white px-5 py-2 text-xs tracking-[0.15em] uppercase transition-colors">
            Anfrage
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-end pb-16 sm:pb-24 overflow-hidden pt-16">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-surface" />
        <div className="absolute bottom-0 left-0 w-2/3 h-px bg-gradient-to-r from-accent/30 to-transparent" />

        <MakiIcon className="absolute top-[20%] right-[14%] w-28 h-28 opacity-30" />
        <MakiIcon className="absolute top-[50%] right-[6%] w-16 h-16 opacity-15" />

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-8 w-full">
          <p className="text-accent text-xs tracking-[0.4em] uppercase mb-6">
            Kaiten Sushi · Luzern · Kriens · Sursee
          </p>

          <h1 className="font-display leading-[0.88] mb-8">
            <span className="block text-[clamp(3rem,10vw,9rem)] text-foreground">
              Frisch
            </span>
            <span className="block text-[clamp(3rem,10vw,9rem)] text-outline">
              gerollt,
            </span>
            <span className="block text-[clamp(2rem,5vw,4rem)] text-muted font-sans font-light mt-2">
              direkt zu Ihnen.
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mt-12">
            <p className="max-w-md text-sm text-muted leading-relaxed">
              Sushi Catering für die Schweiz — Firmenevents, Hochzeiten, Privatanlässe.
              Mit Live-Koch oder als fertige Platten. Ab 8 Personen.
            </p>
            <a
              href="#anfrage"
              className="shrink-0 border border-foreground/20 hover:border-accent hover:text-accent px-8 py-4 text-xs tracking-[0.2em] uppercase transition-all"
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
            <div className="p-8 sm:p-16 flex flex-col justify-center">
              <span className="text-accent text-xs tracking-[0.3em] uppercase mb-4 block">01</span>
              <h2 className="font-display text-4xl sm:text-5xl text-foreground mb-4">
                Live Catering
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-6 max-w-sm">
                Unser Sushi-Koch kommt zu Ihnen und rollt frisches Sushi direkt
                vor Ihren Gästen. Ein Show-Element, das jeden Event aufwertet.
              </p>
              <ul className="space-y-2 text-xs text-muted">
                <li>— Koch & Equipment inklusive</li>
                <li>— Individuelle Menügestaltung</li>
                <li>— Ab 20 Personen · ab CHF 75/Pers.</li>
              </ul>
            </div>
            <div className="bg-surface flex items-center justify-center p-12 sm:p-16 min-h-[300px]">
              <svg viewBox="0 0 200 160" className="w-full max-w-[280px] opacity-40">
                <rect x="30" y="100" width="140" height="12" rx="6" fill="#ddd" />
                <rect x="50" y="80" width="20" height="20" rx="10" fill="#c41e2a" opacity="0.2" />
                <rect x="80" y="75" width="24" height="25" rx="12" fill="#c41e2a" opacity="0.15" />
                <rect x="115" y="78" width="22" height="22" rx="11" fill="#c41e2a" opacity="0.25" />
                <line x1="90" y1="30" x2="88" y2="75" stroke="#bbb" strokeWidth="1.5" />
                <line x1="95" y1="28" x2="105" y2="75" stroke="#bbb" strokeWidth="1.5" />
                <text x="60" y="140" fontFamily="Georgia, serif" fontSize="10" fill="#aaa" letterSpacing="3">LIVE · FRISCH · VOR ORT</text>
              </svg>
            </div>
          </div>

          {/* Sushi Platten */}
          <div className="grid md:grid-cols-2 border-b border-border">
            <div className="bg-warm flex items-center justify-center p-12 sm:p-16 min-h-[300px] order-2 md:order-1">
              <svg viewBox="0 0 200 160" className="w-full max-w-[280px] opacity-40">
                <ellipse cx="100" cy="90" rx="80" ry="40" fill="none" stroke="#ddd" strokeWidth="1.5" />
                <ellipse cx="70" cy="82" rx="14" ry="8" fill="#c41e2a" opacity="0.12" transform="rotate(-10 70 82)" />
                <ellipse cx="100" cy="78" rx="16" ry="9" fill="#c41e2a" opacity="0.18" transform="rotate(5 100 78)" />
                <ellipse cx="130" cy="84" rx="13" ry="7" fill="#c41e2a" opacity="0.14" transform="rotate(-5 130 84)" />
                <ellipse cx="85" cy="96" rx="12" ry="7" fill="#c41e2a" opacity="0.1" />
                <ellipse cx="118" cy="95" rx="11" ry="6" fill="#c41e2a" opacity="0.12" />
                <text x="45" y="148" fontFamily="Georgia, serif" fontSize="10" fill="#aaa" letterSpacing="3">SERVIERFERTIG · EDEL</text>
              </svg>
            </div>
            <div className="p-8 sm:p-16 flex flex-col justify-center order-1 md:order-2">
              <span className="text-accent text-xs tracking-[0.3em] uppercase mb-4 block">02</span>
              <h2 className="font-display text-4xl sm:text-5xl text-foreground mb-4">
                Sushi Platten
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-6 max-w-sm">
                Wunderschön angerichtete Platten, fertig geliefert. Maki, Nigiri,
                Inside-Out und Spezialitäten — kein Koch nötig, einfach geniessen.
              </p>
              <ul className="space-y-2 text-xs text-muted">
                <li>— Lieferung in der ganzen Deutschschweiz</li>
                <li>— Inkl. Sojasauce, Wasabi, Ingwer</li>
                <li>— Ab 10 Personen · ab CHF 45/Pers.</li>
              </ul>
            </div>
          </div>

          {/* Workshop */}
          <div className="grid md:grid-cols-2 border-b border-border">
            <div className="p-8 sm:p-16 flex flex-col justify-center">
              <span className="text-accent text-xs tracking-[0.3em] uppercase mb-4 block">03</span>
              <h2 className="font-display text-4xl sm:text-5xl text-foreground mb-4">
                Sushi Workshop
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-6 max-w-sm">
                Teambuilding der besonderen Art. Ihre Gruppe lernt unter Anleitung
                unseres Sushi-Meisters, selbst zu rollen — und isst das Ergebnis.
              </p>
              <ul className="space-y-2 text-xs text-muted">
                <li>— Alle Zutaten & Utensilien gestellt</li>
                <li>— Perfekt für Teams & Gruppen</li>
                <li>— Ab 8 Personen · ab CHF 95/Pers.</li>
              </ul>
            </div>
            <div className="bg-surface flex items-center justify-center p-12 sm:p-16 min-h-[300px]">
              <svg viewBox="0 0 200 160" className="w-full max-w-[280px] opacity-40">
                <rect x="60" y="60" width="80" height="8" rx="1" fill="#ddd" />
                <rect x="65" y="52" width="12" height="8" rx="4" fill="#c41e2a" opacity="0.2" />
                <rect x="82" y="50" width="14" height="10" rx="5" fill="#c41e2a" opacity="0.15" />
                <rect x="102" y="53" width="11" height="7" rx="3.5" fill="#c41e2a" opacity="0.22" />
                <rect x="118" y="51" width="13" height="9" rx="4.5" fill="#c41e2a" opacity="0.18" />
                <rect x="70" y="90" width="60" height="3" rx="1.5" fill="#ccc" />
                <rect x="75" y="100" width="50" height="3" rx="1.5" fill="#ccc" opacity="0.6" />
                <text x="40" y="140" fontFamily="Georgia, serif" fontSize="10" fill="#aaa" letterSpacing="3">SELBER ROLLEN · LERNEN</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABLAUF ── */}
      <section id="ablauf" className="py-24 sm:py-32">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-8">
          <p className="text-accent text-xs tracking-[0.3em] uppercase mb-4">So gehts</p>
          <h2 className="font-display text-4xl sm:text-5xl text-foreground mb-16">
            In vier Schritten<br />zum Sushi-Erlebnis.
          </h2>

          <div className="grid sm:grid-cols-2 gap-x-16 gap-y-12">
            {[
              { n: "01", t: "Anfrage senden", d: "Erzählen Sie uns von Ihrem Event — Datum, Gästeanzahl und Ihre Wünsche." },
              { n: "02", t: "Offerte erhalten", d: "Innerhalb von 24 Stunden erhalten Sie ein massgeschneidertes Angebot." },
              { n: "03", t: "Details klären", d: "Wir besprechen Menü, Allergien, Aufbau und alle Details persönlich." },
              { n: "04", t: "Geniessen", d: "Wir liefern, bauen auf und sorgen für ein unvergessliches Erlebnis." },
            ].map((s) => (
              <div key={s.n} className="flex gap-6">
                <span className="font-display text-4xl text-accent/20 shrink-0">{s.n}</span>
                <div>
                  <h3 className="text-foreground text-lg font-medium mb-2">{s.t}</h3>
                  <p className="text-muted text-sm leading-relaxed">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATEMENT ── */}
      <section className="py-20 sm:py-32 bg-foreground text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl leading-tight text-center">
            Über <span className="text-accent">500 Events.</span><br />
            Drei Standorte.<br />
            <span className="italic text-white/50">Zwanzig Jahre Erfahrung.</span>
          </h2>
        </div>
      </section>

      {/* ── REFERENZEN ── */}
      <section id="referenzen" className="py-20 sm:py-28">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-8">
          <p className="text-accent text-xs tracking-[0.3em] uppercase mb-12">Stimmen</p>

          <div className="space-y-16">
            {[
              { q: "Das Live-Catering war der Höhepunkt unserer Firmenfeier. Jeder Gast war begeistert.", who: "Sandra M., Eventmanagerin" },
              { q: "Wir buchen seit drei Jahren für unsere Weihnachtsfeier. Jedes Mal perfekt.", who: "Thomas K., CEO TechStart Zürich" },
              { q: "Der Workshop war das beste Teambuilding, das wir je organisiert haben.", who: "Lisa W., HR Lead" },
            ].map((t) => (
              <blockquote key={t.who} className="border-l-2 border-accent/30 pl-8">
                <p className="font-display text-xl sm:text-2xl text-foreground/80 italic leading-relaxed mb-3">
                  {t.q}
                </p>
                <cite className="text-muted text-xs not-italic tracking-wide">{t.who}</cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANFRAGE ── */}
      <section id="anfrage" className="border-t border-border bg-surface py-20 sm:py-28">
        <div className="max-w-[800px] mx-auto px-4 sm:px-8">
          <div className="mb-12">
            <p className="text-accent text-xs tracking-[0.3em] uppercase mb-4">Anfrage</p>
            <h2 className="font-display text-4xl sm:text-5xl text-foreground mb-3">
              Ihr Event, unser Sushi.
            </h2>
            <p className="text-muted text-sm">
              Unverbindlich — wir melden uns innert 24 Stunden.
            </p>
          </div>

          {sent ? (
            <div className="py-20 text-center">
              <p className="font-display text-3xl text-foreground mb-3">Merci!</p>
              <p className="text-muted text-sm">Wir melden uns bei Ihnen.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <input required type="text" placeholder="Name *"
                  value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white border-b border-border px-0 py-3 text-foreground text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-muted/60 w-full" />
                <input required type="email" placeholder="E-Mail *"
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white border-b border-border px-0 py-3 text-foreground text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-muted/60 w-full" />
                <input type="tel" placeholder="Telefon"
                  value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-white border-b border-border px-0 py-3 text-foreground text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-muted/60 w-full" />
                <input type="text" placeholder="Datum (z.B. 15. März 2025)"
                  value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-white border-b border-border px-0 py-3 text-foreground text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-muted/60 w-full" />
                <input type="text" placeholder="Anzahl Gäste"
                  value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  className="bg-white border-b border-border px-0 py-3 text-foreground text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-muted/60 w-full" />
                <select value={formData.typ} onChange={(e) => setFormData({ ...formData, typ: e.target.value })}
                  className="bg-white border-b border-border px-0 py-3 text-foreground text-sm focus:outline-none focus:border-accent transition-colors w-full appearance-none">
                  <option value="live">Live Catering (mit Koch)</option>
                  <option value="platte">Sushi Platten (ohne Koch)</option>
                  <option value="workshop">Sushi Workshop</option>
                  <option value="beratung">Weiss noch nicht — beraten Sie mich</option>
                </select>
              </div>
              <textarea rows={3} placeholder="Was dürfen wir wissen?"
                value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-white border-b border-border px-0 py-3 text-foreground text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-muted/60 w-full resize-none" />
              <button type="submit"
                className="mt-4 bg-accent hover:bg-accent-hover text-white px-10 py-4 text-xs tracking-[0.2em] uppercase transition-colors cursor-pointer">
                Anfrage senden
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-start gap-8">
          <div>
            <p className="font-display text-sm text-foreground mb-1">
              寿司 <span className="text-xs text-muted ml-1">catering.ch</span>
            </p>
            <p className="text-xs text-muted">
              Ein Angebot von{" "}
              <a href="https://www.kaiten.ch" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">
                Kaiten Sushi
              </a>
            </p>
          </div>
          <div className="text-xs text-muted space-y-1 sm:text-right">
            <p>info@sushi-catering.ch · +41 41 320 88 88</p>
            <p>Luzern · Kriens · Sursee</p>
            <p className="text-muted/40">© {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
