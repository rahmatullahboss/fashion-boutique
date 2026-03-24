import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import Stripe from "stripe";
import { checkoutSchema } from "../schemas/checkout";

type Env = {
  Bindings: {
    STRIPE_SECRET_KEY: string;
    STRIPE_PUBLISHABLE_KEY: string;
    SITE_URL: string;
  };
};

export const checkoutRoutes = new Hono<Env>();

// POST /api/checkout — Create Stripe Checkout Session
checkoutRoutes.post(
  "/",
  zValidator("json", checkoutSchema),
  async (c) => {
    const { items } = c.req.valid("json");
    const siteUrl = c.env.SITE_URL;

    const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      items.map((item) => {
        // Convert relative image URLs to absolute
        let imageUrl: string | undefined;
        if (item.image) {
          imageUrl = item.image.startsWith("http")
            ? item.image
            : `${siteUrl}${item.image}`;
        }

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              ...(imageUrl ? { images: [imageUrl] } : {}),
              ...(item.size || item.color
                ? {
                    description: [item.color, item.size]
                      .filter(Boolean)
                      .join(" / "),
                  }
                : {}),
            },
            unit_amount: item.price,
          },
          quantity: item.quantity,
        };
      });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
    });

    return c.json({
      success: true,
      data: { checkoutUrl: session.url },
    });
  }
);

// POST /api/checkout/verify — Verify payment after redirect
checkoutRoutes.post("/verify", async (c) => {
  const { sessionId } = (await c.req.json()) as { sessionId: string };

  if (!sessionId) {
    throw new HTTPException(400, { message: "Session ID required" });
  }

  const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  if (!session || session.payment_status !== "paid") {
    throw new HTTPException(400, { message: "Payment not completed" });
  }

  // Extract purchased items from session
  const purchasedItems =
    session.line_items?.data.map((item) => ({
      name: item.description || "Item",
      quantity: item.quantity || 1,
      amount: item.amount_total || 0,
    })) || [];

  return c.json({
    success: true,
    data: {
      sessionId: session.id,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email || null,
      shippingAddress: (session as unknown as Record<string, unknown>).shipping_details
        ? ((session as unknown as Record<string, { address?: unknown }>).shipping_details?.address ?? null)
        : null,
      items: purchasedItems,
      total: session.amount_total || 0,
    },
  });
});
