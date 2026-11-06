import Link from "next/link";

export const metadata = { title: "Impressum" };

export default function Impressum() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="bg-foreground py-4">
        <div className="max-w-[800px] mx-auto px-5">
          <Link href="/" className="text-white text-sm hover:text-white/80 transition-colors">← Zurück</Link>
        </div>
      </nav>
      <main className="max-w-[800px] mx-auto px-5 py-16">
        <h1 className="font-display text-4xl text-foreground mb-10">Impressum</h1>
        <div className="text-muted space-y-4 text-sm leading-relaxed">
          <p className="text-foreground font-semibold text-base">Daniele Winebar · Restaurant · Lounge</p>
          <p>Kauffmannweg 16<br />CH-6003 Luzern</p>
          <p>Telefon: <a href="tel:+41412102020" className="underline hover:text-foreground">041 210 20 20</a></p>
          <p>Web: <a href="https://daniele.swiss" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">daniele.swiss</a></p>

          <h2 className="text-foreground text-lg font-semibold pt-6">Haftungsausschluss</h2>
          <p>
            Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit,
            Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen.
          </p>

          <h2 className="text-foreground text-lg font-semibold pt-6">Urheberrechte</h2>
          <p>
            Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen
            Dateien auf dieser Website gehören ausschliesslich dem Betreiber oder den
            speziell genannten Rechteinhabern.
          </p>
        </div>
      </main>
      <footer className="border-t border-border py-10">
        <div className="max-w-[800px] mx-auto px-5 flex justify-between items-center text-xs text-muted/50">
          <p>© {new Date().getFullYear()} Daniele Winebar · Restaurant · Lounge</p>
          <div className="flex gap-6">
            <Link href="/impressum" className="text-foreground">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
