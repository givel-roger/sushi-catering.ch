import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const { name, email, phone, date, guests, typ, message } = data;
    if (!name || !email) {
      return NextResponse.json({ error: "Name und E-Mail sind Pflichtfelder." }, { status: 400 });
    }

    const lead = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      timestamp: new Date().toISOString(),
      name,
      email,
      phone: phone || "",
      date: date || "",
      guests: guests || "",
      typ: typ || "live",
      message: message || "",
    };

    const leadsDir = path.join(process.cwd(), "data");
    const leadsFile = path.join(leadsDir, "leads.json");

    await fs.mkdir(leadsDir, { recursive: true });

    let leads: typeof lead[] = [];
    try {
      const existing = await fs.readFile(leadsFile, "utf-8");
      leads = JSON.parse(existing);
    } catch {
      // file doesn't exist yet
    }

    leads.push(lead);
    await fs.writeFile(leadsFile, JSON.stringify(leads, null, 2));

    return NextResponse.json({ success: true, id: lead.id });
  } catch {
    return NextResponse.json({ error: "Server-Fehler" }, { status: 500 });
  }
}
