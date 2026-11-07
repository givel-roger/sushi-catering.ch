"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";

interface Transaction {
  date: string;
  amount: number;
  note: string;
}

interface Gutschein {
  id: string;
  code: string;
  amount: number;
  remainingAmount: number;
  motif: string;
  widmung: {
    fuer: string;
    von: string;
    nachricht: string;
    zustellung: string;
    empfaengerEmail: string;
  };
  kaeufer: {
    name: string;
    email: string;
  };
  status: string;
  createdAt: string;
  paidAt: string | null;
  transactions: Transaction[];
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function TenantAdminPage() {
  const params = useParams<{ tenantSlug: string }>();
  const tenantSlug = params.tenantSlug;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [gutscheine, setGutscheine] = useState<Gutschein[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [searchCode, setSearchCode] = useState("");
  const [selectedGutschein, setSelectedGutschein] = useState<Gutschein | null>(null);
  const [redeemAmount, setRedeemAmount] = useState("");
  const [redeemNote, setRedeemNote] = useState("");
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState<"list" | "check">("list");

  const loadGutscheine = useCallback(async () => {
    try {
      const res = await fetch(`/api/gutschein?tenant=${encodeURIComponent(tenantSlug)}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setGutscheine(data);
    } catch {
      setMessage("Fehler beim Laden der Gutscheine.");
    }
  }, [tenantSlug]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .finally(() => setCheckingAuth(false));
  }, []);

  useEffect(() => {
    if (user) loadGutscheine();
  }, [user, loadGutscheine]);

  async function handleLogin() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, tenantSlug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Login fehlgeschlagen.");
        return;
      }
      setUser(data.user);
      setPassword("");
    } catch {
      setMessage("Verbindungsfehler.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setGutscheine([]);
    setSelectedGutschein(null);
  }

  async function searchGutschein() {
    if (!searchCode.trim()) return;
    try {
      const res = await fetch(`/api/gutschein?code=${encodeURIComponent(searchCode.trim())}&tenant=${encodeURIComponent(tenantSlug)}`);
      if (!res.ok) {
        setMessage("Gutschein nicht gefunden.");
        setSelectedGutschein(null);
        return;
      }
      const data = await res.json();
      setSelectedGutschein(data);
      setMessage("");
    } catch {
      setMessage("Fehler bei der Suche.");
    }
  }

  async function handleRedeem() {
    if (!selectedGutschein || !redeemAmount) return;
    const amount = parseFloat(redeemAmount);
    if (isNaN(amount) || amount <= 0) {
      setMessage("Ungültiger Betrag.");
      return;
    }

    try {
      const res = await fetch("/api/gutschein/einloesen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: selectedGutschein.code, amount, note: redeemNote }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error);
        return;
      }
      setMessage(`Eingelöst! Restguthaben: CHF ${data.remainingAmount.toFixed(2)}`);
      setRedeemAmount("");
      setRedeemNote("");
      searchGutschein();
      loadGutscheine();
    } catch {
      setMessage("Fehler beim Einlösen.");
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-muted">Laden...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-5">
        <div className="bg-white rounded-lg shadow-sm border border-border p-8 w-full max-w-sm">
          <h1 className="font-display text-2xl text-foreground mb-2">Admin-Zugang</h1>
          <p className="text-muted text-sm mb-6">{tenantSlug}</p>
          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && document.getElementById("pw")?.focus()}
            className="border border-border rounded-md px-4 py-3 text-foreground text-base focus:outline-none focus:border-accent transition-colors w-full mb-3"
          />
          <input
            id="pw"
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="border border-border rounded-md px-4 py-3 text-foreground text-base focus:outline-none focus:border-accent transition-colors w-full mb-4"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-foreground text-white px-6 py-3 text-sm w-full rounded-md cursor-pointer hover:bg-foreground/80 transition-colors"
          >
            {loading ? "..." : "Anmelden"}
          </button>
          {message && <p className="text-error text-sm mt-4">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-foreground text-white py-4">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Gutschein-Verwaltung</h1>
            <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded">{tenantSlug}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/50">{user.name}</span>
            <button
              onClick={handleLogout}
              className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              Abmelden
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-5 sm:px-10 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-1 bg-white rounded-lg p-1 border border-border w-fit">
            {([["list", "Übersicht"], ["check", "Prüfen / Einlösen"]] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setTab(key); setMessage(""); }}
                className={`px-5 py-2 text-sm rounded-md cursor-pointer transition-colors ${tab === key ? "bg-foreground text-white" : "text-muted hover:text-foreground"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="text-sm text-muted">{gutscheine.length} Gutscheine</span>
        </div>

        {tab === "list" && (
          <div className="bg-white rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="text-left px-4 py-3 font-medium text-muted">Code</th>
                    <th className="text-left px-4 py-3 font-medium text-muted">Betrag</th>
                    <th className="text-left px-4 py-3 font-medium text-muted">Rest</th>
                    <th className="text-left px-4 py-3 font-medium text-muted">Käufer</th>
                    <th className="text-left px-4 py-3 font-medium text-muted">Für</th>
                    <th className="text-left px-4 py-3 font-medium text-muted">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted">Datum</th>
                  </tr>
                </thead>
                <tbody>
                  {gutscheine.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-muted">Noch keine Gutscheine.</td>
                    </tr>
                  ) : (
                    [...gutscheine].reverse().map((g) => (
                      <tr
                        key={g.id}
                        className="border-b border-border last:border-0 hover:bg-surface/50 cursor-pointer"
                        onClick={() => { setSelectedGutschein(g); setSearchCode(g.code); setTab("check"); }}
                      >
                        <td className="px-4 py-3 font-mono text-xs">{g.code}</td>
                        <td className="px-4 py-3">CHF {g.amount.toFixed(2)}</td>
                        <td className="px-4 py-3">CHF {g.remainingAmount.toFixed(2)}</td>
                        <td className="px-4 py-3">{g.kaeufer.name}</td>
                        <td className="px-4 py-3">{g.widmung.fuer || "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            g.status === "paid" ? "bg-green-100 text-green-700" :
                            g.status === "partial" ? "bg-amber-100 text-amber-700" :
                            g.status === "redeemed" ? "bg-gray-100 text-gray-500" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {g.status === "paid" ? "Aktiv" : g.status === "partial" ? "Teilweise" : g.status === "redeemed" ? "Eingelöst" : "Ausstehend"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted">{new Date(g.createdAt).toLocaleDateString("de-CH")}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "check" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-border p-6">
              <h2 className="font-semibold text-foreground mb-4">Gutschein suchen</h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Code eingeben"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && searchGutschein()}
                  className="border border-border rounded-md px-4 py-3 text-foreground text-base focus:outline-none focus:border-accent transition-colors flex-1 font-mono"
                />
                <button
                  onClick={searchGutschein}
                  className="bg-foreground text-white px-6 py-3 rounded-md cursor-pointer hover:bg-foreground/80 transition-colors text-sm shrink-0"
                >
                  Suchen
                </button>
              </div>

              {message && <p className="text-sm mt-4 text-accent">{message}</p>}

              {selectedGutschein && (
                <div className="mt-6 space-y-4">
                  <div className="bg-surface rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted text-sm">Code</span>
                      <span className="font-mono text-sm">{selectedGutschein.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted text-sm">Originalwert</span>
                      <span className="text-sm">CHF {selectedGutschein.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted text-sm">Restguthaben</span>
                      <span className="font-semibold text-lg">CHF {selectedGutschein.remainingAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted text-sm">Status</span>
                      <span className={`text-sm font-medium ${
                        selectedGutschein.status === "paid" ? "text-green-600" :
                        selectedGutschein.status === "partial" ? "text-amber-600" :
                        "text-gray-500"
                      }`}>
                        {selectedGutschein.status === "paid" ? "Aktiv" : selectedGutschein.status === "partial" ? "Teilweise eingelöst" : "Vollständig eingelöst"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted text-sm">Käufer</span>
                      <span className="text-sm">{selectedGutschein.kaeufer.name}</span>
                    </div>
                    {selectedGutschein.widmung.fuer && (
                      <div className="flex justify-between">
                        <span className="text-muted text-sm">Für</span>
                        <span className="text-sm">{selectedGutschein.widmung.fuer}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted text-sm">Kaufdatum</span>
                      <span className="text-sm">{new Date(selectedGutschein.createdAt).toLocaleDateString("de-CH")}</span>
                    </div>
                  </div>

                  {selectedGutschein.transactions.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-2">Einlösungen</h3>
                      <div className="space-y-2">
                        {selectedGutschein.transactions.map((t, i) => (
                          <div key={i} className="flex justify-between text-sm bg-surface rounded px-3 py-2">
                            <span className="text-muted">{new Date(t.date).toLocaleDateString("de-CH")} {t.note && `— ${t.note}`}</span>
                            <span className="text-foreground font-medium">- CHF {t.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {selectedGutschein && selectedGutschein.status !== "redeemed" && (
              <div className="bg-white rounded-lg border border-border p-6">
                <h2 className="font-semibold text-foreground mb-4">Einlösen</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted mb-2">Betrag (CHF)</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0.05"
                      max={selectedGutschein.remainingAmount}
                      placeholder={`Max. ${selectedGutschein.remainingAmount.toFixed(2)}`}
                      value={redeemAmount}
                      onChange={(e) => setRedeemAmount(e.target.value)}
                      className="border border-border rounded-md px-4 py-3 text-foreground text-base focus:outline-none focus:border-accent transition-colors w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-2">Notiz (optional)</label>
                    <input
                      type="text"
                      placeholder="z.B. Tisch 5, Abendessen"
                      value={redeemNote}
                      onChange={(e) => setRedeemNote(e.target.value)}
                      className="border border-border rounded-md px-4 py-3 text-foreground text-base focus:outline-none focus:border-accent transition-colors w-full"
                    />
                  </div>
                  <button
                    onClick={handleRedeem}
                    className="bg-accent hover:bg-accent-hover text-white px-8 py-3 text-sm rounded-md cursor-pointer transition-colors w-full tracking-wide uppercase"
                  >
                    Einlösen
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
