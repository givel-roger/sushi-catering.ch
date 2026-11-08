import Link from "next/link";

export const metadata = { title: "Datenschutz — gutschein-schenken.ch" };

export default function Datenschutz() {
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
        <h1 className="font-display text-4xl mb-10">Datenschutzerklärung</h1>
        <div className="space-y-6 text-[15px] text-[#777] leading-[1.7]">
          <section>
            <h2 className="text-[#1a1a1a] text-lg font-semibold mb-3">Verantwortliche Stelle</h2>
            <p>
              Marktindex AG<br />
              Cheerstrasse 13b<br />
              6014 Luzern<br />
              E-Mail:{" "}
              <a href="mailto:info@marktindex.ch" className="underline hover:text-[#1a1a1a]">
                info@marktindex.ch
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-[#1a1a1a] text-lg font-semibold mb-3">Erhebung und Verwendung von Daten</h2>
            <p>
              Beim Kauf eines Gutscheins erheben wir die von Ihnen angegebenen Daten
              (Name, E-Mail-Adresse, Widmungstexte). Diese Daten verwenden wir
              ausschliesslich zur Erstellung und Zustellung des Gutscheins sowie
              zur Abwicklung der Zahlung.
            </p>
          </section>

          <section>
            <h2 className="text-[#1a1a1a] text-lg font-semibold mb-3">Rechtsgrundlage</h2>
            <p>
              Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung sowie zur
              Durchführung des Kaufvertrags. In der Schweiz gilt das Bundesgesetz
              über den Datenschutz (DSG).
            </p>
          </section>

          <section>
            <h2 className="text-[#1a1a1a] text-lg font-semibold mb-3">Speicherdauer</h2>
            <p>
              Gutschein-Daten werden gespeichert, solange der Gutschein gültig ist
              und offenes Guthaben besteht, sowie gemäss gesetzlichen Aufbewahrungspflichten.
            </p>
          </section>

          <section>
            <h2 className="text-[#1a1a1a] text-lg font-semibold mb-3">Weitergabe an Dritte</h2>
            <p>
              Ihre Daten werden nicht an Dritte weitergegeben, es sei denn, dies ist
              zur Zahlungsabwicklung erforderlich (z.B. Zahlungsdienstleister Stripe).
            </p>
          </section>

          <section>
            <h2 className="text-[#1a1a1a] text-lg font-semibold mb-3">Ihre Rechte</h2>
            <p>
              Sie haben jederzeit das Recht auf Auskunft, Berichtigung und Löschung
              Ihrer personenbezogenen Daten. Kontaktieren Sie uns unter{" "}
              <a href="mailto:info@marktindex.ch" className="underline hover:text-[#1a1a1a]">
                info@marktindex.ch
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-[#1a1a1a] text-lg font-semibold mb-3">Cookies</h2>
            <p>
              Diese Website verwendet keine Tracking-Cookies und keine Analyse-Tools.
              Es werden nur technisch notwendige Cookies verwendet.
            </p>
          </section>
        </div>
      </main>
      <footer className="border-t border-[#e8e3d8] py-8">
        <div className="max-w-[800px] mx-auto px-6 flex justify-between items-center text-[12px] text-[#ccc]">
          <p>&copy; {new Date().getFullYear()} Marktindex AG</p>
          <div className="flex gap-6">
            <Link href="/impressum" className="hover:text-[#777] transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="text-[#777]">Datenschutz</Link>
            <Link href="/agb" className="hover:text-[#777] transition-colors">AGB</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
