"use client";

import { useState, useRef } from "react";

type FieldType = "text" | "email" | "tel" | "url" | "select" | "textarea" | "file" | "checkbox";

interface Field {
  id: string;
  label: string;
  hint?: string;
  required: boolean;
  type: FieldType;
  placeholder?: string;
  options?: string[];
}

interface Section {
  category: string;
  description?: string;
  fields: Field[];
}

const SECTIONS: Section[] = [
  {
    category: "Betriebsdaten",
    fields: [
      { id: "betriebsname", label: "Betriebsname (offiziell)", hint: "Wie im Handelsregister eingetragen", required: true, type: "text", placeholder: "z.B. Ristorante Daniele GmbH" },
      { id: "rechtsform", label: "Rechtsform", required: true, type: "select", options: ["Einzelfirma", "GmbH", "AG", "Kollektivgesellschaft", "Verein", "Genossenschaft", "Andere"] },
      { id: "geschaeftsfuehrer", label: "Geschäftsführer/in oder Inhaber/in", hint: "Erscheint im Impressum Ihres Shops", required: true, type: "text", placeholder: "Vor- und Nachname" },
      { id: "strasse", label: "Strasse + Nr.", required: true, type: "text", placeholder: "Musterstrasse 12" },
      { id: "plz_ort", label: "PLZ + Ort", required: true, type: "text", placeholder: "6003 Luzern" },
      { id: "telefon", label: "Telefon", hint: "Wird auf der Shop-Seite angezeigt", required: false, type: "tel", placeholder: "041 123 45 67" },
      { id: "email_betrieb", label: "E-Mail (Betrieb)", hint: "Für Kundenanfragen zum Gutschein", required: true, type: "email", placeholder: "info@ihr-betrieb.ch" },
      { id: "website", label: "Website", hint: "Falls vorhanden — wird verlinkt", required: false, type: "url", placeholder: "https://www.ihr-betrieb.ch" },
    ],
  },
  {
    category: "Recht & Steuern",
    fields: [
      { id: "uid", label: "UID-Nummer", hint: "Finden Sie unter zefix.ch oder auf Ihrer MwSt-Abrechnung", required: true, type: "text", placeholder: "CHE-123.456.789" },
      { id: "mwst_nr", label: "MwSt-Nummer", hint: "Falls MwSt-pflichtig (ab CHF 100'000 Umsatz)", required: false, type: "text", placeholder: "CHE-123.456.789 MWST" },
      { id: "mwst_satz", label: "MwSt-Satz auf Gutscheinen", hint: "Gutscheine sind Mehrzweckgutscheine — MwSt fällt erst bei Einlösung an", required: true, type: "select", options: ["8.1% (Normalsatz)", "3.8% (Gastgewerbe / Beherbergung)", "2.6% (reduzierter Satz)", "Nicht MwSt-pflichtig", "Unsicher — bitte beraten"] },
    ],
  },
  {
    category: "Zahlungen (Stripe)",
    description: "Für die Online-Bezahlung nutzen wir Stripe. Wir senden Ihnen einen Einladungs-Link — die Registrierung dauert wenige Minuten.",
    fields: [
      { id: "stripe_bereit", label: "Stripe-Konto: Ich bin bereit für die Registrierung", hint: "Sie erhalten von uns den Einladungs-Link. Stripe prüft Ihre Identität und Bankverbindung.", required: true, type: "checkbox" },
      { id: "iban", label: "IBAN (für Auszahlungen)", hint: "Wird bei der Stripe-Registrierung hinterlegt", required: true, type: "text", placeholder: "CH93 0076 2011 6238 5295 7" },
      { id: "ausweis_bereit", label: "Ausweisdokument: Pass oder ID liegt bereit", hint: "Stripe verlangt eine Identitätsprüfung des Kontoinhabers", required: true, type: "checkbox" },
    ],
  },
  {
    category: "Branding",
    fields: [
      { id: "logo", label: "Logo", hint: "PNG mit transparentem Hintergrund oder SVG, mind. 400px breit", required: true, type: "file" },
      { id: "logo_dark", label: "Logo für dunklen Hintergrund", hint: "Falls Ihr Logo auf Dunkel anders aussehen soll (z.B. weisse Version)", required: false, type: "file" },
      { id: "hauptfarbe", label: "Hauptfarbe (Hex-Code)", hint: "Wird für Buttons und Akzente verwendet", required: true, type: "text", placeholder: "#c8962e" },
      { id: "hero_bild", label: "Hero-Bild", hint: "Grosses Foto für Ihre Shop-Startseite, mind. 1200×800px, JPG Querformat", required: true, type: "file" },
    ],
  },
  {
    category: "Gutschein-Einstellungen",
    fields: [
      { id: "betraege", label: "Betrags-Vorschläge (CHF)", hint: "Der Kunde kann zusätzlich einen freien Betrag wählen", required: true, type: "text", placeholder: "50, 100, 150, 200, 250" },
      { id: "min_betrag", label: "Mindestbetrag", hint: "Standard: CHF 20", required: false, type: "text", placeholder: "20" },
      { id: "max_betrag", label: "Maximalbetrag", hint: "Standard: CHF 1'000", required: false, type: "text", placeholder: "1000" },
      { id: "kuerzel", label: "Gutschein-Kürzel", hint: "2–3 Buchstaben für den Code, z.B. DN → DN-A3K2-B8M1", required: true, type: "text", placeholder: "DN" },
      { id: "gueltigkeit", label: "Gültigkeit", required: false, type: "select", options: ["Unbeschränkt (kein Verfalldatum)", "1 Jahr", "2 Jahre", "3 Jahre", "Andere (bitte im Feld unten angeben)"] },
      { id: "einloesebedingungen", label: "Einlösebedingungen", hint: "Falls besondere Regeln gelten", required: false, type: "textarea", placeholder: "z.B. «Nicht einlösbar auf Takeaway» oder «Nur im Restaurant vor Ort»" },
    ],
  },
  {
    category: "Texte für Ihren Shop",
    fields: [
      { id: "shop_titel", label: "Shop-Titel", hint: "Hauptüberschrift auf Ihrer Shop-Seite", required: true, type: "text", placeholder: "Schenken Sie Genuss" },
      { id: "shop_untertitel", label: "Shop-Untertitel", hint: "Kurzer Beschrieb unter dem Titel", required: true, type: "text", placeholder: "Gutscheine für unser Restaurant in Luzern" },
      { id: "stichworte", label: "3–4 Stichworte", hint: "Werden als Vorteile angezeigt", required: false, type: "text", placeholder: "Sofort per Mail, Ohne Verfalldatum, Persönliche Widmung" },
    ],
  },
  {
    category: "Admin-Zugang",
    fields: [
      { id: "admin_email", label: "Admin E-Mail", hint: "Login für Ihr Verwaltungs-Panel (Gutscheine verwalten und einlösen)", required: true, type: "email", placeholder: "admin@ihr-betrieb.ch" },
      { id: "kontaktperson", label: "Name der Kontaktperson", hint: "Ansprechperson für technische Fragen", required: true, type: "text", placeholder: "Vor- und Nachname" },
    ],
  },
];

export default function OnboardingForm() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const allFields = SECTIONS.flatMap((s) => s.fields);
  const requiredFields = allFields.filter((f) => f.required);
  const filledRequired = requiredFields.filter((f) => {
    if (f.type === "checkbox") return checked[f.id];
    if (f.type === "file") return !!fileNames[f.id];
    return !!values[f.id]?.trim();
  });
  const progress = requiredFields.length > 0 ? Math.round((filledRequired.length / requiredFields.length) * 100) : 0;

  const set = (id: string, val: string) => setValues((prev) => ({ ...prev, [id]: val }));
  const toggle = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  const setFile = (id: string, name: string) => setFileNames((prev) => ({ ...prev, [id]: name }));

  function generateSummary(): string {
    let text = "ONBOARDING — GUTSCHEIN-SHOP\n";
    text += "============================\n";
    text += `Datum: ${new Date().toLocaleDateString("de-CH")}\n\n`;

    for (const section of SECTIONS) {
      text += `${section.category.toUpperCase()}\n`;
      text += "----------------------------\n";
      for (const field of section.fields) {
        const val =
          field.type === "checkbox"
            ? checked[field.id] ? "Ja" : "Nein"
            : field.type === "file"
              ? fileNames[field.id] || "(noch nicht bereit)"
              : values[field.id] || "(offen)";
        text += `${field.label}: ${val}\n`;
      }
      text += "\n";
    }

    text += "----------------------------\n";
    text += "Dateien bitte separat an info@marktindex.ch senden:\n";
    text += "- Logo (PNG/SVG)\n";
    text += "- Hero-Bild (JPG, mind. 1200×800)\n";
    if (fileNames["logo_dark"]) text += "- Logo für dunklen Hintergrund\n";
    text += "\nBitte senden Sie dieses Dokument zusammen mit den Dateien an:\ninfo@marktindex.ch\n";

    return text;
  }

  function handleDownload() {
    const text = generateSummary();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const name = values["betriebsname"]?.trim().replace(/[^a-zA-Z0-9äöüÄÖÜ\s-]/g, "").replace(/\s+/g, "-") || "Betrieb";
    a.download = `Onboarding-${name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleEmail() {
    const text = generateSummary();
    const subject = encodeURIComponent(`Onboarding Gutschein-Shop: ${values["betriebsname"] || "Neuer Betrieb"}`);
    const body = encodeURIComponent(text);
    window.location.href = `mailto:info@marktindex.ch?subject=${subject}&body=${body}`;
  }

  return (
    <>
      {/* Progress */}
      <div className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-sm border-b border-[#e8e3d8] py-3">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-[#999]">
              {filledRequired.length} von {requiredFields.length} Pflichtfeldern ausgefüllt
            </span>
            <span className="text-[13px] font-medium">{progress}%</span>
          </div>
          <div className="h-1.5 bg-[#e8e3d8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1a1a1a] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div ref={formRef}>
        {/* Prozess */}
        <div className="grid sm:grid-cols-3 gap-8 mb-20 pb-16 border-b border-[#e8e3d8]">
          {[
            { nr: "1", title: "Formular ausfüllen", text: "Füllen Sie die Felder unten aus — Pflichtfelder sind markiert." },
            { nr: "2", title: "Absenden", text: "Klicken Sie auf «Per E-Mail senden» oder laden Sie die Zusammenfassung herunter." },
            { nr: "3", title: "Shop ist online", text: "Innerhalb von 24h richten wir Ihren Shop ein. 5% Provision pro Verkauf." },
          ].map((step) => (
            <div key={step.nr}>
              <div className="w-8 h-8 bg-[#1a1a1a] text-white text-[13px] font-medium flex items-center justify-center mb-4">
                {step.nr}
              </div>
              <h3 className="text-[16px] font-medium mb-2">{step.title}</h3>
              <p className="text-[#999] text-[14px] leading-[1.6]">{step.text}</p>
            </div>
          ))}
        </div>

        {/* Form Sections */}
        <div className="space-y-16">
          {SECTIONS.map((section) => (
            <div key={section.category}>
              <h3 className="text-[13px] font-medium uppercase tracking-[0.1em] text-[#999] mb-2">
                {section.category}
              </h3>
              {section.description && (
                <p className="text-[#999] text-[14px] leading-[1.6] mb-6">{section.description}</p>
              )}
              <div className="space-y-5">
                {section.fields.map((field) => (
                  <div key={field.id}>
                    <label className="flex items-baseline gap-2 mb-1.5">
                      <span className="text-[15px] font-medium">{field.label}</span>
                      {field.required && <span className="text-[#c8962e] text-[12px]">Pflicht</span>}
                    </label>
                    {field.hint && (
                      <p className="text-[#aaa] text-[13px] mb-2">{field.hint}</p>
                    )}

                    {field.type === "checkbox" ? (
                      <button
                        type="button"
                        onClick={() => toggle(field.id)}
                        className={`flex items-center gap-3 w-full text-left py-3 px-4 border transition-colors ${
                          checked[field.id]
                            ? "border-[#1a1a1a] bg-[#1a1a1a]/[0.03]"
                            : "border-[#ddd] hover:border-[#bbb]"
                        }`}
                      >
                        <div className={`w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          checked[field.id] ? "border-[#1a1a1a] bg-[#1a1a1a]" : "border-[#ccc]"
                        }`}>
                          {checked[field.id] && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-[14px]">
                          {checked[field.id] ? "Ja, bestätigt" : "Bitte bestätigen"}
                        </span>
                      </button>
                    ) : field.type === "select" ? (
                      <select
                        value={values[field.id] || ""}
                        onChange={(e) => set(field.id, e.target.value)}
                        className="w-full border border-[#ddd] bg-white py-3 px-4 text-[14px] focus:outline-none focus:border-[#1a1a1a] transition-colors appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23999' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: "right 12px center", backgroundRepeat: "no-repeat", backgroundSize: "20px" }}
                      >
                        <option value="">Bitte wählen...</option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        value={values[field.id] || ""}
                        onChange={(e) => set(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full border border-[#ddd] bg-white py-3 px-4 text-[14px] focus:outline-none focus:border-[#1a1a1a] transition-colors resize-none placeholder:text-[#ccc]"
                      />
                    ) : field.type === "file" ? (
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer border border-dashed border-[#ccc] hover:border-[#999] py-3 px-4 text-[14px] text-[#999] transition-colors flex-1 text-center">
                          {fileNames[field.id] ? (
                            <span className="text-[#1a1a1a]">{fileNames[field.id]}</span>
                          ) : (
                            "Datei auswählen..."
                          )}
                          <input
                            type="file"
                            className="hidden"
                            accept={field.id.includes("logo") ? ".png,.svg,.jpg,.jpeg" : ".jpg,.jpeg,.png,.webp"}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setFile(field.id, file.name);
                            }}
                          />
                        </label>
                        {fileNames[field.id] && (
                          <button
                            type="button"
                            onClick={() => setFile(field.id, "")}
                            className="text-[#999] hover:text-[#1a1a1a] text-[13px]"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        value={values[field.id] || ""}
                        onChange={(e) => set(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full border border-[#ddd] bg-white py-3 px-4 text-[14px] focus:outline-none focus:border-[#1a1a1a] transition-colors placeholder:text-[#ccc]"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Info Boxes */}
        <div className="mt-16 bg-[#f3f0ea] p-8">
          <h3 className="font-medium text-[16px] mb-3">Dateien &amp; Formate</h3>
          <ul className="text-[#777] text-[14px] leading-[1.8] space-y-1">
            <li><strong>Logo:</strong> PNG mit transparentem Hintergrund oder SVG. Mindestens 400px breit.</li>
            <li><strong>Hero-Bild:</strong> JPG oder PNG, Querformat, mindestens 1200 &times; 800 Pixel.</li>
            <li><strong>Farbe:</strong> Hex-Code (z.B. #c8962e). Nutzen Sie ein Tool wie <span className="text-[#1a1a1a]">coolors.co</span>.</li>
            <li><strong>UID-Nummer:</strong> Finden Sie unter <span className="text-[#1a1a1a]">zefix.ch</span> (Handelsregister).</li>
          </ul>
        </div>

        <div className="mt-6 bg-[#f3f0ea] p-8">
          <h3 className="font-medium text-[16px] mb-3">Wie funktioniert die Bezahlung?</h3>
          <div className="text-[#777] text-[14px] leading-[1.8] space-y-3">
            <p>
              Käufer bezahlen online mit Kreditkarte, Twint oder anderen Zahlungsmitteln via <strong className="text-[#1a1a1a]">Stripe</strong>.
              Das Geld fliesst direkt auf Ihr Bankkonto — abzüglich 5% Plattform-Provision und der Stripe-Gebühren
              (ca. 2.9% + CHF 0.30 pro Transaktion).
            </p>
            <p>
              Wir senden Ihnen einen <strong className="text-[#1a1a1a]">persönlichen Einladungs-Link</strong> —
              halten Sie dafür Ihren Ausweis (Pass oder ID) und Ihre IBAN bereit.
            </p>
          </div>
        </div>

        {/* Was Sie bekommen */}
        <div className="mt-12 mb-8">
          <h3 className="font-medium text-[16px] mb-4">Was Sie von uns bekommen</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Eigene Shop-Seite mit Ihrem Branding",
              "Admin-Panel zum Verwalten und Einlösen",
              "QR-Code Scanner-App fürs Handy",
              "iframe-Code für Ihre Website",
              "PDF-Gutscheine mit Logo, per Mail",
              "Online-Bezahlung via Stripe",
              "Eigenes Impressum und AGB",
              "Support bei Einrichtung und Betrieb",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-[14px] text-[#777]">
                <span className="text-[#1a1a1a] mt-0.5">&#10003;</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        {!submitted ? (
          <div className="border-t border-[#e8e3d8] pt-12 mt-12">
            <div className="text-center">
              <p className="text-[#777] text-[15px] mb-2">
                {progress === 100
                  ? "Alles ausgefüllt — bereit zum Absenden!"
                  : `Noch ${requiredFields.length - filledRequired.length} Pflichtfelder offen.`}
              </p>
              <p className="text-[#aaa] text-[13px] mb-8">
                Die Dateien (Logo, Hero-Bild) senden Sie separat als Anhang an die gleiche Adresse.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => { handleEmail(); setSubmitted(true); }}
                  className="text-[14px] font-medium bg-[#1a1a1a] text-white px-8 py-4 hover:bg-[#333] transition-colors"
                >
                  Per E-Mail senden
                </button>
                <button
                  onClick={handleDownload}
                  className="text-[14px] font-medium border border-[#ddd] text-[#1a1a1a] px-8 py-4 hover:border-[#999] transition-colors"
                >
                  Zusammenfassung herunterladen
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-t border-[#e8e3d8] pt-12 mt-12 text-center">
            <div className="w-16 h-16 bg-[#1a1a1a] text-white flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-display text-2xl mb-3">Vielen Dank!</h3>
            <p className="text-[#777] text-[15px] mb-2">
              Ihr Mail-Programm sollte sich geöffnet haben. Bitte senden Sie die E-Mail ab
              und hängen Sie die Dateien (Logo, Hero-Bild) an.
            </p>
            <p className="text-[#aaa] text-[13px] mb-8">
              Innerhalb von 24 Stunden ist Ihr Shop online.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleDownload}
                className="text-[14px] font-medium border border-[#ddd] text-[#1a1a1a] px-8 py-4 hover:border-[#999] transition-colors"
              >
                Zusammenfassung herunterladen
              </button>
              <button
                onClick={() => setSubmitted(false)}
                className="text-[14px] text-[#999] hover:text-[#1a1a1a] px-8 py-4 transition-colors"
              >
                Zurück zum Formular
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
