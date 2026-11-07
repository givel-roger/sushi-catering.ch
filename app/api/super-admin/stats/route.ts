import { NextResponse } from "next/server";
import { getDb, schema } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { sql } from "drizzle-orm";

export async function GET() {
  const user = await getAuthUser();
  if (!user || user.role !== "superadmin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();

  const tenantCount = db.select({ count: sql<number>`count(*)` }).from(schema.tenants).get()?.count || 0;
  const gutscheinCount = db.select({ count: sql<number>`count(*)` }).from(schema.gutscheine).get()?.count || 0;
  const totalRevenue = db.select({ total: sql<number>`coalesce(sum(amount), 0)` }).from(schema.gutscheine).get()?.total || 0;
  const paidGutscheine = db
    .select({ count: sql<number>`count(*)`, total: sql<number>`coalesce(sum(amount), 0)` })
    .from(schema.gutscheine)
    .where(sql`status != 'pending'`)
    .get();
  const redeemedTotal = db
    .select({ total: sql<number>`coalesce(sum(amount), 0)` })
    .from(schema.transactions)
    .get()?.total || 0;

  return NextResponse.json({
    tenantCount,
    gutscheinCount,
    paidGutscheine: paidGutscheine?.count || 0,
    totalRevenue: paidGutscheine?.total || 0,
    redeemedTotal,
  });
}
