import Link from "next/link";

export const metadata = { title: "AGB" };

export default function AGB() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-foreground py-4">
        <div className="max-w-[800px] mx-auto px-5">
          <Link href="/" className="text-white text-sm hover:text-white/80 transition-colors">← Zurück</Link>
        </div>
      </nav>
      <div className="max-w-[800px] mx-auto px-5 py-16">
        <h1 className="font-display text-4xl text-foreground mb-10">Allgemeine Geschäftsbedingungen</h1>
        <div className="prose prose-sm text-muted space-y-6">
          <h2 className="text-foreground text-lg font-semibold">1. Geltungsbereich</h2>
          <p>Diese AGB gelten für den Kauf von Gutscheinen über gutschein-schenken.ch, betrieben von Daniele Winebar · Restaurant · Lounge, Kauffmannweg 16, 6003 Luzern.</p>

          <h2 className="text-foreground text-lg font-semibold">2. Gutscheine</h2>
          <p>Die Gutscheine sind in allen Betrieben der Daniele Winebar · Restaurant · Lounge einlösbar. Gutscheine haben kein Verfalldatum. Teilbeträge können eingelöst werden, das Restguthaben bleibt bestehen. Eine Barauszahlung ist ausgeschlossen.</p>

          <h2 className="text-foreground text-lg font-semibold">3. Bezahlung</h2>
          <p>Die Bezahlung erfolgt online zum Zeitpunkt des Kaufs. Der Gutschein wird nach erfolgter Zahlung per E-Mail als PDF zugestellt.</p>

          <h2 className="text-foreground text-lg font-semibold">4. Stornierung</h2>
          <p>Eine Stornierung oder Rückerstattung nach dem Kauf ist nicht möglich, es sei denn, es liegt ein technischer Fehler vor.</p>

          <h2 className="text-foreground text-lg font-semibold">5. Haftung</h2>
          <p>Die Haftung beschränkt sich auf den Wert des Gutscheins. Für den Verlust des Gutscheins (PDF/Ausdruck) übernehmen wir keine Haftung.</p>

          <h2 className="text-foreground text-lg font-semibold">6. Gerichtsstand</h2>
          <p>Es gilt Schweizer Recht. Gerichtsstand ist Luzern.</p>
        </div>
      </div>
    </div>
  );
}
