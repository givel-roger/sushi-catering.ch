"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ───────── Scroll-Animate Hook ───────── */
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
    <div ref={ref} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `opacity .6s ease ${delay}s, transform .6s ease ${delay}s` }}>
      {children}
    </div>
  );
}

/* ───────── Werbequelle ───────── */
function getWerbeQuelle() {
  if (typeof window === "undefined") return { quelle: "", kampagne: "" };
  try {
    const q = new URLSearchParams(window.location.search);
    const ref = document.referrer || "";
    const us = (q.get("utm_source") || "").toLowerCase();
    let quelle = "";
    if (q.get("ttclid") || us.includes("tiktok") || /tiktok\./i.test(ref)) quelle = "TikTok";
    else if (q.get("fbclid") || ["facebook","instagram","meta","fb","ig"].includes(us) || /facebook\.|instagram\./i.test(ref)) quelle = "Meta";
    else if (us) quelle = q.get("utm_source") || "";
    return { quelle, kampagne: q.get("utm_campaign") || "" };
  } catch { return { quelle: "", kampagne: "" }; }
}

/* ───────── Types ───────── */
type Step = 1 | 2 | 3 | 4 | 5 | "deadend";
interface FormState {
  step: Step;
  experience: string;
  education: string;
  languages: string[];
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  gdpr: boolean;
  errors: Record<string, string>;
}

const STEP_NAMES: Record<number, string> = { 1: "Erfahrung", 2: "Führung", 3: "Sprachen", 4: "Kontakt" };

/* ───────── Scoring ───────── */
function scoreApplication(s: FormState): { score: number; label: string; color: string } {
  let score = 0;
  if (s.experience === "einkauf") score += 35;
  else if (s.experience === "logistik") score += 25;
  else if (s.experience === "lebensmittel") score += 20;
  else if (s.experience === "quer") score += 5;

  if (s.education === "fuehrung_projekt") score += 30;
  else if (s.education === "fuehrung") score += 25;
  else if (s.education === "projekt") score += 15;
  else if (s.education === "keine") score += 5;

  if (s.languages.includes("Deutsch")) score += 20;
  if (s.languages.includes("Englisch")) score += 10;
  if (s.languages.includes("Französisch")) score += 5;

  if (score >= 70) return { score, label: "Top-Kandidat", color: "#16a34a" };
  if (score >= 45) return { score, label: "Guter Fit", color: "#0a7be0" };
  return { score, label: "Prüfen", color: "#d97706" };
}

/* ═══════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════ */
export default function Home() {
  const [form, setForm] = useState<FormState>({
    step: 1,
    experience: "",
    education: "",
    languages: [],
    firstName: "", lastName: "", email: "", phone: "", message: "",
    gdpr: false,
    errors: {},
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const funnelRef = useRef<HTMLDivElement>(null);

  const scrollToFunnel = useCallback(() => {
    funnelRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  function pick(field: "experience" | "education", val: string) {
    setForm(f => ({ ...f, [field]: val }));
  }
  function toggleLang(lang: string) {
    setForm(f => ({
      ...f,
      languages: f.languages.includes(lang) ? f.languages.filter(l => l !== lang) : [...f.languages, lang],
    }));
  }
  function goStep(s: Step) {
    setForm(f => ({ ...f, step: s }));
    setTimeout(() => funnelRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }
  function nextStep() {
    if (form.step === 3 && !form.languages.includes("Deutsch")) {
      goStep("deadend");
      return;
    }
    if (typeof form.step === "number") goStep((form.step + 1) as Step);
  }

  async function submitForm() {
    const err: Record<string, string> = {};
    if (!form.firstName.trim()) err.firstName = "Vorname erforderlich";
    if (!form.lastName.trim()) err.lastName = "Nachname erforderlich";
    if (!form.email.trim() || !form.email.includes("@")) err.email = "Gültige E-Mail erforderlich";
    if (!form.phone.trim() || form.phone.trim().length < 7) err.phone = "Gültige Telefonnummer erforderlich";
    if (!form.gdpr) err.gdpr = "Bitte akzeptiere die Datenverarbeitung.";
    if (Object.keys(err).length) { setForm(f => ({ ...f, errors: err })); return; }

    const werbe = getWerbeQuelle();
    const EXP: Record<string, string> = { einkauf: "Operativer Einkauf", logistik: "Logistik/Supply Chain", lebensmittel: "Lebensmittelbranche", quer: "Quereinsteiger" };
    const EDU: Record<string, string> = { fuehrung_projekt: "Führungs- und Projekterfahrung", fuehrung: "Führungserfahrung", projekt: "Projekterfahrung", keine: "Noch keine" };
    const scoring = scoreApplication(form);

    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stelle: "Teamleiter Operativer Einkauf",
          name: (form.firstName + " " + form.lastName).trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          data: {
            Erfahrung: EXP[form.experience] || form.experience,
            "Führungserfahrung": EDU[form.education] || form.education,
            Sprachen: form.languages.join(", "),
            Nachricht: form.message.trim(),
            Werbequelle: werbe.quelle,
            Kampagne: werbe.kampagne,
          },
          score: scoring.score,
          scoreLabel: scoring.label,
          source: "operativer-einkauf.ch",
          medium: "website",
        }),
      });
    } catch { /* fire-and-forget */ }

    setSubmitted(true);
    goStep(5);
  }

  /* ───── Upload ───── */
  const [uploadStatus, setUploadStatus] = useState("");
  async function uploadDocs() {
    const input = document.getElementById("docFiles") as HTMLInputElement;
    const files = Array.from(input?.files || []);
    if (!files.length) { setUploadStatus("Bitte wähle zuerst deine Dateien aus."); return; }
    if (files.length > 5) { setUploadStatus("Bitte maximal 5 Dateien."); return; }
    if (files.some(f => f.size > 10 * 1024 * 1024)) { setUploadStatus("Eine Datei ist grösser als 10 MB."); return; }

    const CHUNK = 600 * 1024;
    const readB64 = (blob: Blob): Promise<string> => new Promise((ok, err) => {
      const r = new FileReader();
      r.onload = () => ok(String(r.result).split(",")[1] || "");
      r.onerror = err;
      r.readAsDataURL(blob);
    });

    try {
      for (let fi = 0; fi < files.length; fi++) {
        const f = files[fi];
        const total = Math.max(1, Math.ceil(f.size / CHUNK));
        const uid = "u" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
        for (let i = 0; i < total; i++) {
          setUploadStatus(`Lade hoch: ${f.name} (${fi + 1}/${files.length}, Teil ${i + 1}/${total})…`);
          const b64 = await readB64(f.slice(i * CHUNK, (i + 1) * CHUNK));
          const res = await fetch("/api/upload-chunk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: form.email.trim(), fileName: f.name, uploadId: uid, chunkIndex: i, chunkTotal: total, dataB64: b64 }),
          });
          if (!res.ok) throw new Error("HTTP " + res.status);
        }
      }
      setUploadStatus("✅ Vielen Dank, deine Unterlagen sind angekommen!");
    } catch {
      setUploadStatus("Der Upload hat leider nicht geklappt. Bitte versuche es nochmals.");
    }
  }

  /* ═════════ RENDER ═════════ */
  return (
    <div className="min-h-screen" style={{ background: "var(--bg, #f4f8fc)", color: "var(--ink, #1a1a2e)", fontFamily: "'Nunito', var(--font-geist-sans), system-ui, sans-serif" }}>

      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 border-b" style={{ background: "rgba(255,255,255,.88)", backdropFilter: "blur(12px)", borderColor: "#e4ebf3" }}>
        <div className="max-w-[1120px] mx-auto px-5 h-[68px] flex items-center justify-between">
          <a href="#top" className="block no-underline">
            <img src="/images/bachmann_logo_braun.png" alt="Confiserie Bachmann" className="h-12 w-auto" />
          </a>
          <button onClick={scrollToFunnel} className="hidden sm:inline-flex items-center gap-2 border-none cursor-pointer font-semibold text-[14px] px-[18px] py-[10px] rounded-full transition-all" style={{ background: "#351A00", color: "#fff", boxShadow: "0 10px 24px -10px rgba(53,26,0,.5)" }}>
            Jetzt bewerben
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section id="top" className="relative overflow-hidden" style={{ padding: 0, background: "radial-gradient(120% 120% at 80% -10%, #4a2500 0%, #351A00 38%, #2a1400 78%, #1f0f00 100%)", color: "#fff" }}>
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 12% 20%, rgba(240,131,178,.16), transparent 40%), radial-gradient(circle at 90% 80%, rgba(255,255,255,.08), transparent 45%)", pointerEvents: "none" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)", backgroundSize: "52px 52px", maskImage: "linear-gradient(180deg, transparent, #000 20%, #000 60%, transparent)" }} />

        <div className="relative max-w-[1120px] mx-auto px-5 grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr] gap-12 items-center py-[72px] lg:py-[72px]">
          <div>
            <span className="inline-flex items-center gap-2 text-[13px] font-semibold px-3.5 py-[7px] rounded-full mb-5" style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.18)" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: "#F083B2", boxShadow: "0 0 0 4px rgba(240,131,178,.25)" }} />
              Wir stellen ein · Luzern
            </span>
            <h1 className="font-display font-bold leading-[1.1] tracking-tight" style={{ fontSize: "clamp(34px, 5vw, 54px)" }}>
              Teamleiter <span style={{ color: "#F083B2" }}>Operativer Einkauf</span> (m/w/d)
            </h1>
            <p className="text-[clamp(16px,1.7vw,19px)] max-w-[34ch] mt-5 mb-7" style={{ color: "rgba(255,255,255,.82)" }}>
              Du willst nicht nur einkaufen, sondern den Einkauf gestalten? Führe ein Team, optimiere Prozesse und begleite die Einführung eines neuen ERP-Systems.
            </p>
            <div className="flex flex-wrap gap-3.5 items-center">
              <button onClick={scrollToFunnel} className="inline-flex items-center gap-2 border-none cursor-pointer font-semibold text-[15px] px-[22px] py-[13px] rounded-full transition-all hover:-translate-y-0.5" style={{ background: "#F083B2", color: "#1f0f00", boxShadow: "0 10px 24px -10px rgba(240,131,178,.8)" }}>
                In 60 Sekunden bewerben
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
              <button onClick={() => document.getElementById("rolle")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-2 cursor-pointer font-semibold text-[15px] px-[22px] py-[13px] rounded-full transition-all" style={{ background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,.3)" }}>
                Aufgaben ansehen
              </button>
            </div>
            <p className="text-[13px] mt-4" style={{ color: "rgba(255,255,255,.6)" }}>Kein Lebenslauf nötig zum Start. Wir melden uns persönlich bei dir.</p>
            <div className="flex flex-wrap gap-2.5 mt-8">
              {[
                { icon: <><path d="M12 21s-7-5.5-7-11a7 7 0 0114 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>, text: "6005 Luzern" },
                { icon: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18" /></>, text: "100%" },
                { icon: <path d="M20 6L9 17l-5-5" />, text: "Festanstellung" },
                { icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></>, text: "Per sofort oder nach Vereinbarung" },
              ].map((c, i) => (
                <span key={i} className="inline-flex items-center gap-2 text-[13.5px] font-medium px-3.5 py-2 rounded-xl" style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.14)" }}>
                  <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "#F083B2" }}>{c.icon}</svg>
                  {c.text}
                </span>
              ))}
            </div>
          </div>

          {/* Hero Card */}
          <div className="rounded-3xl p-6 backdrop-blur-sm" style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.14)" }}>
            <h3 className="text-[15px] uppercase tracking-[.12em] font-bold mb-4" style={{ color: "#F083B2", fontFamily: "inherit" }}>Die Stelle auf einen Blick</h3>
            {[
              { icon: <><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></>, title: "Teamleitung (3 Personen)", sub: "2 Mitarbeitende + 1 Lernende/r" },
              { icon: <><path d="M3 3h18v18H3z" /><path d="M3 9h18M9 21V9" /></>, title: "ERP-Einführung", sub: "Prozesse aktiv mitgestalten" },
              { icon: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>, title: "Verhandlung & Lieferanten", sub: "Konditionen, Rahmenverträge, Alternativen" },
              { icon: <><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></>, title: "Lebensmittelbranche", sub: "Confiserie, Bäckerei, Gastronomie" },
            ].map((r, i) => (
              <div key={i} className="flex gap-3.5 py-3" style={i > 0 ? { borderTop: "1px solid rgba(255,255,255,.1)" } : {}}>
                <span className="shrink-0 w-[38px] h-[38px] rounded-xl grid place-items-center" style={{ background: "rgba(240,131,178,.16)" }}>
                  <svg className="w-[19px] h-[19px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "#F083B2" }}>{r.icon}</svg>
                </span>
                <div>
                  <b className="block text-[15px]">{r.title}</b>
                  <span className="text-[13px]" style={{ color: "rgba(255,255,255,.7)" }}>{r.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div style={{ background: "#1f0f00", color: "rgba(255,255,255,.9)" }}>
        <div className="max-w-[1120px] mx-auto px-5 flex flex-wrap justify-center gap-x-10 gap-y-3.5 py-5">
          {[
            "Seit 1897 in Luzern",
            "Über 25 Fachgeschäfte",
            "Innovativer Arbeitgeber",
            "GAV-Anstellungsbedingungen",
          ].map((t, i) => (
            <span key={i} className="flex items-center gap-2.5 text-[14px] font-medium">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "#F083B2" }}><path d="M20 6L9 17l-5-5" /></svg>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── ROLLE ── */}
      <section id="rolle" className="py-[76px]">
        <div className="max-w-[1120px] mx-auto px-5">
          <FadeIn>
            <div className="max-w-[640px] mb-10">
              <span className="inline-block text-[13px] font-bold tracking-[.14em] uppercase px-3.5 py-1.5 rounded-full mb-4" style={{ color: "#351A00", background: "rgba(53,26,0,.08)" }}>Deine Rolle</span>
              <h2 className="font-display font-bold tracking-tight" style={{ fontSize: "clamp(26px, 3.4vw, 38px)" }}>
                Vom Besteller zum Gestalter des Einkaufs
              </h2>
              <p className="text-[17px] mt-3.5" style={{ color: "#5b6b7c" }}>
                Die Confiserie Bachmann zentralisiert den Einkauf und führt ein neues ERP-System ein. Du bringst operative Stärke mit, hinterfragst Prozesse und setzt mit deinem Team neue Standards.
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
                    "3-köpfiges Team führen, coachen und weiterentwickeln",
                    "Operativen Einkauf verantworten und Prozesse optimieren",
                    "Materialversorgung sicherstellen (Mengen, Termine, Verfügbarkeit)",
                    "Lieferantenbeziehungen pflegen, bewerten und Alternativen aufbauen",
                    "Konditionen, Rahmenverträge und Preise verhandeln",
                    "Einkaufs- und Optimierungsprojekte leiten",
                    "Eng mit Produktion, Logistik, QM und Verkauf zusammenarbeiten",
                  ].map((t, i) => (
                    <li key={i} className="relative pl-6 py-2 text-[15px]" style={{ color: "#31465b", borderTop: i > 0 ? "1px solid #e4ebf3" : "none" }}>
                      <span className="absolute left-[2px] top-[15px] w-2 h-2 rounded-full" style={{ background: "#F083B2", boxShadow: "0 0 0 3px rgba(53,26,0,.12)" }} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            {/* Anforderungen */}
            <FadeIn delay={0.1}>
              <div className="bg-white rounded-[20px] p-7 h-full" style={{ border: "1px solid #e4ebf3", boxShadow: "0 8px 24px -12px rgba(4,32,63,.22)" }}>
                <div className="w-[46px] h-[46px] rounded-[13px] grid place-items-center mb-4" style={{ background: "#351A00" }}>
                  <svg className="w-[23px] h-[23px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "#F083B2" }}><path d="M12 2l2.5 6.5H21l-5 4 2 7-6-4-6 4 2-7-5-4h6.5z" /></svg>
                </div>
                <h3 className="font-display text-[19px] font-bold mb-3.5">Das bringst du mit</h3>
                <ul className="list-none p-0 m-0">
                  {[
                    "Mehrjährige Erfahrung im operativen Einkauf, idealerweise im Lebensmittelbereich",
                    "Erste Führungs- und Projekterfahrung",
                    "Starke Prozessorientierung und gutes Zahlenverständnis",
                    "Verhandlungsstärke und sicheres Auftreten",
                    "Hohe ERP-Affinität und Lust, Systeme mitzugestalten",
                    "Sehr gute Deutschkenntnisse, Englisch von Vorteil",
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
                    "GAV-Anstellungsbedingungen (Bäckerei-Confiserie)",
                    "5 Wochen Ferien und 6 bezahlte Feiertage",
                    "Zentraler Arbeitsplatz in Luzern mit Parkplatz",
                    "Interne und externe Weiterbildung",
                    "Modernes, zukunftsorientiertes Arbeitsumfeld",
                    "Mitarbeiterrabatte in Fachgeschäften und Cafés",
                    "Unterstützung bei Karrierezielen und Weiterbildung",
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
      <section ref={funnelRef} id="funnel" className="py-[76px]" style={{ background: "linear-gradient(180deg, #f0e8e0 0%, #f4f8fc 100%)" }}>
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
            {typeof form.step === "number" && form.step <= 4 && (
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-[12.5px] font-bold tracking-[.02em]" style={{ color: "#5b6b7c" }}>Schritt {form.step} von 4</span>
                  <span className="text-[12.5px] font-bold tracking-[.02em]" style={{ color: "#5b6b7c" }}>{STEP_NAMES[form.step]}</span>
                </div>
                <div className="h-[7px] rounded-full overflow-hidden" style={{ background: "#dbe6f2" }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(form.step / 4) * 100}%`, background: "linear-gradient(90deg, #351A00, #4a2500)" }} />
                </div>
              </div>
            )}

            {/* Card */}
            <div className="bg-white rounded-[26px] p-8 sm:p-9" style={{ border: "1px solid #e4ebf3", boxShadow: "0 20px 50px -20px rgba(4,32,63,.25)", animation: "rise .35s ease-out" }}>

              {/* STEP 1: Erfahrung */}
              {form.step === 1 && (<>
                <span className="inline-block text-[12px] font-bold tracking-[.13em] uppercase px-3 py-1.5 rounded-full mb-4" style={{ color: "#351A00", background: "rgba(53,26,0,.08)" }}>Dein Hintergrund</span>
                <h2 className="font-display font-bold text-[24px] mb-2.5">Woher bringst du deine Erfahrung mit?</h2>
                <p className="text-[15px] mb-6" style={{ color: "#5b6b7c" }}>Ideal ist jemand mit Einkaufserfahrung in der Lebensmittelbranche. Wähle, was am ehesten zutrifft.</p>
                {[
                  { v: "einkauf", e: "🛒", t: "Aus dem operativen Einkauf" },
                  { v: "logistik", e: "📦", t: "Aus Logistik oder Supply Chain" },
                  { v: "lebensmittel", e: "🍰", t: "Aus der Lebensmittelbranche (anderer Bereich)" },
                  { v: "quer", e: "✨", t: "Quereinsteiger, motiviert einzusteigen" },
                ].map(o => (
                  <button key={o.v} onClick={() => pick("experience", o.v)}
                    className="w-full text-left flex items-center gap-3.5 rounded-[15px] px-[18px] py-4 text-[15.5px] font-medium cursor-pointer transition-all mb-2.5"
                    style={{ background: form.experience === o.v ? "rgba(53,26,0,.05)" : "#fff", border: `2px solid ${form.experience === o.v ? "#351A00" : "#e4ebf3"}` }}>
                    <span className="text-[20px] leading-none">{o.e}</span>
                    <span className="flex-1">{o.t}</span>
                    <span className="shrink-0 w-6 h-6 rounded-full grid place-items-center transition-all" style={{ border: `2px solid ${form.experience === o.v ? "#351A00" : "#e4ebf3"}`, background: form.experience === o.v ? "#351A00" : "transparent" }}>
                      <svg className="w-[13px] h-[13px] transition-all" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" style={{ opacity: form.experience === o.v ? 1 : 0, transform: form.experience === o.v ? "none" : "scale(.6)" }}><path d="M20 6L9 17l-5-5" /></svg>
                    </span>
                  </button>
                ))}
                <div className="flex gap-3 mt-6">
                  <button onClick={nextStep} disabled={!form.experience} className="flex-1 border-none py-3.5 rounded-full font-bold text-[16px] cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: "#F083B2", color: "#1f0f00" }}>Weiter</button>
                </div>
              </>)}

              {/* STEP 2: Führung */}
              {form.step === 2 && (<>
                <span className="inline-block text-[12px] font-bold tracking-[.13em] uppercase px-3 py-1.5 rounded-full mb-4" style={{ color: "#351A00", background: "rgba(53,26,0,.08)" }}>Führungserfahrung</span>
                <h2 className="font-display font-bold text-[24px] mb-2.5">Hast du bereits Führungs- oder Projekterfahrung?</h2>
                <p className="text-[15px] mb-6" style={{ color: "#5b6b7c" }}>Erste Führungs- und Projekterfahrung ist ideal. Wir schauen aufs Gesamtbild.</p>
                {[
                  { v: "fuehrung_projekt", e: "🎯", t: "Ja, Führung und Projekterfahrung" },
                  { v: "fuehrung", e: "👥", t: "Führungserfahrung, noch keine Projekte" },
                  { v: "projekt", e: "📋", t: "Projekterfahrung, noch keine Führung" },
                  { v: "keine", e: "💪", t: "Noch keine, aber bereit dafür" },
                ].map(o => (
                  <button key={o.v} onClick={() => pick("education", o.v)}
                    className="w-full text-left flex items-center gap-3.5 rounded-[15px] px-[18px] py-4 text-[15.5px] font-medium cursor-pointer transition-all mb-2.5"
                    style={{ background: form.education === o.v ? "rgba(53,26,0,.05)" : "#fff", border: `2px solid ${form.education === o.v ? "#351A00" : "#e4ebf3"}` }}>
                    <span className="text-[20px] leading-none">{o.e}</span>
                    <span className="flex-1">{o.t}</span>
                    <span className="shrink-0 w-6 h-6 rounded-full grid place-items-center transition-all" style={{ border: `2px solid ${form.education === o.v ? "#351A00" : "#e4ebf3"}`, background: form.education === o.v ? "#351A00" : "transparent" }}>
                      <svg className="w-[13px] h-[13px] transition-all" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" style={{ opacity: form.education === o.v ? 1 : 0, transform: form.education === o.v ? "none" : "scale(.6)" }}><path d="M20 6L9 17l-5-5" /></svg>
                    </span>
                  </button>
                ))}
                <div className="flex gap-3 mt-6">
                  <button onClick={() => goStep(1)} className="bg-white px-[22px] py-3.5 rounded-full font-semibold text-[15px] cursor-pointer transition-all" style={{ border: "2px solid #e4ebf3", color: "#5b6b7c" }}>Zurück</button>
                  <button onClick={nextStep} disabled={!form.education} className="flex-1 border-none py-3.5 rounded-full font-bold text-[16px] cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: "#F083B2", color: "#1f0f00" }}>Weiter</button>
                </div>
              </>)}

              {/* STEP 3: Sprachen */}
              {form.step === 3 && (<>
                <span className="inline-block text-[12px] font-bold tracking-[.13em] uppercase px-3 py-1.5 rounded-full mb-4" style={{ color: "#351A00", background: "rgba(53,26,0,.08)" }}>Sprachen</span>
                <h2 className="font-display font-bold text-[24px] mb-2.5">Welche Sprachen sprichst du?</h2>
                <p className="text-[15px] mb-6" style={{ color: "#5b6b7c" }}>Sehr gutes Deutsch ist Voraussetzung. Englisch ist ein Vorteil. Mehrfachauswahl möglich.</p>
                {[
                  { v: "Deutsch", t: "Deutsch (sehr gut)", note: "zwingend" },
                  { v: "Englisch", t: "Englisch", note: "von Vorteil" },
                  { v: "Französisch", t: "Französisch", note: "" },
                  { v: "Italienisch", t: "Italienisch", note: "" },
                ].map(l => (
                  <button key={l.v} onClick={() => toggleLang(l.v)}
                    className="w-full text-left flex items-center gap-3.5 rounded-[15px] px-[18px] py-4 text-[15.5px] font-medium cursor-pointer transition-all mb-2.5"
                    style={{ background: form.languages.includes(l.v) ? "rgba(53,26,0,.05)" : "#fff", border: `2px solid ${form.languages.includes(l.v) ? "#351A00" : "#e4ebf3"}` }}>
                    <span className="shrink-0 w-6 h-6 rounded-[7px] grid place-items-center transition-all" style={{ border: `2px solid ${form.languages.includes(l.v) ? "#351A00" : "#e4ebf3"}`, background: form.languages.includes(l.v) ? "#351A00" : "transparent" }}>
                      <svg className="w-[13px] h-[13px] transition-all" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" style={{ opacity: form.languages.includes(l.v) ? 1 : 0, transform: form.languages.includes(l.v) ? "none" : "scale(.6)" }}><path d="M20 6L9 17l-5-5" /></svg>
                    </span>
                    <span className="flex-1">{l.t}</span>
                    {l.note && <span className="text-[12px] font-semibold px-2.5 py-[3px] rounded-full" style={{ color: l.note === "zwingend" ? "#351A00" : "#5b6b7c", background: l.note === "zwingend" ? "rgba(53,26,0,.09)" : "#f0f4f8" }}>{l.note}</span>}
                  </button>
                ))}
                <div className="flex gap-3 mt-6">
                  <button onClick={() => goStep(2)} className="bg-white px-[22px] py-3.5 rounded-full font-semibold text-[15px] cursor-pointer transition-all" style={{ border: "2px solid #e4ebf3", color: "#5b6b7c" }}>Zurück</button>
                  <button onClick={nextStep} disabled={form.languages.length === 0} className="flex-1 border-none py-3.5 rounded-full font-bold text-[16px] cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: "#F083B2", color: "#1f0f00" }}>Weiter</button>
                </div>
              </>)}

              {/* DEADEND */}
              {form.step === "deadend" && (
                <div className="text-center py-2.5">
                  <div className="w-[72px] h-[72px] rounded-full grid place-items-center mx-auto mb-4" style={{ background: "rgba(53,26,0,.09)" }}>
                    <svg className="w-[34px] h-[34px]" viewBox="0 0 24 24" fill="none" stroke="#351A00" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>
                  </div>
                  <h2 className="font-display font-bold text-[24px] mb-3">Deutsch ist für diese Stelle Voraussetzung</h2>
                  <p className="text-[15px] max-w-[420px] mx-auto" style={{ color: "#5b6b7c" }}>
                    Als Teamleiter bist du täglich mit Lieferanten, Produktion und deinem Team in Kontakt. Dafür brauchen wir sehr gute Deutschkenntnisse.
                  </p>
                  <div className="mt-6">
                    <button onClick={() => goStep(3)} className="border-none py-3.5 px-6 rounded-full font-bold text-[16px] cursor-pointer" style={{ background: "#F083B2", color: "#1f0f00" }}>Zurück zur Sprachauswahl</button>
                  </div>
                </div>
              )}

              {/* STEP 4: Kontakt */}
              {form.step === 4 && (<>
                <span className="inline-block text-[12px] font-bold tracking-[.13em] uppercase px-3 py-1.5 rounded-full mb-4" style={{ color: "#351A00", background: "rgba(53,26,0,.08)" }}>Kontaktdaten</span>
                <h2 className="font-display font-bold text-[24px] mb-2.5">Wie können wir dich erreichen?</h2>
                <p className="text-[15px] mb-6" style={{ color: "#5b6b7c" }}>Wir melden uns persönlich bei dir. Deinen Lebenslauf kannst du später ganz entspannt nachreichen.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[12px] font-bold tracking-[.06em] uppercase mb-1.5" style={{ color: "#5b6b7c" }}>Vorname *</label>
                    <input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value, errors: { ...f.errors, firstName: "" } }))}
                      placeholder="Max" className="w-full rounded-[13px] px-4 py-3.5 text-[15px] outline-none transition-all" style={{ border: `2px solid ${form.errors.firstName ? "#e5484d" : "#e4ebf3"}`, background: "#fff" }} />
                    {form.errors.firstName && <div className="text-[12.5px] mt-1" style={{ color: "#e5484d" }}>{form.errors.firstName}</div>}
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold tracking-[.06em] uppercase mb-1.5" style={{ color: "#5b6b7c" }}>Nachname *</label>
                    <input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value, errors: { ...f.errors, lastName: "" } }))}
                      placeholder="Muster" className="w-full rounded-[13px] px-4 py-3.5 text-[15px] outline-none transition-all" style={{ border: `2px solid ${form.errors.lastName ? "#e5484d" : "#e4ebf3"}`, background: "#fff" }} />
                    {form.errors.lastName && <div className="text-[12.5px] mt-1" style={{ color: "#e5484d" }}>{form.errors.lastName}</div>}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-[12px] font-bold tracking-[.06em] uppercase mb-1.5" style={{ color: "#5b6b7c" }}>E-Mail *</label>
                  <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value, errors: { ...f.errors, email: "" } }))}
                    placeholder="max.muster@email.ch" className="w-full rounded-[13px] px-4 py-3.5 text-[15px] outline-none transition-all" style={{ border: `2px solid ${form.errors.email ? "#e5484d" : "#e4ebf3"}`, background: "#fff" }} />
                  {form.errors.email && <div className="text-[12.5px] mt-1" style={{ color: "#e5484d" }}>{form.errors.email}</div>}
                </div>
                <div className="mt-4">
                  <label className="block text-[12px] font-bold tracking-[.06em] uppercase mb-1.5" style={{ color: "#5b6b7c" }}>Telefon *</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value, errors: { ...f.errors, phone: "" } }))}
                    placeholder="+41 79 123 45 67" className="w-full rounded-[13px] px-4 py-3.5 text-[15px] outline-none transition-all" style={{ border: `2px solid ${form.errors.phone ? "#e5484d" : "#e4ebf3"}`, background: "#fff" }} />
                  {form.errors.phone && <div className="text-[12.5px] mt-1" style={{ color: "#e5484d" }}>{form.errors.phone}</div>}
                </div>
                <div className="mt-4">
                  <label className="block text-[12px] font-bold tracking-[.06em] uppercase mb-1.5" style={{ color: "#5b6b7c" }}>Nachricht (optional)</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={3}
                    placeholder="Gibt es etwas, das du uns mitteilen möchtest?" className="w-full rounded-[13px] px-4 py-3.5 text-[15px] outline-none transition-all resize-none" style={{ border: "2px solid #e4ebf3", background: "#fff" }} />
                </div>
                <label className="flex gap-2.5 items-start mt-4 cursor-pointer">
                  <input type="checkbox" checked={form.gdpr} onChange={e => setForm(f => ({ ...f, gdpr: e.target.checked, errors: { ...f.errors, gdpr: "" } }))} className="mt-[3px] w-[17px] h-[17px] shrink-0" style={{ accentColor: "#351A00" }} />
                  <span className="text-[12.5px] leading-relaxed" style={{ color: "#5b6b7c" }}>Ich bin damit einverstanden, dass meine Daten zum Zweck der Bearbeitung meiner Bewerbung gespeichert und verarbeitet werden. *</span>
                </label>
                {form.errors.gdpr && <div className="text-[12.5px] mt-1" style={{ color: "#e5484d" }}>{form.errors.gdpr}</div>}
                <div className="flex gap-3 mt-6">
                  <button onClick={() => goStep(3)} className="bg-white px-[22px] py-3.5 rounded-full font-semibold text-[15px] cursor-pointer transition-all" style={{ border: "2px solid #e4ebf3", color: "#5b6b7c" }}>Zurück</button>
                  <button onClick={submitForm} className="flex-1 border-none py-3.5 rounded-full font-bold text-[16px] cursor-pointer transition-all" style={{ background: "#F083B2", color: "#1f0f00" }}>Bewerbung absenden</button>
                </div>
              </>)}

              {/* STEP 5: Danke */}
              {form.step === 5 && (
                <div className="text-center py-2.5">
                  <div className="w-[72px] h-[72px] rounded-full grid place-items-center mx-auto mb-4" style={{ background: "#e6f7ee" }}>
                    <svg className="w-[36px] h-[36px]" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  </div>
                  <h2 className="font-display font-bold text-[24px] mb-3">Danke, wir melden uns bei dir!</h2>
                  <p className="text-[15px] max-w-[440px] mx-auto mb-4" style={{ color: "#5b6b7c" }}>
                    Deine Bewerbung ist bei uns eingegangen. Wir schauen sie uns an und melden uns in Kürze persönlich bei dir.
                  </p>

                  {/* Upload-Bereich */}
                  <div className="rounded-[15px] p-4 max-w-[440px] mx-auto text-left mb-5" style={{ background: "rgba(240,131,178,.14)", border: "1.5px solid #F083B2" }}>
                    <b className="block text-[15px] mb-1.5">📎 Noch ein wichtiger Schritt</b>
                    <p className="text-[14px] mb-3" style={{ color: "#31465b" }}>
                      Damit wir deine Bewerbung vollständig prüfen können, lade bitte deinen <b>Lebenslauf</b> und deine <b>Arbeitszeugnisse</b> hoch (PDF, JPG, PNG oder Word, max. 10 MB pro Datei).
                    </p>
                    <input type="file" id="docFiles" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="block w-full text-[13.5px] mb-3 p-2.5 rounded-xl bg-white" style={{ border: "2px dashed #F083B2" }} />
                    <button onClick={uploadDocs} className="inline-block border-none cursor-pointer font-semibold text-[14px] px-[18px] py-[11px] rounded-full" style={{ background: "#351A00", color: "#fff" }}>
                      Unterlagen jetzt hochladen
                    </button>
                    {uploadStatus && <div className="text-[13px] mt-2" style={{ color: "#31465b" }}>{uploadStatus}</div>}
                  </div>

                  {/* Zusammenfassung */}
                  <div className="rounded-[15px] p-4 text-left text-[14.5px] max-w-[380px] mx-auto" style={{ background: "#f4f8fc", border: "1px solid #e4ebf3" }}>
                    {[
                      { l: "Stelle", v: "Teamleiter Operativer Einkauf" },
                      { l: "Name", v: `${form.firstName} ${form.lastName}` },
                      { l: "E-Mail", v: form.email },
                      { l: "Telefon", v: form.phone },
                      { l: "Sprachen", v: form.languages.join(", ") || "-" },
                    ].map((r, i) => (
                      <div key={r.l} className="flex justify-between gap-4 py-1.5" style={i > 0 ? { borderTop: "1px solid #e4ebf3" } : {}}>
                        <b style={{ color: "#5b6b7c", fontWeight: 600 }}>{r.l}</b>
                        <span className="font-semibold text-right">{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
            { q: "Brauche ich zwingend Erfahrung in der Lebensmittelbranche?", a: "Ideal, aber kein Muss. Mehrjährige Einkaufserfahrung in einer anderen Branche ist ebenfalls eine sehr gute Basis. Du solltest aber Lust haben, dich in die Besonderheiten der Lebensmittelbranche einzuarbeiten." },
            { q: "Wie gross ist das Team, das ich führen werde?", a: "Du leitest ein Team von 3 Personen: 2 Mitarbeitende und 1 Lernende/r. Du bist verantwortlich für Coaching, Priorisierung und Entwicklung." },
            { q: "Was ist mit dem neuen ERP-System gemeint?", a: "Die Confiserie Bachmann führt aktuell ein neues ERP-System ein. Als Teamleiter gestaltest du die Einkaufsprozesse im neuen System aktiv mit — eine spannende Gestaltungsaufgabe." },
            { q: "Wie geht es nach der Bewerbung weiter?", a: "Wir schauen uns deine Angaben an und melden uns persönlich bei dir, meist telefonisch. Deinen Lebenslauf kannst du ganz entspannt nachreichen." },
            { q: "Wo genau ist der Arbeitsort?", a: "An der Werkhofstrasse 20, 6005 Luzern. Zentraler Arbeitsplatz mit bezahltem Parkplatz für Autofahrer." },
          ].map((faq, i) => (
            <div key={i} className="bg-white rounded-[15px] mb-3 overflow-hidden" style={{ border: "1px solid #e4ebf3" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left bg-transparent border-none cursor-pointer text-[16px] font-semibold p-5 flex justify-between items-center gap-4" style={{ color: "#1a1a2e", fontFamily: "inherit" }}>
                {faq.q}
                <span className="shrink-0 w-[22px] h-[22px] relative">
                  <span className="absolute rounded-sm" style={{ background: "#351A00", width: "14px", height: "2.5px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
                  <span className="absolute rounded-sm transition-transform" style={{ background: "#351A00", width: "2.5px", height: "14px", top: "50%", left: "50%", transform: `translate(-50%, -50%) ${openFaq === i ? "scaleY(0)" : "scaleY(1)"}` }} />
                </span>
              </button>
              <div className="overflow-hidden transition-all" style={{ maxHeight: openFaq === i ? "200px" : "0px" }}>
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
            <button onClick={scrollToFunnel} className="block py-1 text-[14.5px] bg-transparent border-none cursor-pointer text-left hover:text-[#F083B2] transition-colors" style={{ color: "rgba(255,255,255,.78)", fontFamily: "inherit" }}>Jetzt bewerben</button>
            <a href="#rolle" className="block py-1 text-[14.5px] no-underline hover:text-[#F083B2] transition-colors" style={{ color: "rgba(255,255,255,.78)" }}>Aufgaben</a>
            <a href="#faq" className="block py-1 text-[14.5px] no-underline hover:text-[#F083B2] transition-colors" style={{ color: "rgba(255,255,255,.78)" }}>Häufige Fragen</a>
          </div>
        </div>
        <div className="max-w-[1120px] mx-auto px-5 flex flex-wrap justify-between gap-2.5 py-4 text-[13px]" style={{ borderTop: "1px solid rgba(255,255,255,.12)", color: "rgba(255,255,255,.5)" }}>
          <span>&copy; {new Date().getFullYear()} Confiserie Bachmann AG. Alle Rechte vorbehalten.</span>
          <span>v1.0.6</span>
        </div>
      </footer>

      <style>{`
        @keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}
