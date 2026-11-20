"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function PasswortResetInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }
    if (password !== confirm) {
      setError("Passwörter stimmen nicht überein.");
      return;
    }

    setStatus("loading");
    setError("");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setStatus("success");
    } else {
      setError(data.error || "Ein Fehler ist aufgetreten.");
      setStatus("error");
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-6">
        <div className="max-w-[400px] w-full text-center">
          <h1 className="font-display text-2xl mb-4">Ungültiger Link</h1>
          <p className="text-[#777] text-[15px] mb-6">
            Dieser Link ist ungültig. Bitte fordern Sie einen neuen Passwort-Reset an.
          </p>
          <Link href="/admin" className="text-[14px] font-medium text-accent hover:underline">
            Zum Login
          </Link>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-6">
        <div className="max-w-[400px] w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-2xl mb-4">Passwort geändert</h1>
          <p className="text-[#777] text-[15px] mb-6">
            Ihr neues Passwort wurde gespeichert. Sie können sich jetzt anmelden.
          </p>
          <Link
            href="/admin"
            className="inline-block text-[14px] font-medium bg-[#1a1a1a] text-white px-7 py-3 hover:bg-[#333] transition-colors"
          >
            Zum Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-6">
      <div className="max-w-[400px] w-full">
        <h1 className="font-display text-2xl mb-2">Neues Passwort setzen</h1>
        <p className="text-[#777] text-[15px] mb-8">Wählen Sie ein neues Passwort (mindestens 8 Zeichen).</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-[#555] mb-1.5">Neues Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#ddd] px-4 py-3 text-[15px] bg-white focus:outline-none focus:border-[#999] transition-colors"
              required
              minLength={8}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#555] mb-1.5">Passwort bestätigen</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border border-[#ddd] px-4 py-3 text-[15px] bg-white focus:outline-none focus:border-[#999] transition-colors"
              required
              minLength={8}
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
            {status === "loading" ? "Wird gespeichert..." : "Passwort speichern"}
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

export default function PasswortResetPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf8f5]" />}>
      <PasswortResetInner />
    </Suspense>
  );
}
