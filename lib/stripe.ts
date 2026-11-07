import Stripe from "stripe";
import { getDb, schema } from "./db";
import { eq } from "drizzle-orm";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY nicht gesetzt");
    _stripe = new Stripe(key, { apiVersion: "2026-10-28.endive" });
  }
  return _stripe;
}

export function getStripeConnectAccount(tenantId: string): string | null {
  const db = getDb();
  const tenant = db
    .select({ stripeAccountId: schema.tenants.stripeAccountId })
    .from(schema.tenants)
    .where(eq(schema.tenants.id, tenantId))
    .get();
  return tenant?.stripeAccountId || null;
}

export function createCheckoutParams(opts: {
  gutscheinId: string;
  amount: number;
  tenantSlug: string;
  tenantName: string;
  kaeuferEmail: string;
  connectedAccountId?: string | null;
  platformFeePercent?: number;
  baseUrl: string;
}): Stripe.Checkout.SessionCreateParams {
  const unitAmount = Math.round(opts.amount * 100);

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    customer_email: opts.kaeuferEmail,
    line_items: [
      {
        price_data: {
          currency: "chf",
          unit_amount: unitAmount,
          product_data: {
            name: `Gutschein ${opts.tenantName}`,
            description: `Gutschein über CHF ${opts.amount.toFixed(2)} für ${opts.tenantName}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      gutscheinId: opts.gutscheinId,
      tenantSlug: opts.tenantSlug,
    },
    success_url: `${opts.baseUrl}/r/${opts.tenantSlug}/erfolg?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${opts.baseUrl}/r/${opts.tenantSlug}?cancelled=1`,
  };

  if (opts.connectedAccountId && opts.platformFeePercent) {
    params.payment_intent_data = {
      application_fee_amount: Math.round(unitAmount * (opts.platformFeePercent / 100)),
      transfer_data: {
        destination: opts.connectedAccountId,
      },
    };
  }

  return params;
}
