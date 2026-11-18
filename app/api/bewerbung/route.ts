import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { answers, contact, stelle } = data;

    if (!contact?.name || !contact?.phone) {
      return NextResponse.json({ error: "Name und Telefon sind Pflichtfelder." }, { status: 400 });
    }

    console.log("Neue Bewerbung:", JSON.stringify({ stelle, answers, contact }, null, 2));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server-Fehler" }, { status: 500 });
  }
}
