import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { inArray } from "drizzle-orm";
import Stripe from "stripe";
import { createDb } from "../db";
import { products, productVariants } from "../db/schema";
import { checkoutSchema } from "../schemas/checkout";
import { CheckoutValidationError, priceCheckoutCart } from "../checkout-logic";

type Env = {
  Bindings: {
    DATABASE_URL: string;
    STRIPE_SECRET_KEY: string;
    SITE_URL: string;
  };
};

export const checkoutRoutes = new Hono<Env>();

checkoutRoutes.post("/", zValidator("json", checkoutSchema), async (c) => {
  const { items, customerEmail } = c.req.valid("json");

  if (!c.env.DATABASE_URL || !c.env.STRIPE_SECRET_KEY || !c.env.SITE_URL) {
    throw new HTTPException(503, { message: "Checkout is not configured" });
  }

  let siteOrigin: string;
  try {
    const url = new URL(c.env.SITE_URL);
    if (url.protocol !== "https:" && !(url.protocol === "http:" && url.hostname === "localhost")) {
      throw new Error("Insecure store URL");
    }
    siteOrigin = url.origin;
  } catch {
    throw new HTTPException(503, { message: "Checkout is not configured" });
  }

  const db = createDb(c.env.DATABASE_URL);
  const productIds = [...new Set(items.map((item) => item.productId))];
  const [catalogProducts, catalogVariants] = await Promise.all([
    db.select().from(products).where(inArray(products.id, productIds)),
    db.select().from(productVariants).where(inArray(productVariants.productId, productIds)),
  ]);

  let validatedLines;
  try {
    validatedLines = priceCheckoutCart(items, catalogProducts, catalogVariants);
  } catch (error) {
    if (error instanceof CheckoutValidationError) {
      throw new HTTPException(400, { message: error.message });
    }
    throw error;
  }

  const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: validatedLines.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.productName, description: item.description },
        unit_amount: item.unitAmount,
      },
      quantity: item.quantity,
    })),
    ...(customerEmail ? { customer_email: customerEmail } : {}),
    shipping_address_collection: {
      allowed_countries: [
        "US", "GB", "CA", "AU", "BD", "IN", "PK", "AE", "SA", "QA", "KW",
        "BH", "OM", "MY", "ID", "SG", "FR", "DE", "NL", "SE", "NO", "DK",
        "CH", "IT", "ES", "PT", "JP", "KR", "NZ",
      ],
    },
    metadata: { source: "atelier-alabaster" },
    success_url: `${siteOrigin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteOrigin}/checkout`,
  });

  if (!session.url || !session.url.startsWith("https://checkout.stripe.com/")) {
    throw new HTTPException(502, { message: "Payment session unavailable" });
  }

  return c.json({ success: true, data: { checkoutUrl: session.url } });
});

checkoutRoutes.post("/verify", async (c) => {
  const body = await c.req.json().catch(() => null) as { sessionId?: unknown } | null;
  const sessionId = body?.sessionId;
  if (typeof sessionId !== "string" || !/^cs_(?:test_|live_)[A-Za-z0-9]+$/.test(sessionId)) {
    throw new HTTPException(400, { message: "Valid checkout session required" });
  }

  if (!c.env.STRIPE_SECRET_KEY) {
    throw new HTTPException(503, { message: "Checkout is not configured" });
  }
  const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  if (session.mode !== "payment" ||
      session.metadata?.source !== "atelier-alabaster" ||
      session.payment_status !== "paid") {
    throw new HTTPException(400, { message: "Payment not completed or session unavailable" });
  }

  const purchasedItems = session.line_items?.data.map((item) => ({
    name: item.description || "Item",
    quantity: item.quantity || 1,
    amount: item.amount_total || 0,
  })) || [];

  c.header("Cache-Control", "no-store");
  return c.json({
    success: true,
    data: {
      sessionId: session.id,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email || null,
      items: purchasedItems,
      total: session.amount_total || 0,
    },
  });
});
