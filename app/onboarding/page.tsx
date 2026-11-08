import type { Metadata } from "next";
import Link from "next/link";
import OnboardingForm from "@/components/OnboardingForm";

export const metadata: Metadata = {
  title: "Onboarding — gutschein-schenken.ch",
  description: "Alle Informationen für die Einrichtung Ihres Gutschein-Shops.",
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a]">
      {/* Nav */}
      <nav className="border-b border-[#e8e3d8]">
        <div className="max-w-[800px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-[15px] font-medium tracking-[-0.01em]">
            gutschein-schenken.ch
          </Link>
          <Link href="/mitmachen" className="text-[13px] text-[#999] hover:text-[#1a1a1a] transition-colors">
            Übersicht
          </Link>
        </div>
      </nav>

      <main className="max-w-[800px] mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.02em] mb-4">
            Shop einrichten.
          </h1>
          <p className="text-[#777] text-[16px] leading-[1.7] max-w-[560px]">
            Füllen Sie das Formular aus — wir richten Ihren Gutschein-Shop
            innerhalb von 24 Stunden ein. Am Ende können Sie alles per E-Mail
            absenden oder als Zusammenfassung herunterladen.
          </p>
        </div>

        <OnboardingForm />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e8e3d8] py-8">
        <div className="max-w-[800px] mx-auto px-6 flex justify-between items-center text-[12px] text-[#ccc]">
          <p>Ein Angebot der Marktindex AG, Luzern</p>
          <div className="flex gap-6">
            <Link href="/impressum" className="hover:text-[#777] transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-[#777] transition-colors">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
