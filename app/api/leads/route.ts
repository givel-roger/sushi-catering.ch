import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "leads");

export async function GET() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const files = await fs.readdir(DATA_DIR);
    const leads = [];

    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const content = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
      leads.push(JSON.parse(content));
    }

    leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(leads);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status, notes } = await req.json();
    if (!id) return NextResponse.json({ error: "ID erforderlich" }, { status: 400 });

    const filePath = path.join(DATA_DIR, `${id}.json`);
    const content = await fs.readFile(filePath, "utf-8");
    const lead = JSON.parse(content);

    if (status !== undefined) lead.status = status;
    if (notes !== undefined) lead.notes = notes;
    lead.updatedAt = new Date().toISOString();

    await fs.writeFile(filePath, JSON.stringify(lead, null, 2));
    return NextResponse.json(lead);
  } catch {
    return NextResponse.json({ error: "Lead nicht gefunden" }, { status: 404 });
  }
}
