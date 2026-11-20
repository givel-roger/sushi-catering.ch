"use client";

import { useState } from "react";
import Link from "next/link";

export default function PasswortVergessenPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Ein Fehler ist aufgetreten.");
        setStatus("idle");
        return;
      }

      setStatus("sent");
    } catch {
      setError("Verbindungsfehler. Bitte versuchen Sie es erneut.");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-6">
        <div className="max-w-[400px] w-full text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h1 className="font-display text-2xl mb-4">E-Mail gesendet</h1>
          <p className="text-[#777] text-[15px] leading-relaxed mb-6">
            Falls ein Konto mit <strong>{email}</strong> existiert, haben wir einen Link zum Zurücksetzen gesendet. Prüfen Sie auch den Spam-Ordner.
          </p>
          <Link href="/admin" className="text-[13px] text-[#999] hover:text-[#555] transition-colors">
            Zurück zum Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-6">
      <div className="max-w-[400px] w-full">
        <h1 className="font-display text-2xl mb-2">Passwort vergessen?</h1>
        <p className="text-[#777] text-[15px] mb-8">
          Geben Sie Ihre E-Mail-Adresse ein. Wir senden Ihnen einen Link zum Zurücksetzen.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-[#555] mb-1.5">E-Mail-Adresse</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ihre@email.ch"
              className="w-full border border-[#ddd] px-4 py-3 text-[15px] bg-white focus:outline-none focus:border-[#999] transition-colors"
              required
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-600 text-[13px]">{error}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-[#1a1a1a] text-white py-3 text-[14px] font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "Wird gesendet..." : "Link senden"}
          </button>
        </form>

        <p className="text-center mt-6">
          <Link href="/admin" className="text-[13px] text-[#999] hover:text-[#555] transition-colors">
            Zurück zum Login
          </Link>
        </p>
      </div>
    </div>
  );
}
