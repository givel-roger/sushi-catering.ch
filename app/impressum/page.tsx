import Image from "next/image";
import Link from "next/link";

export default function Impressum() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logo-black.png" alt="Kaiten by Yorokobi" width={200} height={44} className="h-8 w-auto" />
          </Link>
          <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
            Zurück zur Startseite
          </Link>
        </div>
      </nav>

      <main className="max-w-[700px] mx-auto px-5 sm:px-10 py-20">
        <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-12">Impressum</h1>

        <div className="space-y-8 text-base text-muted leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Kontaktadresse</h2>
            <p>
              Yorokobi AG<br />
              Habsburgerstrasse 48<br />
              6003 Luzern
            </p>
            <p className="mt-3">
              Telefon: <a href="tel:+41412449999" className="text-foreground underline">041 244 99 99</a><br />
              E-Mail: <a href="mailto:info@yorokobi.ch" className="text-foreground underline">info@yorokobi.ch</a><br />
              Web: <a href="https://www.kaiten.ch" target="_blank" rel="noopener noreferrer" className="text-foreground underline">www.kaiten.ch</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Handelsregister und Mehrwertsteuer</h2>
            <p>
              Yorokobi AG, Aktiengesellschaft mit Sitz in Luzern<br />
              UID und MWST-Nummer: CHE-348.228.951 MWST<br />
              CH-ID: CH-100.3824140-2
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Betriebe</h2>
            <p>
              Der Japaner by Yorokobi<br />
              Luzernerstrasse 73, 6010 Kriens, 041 244 99 10
            </p>
            <p className="mt-3">
              Kaiten Sushibar Luzern<br />
              Kauffmannweg 16, 6003 Luzern, 041 244 99 20
            </p>
            <p className="mt-3">
              Kaiten Sushibar Sursee<br />
              Mühleplatz 6, 6210 Sursee, 041 244 99 40
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Haftungsausschluss</h2>
            <p>
              Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit,
              Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen.
            </p>
            <p className="mt-3">
              Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art,
              welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten
              Informationen, durch Missbrauch der Verbindung oder durch technische Störungen
              entstanden sind, werden ausgeschlossen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Urheberrechte</h2>
            <p>
              Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen
              Dateien auf dieser Website gehören ausschliesslich der Yorokobi AG oder den
              speziell genannten Rechteinhabern. Für die Reproduktion jeglicher Elemente ist
              die schriftliche Zustimmung der Urheberrechtsträger im Voraus einzuholen.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-border py-10">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted/50">
          <p>© {new Date().getFullYear()} Yorokobi AG</p>
          <div className="flex gap-6">
            <Link href="/impressum" className="text-foreground">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
