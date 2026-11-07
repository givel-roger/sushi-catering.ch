"use client";

import { useState, useEffect } from "react";
import QRScanner from "@/components/QRScanner";

type GutscheinInfo = {
  code: string;
  amount: number;
  remainingAmount: number;
  status: string;
  motif: string;
  widmung: { fuer: string; von: string; nachricht: string };
  kaeufer: { name: string; email: string };
  paidAt: string | null;
  transactions: { date: string; amount: number; note: string }[];
};

export default function ScanPage() {
  const [tenantSlug, setTenantSlug] = useState<string>("");
  const [tenantName, setTenantName] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [scanning, setScanning] = useState(false);
  const [gutschein, setGutschein] = useState<GutscheinInfo | null>(null);
  const [redeemAmount, setRedeemAmount] = useState("");
  const [redeemNote, setRedeemNote] = useState("");
  const [redeemError, setRedeemError] = useState("");
  const [redeemSuccess, setRedeemSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const slug = window.location.pathname.split("/")[2] || "";
    setTenantSlug(slug);
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setLoggedIn(true);
        setTenantName(data.tenantName || "");
      }
    } catch {}
    setChecking(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, tenantSlug }),
      });
      if (!res.ok) {
        const data = await res.json();
        setLoginError(data.error || "Login fehlgeschlagen.");
        return;
      }
      setLoggedIn(true);
      const me = await fetch("/api/auth/me").then((r) => r.json());
      setTenantName(me.tenantName || "");
    } catch {
      setLoginError("Verbindungsfehler.");
    }
  }

  async function handleScan(code: string) {
    setScanning(false);
    setGutschein(null);
    setRedeemError("");
    setRedeemSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`/api/gutschein?code=${encodeURIComponent(code)}`);
      if (!res.ok) {
        setRedeemError("Gutschein nicht gefunden.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setGutschein(data);
      setRedeemAmount(data.remainingAmount.toFixed(2));
    } catch {
      setRedeemError("Fehler beim Laden des Gutscheins.");
    }
    setLoading(false);
  }

  async function handleRedeem() {
    if (!gutschein) return;
    const amt = parseFloat(redeemAmount);
    if (!amt || amt <= 0) {
      setRedeemError("Bitte gültigen Betrag eingeben.");
      return;
    }
    setRedeemError("");
    setRedeemSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/gutschein/einloesen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: gutschein.code, amount: amt, note: redeemNote }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRedeemError(data.error || "Einlösen fehlgeschlagen.");
        setLoading(false);
        return;
      }
      setRedeemSuccess(
        `CHF ${amt.toFixed(2)} eingelöst! Restguthaben: CHF ${data.remainingAmount.toFixed(2)}`
      );
      setGutschein({
        ...gutschein,
        remainingAmount: data.remainingAmount,
        status: data.status,
      });
      setRedeemAmount(data.remainingAmount > 0 ? data.remainingAmount.toFixed(2) : "");
      setRedeemNote("");
    } catch {
      setRedeemError("Verbindungsfehler.");
    }
    setLoading(false);
  }

  function handleManualInput() {
    const code = prompt("Gutschein-Code eingeben:");
    if (code) handleScan(code.trim().toUpperCase());
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full" />
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <div className="p-4 text-center border-b border-gray-800">
          <h1 className="text-lg font-semibold">Gutschein Scanner</h1>
          <p className="text-sm text-gray-400">Anmeldung erforderlich</p>
        </div>
        <div className="flex-1 flex items-center justify-center px-5">
          <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
            {loginError && (
              <div className="bg-red-900/50 text-red-300 rounded-lg p-3 text-sm">{loginError}</div>
            )}
            <input
              type="email"
              placeholder="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-medium transition-colors"
            >
              Anmelden
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <div>
          <h1 className="text-lg font-semibold">Gutschein Scanner</h1>
          {tenantName && <p className="text-xs text-gray-400">{tenantName}</p>}
        </div>
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            setLoggedIn(false);
          }}
          className="text-sm text-gray-400 hover:text-white"
        >
          Abmelden
        </button>
      </div>

      <div className="flex-1 px-4 py-6 space-y-6">
        {/* Scanner */}
        {!gutschein && !loading && (
          <>
            {scanning ? (
              <QRScanner onScan={handleScan} scanning={scanning} />
            ) : (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-gray-800 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75H16.5v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75H16.5v-.75z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">QR-Code auf dem Gutschein scannen</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setScanning(!scanning)}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  scanning
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {scanning ? "Stoppen" : "Scanner starten"}
              </button>
              <button
                onClick={handleManualInput}
                className="px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
              >
                Code eingeben
              </button>
            </div>
          </>
        )}

        {/* Loading */}
        {loading && !gutschein && (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Gutschein wird geladen...</p>
          </div>
        )}

        {/* Error */}
        {redeemError && !gutschein && (
          <div className="bg-red-900/50 text-red-300 rounded-lg p-4 text-sm text-center">
            {redeemError}
            <button
              onClick={() => { setRedeemError(""); setScanning(false); }}
              className="block mx-auto mt-3 text-white underline text-sm"
            >
              Erneut scannen
            </button>
          </div>
        )}

        {/* Gutschein Details */}
        {gutschein && (
          <div className="space-y-4">
            {/* Status Badge */}
            <div className="text-center">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  gutschein.status === "paid"
                    ? "bg-green-900/50 text-green-300"
                    : gutschein.status === "partial"
                    ? "bg-yellow-900/50 text-yellow-300"
                    : "bg-red-900/50 text-red-300"
                }`}
              >
                {gutschein.status === "paid"
                  ? "Gültig"
                  : gutschein.status === "partial"
                  ? "Teilweise eingelöst"
                  : "Vollständig eingelöst"}
              </span>
            </div>

            {/* Card */}
            <div className="bg-gray-900 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Gutschein-Code</p>
                  <p className="text-lg font-mono font-bold">{gutschein.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Restguthaben</p>
                  <p className="text-2xl font-bold text-green-400">
                    CHF {gutschein.remainingAmount.toFixed(2)}
                  </p>
                  {gutschein.remainingAmount < gutschein.amount && (
                    <p className="text-xs text-gray-500">
                      von CHF {gutschein.amount.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              {gutschein.widmung.fuer && (
                <div className="pt-2 border-t border-gray-800 text-sm text-gray-400">
                  <span>Für: {gutschein.widmung.fuer}</span>
                  {gutschein.widmung.von && <span> · Von: {gutschein.widmung.von}</span>}
                </div>
              )}
            </div>

            {/* Redeem Form */}
            {gutschein.remainingAmount > 0 && (
              <div className="bg-gray-900 rounded-xl p-5 space-y-4">
                <h3 className="font-medium">Einlösen</h3>

                {redeemSuccess && (
                  <div className="bg-green-900/50 text-green-300 rounded-lg p-3 text-sm">
                    {redeemSuccess}
                  </div>
                )}
                {redeemError && gutschein && (
                  <div className="bg-red-900/50 text-red-300 rounded-lg p-3 text-sm">
                    {redeemError}
                  </div>
                )}

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                    Betrag (CHF)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={gutschein.remainingAmount}
                    value={redeemAmount}
                    onChange={(e) => setRedeemAmount(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                    Notiz (optional)
                  </label>
                  <input
                    type="text"
                    value={redeemNote}
                    onChange={(e) => setRedeemNote(e.target.value)}
                    placeholder="z.B. Tisch 4, Abendessen"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleRedeem}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg py-3 font-medium transition-colors"
                >
                  {loading ? "Wird eingelöst..." : `CHF ${parseFloat(redeemAmount || "0").toFixed(2)} einlösen`}
                </button>
              </div>
            )}

            {/* Transactions */}
            {gutschein.transactions.length > 0 && (
              <div className="bg-gray-900 rounded-xl p-5 space-y-3">
                <h3 className="font-medium text-sm">Einlösungen</h3>
                {gutschein.transactions.map((t, i) => (
                  <div key={i} className="flex justify-between text-sm border-t border-gray-800 pt-2">
                    <div>
                      <p className="text-gray-400">
                        {new Date(t.date).toLocaleDateString("de-CH", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {t.note && <p className="text-gray-500 text-xs">{t.note}</p>}
                    </div>
                    <p className="text-red-400 font-mono">-CHF {t.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setGutschein(null);
                  setRedeemSuccess("");
                  setRedeemError("");
                  setScanning(false);
                }}
                className="flex-1 bg-gray-800 hover:bg-gray-700 rounded-lg py-3 text-sm transition-colors"
              >
                Neuer Scan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-xs text-gray-600 border-t border-gray-800">
        gutschein-schenken.ch
      </div>
    </div>
  );
}
