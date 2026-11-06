"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const AMOUNTS = [50, 100, 125, 150, 200, 250, 300];

const MOTIFS = [
  { id: "elegant", label: "Edel & neutral", sub: "Immer passend", bg: "#1a1a1a", accent: "#c8962e" },
  { id: "geburtstag", label: "Geburtstag", sub: "Herzlich", bg: "#2d1b4e", accent: "#e8a0bf" },
  { id: "weihnachten", label: "Weihnachten", sub: "Festlich", bg: "#1a2e1a", accent: "#c41e2a" },
  { id: "danke", label: "Danke", sub: "Von Herzen", bg: "#3d2b1a", accent: "#c8962e" },
  { id: "valentinstag", label: "Valentinstag", sub: "Amore", bg: "#3d1a1a", accent: "#e84060" },
  { id: "genuss", label: "Genussmoment", sub: "Für Geniesser", bg: "#1a2a3d", accent: "#c8962e" },
  { id: "gratulation", label: "Gratulation", sub: "Für grosse Momente", bg: "#1a1a2e", accent: "#c8962e" },
];

type Step = "betrag" | "motiv" | "widmung" | "bezahlen";
const STEPS: { key: Step; label: string }[] = [
  { key: "betrag", label: "Betrag" },
  { key: "motiv", label: "Motiv" },
  { key: "widmung", label: "Widmung" },
  { key: "bezahlen", label: "Bezahlen" },
];

function MotifCard({ motif, amount }: { motif: typeof MOTIFS[0]; amount: number }) {
  return (
    <div
      className="rounded-lg overflow-hidden shadow-lg aspect-[1.6/1] relative flex flex-col justify-between p-5"
      style={{ background: motif.bg }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white/60 text-[10px] tracking-[0.3em] uppercase">Daniele</p>
          <p className="text-white/40 text-[8px] tracking-[0.15em]">Restaurant & Winebar · Luzern</p>
        </div>
        <p className="text-white/30 text-[9px] tracking-[0.2em] uppercase">Gutschein</p>
      </div>
      <div>
        <p className="text-white/50 text-[9px] tracking-[0.2em] uppercase mb-1">Guthaben</p>
        <p className="text-white text-2xl font-display" style={{ color: motif.accent }}>
          CHF {amount.toFixed(2)}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState<Step>("betrag");
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedMotif, setSelectedMotif] = useState("elegant");
  const [widmung, setWidmung] = useState({ fuer: "", von: "", nachricht: "", zustellung: "selbst" as "selbst" | "direkt", empfaengerEmail: "" });
  const [kaeufer, setKaeufer] = useState({ name: "", email: "", agb: false });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const currentMotif = MOTIFS.find((m) => m.id === selectedMotif) || MOTIFS[0];
  const displayAmount = customAmount ? parseFloat(customAmount) || 0 : amount;
  const stepIndex = STEPS.findIndex((s) => s.key === step);

  function goToStep(s: Step) {
    const targetIndex = STEPS.findIndex((st) => st.key === s);
    if (targetIndex <= stepIndex) setStep(s);
  }

  function handleCustomAmount(val: string) {
    const num = val.replace(/[^0-9]/g, "");
    setCustomAmount(num);
    if (num) setAmount(0);
  }

  function selectPreset(val: number) {
    setAmount(val);
    setCustomAmount("");
  }

  async function handleSubmit() {
    if (!kaeufer.name || !kaeufer.email || !kaeufer.agb) {
      setError("Bitte fülle alle Pflichtfelder aus und akzeptiere die AGB.");
      return;
    }
    if (displayAmount < 20 || displayAmount > 1000) {
      setError("Betrag muss zwischen CHF 20 und CHF 1000 liegen.");
      return;
    }

    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/gutschein", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: displayAmount,
          motif: selectedMotif,
          widmung,
          kaeufer,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Fehler beim Erstellen des Gutscheins");
      }

      const data = await res.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setSent(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Etwas ist schiefgelaufen.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Nav />
        <div className="flex-1 flex items-center justify-center px-5">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="font-display text-4xl text-foreground mb-4">Vielen Dank!</h1>
            <p className="text-muted text-lg mb-2">Dein Gutschein wurde erstellt.</p>
            <p className="text-muted">Du erhältst in Kürze eine E-Mail mit dem Gutschein als PDF.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Nav />

      {/* Hero */}
      <section className="bg-foreground text-white pt-24 pb-14 sm:pt-28 sm:pb-16">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-10">
          <div className="flex items-center gap-3 mb-6">
            <Image src="/images/daniele-logo-schwarz.png" alt="Daniele" width={160} height={49} className="h-8 w-auto invert" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-4 leading-tight">
            Genuss verschenken.
          </h1>
          <p className="text-white/70 text-lg max-w-xl leading-relaxed">
            Italienische Küche, erlesene Weine und unvergessliche Abende verschenken.
            In wenigen Minuten gekauft, sofort per Mail, ohne Verfalldatum.
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-2 mt-6 text-sm text-white/50">
            <span>Daniele Restaurant & Winebar</span>
            <span>Kauffmannweg 16, Luzern</span>
          </div>
        </div>
      </section>

      {/* Step indicator */}
      <div className="border-b border-border sticky top-0 bg-white z-30">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-10">
          <div className="flex">
            {STEPS.map((s, i) => (
              <button
                key={s.key}
                onClick={() => goToStep(s.key)}
                className={`py-4 px-4 sm:px-8 text-sm tracking-wide transition-colors relative cursor-pointer ${
                  i === stepIndex
                    ? "text-foreground font-semibold"
                    : i < stepIndex
                    ? "text-accent hover:text-accent-hover"
                    : "text-muted/40 cursor-default"
                }`}
                disabled={i > stepIndex}
              >
                {s.label}
                {i === stepIndex && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-10">
          <div className="grid lg:grid-cols-[1fr,360px] gap-12 lg:gap-16">

            {/* Left: Form */}
            <div>
              {/* STEP 1: Betrag */}
              {step === "betrag" && (
                <div>
                  <h2 className="font-display text-3xl text-foreground mb-3">
                    Wie viel soll der Gutschein wert sein?
                  </h2>
                  <p className="text-muted mb-8">
                    Ohne Verfalldatum, einlösbar im Daniele Restaurant & Winebar, Luzern.
                  </p>

                  <div className="flex flex-wrap gap-3 mb-8">
                    {AMOUNTS.map((a) => (
                      <button
                        key={a}
                        onClick={() => selectPreset(a)}
                        className={`px-6 py-3 rounded-md text-base font-medium transition-all cursor-pointer ${
                          amount === a && !customAmount
                            ? "bg-foreground text-white"
                            : "bg-surface text-foreground hover:bg-border"
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>

                  <label className="block text-sm text-muted mb-2">
                    Oder eigener Betrag (CHF 20 bis 1000)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="z.B. 75"
                    value={customAmount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                    className="border border-border rounded-md px-4 py-3 text-foreground text-base focus:outline-none focus:border-accent transition-colors w-full max-w-[200px]"
                  />

                  <div className="mt-10">
                    <button
                      onClick={() => {
                        if (displayAmount >= 20 && displayAmount <= 1000) setStep("motiv");
                      }}
                      disabled={displayAmount < 20 || displayAmount > 1000}
                      className="bg-accent hover:bg-accent-hover text-white px-10 py-4 text-sm tracking-[0.12em] uppercase transition-colors cursor-pointer rounded-md disabled:opacity-40 disabled:cursor-default"
                    >
                      Weiter zum Motiv
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Motiv */}
              {step === "motiv" && (
                <div>
                  <h2 className="font-display text-3xl text-foreground mb-3">
                    Zu welchem Anlass?
                  </h2>
                  <p className="text-muted mb-8">
                    Das Motiv erscheint auf dem Gutschein und in der Geschenkmail.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {MOTIFS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMotif(m.id)}
                        className={`rounded-lg overflow-hidden text-left transition-all cursor-pointer ${
                          selectedMotif === m.id
                            ? "ring-2 ring-accent ring-offset-2"
                            : "hover:ring-1 hover:ring-border"
                        }`}
                      >
                        <div
                          className="aspect-[1.5/1] flex items-center justify-center relative"
                          style={{ background: m.bg }}
                        >
                          <span className="text-[10px] tracking-[0.3em] uppercase text-white/70">{m.id === "elegant" ? "GUTSCHEIN" : m.label.toUpperCase()}</span>
                        </div>
                        <div className="p-3 bg-surface">
                          <p className="text-sm font-medium text-foreground">{m.label}</p>
                          <p className="text-xs text-muted">{m.sub}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-10 flex gap-4">
                    <button
                      onClick={() => setStep("betrag")}
                      className="px-8 py-4 text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
                    >
                      Zurück
                    </button>
                    <button
                      onClick={() => setStep("widmung")}
                      className="bg-accent hover:bg-accent-hover text-white px-10 py-4 text-sm tracking-[0.12em] uppercase transition-colors cursor-pointer rounded-md"
                    >
                      Weiter
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Widmung */}
              {step === "widmung" && (
                <div>
                  <h2 className="font-display text-3xl text-foreground mb-3">
                    Persönliche Widmung
                  </h2>
                  <p className="text-muted mb-8">
                    Alles freiwillig, aber es macht das Geschenk viel schöner.
                  </p>

                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-muted mb-2">Für</label>
                        <input
                          type="text"
                          placeholder="Name der beschenkten Person"
                          value={widmung.fuer}
                          onChange={(e) => setWidmung({ ...widmung, fuer: e.target.value })}
                          className="border border-border rounded-md px-4 py-3 text-foreground text-base focus:outline-none focus:border-accent transition-colors w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-muted mb-2">Von</label>
                        <input
                          type="text"
                          placeholder="Dein Name"
                          value={widmung.von}
                          onChange={(e) => setWidmung({ ...widmung, von: e.target.value })}
                          className="border border-border rounded-md px-4 py-3 text-foreground text-base focus:outline-none focus:border-accent transition-colors w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-muted mb-2">Nachricht</label>
                      <textarea
                        rows={3}
                        placeholder="z.B. Alles Gute zum Geburtstag, lass es dir schmecken!"
                        value={widmung.nachricht}
                        onChange={(e) => setWidmung({ ...widmung, nachricht: e.target.value })}
                        className="border border-border rounded-md px-4 py-3 text-foreground text-base focus:outline-none focus:border-accent transition-colors w-full resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted mb-4">Zustellung</label>
                      <div className="flex flex-col gap-3">
                        <label className={`flex items-center gap-3 p-4 rounded-md border cursor-pointer transition-colors ${widmung.zustellung === "selbst" ? "border-accent bg-accent/5" : "border-border hover:border-muted"}`}>
                          <input
                            type="radio"
                            name="zustellung"
                            checked={widmung.zustellung === "selbst"}
                            onChange={() => setWidmung({ ...widmung, zustellung: "selbst", empfaengerEmail: "" })}
                            className="accent-accent"
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">An mich senden</p>
                            <p className="text-xs text-muted">Du erhältst den Gutschein und gibst ihn selbst weiter.</p>
                          </div>
                        </label>
                        <label className={`flex items-center gap-3 p-4 rounded-md border cursor-pointer transition-colors ${widmung.zustellung === "direkt" ? "border-accent bg-accent/5" : "border-border hover:border-muted"}`}>
                          <input
                            type="radio"
                            name="zustellung"
                            checked={widmung.zustellung === "direkt"}
                            onChange={() => setWidmung({ ...widmung, zustellung: "direkt" })}
                            className="accent-accent"
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">Direkt an die beschenkte Person</p>
                            <p className="text-xs text-muted">Der Gutschein wird direkt per Mail zugestellt.</p>
                          </div>
                        </label>
                      </div>
                      {widmung.zustellung === "direkt" && (
                        <input
                          type="email"
                          placeholder="E-Mail der beschenkten Person"
                          value={widmung.empfaengerEmail}
                          onChange={(e) => setWidmung({ ...widmung, empfaengerEmail: e.target.value })}
                          className="mt-4 border border-border rounded-md px-4 py-3 text-foreground text-base focus:outline-none focus:border-accent transition-colors w-full"
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-10 flex gap-4">
                    <button
                      onClick={() => setStep("motiv")}
                      className="px-8 py-4 text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
                    >
                      Zurück
                    </button>
                    <button
                      onClick={() => setStep("bezahlen")}
                      className="bg-accent hover:bg-accent-hover text-white px-10 py-4 text-sm tracking-[0.12em] uppercase transition-colors cursor-pointer rounded-md"
                    >
                      Weiter zur Bezahlung
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Bezahlen */}
              {step === "bezahlen" && (
                <div>
                  <h2 className="font-display text-3xl text-foreground mb-3">
                    Deine Angaben
                  </h2>
                  <p className="text-muted mb-8">
                    Noch schnell deine Daten, dann gehts zur Bezahlung.
                  </p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-muted mb-2">Dein Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Vor- und Nachname"
                        value={kaeufer.name}
                        onChange={(e) => setKaeufer({ ...kaeufer, name: e.target.value })}
                        className="border border-border rounded-md px-4 py-3 text-foreground text-base focus:outline-none focus:border-accent transition-colors w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted mb-2">Deine E-Mail *</label>
                      <input
                        type="email"
                        required
                        placeholder="deine@email.ch"
                        value={kaeufer.email}
                        onChange={(e) => setKaeufer({ ...kaeufer, email: e.target.value })}
                        className="border border-border rounded-md px-4 py-3 text-foreground text-base focus:outline-none focus:border-accent transition-colors w-full"
                      />
                    </div>

                    <div className="bg-surface rounded-lg p-5 space-y-3">
                      <h3 className="text-sm font-semibold text-foreground">Zusammenfassung</h3>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Gutscheinwert</span>
                        <span className="text-foreground font-medium">CHF {displayAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Motiv</span>
                        <span className="text-foreground">{currentMotif.label}</span>
                      </div>
                      {widmung.fuer && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted">Für</span>
                          <span className="text-foreground">{widmung.fuer}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Zustellung</span>
                        <span className="text-foreground">{widmung.zustellung === "selbst" ? "An mich" : "Direkt"}</span>
                      </div>
                      <div className="border-t border-border pt-3 flex justify-between">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="font-semibold text-foreground text-lg">CHF {displayAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={kaeufer.agb}
                        onChange={(e) => setKaeufer({ ...kaeufer, agb: e.target.checked })}
                        className="mt-1 accent-accent"
                      />
                      <span className="text-sm text-muted">
                        Ich akzeptiere die{" "}
                        <Link href="/agb" className="underline text-foreground hover:text-accent">AGB</Link>{" "}
                        und die{" "}
                        <Link href="/datenschutz" className="underline text-foreground hover:text-accent">Datenschutzerklärung</Link>.
                      </span>
                    </label>

                    {error && (
                      <p className="text-error text-sm bg-error/5 p-3 rounded-md">{error}</p>
                    )}
                  </div>

                  <div className="mt-10 flex gap-4">
                    <button
                      onClick={() => setStep("widmung")}
                      className="px-8 py-4 text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
                    >
                      Zurück
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={sending}
                      className="bg-accent hover:bg-accent-hover text-white px-10 py-4 text-sm tracking-[0.12em] uppercase transition-colors cursor-pointer rounded-md disabled:opacity-60 disabled:cursor-default"
                    >
                      {sending ? "Wird verarbeitet..." : "Jetzt bezahlen"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Preview card */}
            <div className="hidden lg:block">
              <div className="sticky top-20">
                <MotifCard motif={currentMotif} amount={displayAmount} />
                <ul className="mt-6 space-y-3 text-sm text-muted">
                  <li className="flex gap-2">
                    <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Sofort per Mail, als PDF zum Ausdrucken
                  </li>
                  <li className="flex gap-2">
                    <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Ohne Verfalldatum
                  </li>
                  <li className="flex gap-2">
                    <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Teilbeträge möglich, Restguthaben bleibt
                  </li>
                  <li className="flex gap-2">
                    <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Einlösbar im Daniele Restaurant & Winebar
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile preview (below form on small screens) */}
      <div className="lg:hidden border-t border-border py-8 bg-surface">
        <div className="max-w-[400px] mx-auto px-5">
          <MotifCard motif={currentMotif} amount={displayAmount} />
        </div>
      </div>

      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-foreground">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-10 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center">
          <Image src="/images/daniele-logo-schwarz.png" alt="Daniele" width={140} height={43} className="h-7 w-auto invert" />
        </a>
        <div className="flex items-center gap-6 text-sm text-white/60">
          <a href="https://daniele.swiss" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors hidden sm:block">
            daniele.swiss
          </a>
          <a href="tel:+41412102020" className="hover:text-white transition-colors hidden sm:block">
            041 210 20 20
          </a>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-10">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-6">
          <div>
            <Image src="/images/daniele-logo-schwarz.png" alt="Daniele" width={120} height={37} className="h-6 w-auto mb-3" />
            <p className="text-sm text-muted">
              Gutscheine von{" "}
              <a href="https://daniele.swiss" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">
                Daniele Restaurant & Winebar
              </a>
            </p>
          </div>
          <div className="text-sm text-muted space-y-1 sm:text-right">
            <p>Kauffmannweg 16, 6003 Luzern</p>
            <p><a href="tel:+41412102020" className="hover:text-foreground transition-colors">041 210 20 20</a></p>
          </div>
        </div>
        <div className="border-t border-border pt-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted/50">
          <p>© {new Date().getFullYear()} Daniele Winebar · Restaurant · Lounge · <span className="text-muted/30">v1.0.0</span></p>
          <div className="flex gap-6">
            <Link href="/impressum" className="hover:text-foreground transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</Link>
            <Link href="/agb" className="hover:text-foreground transition-colors">AGB</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
