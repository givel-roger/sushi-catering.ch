import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const GUTSCHEINE_FILE = join(process.cwd(), "data", "gutscheine.json");

export async function POST(req: NextRequest) {
  try {
    const { code, amount, note, secret } = await req.json();

    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!code || !amount || amount <= 0) {
      return NextResponse.json({ error: "Code und Betrag sind erforderlich." }, { status: 400 });
    }

    const data = await readFile(GUTSCHEINE_FILE, "utf-8");
    const gutscheine = JSON.parse(data);
    const idx = gutscheine.findIndex((g: { code: string }) => g.code === code);

    if (idx === -1) {
      return NextResponse.json({ error: "Gutschein nicht gefunden." }, { status: 404 });
    }

    const gutschein = gutscheine[idx];

    if (gutschein.status === "redeemed") {
      return NextResponse.json({ error: "Gutschein bereits vollständig eingelöst." }, { status: 400 });
    }

    if (amount > gutschein.remainingAmount) {
      return NextResponse.json(
        { error: `Restguthaben beträgt nur CHF ${gutschein.remainingAmount.toFixed(2)}.` },
        { status: 400 }
      );
    }

    gutschein.remainingAmount -= amount;
    gutschein.transactions.push({
      date: new Date().toISOString(),
      amount,
      note: note || "",
    });

    if (gutschein.remainingAmount <= 0) {
      gutschein.status = "redeemed";
    } else {
      gutschein.status = "partial";
    }

    gutscheine[idx] = gutschein;
    await writeFile(GUTSCHEINE_FILE, JSON.stringify(gutscheine, null, 2));

    return NextResponse.json({
      success: true,
      remainingAmount: gutschein.remainingAmount,
      status: gutschein.status,
    });
  } catch (err) {
    console.error("Einlösen error:", err);
    return NextResponse.json({ error: "Interner Fehler." }, { status: 500 });
  }
}
