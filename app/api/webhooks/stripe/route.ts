import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[Webhook] STRIPE_WEBHOOK_SECRET nicht gesetzt");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  try {
    const { getStripe } = await import("@/lib/stripe");
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const gutscheinId = session.metadata?.gutscheinId;

      if (!gutscheinId) {
        console.error("[Webhook] Kein gutscheinId in metadata");
        return NextResponse.json({ received: true });
      }

      const db = getDb();
      const gutschein = db
        .select()
        .from(schema.gutscheine)
        .where(eq(schema.gutscheine.id, gutscheinId))
        .get();

      if (!gutschein) {
        console.error(`[Webhook] Gutschein ${gutscheinId} nicht gefunden`);
        return NextResponse.json({ received: true });
      }

      if (gutschein.status === "pending") {
        db.update(schema.gutscheine)
          .set({
            status: "paid",
            paidAt: new Date().toISOString(),
            stripePaymentIntentId: session.payment_intent as string || null,
          })
          .where(eq(schema.gutscheine.id, gutscheinId))
          .run();

        console.log(`[Webhook] Gutschein ${gutschein.code} bezahlt (CHF ${gutschein.amount})`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Webhook] Error:", err);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }
}
