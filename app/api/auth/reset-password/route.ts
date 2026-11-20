import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { admins, passwordResetTokens } from "@/lib/schema";
import { eq, and, isNull } from "drizzle-orm";
import { hashSync } from "bcryptjs";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  if (!token || !password) {
    return NextResponse.json({ error: "Token und Passwort erforderlich." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Passwort muss mindestens 8 Zeichen lang sein." }, { status: 400 });
  }

  const db = getDb();
  const resetToken = db
    .select()
    .from(passwordResetTokens)
    .where(and(eq(passwordResetTokens.token, token), isNull(passwordResetTokens.usedAt)))
    .get();

  if (!resetToken) {
    return NextResponse.json({ error: "Ungültiger oder bereits verwendeter Link." }, { status: 400 });
  }

  if (new Date(resetToken.expiresAt) < new Date()) {
    return NextResponse.json({ error: "Der Link ist abgelaufen. Bitte fordern Sie einen neuen an." }, { status: 400 });
  }

  const passwordHash = hashSync(password, 10);
  db.update(admins).set({ passwordHash }).where(eq(admins.id, resetToken.adminId)).run();
  db.update(passwordResetTokens)
    .set({ usedAt: new Date().toISOString() })
    .where(eq(passwordResetTokens.id, resetToken.id))
    .run();

  return NextResponse.json({ ok: true });
}
