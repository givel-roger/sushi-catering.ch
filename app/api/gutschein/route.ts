import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";

function generateCode(prefix: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(8);
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return `${prefix}-${code.slice(0, 4)}-${code.slice(4)}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, motif, widmung, kaeufer, tenantSlug } = body;

    const db = getDb();

    const slug = tenantSlug || "daniele";
    const tenant = db.select().from(schema.tenants).where(eq(schema.tenants.slug, slug)).get();
    if (!tenant) {
      return NextResponse.json({ error: "Tenant nicht gefunden." }, { status: 404 });
    }

    const minAmount = tenant.minAmount ?? 20;
    const maxAmount = tenant.maxAmount ?? 1000;
    if (!amount || amount < minAmount || amount > maxAmount) {
      return NextResponse.json(
        { error: `Betrag muss zwischen CHF ${minAmount} und CHF ${maxAmount} liegen.` },
        { status: 400 }
      );
    }

    if (!kaeufer?.name || !kaeufer?.email) {
      return NextResponse.json(
        { error: "Name und E-Mail sind Pflichtfelder." },
        { status: 400 }
      );
    }

    let code: string;
    do {
      code = generateCode(tenant.codePrefix);
    } while (db.select().from(schema.gutscheine).where(eq(schema.gutscheine.code, code)).get());

    const id = randomBytes(16).toString("hex");
    const now = new Date().toISOString();

    db.insert(schema.gutscheine).values({
      id,
      tenantId: tenant.id,
      code,
      amount,
      remainingAmount: amount,
      motif: motif || "elegant",
      widmungFuer: widmung?.fuer || "",
      widmungVon: widmung?.von || "",
      widmungNachricht: widmung?.nachricht || "",
      zustellung: widmung?.zustellung || "selbst",
      empfaengerEmail: widmung?.empfaengerEmail || "",
      kaeuferName: kaeufer.name,
      kaeuferEmail: kaeufer.email,
      status: "paid",
      createdAt: now,
      paidAt: now,
    }).run();

    return NextResponse.json({ success: true, code, id });
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

  const db = getDb();

  if (code) {
    const gutschein = db.select().from(schema.gutscheine).where(eq(schema.gutscheine.code, code)).get();
    if (!gutschein) {
      return NextResponse.json({ error: "Gutschein nicht gefunden." }, { status: 404 });
    }
    const txns = db.select().from(schema.transactions).where(eq(schema.transactions.gutscheinId, gutschein.id)).all();

    return NextResponse.json({
      ...gutschein,
      widmung: {
        fuer: gutschein.widmungFuer,
        von: gutschein.widmungVon,
        nachricht: gutschein.widmungNachricht,
        zustellung: gutschein.zustellung,
        empfaengerEmail: gutschein.empfaengerEmail,
      },
      kaeufer: {
        name: gutschein.kaeuferName,
        email: gutschein.kaeuferEmail,
      },
      transactions: txns.map(t => ({
        date: t.createdAt,
        amount: t.amount,
        note: t.note,
      })),
    });
  }

  const allGutscheine = db.select().from(schema.gutscheine).all();
  const allTxns = db.select().from(schema.transactions).all();

  return NextResponse.json(
    allGutscheine.map(g => {
      const txns = allTxns.filter(t => t.gutscheinId === g.id);
      return {
        ...g,
        widmung: {
          fuer: g.widmungFuer,
          von: g.widmungVon,
          nachricht: g.widmungNachricht,
          zustellung: g.zustellung,
          empfaengerEmail: g.empfaengerEmail,
        },
        kaeufer: {
          name: g.kaeuferName,
          email: g.kaeuferEmail,
        },
        transactions: txns.map(t => ({
          date: t.createdAt,
          amount: t.amount,
          note: t.note,
        })),
      };
    })
  );
}
