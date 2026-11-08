import Link from "next/link";

export const metadata = { title: "AGB — gutschein-schenken.ch" };

export default function AGB() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a]">
      <nav className="border-b border-[#e8e3d8]">
        <div className="max-w-[800px] mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="text-[14px] hover:text-[#777] transition-colors">
            &larr; Zurück
          </Link>
        </div>
      </nav>
      <main className="max-w-[800px] mx-auto px-6 py-16">
        <h1 className="font-display text-4xl mb-10">Allgemeine Geschäftsbedingungen</h1>
        <div className="space-y-6 text-[15px] text-[#777] leading-[1.7]">
          <section>
            <h2 className="text-[#1a1a1a] text-lg font-semibold mb-3">1. Geltungsbereich</h2>
            <p>
              Diese AGB gelten für den Kauf von Gutscheinen über gutschein-schenken.ch,
              betrieben von der Marktindex AG, Cheerstrasse 13b, 6014 Luzern.
            </p>
          </section>

          <section>
            <h2 className="text-[#1a1a1a] text-lg font-semibold mb-3">2. Gutscheine</h2>
            <p>
              Die Gutscheine sind beim jeweiligen anbietenden Betrieb einlösbar, der auf
              dem Gutschein angegeben ist. Gutscheine haben kein Verfalldatum. Teilbeträge
              können eingelöst werden, das Restguthaben bleibt bestehen. Eine Barauszahlung
              ist ausgeschlossen.
            </p>
          </section>

          <section>
            <h2 className="text-[#1a1a1a] text-lg font-semibold mb-3">3. Bezahlung</h2>
            <p>
              Die Bezahlung erfolgt online zum Zeitpunkt des Kaufs. Der Gutschein wird
              nach erfolgter Zahlung per E-Mail als PDF zugestellt.
            </p>
          </section>

          <section>
            <h2 className="text-[#1a1a1a] text-lg font-semibold mb-3">4. Stornierung</h2>
            <p>
              Eine Stornierung oder Rückerstattung nach dem Kauf ist nicht möglich,
              es sei denn, es liegt ein technischer Fehler vor.
            </p>
          </section>

          <section>
            <h2 className="text-[#1a1a1a] text-lg font-semibold mb-3">5. Haftung</h2>
            <p>
              Die Haftung beschränkt sich auf den Wert des Gutscheins. Für den Verlust
              des Gutscheins (PDF/Ausdruck) übernehmen wir keine Haftung.
            </p>
          </section>

          <section>
            <h2 className="text-[#1a1a1a] text-lg font-semibold mb-3">6. Gerichtsstand</h2>
            <p>Es gilt Schweizer Recht. Gerichtsstand ist Luzern.</p>
          </section>
        </div>
      </main>
      <footer className="border-t border-[#e8e3d8] py-8">
        <div className="max-w-[800px] mx-auto px-6 flex justify-between items-center text-[12px] text-[#ccc]">
          <p>&copy; {new Date().getFullYear()} Marktindex AG</p>
          <div className="flex gap-6">
            <Link href="/impressum" className="hover:text-[#777] transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-[#777] transition-colors">Datenschutz</Link>
            <Link href="/agb" className="text-[#777]">AGB</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
