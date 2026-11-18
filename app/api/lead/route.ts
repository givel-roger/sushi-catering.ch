import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "leads");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { stelle, name, email, phone, data, score, scoreLabel, source, medium } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Name, E-Mail und Telefon sind Pflichtfelder." }, { status: 400 });
    }

    const lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      stelle: stelle || "Teamleiter Operativer Einkauf",
      name,
      email: email.trim(),
      phone: phone.trim(),
      data: data || {},
      score: score || 0,
      scoreLabel: scoreLabel || "Prüfen",
      source: source || "operativer-einkauf.ch",
      medium: medium || "website",
      status: "neu",
      notes: "",
      createdAt: new Date().toISOString(),
    };

    await fs.mkdir(DATA_DIR, { recursive: true });
    const filePath = path.join(DATA_DIR, `${lead.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(lead, null, 2));

    // E-Mail-Benachrichtigung an Bachmann HR
    try {
      await fetch("https://yorokobi.ch/personal/api/extern/anfrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          typ: `Bewerbung: ${stelle || "Teamleiter Operativer Einkauf"}`,
          message: `Score: ${score} (${scoreLabel})\n\nErfahrung: ${data?.Erfahrung || "-"}\nFührung: ${data?.["Führungserfahrung"] || "-"}\nSprachen: ${data?.Sprachen || "-"}\nNachricht: ${data?.Nachricht || "-"}\nQuelle: ${data?.Werbequelle || "direkt"} ${data?.Kampagne || ""}`.trim(),
        }),
      });
    } catch { /* notification is best-effort */ }

    return NextResponse.json({ success: true, id: lead.id });
  } catch {
    return NextResponse.json({ error: "Server-Fehler" }, { status: 500 });
  }
}
