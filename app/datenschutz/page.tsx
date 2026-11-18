export default function Datenschutz() {
  return (
    <div className="min-h-screen py-20 px-5" style={{ background: "#f4f8fc", fontFamily: "'Nunito', system-ui, sans-serif", color: "#1a1a2e" }}>
      <div className="max-w-[700px] mx-auto">
        <a href="/" className="inline-flex items-center gap-2 text-[14px] font-semibold mb-8 no-underline" style={{ color: "#351A00" }}>
          &larr; Zurück zur Stelle
        </a>
        <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: "'Abril Fatface', serif" }}>Datenschutzerklärung</h1>

        <div className="space-y-6 text-[15px] leading-relaxed" style={{ color: "#31465b" }}>
          <div>
            <h2 className="font-bold text-lg mb-2" style={{ color: "#1a1a2e" }}>1. Verantwortliche Stelle</h2>
            <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist die LeadHunter GmbH, c/o Marktindex GmbH, im Auftrag der Confiserie Bachmann AG, Werkhofstrasse 20, 6005 Luzern.</p>
          </div>
          <div>
            <h2 className="font-bold text-lg mb-2" style={{ color: "#1a1a2e" }}>2. Erhobene Daten</h2>
            <p>Im Rahmen der Bewerbung werden folgende Daten erhoben: Vorname, Nachname, E-Mail-Adresse, Telefonnummer sowie die im Bewerbungsformular eingegebenen Angaben zu Erfahrung, Führungserfahrung und Sprachkenntnissen. Optional können Lebenslauf und Arbeitszeugnisse hochgeladen werden.</p>
          </div>
          <div>
            <h2 className="font-bold text-lg mb-2" style={{ color: "#1a1a2e" }}>3. Zweck der Verarbeitung</h2>
            <p>Deine Daten werden ausschliesslich zur Bearbeitung deiner Bewerbung für die Stelle &quot;Teamleiter Operativer Einkauf (m/w/d)&quot; bei der Confiserie Bachmann AG verwendet.</p>
          </div>
          <div>
            <h2 className="font-bold text-lg mb-2" style={{ color: "#1a1a2e" }}>4. Speicherdauer</h2>
            <p>Deine Bewerbungsdaten werden für die Dauer des Bewerbungsprozesses gespeichert. Nach Abschluss des Verfahrens werden die Daten spätestens nach 6 Monaten gelöscht, sofern keine Einwilligung zur längeren Speicherung vorliegt.</p>
          </div>
          <div>
            <h2 className="font-bold text-lg mb-2" style={{ color: "#1a1a2e" }}>5. Deine Rechte</h2>
            <p>Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung deiner personenbezogenen Daten. Wende dich hierzu an <a href="mailto:jobs@confiserie.ch" className="underline" style={{ color: "#351A00" }}>jobs@confiserie.ch</a>.</p>
          </div>
          <div>
            <h2 className="font-bold text-lg mb-2" style={{ color: "#1a1a2e" }}>6. Tracking</h2>
            <p>Diese Website kann Tracking-Pixel von Meta (Facebook/Instagram) und TikTok verwenden, um die Effektivität von Stellenanzeigen zu messen. Es werden dabei keine personenbezogenen Bewerbungsdaten an diese Dienste übermittelt.</p>
          </div>
          <div>
            <h2 className="font-bold text-lg mb-2" style={{ color: "#1a1a2e" }}>7. SSL-Verschlüsselung</h2>
            <p>Diese Website nutzt eine SSL-Verschlüsselung zum Schutz deiner Daten.</p>
          </div>
        </div>

        <footer className="mt-16 pt-6 text-[12px]" style={{ borderTop: "1px solid #e4ebf3", color: "#5b6b7c" }}>
          <p>&copy; {new Date().getFullYear()} Confiserie Bachmann AG</p>
        </footer>
      </div>
    </div>
  );
}
