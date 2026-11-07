import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin, createToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, tenantSlug } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "E-Mail und Passwort erforderlich." }, { status: 400 });
  }

  const user = authenticateAdmin(email, password, tenantSlug);
  if (!user) {
    return NextResponse.json({ error: "Ungültige Anmeldedaten." }, { status: 401 });
  }

  const token = await createToken(user);
  await setAuthCookie(token);

  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
}
