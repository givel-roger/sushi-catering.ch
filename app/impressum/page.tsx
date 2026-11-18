export default function Impressum() {
  return (
    <div className="min-h-screen py-20 px-5" style={{ background: "#f4f8fc", fontFamily: "'Nunito', system-ui, sans-serif", color: "#1a1a2e" }}>
      <div className="max-w-[700px] mx-auto">
        <a href="/" className="inline-flex items-center gap-2 text-[14px] font-semibold mb-8 no-underline" style={{ color: "#351A00" }}>
          &larr; Zurück zur Stelle
        </a>
        <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: "'Abril Fatface', serif" }}>Impressum</h1>

        <div className="space-y-6 text-[15px] leading-relaxed" style={{ color: "#31465b" }}>
          <div>
            <h2 className="font-bold text-lg mb-2" style={{ color: "#1a1a2e" }}>Betreiber dieser Stellenanzeige</h2>
            <p>
              LeadHunter GmbH<br />
              c/o Marktindex GmbH<br />
              Schweiz
            </p>
          </div>
          <div>
            <h2 className="font-bold text-lg mb-2" style={{ color: "#1a1a2e" }}>Ausschreibende Firma</h2>
            <p>
              Confiserie Bachmann AG<br />
              Werkhofstrasse 20<br />
              6005 Luzern<br />
              Schweiz
            </p>
          </div>
          <div>
            <h2 className="font-bold text-lg mb-2" style={{ color: "#1a1a2e" }}>Kontakt HR</h2>
            <p>
              Sejla Jusic, HR Leiterin<br />
              Telefon: <a href="tel:+41772088188" className="underline" style={{ color: "#351A00" }}>+41 77 208 81 88</a><br />
              E-Mail: <a href="mailto:jobs@confiserie.ch" className="underline" style={{ color: "#351A00" }}>jobs@confiserie.ch</a>
            </p>
          </div>
          <div>
            <h2 className="font-bold text-lg mb-2" style={{ color: "#1a1a2e" }}>Haftungsausschluss</h2>
            <p>
              Die Inhalte dieser Stellenanzeige wurden mit grösster Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Die ausgeschriebene Stelle ist eine Stelle der Confiserie Bachmann AG. Die Bewerbungsverarbeitung erfolgt im Auftrag.
            </p>
          </div>
        </div>

        <footer className="mt-16 pt-6 text-[12px]" style={{ borderTop: "1px solid #e4ebf3", color: "#5b6b7c" }}>
          <p>&copy; {new Date().getFullYear()} Confiserie Bachmann AG</p>
        </footer>
      </div>
    </div>
  );
}
