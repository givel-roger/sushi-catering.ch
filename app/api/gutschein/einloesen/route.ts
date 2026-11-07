import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { code, amount, note, secret } = await req.json();

    // Auth: JWT cookie OR legacy ADMIN_SECRET
    const { getAuthUser } = await import("@/lib/auth");
    const authUser = await getAuthUser();
    const legacyOk = secret && secret === process.env.ADMIN_SECRET;

    if (!authUser && !legacyOk) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!code || !amount || amount <= 0) {
      return NextResponse.json({ error: "Code und Betrag sind erforderlich." }, { status: 400 });
    }

    const db = getDb();

    const gutschein = db.select().from(schema.gutscheine).where(eq(schema.gutscheine.code, code)).get();
    if (!gutschein) {
      return NextResponse.json({ error: "Gutschein nicht gefunden." }, { status: 404 });
    }

    if (gutschein.status === "redeemed") {
      return NextResponse.json({ error: "Gutschein bereits vollständig eingelöst." }, { status: 400 });
    }

    if (amount > gutschein.remainingAmount) {
      return NextResponse.json(
        { error: `Restguthaben beträgt nur CHF ${gutschein.remainingAmount.toFixed(2)}.` },
        { status: 400 }
      );
    }

    const newRemaining = gutschein.remainingAmount - amount;
    const newStatus = newRemaining <= 0 ? "redeemed" : "partial";

    db.update(schema.gutscheine)
      .set({ remainingAmount: newRemaining, status: newStatus })
      .where(eq(schema.gutscheine.id, gutschein.id))
      .run();

    db.insert(schema.transactions).values({
      id: randomBytes(16).toString("hex"),
      gutscheinId: gutschein.id,
      tenantId: gutschein.tenantId,
      amount,
      note: note || "",
    }).run();

    return NextResponse.json({
      success: true,
      remainingAmount: newRemaining,
      status: newStatus,
    });
  } catch (err) {
    console.error("Einlösen error:", err);
    return NextResponse.json({ error: "Interner Fehler." }, { status: 500 });
  }
}
