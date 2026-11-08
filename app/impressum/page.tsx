import Link from "next/link";

export const metadata = { title: "Impressum — gutschein-schenken.ch" };

export default function Impressum() {
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
        <h1 className="font-display text-4xl mb-10">Impressum</h1>
        <div className="text-[#777] space-y-4 text-[15px] leading-[1.7]">
          <p>
            gutschein-schenken.ch ist ein Angebot der Marktindex AG in Luzern.
            Die Marktindex AG betreibt diese Plattform als Vermittlerin von
            Gutscheinen und ist nicht selbst Anbieterin der damit verbundenen Leistungen.
          </p>

          <h2 className="text-[#1a1a1a] text-lg font-semibold pt-6">Betreiberin</h2>
          <p>
            Marktindex AG<br />
            Cheerstrasse 13b<br />
            6014 Luzern
          </p>
          <p>
            E-Mail:{" "}
            <a href="mailto:info@marktindex.ch" className="underline hover:text-[#1a1a1a]">
              info@marktindex.ch
            </a>
          </p>

          <h2 className="text-[#1a1a1a] text-lg font-semibold pt-6">Haftungsausschluss</h2>
          <p>
            Die Inhalte werden mit Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit
            und Aktualität wird jedoch keine Gewähr übernommen. Eine Haftung für Schäden,
            die aus der Nutzung dieser Plattform entstehen, wird im Rahmen des gesetzlich
            Zulässigen ausgeschlossen.
          </p>

          <h2 className="text-[#1a1a1a] text-lg font-semibold pt-6">Externe Links</h2>
          <p>
            Diese Plattform enthält Links auf Websites Dritter. Auf deren Inhalte haben
            wir keinen Einfluss, und wir übernehmen dafür keine Verantwortung.
          </p>

          <h2 className="text-[#1a1a1a] text-lg font-semibold pt-6">Urheberrecht</h2>
          <p>
            Texte, Bilder und die Gestaltung dieser Plattform sind urheberrechtlich
            geschützt. Die Rechte liegen bei der Marktindex AG oder bei den jeweiligen
            Rechteinhabern. Eine Weiterverwendung ist nur mit vorgängiger schriftlicher
            Zustimmung zulässig.
          </p>
        </div>
      </main>
      <footer className="border-t border-[#e8e3d8] py-8">
        <div className="max-w-[800px] mx-auto px-6 flex justify-between items-center text-[12px] text-[#ccc]">
          <p>&copy; {new Date().getFullYear()} Marktindex AG</p>
          <div className="flex gap-6">
            <Link href="/impressum" className="text-[#777]">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-[#777] transition-colors">Datenschutz</Link>
            <Link href="/agb" className="hover:text-[#777] transition-colors">AGB</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
