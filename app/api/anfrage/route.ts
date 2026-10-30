import { NextResponse } from "next/server";

const YOROKOBI_API = "https://yorokobi.ch/personal/api/extern/anfrage";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const { name, email, phone, date, guests, typ, message } = data;
    if (!name || !email) {
      return NextResponse.json({ error: "Name und E-Mail sind Pflichtfelder." }, { status: 400 });
    }

    const typLabels: Record<string, string> = {
      live: "Catering mit Koch vor Ort",
      catering: "Catering (ohne Koch)",
      platte: "Sushi Platten (Lieferung)",
      workshop: "Sushi Workshop",
      beratung: "Noch offen — Beratung gewünscht",
    };

    const res = await fetch(YOROKOBI_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone: phone || "",
        date: date || "",
        guests: guests || "",
        typ: typLabels[typ] || typ || "",
        message: message || "",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: (err as Record<string, string>).error || "Fehler beim Weiterleiten" },
        { status: res.status },
      );
    }

    const result = await res.json();
    return NextResponse.json({ success: true, nummer: result.nummer });
  } catch {
    return NextResponse.json({ error: "Server-Fehler" }, { status: 500 });
  }
}
