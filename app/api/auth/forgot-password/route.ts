import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { admins, passwordResetTokens } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { sendEmail, passwordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "E-Mail erforderlich." }, { status: 400 });
  }

  const db = getDb();
  const admin = db.select().from(admins).where(eq(admins.email, email)).get();

  // Always return success to prevent email enumeration
  if (!admin) {
    return NextResponse.json({ ok: true });
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 3600_000).toISOString(); // 1 hour

  db.insert(passwordResetTokens).values({
    id: randomBytes(16).toString("hex"),
    adminId: admin.id,
    token,
    expiresAt,
  }).run();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://gutschein-schenken.ch";
  const resetUrl = `${baseUrl}/passwort-reset?token=${token}`;
  const { subject, html } = passwordResetEmail(resetUrl);
  await sendEmail(email, subject, html);

  return NextResponse.json({ ok: true });
}
