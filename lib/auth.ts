import { compareSync } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { getDb } from "./db";
import { admins, tenants } from "./schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.ADMIN_SECRET || "gutschein-dev-secret-change-me"
);
const TOKEN_COOKIE = "gs_token";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "staff" | "superadmin";
  tenantId: string | null;
};

export async function createToken(user: AuthUser): Promise<string> {
  return new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    tenantId: user.tenantId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_MAX_AGE}s`)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as AuthUser["role"],
      tenantId: (payload.tenantId as string) || null,
    };
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const jar = await cookies();
  jar.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_MAX_AGE,
  });
}

export async function clearAuthCookie() {
  const jar = await cookies();
  jar.delete(TOKEN_COOKIE);
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const jar = await cookies();
  const token = jar.get(TOKEN_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function authenticateAdmin(
  email: string,
  password: string,
  tenantSlug?: string
): AuthUser | null {
  const db = getDb();
  const conditions = [eq(admins.email, email)];

  const adminRows = db.select().from(admins).where(and(...conditions)).all();
  if (adminRows.length === 0) return null;

  const admin = adminRows[0];
  if (!compareSync(password, admin.passwordHash)) return null;

  if (tenantSlug && admin.tenantId) {
    const tenant = db
      .select({ slug: tenants.slug })
      .from(tenants)
      .where(eq(tenants.id, admin.tenantId))
      .get();
    if (tenant && tenant.slug !== tenantSlug) return null;
  }

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role as AuthUser["role"],
    tenantId: admin.tenantId,
  };
}
