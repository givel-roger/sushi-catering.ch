import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const GUTSCHEINE_FILE = join(DATA_DIR, "gutscheine.json");

interface Gutschein {
  id: string;
  code: string;
  amount: number;
  remainingAmount: number;
  motif: string;
  widmung: {
    fuer: string;
    von: string;
    nachricht: string;
    zustellung: "selbst" | "direkt";
    empfaengerEmail: string;
  };
  kaeufer: {
    name: string;
    email: string;
  };
  status: "pending" | "paid" | "redeemed" | "partial";
  createdAt: string;
  paidAt: string | null;
  transactions: { date: string; amount: number; note: string }[];
}

async function loadGutscheine(): Promise<Gutschein[]> {
  try {
    const data = await readFile(GUTSCHEINE_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveGutscheine(gutscheine: Gutschein[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(GUTSCHEINE_FILE, JSON.stringify(gutscheine, null, 2));
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(8);
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return `DN-${code.slice(0, 4)}-${code.slice(4)}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, motif, widmung, kaeufer } = body;

    if (!amount || amount < 20 || amount > 1000) {
      return NextResponse.json(
        { error: "Betrag muss zwischen CHF 20 und CHF 1000 liegen." },
        { status: 400 }
      );
    }

    if (!kaeufer?.name || !kaeufer?.email) {
      return NextResponse.json(
        { error: "Name und E-Mail sind Pflichtfelder." },
        { status: 400 }
      );
    }

    const gutscheine = await loadGutscheine();

    let code: string;
    do {
      code = generateCode();
    } while (gutscheine.some((g) => g.code === code));

    const gutschein: Gutschein = {
      id: randomBytes(16).toString("hex"),
      code,
      amount,
      remainingAmount: amount,
      motif: motif || "elegant",
      widmung: {
        fuer: widmung?.fuer || "",
        von: widmung?.von || "",
        nachricht: widmung?.nachricht || "",
        zustellung: widmung?.zustellung || "selbst",
        empfaengerEmail: widmung?.empfaengerEmail || "",
      },
      kaeufer: {
        name: kaeufer.name,
        email: kaeufer.email,
      },
      status: "paid",
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
      transactions: [],
    };

    gutscheine.push(gutschein);
    await saveGutscheine(gutscheine);

    return NextResponse.json({
      success: true,
      code: gutschein.code,
      id: gutschein.id,
    });
  } catch (err) {
    console.error("Gutschein creation error:", err);
    return NextResponse.json(
      { error: "Interner Fehler beim Erstellen des Gutscheins." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const secret = searchParams.get("secret");

  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gutscheine = await loadGutscheine();

  if (code) {
    const gutschein = gutscheine.find((g) => g.code === code);
    if (!gutschein) {
      return NextResponse.json({ error: "Gutschein nicht gefunden." }, { status: 404 });
    }
    return NextResponse.json(gutschein);
  }

  return NextResponse.json(gutscheine);
}
