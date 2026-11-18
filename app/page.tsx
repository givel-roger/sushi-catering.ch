"use client";

import { useState, useEffect, useRef } from "react";

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
        transform: visible ? "none" : "translateY(24px)",
        transition: `opacity .6s ease ${delay}s, transform .6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

const STEPS = [
  {
    label: "Erfahrung",
    title: "Woher bringst du deine Erfahrung mit?",
    subtitle: "Wähle, was am ehesten auf dich zutrifft. Quereinsteiger sind willkommen.",
    options: [
      { emoji: "🍰", text: "Aus der Lebensmittelproduktion (Bäckerei, Confiserie, Gastro)" },
      { emoji: "🏭", text: "Aus der industriellen Produktion (anderer Bereich)" },
      { emoji: "🔧", text: "Aus dem Handwerk oder Gewerbe" },
      { emoji: "✨", text: "Quereinsteiger/in, motiviert einzusteigen" },
    ],
  },
  {
    label: "Arbeitszeit",
    title: "Früh aufstehen — kein Problem für dich?",
    subtitle: "Die Frühschicht startet um 3:30 Uhr. Feierabend ist dafür gegen 13 Uhr.",
    options: [
      { emoji: "⏰", text: "Ja, ich bin ein Frühaufsteher — das passt perfekt" },
      { emoji: "🌅", text: "Ich bin es gewohnt, früh zu arbeiten" },
      { emoji: "🤔", text: "Ich bin offen dafür und will es ausprobieren" },
    ],
  },
  {
    label: "Motivation",
    title: "Was reizt dich an dieser Stelle?",
    subtitle: "Es gibt keine falsche Antwort. Wir wollen dich kennenlernen.",
    options: [
      { emoji: "☀️", text: "Der freie Nachmittag — mehr Zeit für Familie & Freizeit" },
      { emoji: "🎂", text: "Die Arbeit mit Lebensmitteln und handwerkliche Produktion" },
      { emoji: "👥", text: "Das Teamwork und die abwechslungsreiche Tätigkeit" },
      { emoji: "🏔️", text: "Stabiler Job bei einem Top-Arbeitgeber in Luzern" },
    ],
  },
  {
    label: "Kontakt",
    title: "Fast geschafft — wie erreichen wir dich?",
    subtitle: "Wir melden uns persönlich bei dir, meist telefonisch.",
    options: [],
  },
];

export default function Home() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function selectOption(text: string) {
    const next = [...answers];
    next[step] = text;
    setAnswers(next);
    setTimeout(() => setStep(step + 1), 300);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/bewerbung", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, contact, stelle: "Produktionsmitarbeiter/in Frühschicht" }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setSending(false);
    }
  }

  function scrollToFunnel() {
    document.getElementById("funnel")?.scrollIntoView({ behavior: "smooth" });
  }

  function scrollToRolle() {
    document.getElementById("rolle")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg, #f4f8fc)", color: "var(--ink, #1a1a2e)" }}>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 border-b" style={{ background: "rgba(255,255,255,.88)", backdropFilter: "blur(12px)", borderColor: "#e4ebf3" }}>
        <div className="max-w-[1120px] mx-auto px-5 h-[68px] flex items-center justify-between">
          <a href="#top" className="block no-underline">
            <img src="/images/bachmann_logo_braun.png" alt="Confiserie Bachmann" className="h-12 w-auto" />
          </a>
          <button
            onClick={scrollToFunnel}
            className="hidden sm:inline-flex items-center gap-2 border-none cursor-pointer font-semibold text-[14px] px-[18px] py-[10px] rounded-full transition-all"
            style={{ background: "#351A00", color: "#fff", boxShadow: "0 10px 24px -10px rgba(53,26,0,.5)" }}
          >
            Jetzt bewerben
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section id="top" className="relative overflow-hidden" style={{ padding: 0, background: "radial-gradient(120% 120% at 80% -10%, #4a2500 0%, #351A00 38%, #2a1400 78%, #1f0f00 100%)", color: "#fff" }}>
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 12% 20%, rgba(240,131,178,.16), transparent 40%), radial-gradient(circle at 90% 80%, rgba(255,255,255,.08), transparent 45%)", pointerEvents: "none" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)", backgroundSize: "52px 52px", maskImage: "linear-gradient(180deg, transparent, #000 20%, #000 60%, transparent)" }} />

        <div className="relative max-w-[1120px] mx-auto px-5 grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr] gap-12 items-center py-[72px]">
          <div>
            <span className="inline-flex items-center gap-2 text-[13px] font-semibold px-3.5 py-[7px] rounded-full mb-5" style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.18)" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: "#F083B2", boxShadow: "0 0 0 4px rgba(240,131,178,.25)" }} />
              Wir stellen ein · Luzern
            </span>

            <h1 className="font-display font-bold leading-[1.1] tracking-tight" style={{ fontSize: "clamp(34px, 5vw, 54px)" }}>
              Produktions&shy;mitarbeiter/in{" "}
              <span style={{ color: "#F083B2" }}>Frühschicht</span> (m/w/d)
            </h1>

            <p className="text-[clamp(16px,1.7vw,19px)] max-w-[38ch] mt-5 mb-7" style={{ color: "rgba(255,255,255,.82)" }}>
              Du liebst es, mit deinen Händen hochwertige Produkte herzustellen? Starte früh, hab den Nachmittag frei — und produziere täglich handwerkliche Spezialitäten auf höchstem Niveau.
            </p>

            <div className="flex flex-wrap gap-3.5 items-center">
              <button
                onClick={scrollToFunnel}
                className="inline-flex items-center gap-2 border-none cursor-pointer font-semibold text-[15px] px-[22px] py-[13px] rounded-full transition-all hover:-translate-y-0.5"
                style={{ background: "#F083B2", color: "#1f0f00", boxShadow: "0 10px 24px -10px rgba(240,131,178,.8)" }}
              >
                In 60 Sekunden bewerben
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
              <button
                onClick={scrollToRolle}
                className="inline-flex items-center gap-2 cursor-pointer font-semibold text-[15px] px-[22px] py-[13px] rounded-full transition-all"
                style={{ background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,.3)" }}
              >
                Aufgaben ansehen
              </button>
            </div>

            <p className="text-[13px] mt-4" style={{ color: "rgba(255,255,255,.6)" }}>
              Kein Lebenslauf nötig zum Start. Wir melden uns persönlich bei dir.
            </p>

            <div className="flex flex-wrap gap-2.5 mt-8">
              {[
                { icon: <><path d="M12 21s-7-5.5-7-11a7 7 0 0114 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>, label: "6005 Luzern" },
                { icon: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18" /></>, label: "100%" },
                { icon: <path d="M20 6L9 17l-5-5" />, label: "Festanstellung" },
                { icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></>, label: "Per sofort oder nach Vereinbarung" },
              ].map((b) => (
                <span key={b.label} className="inline-flex items-center gap-2 text-[13.5px] font-medium px-3.5 py-2 rounded-xl" style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.14)" }}>
                  <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "#F083B2" }}>{b.icon}</svg>
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* Stelle auf einen Blick */}
          <div className="rounded-3xl p-6 backdrop-blur-sm" style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.14)" }}>
            <h3 className="text-[15px] uppercase tracking-[.12em] font-bold mb-4" style={{ color: "#F083B2" }}>Die Stelle auf einen Blick</h3>
            {[
              { icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></>, title: "Frühschicht 3:30–13:00", sub: "Montag bis Freitag, kein Wochenende" },
              { icon: <><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></>, title: "Handwerkliche Produktion", sub: "Confiserie, Bäckerei, Spezialitäten" },
              { icon: <><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></>, title: "Grösseres Team", sub: "Abwechslungsreich & kollegial" },
              { icon: <><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></>, title: "Nachmittag frei", sub: "Familie, Freizeit, Hobbys — ab 13 Uhr" },
            ].map((item, i) => (
              <div key={i} className="flex gap-3.5 py-3" style={i > 0 ? { borderTop: "1px solid rgba(255,255,255,.1)" } : undefined}>
                <span className="shrink-0 w-[38px] h-[38px] rounded-xl grid place-items-center" style={{ background: "rgba(240,131,178,.16)" }}>
                  <svg className="w-[19px] h-[19px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "#F083B2" }}>{item.icon}</svg>
                </span>
                <div>
                  <b className="block text-[15px]">{item.title}</b>
                  <span className="text-[13px]" style={{ color: "rgba(255,255,255,.7)" }}>{item.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BADGE BAR ── */}
      <div style={{ background: "#1f0f00", color: "rgba(255,255,255,.9)" }}>
        <div className="max-w-[1120px] mx-auto px-5 flex flex-wrap justify-center gap-x-10 gap-y-3.5 py-5">
          {["Seit 1897 in Luzern", "Über 25 Fachgeschäfte", "Innovativer Arbeitgeber", "GAV-Anstellungsbedingungen"].map((t) => (
            <span key={t} className="flex items-center gap-2.5 text-[14px] font-medium">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "#F083B2" }}><path d="M20 6L9 17l-5-5" /></svg>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── VORTEILE FRÜHSCHICHT ── */}
      <section className="py-[76px]">
        <div className="max-w-[1120px] mx-auto px-5">
          <FadeIn>
            <div className="text-center max-w-[640px] mx-auto mb-12">
              <span className="inline-block text-[13px] font-bold tracking-[.14em] uppercase px-3.5 py-1.5 rounded-full mb-4" style={{ color: "#351A00", background: "rgba(53,26,0,.08)" }}>Deine Vorteile</span>
              <h2 className="font-display font-bold tracking-tight" style={{ fontSize: "clamp(26px, 3.4vw, 38px)" }}>Früh anfangen, früh geniessen</h2>
              <p className="text-[17px] mt-3.5" style={{ color: "#5b6b7c" }}>
                Die Frühschicht hat ihren eigenen Rhythmus — und viele Vorteile, die andere Jobs nicht bieten.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { emoji: "☀️", title: "Früher Feierabend", desc: "Ab ca. 13 Uhr hast du frei. Der ganze Nachmittag gehört dir — während andere noch arbeiten." },
              { emoji: "👨‍👩‍👧‍👦", title: "Familienleben", desc: "Kinder von der Schule abholen, Mittagessen zusammen, Hausaufgaben begleiten — alles möglich." },
              { emoji: "🏃", title: "Freizeit & Hobbys", desc: "Sport, Termine, Einkäufe, Garten — du kannst deinen Nachmittag frei gestalten." },
              { emoji: "🌙", title: "Ruhige Nächte", desc: "Wer früh aufsteht, schläft früh ein. Ein gesunder Rhythmus, der sich bewährt." },
            ].map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.1}>
                <div className="bg-white rounded-[20px] p-7 h-full" style={{ border: "1px solid #e4ebf3", boxShadow: "0 8px 24px -12px rgba(4,32,63,.15)" }}>
                  <span className="text-[32px] block mb-3">{v.emoji}</span>
                  <h3 className="font-display text-[18px] font-bold mb-2">{v.title}</h3>
                  <p className="text-[15px]" style={{ color: "#5b6b7c" }}>{v.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLLE: AUFGABEN / PROFIL / BENEFITS ── */}
      <section id="rolle" className="py-[76px]" style={{ background: "#fff" }}>
        <div className="max-w-[1120px] mx-auto px-5">
          <FadeIn>
            <div className="max-w-[640px] mb-10">
              <span className="inline-block text-[13px] font-bold tracking-[.14em] uppercase px-3.5 py-1.5 rounded-full mb-4" style={{ color: "#351A00", background: "rgba(53,26,0,.08)" }}>Deine Rolle</span>
              <h2 className="font-display font-bold tracking-tight" style={{ fontSize: "clamp(26px, 3.4vw, 38px)" }}>
                Handwerkliche Spezialitäten auf höchstem Niveau
              </h2>
              <p className="text-[17px] mt-3.5" style={{ color: "#5b6b7c" }}>
                In der Produktion der Confiserie Bachmann stellst du täglich eine breite Palette an handwerklichen Spezialitäten her — mit Leidenschaft, Präzision und im Team.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Aufgaben */}
            <FadeIn>
              <div className="bg-white rounded-[20px] p-7 h-full" style={{ border: "1px solid #e4ebf3", boxShadow: "0 8px 24px -12px rgba(4,32,63,.22)" }}>
                <div className="w-[46px] h-[46px] rounded-[13px] grid place-items-center mb-4" style={{ background: "#351A00" }}>
                  <svg className="w-[23px] h-[23px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "#F083B2" }}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                </div>
                <h3 className="font-display text-[19px] font-bold mb-3.5">Deine Aufgaben</h3>
                <ul className="list-none p-0 m-0">
                  {[
                    "Qualitativ hochstehende Spezialitäten produzieren",
                    "Breite Palette handwerklicher Produkte herstellen",
                    "Wünsche der Feinschmecker-Kunden auf höchstem Niveau erfüllen",
                    "Hygienische Standards sicherstellen und einhalten",
                    "Exaktes, prozessorientiertes Arbeiten",
                    "Im Team täglich abwechslungsreiche Aufgaben meistern",
                  ].map((t, i) => (
                    <li key={i} className="relative pl-6 py-2 text-[15px]" style={{ color: "#31465b", borderTop: i > 0 ? "1px solid #e4ebf3" : "none" }}>
                      <span className="absolute left-[2px] top-[15px] w-2 h-2 rounded-full" style={{ background: "#F083B2", boxShadow: "0 0 0 3px rgba(53,26,0,.12)" }} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            {/* Profil */}
            <FadeIn delay={0.1}>
              <div className="bg-white rounded-[20px] p-7 h-full" style={{ border: "1px solid #e4ebf3", boxShadow: "0 8px 24px -12px rgba(4,32,63,.22)" }}>
                <div className="w-[46px] h-[46px] rounded-[13px] grid place-items-center mb-4" style={{ background: "#351A00" }}>
                  <svg className="w-[23px] h-[23px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "#F083B2" }}><path d="M12 2l2.5 6.5H21l-5 4 2 7-6-4-6 4 2-7-5-4h6.5z" /></svg>
                </div>
                <h3 className="font-display text-[19px] font-bold mb-3.5">Dein Profil</h3>
                <ul className="list-none p-0 m-0">
                  {[
                    "Motivierte, engagierte und selbständige Person",
                    "Frühaufsteher/in — Arbeitsbeginn ab 3:30 Uhr",
                    "Spass an der Arbeit in einem grösseren Team",
                    "Erfahrung in der Lebensmittelproduktion von Vorteil",
                    "Hohes Qualitätsbewusstsein und hygienisches Verhalten",
                    "Sehr gute mündliche Deutschkenntnisse",
                    "Mobil oder wohnhaft in der Nähe (keine ÖV-Anbindung um 3:30)",
                  ].map((t, i) => (
                    <li key={i} className="relative pl-6 py-2 text-[15px]" style={{ color: "#31465b", borderTop: i > 0 ? "1px solid #e4ebf3" : "none" }}>
                      <span className="absolute left-[2px] top-[15px] w-2 h-2 rounded-full" style={{ background: "#F083B2", boxShadow: "0 0 0 3px rgba(53,26,0,.12)" }} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            {/* Benefits */}
            <FadeIn delay={0.2}>
              <div className="bg-white rounded-[20px] p-7 h-full" style={{ border: "1px solid #e4ebf3", boxShadow: "0 8px 24px -12px rgba(4,32,63,.22)" }}>
                <div className="w-[46px] h-[46px] rounded-[13px] grid place-items-center mb-4" style={{ background: "#351A00" }}>
                  <svg className="w-[23px] h-[23px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "#F083B2" }}><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <h3 className="font-display text-[19px] font-bold mb-3.5">Das bieten wir</h3>
                <ul className="list-none p-0 m-0">
                  {[
                    "Feierabend ab ca. 13 Uhr — der Nachmittag gehört dir",
                    "GAV-Anstellungsbedingungen (Bäckerei-Confiserie)",
                    "5 Wochen Ferien und 6 bezahlte Feiertage",
                    "Arbeitsplatz in Luzern mit Parkplatz",
                    "Interessante, abwechslungsreiche Tätigkeit",
                    "Mitarbeiterrabatte in Fachgeschäften und Cafés",
                    "Stabiler Arbeitgeber seit 1897",
                  ].map((t, i) => (
                    <li key={i} className="relative pl-6 py-2 text-[15px]" style={{ color: "#31465b", borderTop: i > 0 ? "1px solid #e4ebf3" : "none" }}>
                      <span className="absolute left-[2px] top-[15px] w-2 h-2 rounded-full" style={{ background: "#F083B2", boxShadow: "0 0 0 3px rgba(53,26,0,.12)" }} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── FUNNEL ── */}
      <section id="funnel" className="py-[76px]" style={{ background: "linear-gradient(180deg, #f0e8e0 0%, #f4f8fc 100%)" }}>
        <div className="max-w-[1120px] mx-auto px-5">
          <div className="text-center max-w-[640px] mx-auto mb-8">
            <span className="inline-block text-[13px] font-bold tracking-[.14em] uppercase px-3.5 py-1.5 rounded-full mb-4" style={{ color: "#351A00", background: "rgba(53,26,0,.08)" }}>Bewerbung</span>
            <h2 className="font-display font-bold tracking-tight" style={{ fontSize: "clamp(26px, 3.4vw, 38px)" }}>In 4 kurzen Schritten zu uns</h2>
            <p className="text-[17px] mt-3.5 mx-auto" style={{ color: "#5b6b7c" }}>
              Keine langen Formulare. Beantworte ein paar Fragen und hinterlasse deine Kontaktdaten. Den Rest besprechen wir persönlich.
            </p>
          </div>

          <div className="max-w-[640px] mx-auto">
            {/* Progress */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[12.5px] font-bold tracking-[.02em]" style={{ color: "#5b6b7c" }}>Schritt {Math.min(step + 1, 4)} von 4</span>
                <span className="text-[12.5px] font-bold tracking-[.02em]" style={{ color: "#5b6b7c" }}>{STEPS[Math.min(step, 3)].label}</span>
              </div>
              <div className="h-[7px] rounded-full overflow-hidden" style={{ background: "#dbe6f2" }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${sent ? 100 : ((step + 1) / 4) * 100}%`, background: "linear-gradient(90deg, #351A00, #4a2500)" }} />
              </div>
            </div>

            {/* Card */}
            {sent ? (
              <div className="bg-white rounded-[26px] p-8 sm:p-9 text-center" style={{ border: "1px solid #e4ebf3", boxShadow: "0 20px 50px -20px rgba(4,32,63,.25)", animation: "rise .35s ease-out" }}>
                <span className="text-[48px] block mb-4">🎉</span>
                <h2 className="font-display font-bold text-[24px] mb-2.5">Merci für dein Interesse!</h2>
                <p className="text-[15px]" style={{ color: "#5b6b7c" }}>Wir schauen uns deine Angaben an und melden uns persönlich bei dir — meist telefonisch.</p>
              </div>
            ) : step < 3 ? (
              <div key={step} className="bg-white rounded-[26px] p-8 sm:p-9" style={{ border: "1px solid #e4ebf3", boxShadow: "0 20px 50px -20px rgba(4,32,63,.25)", animation: "rise .35s ease-out" }}>
                <span className="inline-block text-[12px] font-bold tracking-[.13em] uppercase px-3 py-1.5 rounded-full mb-4" style={{ color: "#351A00", background: "rgba(53,26,0,.08)" }}>
                  {STEPS[step].label}
                </span>
                <h2 className="font-display font-bold text-[24px] mb-2.5">{STEPS[step].title}</h2>
                <p className="text-[15px] mb-6" style={{ color: "#5b6b7c" }}>{STEPS[step].subtitle}</p>

                {STEPS[step].options.map((o) => (
                  <button
                    key={o.text}
                    onClick={() => selectOption(o.text)}
                    className="w-full text-left flex items-center gap-3.5 rounded-[15px] px-[18px] py-4 text-[15.5px] font-medium cursor-pointer transition-all mb-2.5 hover:border-[#F083B2]"
                    style={{
                      background: answers[step] === o.text ? "rgba(240,131,178,.08)" : "#fff",
                      border: answers[step] === o.text ? "2px solid #F083B2" : "2px solid #e4ebf3",
                    }}
                  >
                    <span className="text-[20px] leading-none">{o.emoji}</span>
                    <span className="flex-1">{o.text}</span>
                    <span className="shrink-0 w-6 h-6 rounded-full grid place-items-center transition-all" style={{
                      border: answers[step] === o.text ? "none" : "2px solid #e4ebf3",
                      background: answers[step] === o.text ? "#F083B2" : "transparent",
                    }}>
                      <svg className="w-[13px] h-[13px] transition-all" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" style={{ opacity: answers[step] === o.text ? 1 : 0, transform: answers[step] === o.text ? "scale(1)" : "scale(.6)" }}>
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                  </button>
                ))}

                <div className="flex gap-3 mt-6">
                  {step > 0 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="flex-1 py-3.5 rounded-full font-bold text-[16px] cursor-pointer transition-all"
                      style={{ background: "transparent", border: "1.5px solid #e4ebf3", color: "#5b6b7c" }}
                    >
                      Zurück
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[26px] p-8 sm:p-9" style={{ border: "1px solid #e4ebf3", boxShadow: "0 20px 50px -20px rgba(4,32,63,.25)", animation: "rise .35s ease-out" }}>
                <span className="inline-block text-[12px] font-bold tracking-[.13em] uppercase px-3 py-1.5 rounded-full mb-4" style={{ color: "#351A00", background: "rgba(53,26,0,.08)" }}>
                  Kontakt
                </span>
                <h2 className="font-display font-bold text-[24px] mb-2.5">{STEPS[3].title}</h2>
                <p className="text-[15px] mb-6" style={{ color: "#5b6b7c" }}>{STEPS[3].subtitle}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    required
                    type="text"
                    placeholder="Vorname und Name *"
                    value={contact.name}
                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                    className="w-full rounded-[12px] px-4 py-3.5 text-[15px] outline-none transition-all"
                    style={{ border: "2px solid #e4ebf3", background: "#fff" }}
                    onFocus={(e) => (e.target.style.borderColor = "#F083B2")}
                    onBlur={(e) => (e.target.style.borderColor = "#e4ebf3")}
                  />
                  <input
                    required
                    type="tel"
                    placeholder="Telefonnummer *"
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    className="w-full rounded-[12px] px-4 py-3.5 text-[15px] outline-none transition-all"
                    style={{ border: "2px solid #e4ebf3", background: "#fff" }}
                    onFocus={(e) => (e.target.style.borderColor = "#F083B2")}
                    onBlur={(e) => (e.target.style.borderColor = "#e4ebf3")}
                  />
                  <input
                    type="email"
                    placeholder="E-Mail (optional)"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    className="w-full rounded-[12px] px-4 py-3.5 text-[15px] outline-none transition-all"
                    style={{ border: "2px solid #e4ebf3", background: "#fff" }}
                    onFocus={(e) => (e.target.style.borderColor = "#F083B2")}
                    onBlur={(e) => (e.target.style.borderColor = "#e4ebf3")}
                  />
                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 py-3.5 rounded-full font-bold text-[16px] cursor-pointer transition-all"
                      style={{ background: "transparent", border: "1.5px solid #e4ebf3", color: "#5b6b7c" }}
                    >
                      Zurück
                    </button>
                    <button
                      type="submit"
                      disabled={sending}
                      className="flex-1 py-3.5 rounded-full font-bold text-[16px] cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ background: "#F083B2", color: "#1f0f00" }}
                    >
                      {sending ? "Wird gesendet..." : "Bewerbung absenden"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-[76px]">
        <div className="max-w-[760px] mx-auto px-5">
          <div className="text-center mx-auto mb-8">
            <span className="inline-block text-[13px] font-bold tracking-[.14em] uppercase px-3.5 py-1.5 rounded-full mb-4" style={{ color: "#351A00", background: "rgba(53,26,0,.08)" }}>Häufige Fragen</span>
            <h2 className="font-display font-bold tracking-tight" style={{ fontSize: "clamp(26px, 3.4vw, 38px)" }}>Gut zu wissen</h2>
          </div>

          {[
            { q: "Brauche ich zwingend Erfahrung in der Lebensmittelproduktion?", a: "Nein, Quereinsteiger sind willkommen. Erfahrung in der Lebensmittelbranche ist ein Plus, aber keine Voraussetzung. Wichtiger sind Motivation, Zuverlässigkeit und Freude an handwerklicher Arbeit." },
            { q: "Warum beginnt die Schicht so früh?", a: "Damit unsere frischen Produkte rechtzeitig in den über 25 Fachgeschäften sind. Der grosse Vorteil für dich: Ab ca. 13 Uhr hast du frei — den ganzen Nachmittag für dich, deine Familie oder Hobbys." },
            { q: "Gibt es eine ÖV-Anbindung?", a: "Um 3:30 Uhr gibt es leider keine öffentlichen Verkehrsmittel. Du solltest daher mobil sein (Auto, Roller, E-Bike) oder in der Nähe des Arbeitsorts wohnen. Parkplätze sind vorhanden." },
            { q: "Wie geht es nach der Bewerbung weiter?", a: "Wir schauen uns deine Angaben an und melden uns persönlich bei dir, meist telefonisch. Deinen Lebenslauf kannst du ganz entspannt nachreichen." },
            { q: "Wo genau ist der Arbeitsort?", a: "An der Werkhofstrasse 20, 6005 Luzern. Parkplätze stehen für Mitarbeitende zur Verfügung." },
            { q: "Ist die Stelle auch für Teilzeit möglich?", a: "Die ausgeschriebene Stelle ist eine 100%-Festanstellung. Für Teilzeitoptionen melde dich gerne — wir besprechen die Möglichkeiten persönlich." },
          ].map((faq, i) => (
            <div key={i} className="bg-white rounded-[15px] mb-3 overflow-hidden" style={{ border: "1px solid #e4ebf3" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left bg-transparent border-none cursor-pointer text-[16px] font-semibold p-5 flex justify-between items-center gap-4"
                style={{ color: "#1a1a2e" }}
              >
                {faq.q}
                <span className="shrink-0 w-[22px] h-[22px] relative">
                  <span className="absolute rounded-sm" style={{ background: "#351A00", width: 14, height: 2.5, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
                  <span className="absolute rounded-sm transition-transform" style={{ background: "#351A00", width: 2.5, height: 14, top: "50%", left: "50%", transform: `translate(-50%, -50%) scaleY(${openFaq === i ? 0 : 1})` }} />
                </span>
              </button>
              <div className="overflow-hidden transition-all" style={{ maxHeight: openFaq === i ? 200 : 0 }}>
                <p className="text-[15px] px-5 pb-5" style={{ color: "#5b6b7c" }}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#1f0f00", color: "rgba(255,255,255,.78)" }}>
        <div className="max-w-[1120px] mx-auto px-5 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-8 py-14 pb-8">
          <div>
            <a href="#top" className="block no-underline mb-3.5">
              <img src="/images/bachmann_logo_pink.png" alt="Confiserie Bachmann" className="h-14 w-auto" style={{ imageRendering: "auto" }} />
            </a>
            <p className="text-[14px] max-w-[34ch] mt-3.5" style={{ color: "rgba(255,255,255,.6)" }}>
              Tradition trifft Innovation — seit 1897 eine der bekanntesten Confiserien der Schweiz.
            </p>
          </div>
          <div>
            <h4 className="text-white font-display text-[15px] mb-3.5">Deine Ansprechpartnerin</h4>
            <span className="block py-1 text-[14.5px] font-semibold text-white">Irma Eckermann</span>
            <a href="tel:+41794190070" className="block py-1 text-[14.5px] no-underline hover:text-[#F083B2] transition-colors" style={{ color: "rgba(255,255,255,.78)" }}>+41 79 419 00 70</a>
            <a href="mailto:info@leadhunter.ch" className="block py-1 text-[14.5px] no-underline hover:text-[#F083B2] transition-colors" style={{ color: "rgba(255,255,255,.78)" }}>info@leadhunter.ch</a>
            <span className="block py-1 text-[14.5px]">LeadHunter · Luzern</span>
          </div>
          <div>
            <h4 className="text-white font-display text-[15px] mb-3.5">Stelle</h4>
            <button onClick={scrollToFunnel} className="block py-1 text-[14.5px] bg-transparent border-none cursor-pointer text-left hover:text-[#F083B2] transition-colors" style={{ color: "rgba(255,255,255,.78)" }}>Jetzt bewerben</button>
            <a href="#rolle" className="block py-1 text-[14.5px] no-underline hover:text-[#F083B2] transition-colors" style={{ color: "rgba(255,255,255,.78)" }}>Aufgaben</a>
            <a href="#faq" className="block py-1 text-[14.5px] no-underline hover:text-[#F083B2] transition-colors" style={{ color: "rgba(255,255,255,.78)" }}>Häufige Fragen</a>
          </div>
        </div>
        <div className="max-w-[1120px] mx-auto px-5 flex flex-wrap justify-between gap-2.5 py-4 text-[13px]" style={{ borderTop: "1px solid rgba(255,255,255,.12)", color: "rgba(255,255,255,.5)" }}>
          <span>© {new Date().getFullYear()} Confiserie Bachmann AG. Alle Rechte vorbehalten.</span>
          <span>v1.0.0</span>
        </div>
      </footer>
    </div>
  );
}
