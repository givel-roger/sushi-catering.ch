import Link from "next/link";

export const metadata = { title: "Datenschutz" };

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="bg-foreground py-4">
        <div className="max-w-[800px] mx-auto px-5">
          <Link href="/" className="text-white text-sm hover:text-white/80 transition-colors">← Zurück</Link>
        </div>
      </nav>
      <main className="max-w-[800px] mx-auto px-5 py-16">
        <h1 className="font-display text-4xl text-foreground mb-10">Datenschutzerklärung</h1>
        <div className="space-y-6 text-sm text-muted leading-relaxed">
          <section>
            <h2 className="text-foreground text-lg font-semibold mb-3">Verantwortliche Stelle</h2>
            <p>Daniele Winebar · Restaurant · Lounge<br />Kauffmannweg 16, 6003 Luzern</p>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-semibold mb-3">Erhebung und Verwendung von Daten</h2>
            <p>
              Beim Kauf eines Gutscheins erheben wir die von Ihnen angegebenen Daten
              (Name, E-Mail-Adresse, Widmungstexte). Diese Daten verwenden wir
              ausschliesslich zur Erstellung und Zustellung des Gutscheins sowie
              zur Abwicklung der Zahlung.
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-semibold mb-3">Rechtsgrundlage</h2>
            <p>
              Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung sowie zur
              Durchführung des Kaufvertrags. In der Schweiz gilt das Bundesgesetz
              über den Datenschutz (DSG).
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-semibold mb-3">Speicherdauer</h2>
            <p>
              Gutschein-Daten werden gespeichert, solange der Gutschein gültig ist
              und offenes Guthaben besteht, sowie gemäss gesetzlichen Aufbewahrungspflichten.
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-semibold mb-3">Weitergabe an Dritte</h2>
            <p>
              Ihre Daten werden nicht an Dritte weitergegeben, es sei denn, dies ist
              zur Zahlungsabwicklung erforderlich (z.B. Zahlungsdienstleister).
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-semibold mb-3">Ihre Rechte</h2>
            <p>
              Sie haben jederzeit das Recht auf Auskunft, Berichtigung und Löschung
              Ihrer personenbezogenen Daten. Kontaktieren Sie uns unter{" "}
              <a href="https://daniele.swiss" className="text-foreground underline">daniele.swiss</a>.
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-semibold mb-3">Cookies</h2>
            <p>
              Diese Website verwendet keine Tracking-Cookies und keine Analyse-Tools.
              Es werden nur technisch notwendige Cookies verwendet.
            </p>
          </section>
        </div>
      </main>
      <footer className="border-t border-border py-10">
        <div className="max-w-[800px] mx-auto px-5 flex justify-between items-center text-xs text-muted/50">
          <p>© {new Date().getFullYear()} Daniele Winebar · Restaurant · Lounge</p>
          <div className="flex gap-6">
            <Link href="/impressum" className="hover:text-foreground transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="text-foreground">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
