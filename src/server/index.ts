import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { productsRoute } from "./routes/products";
import { collectionsRoute } from "./routes/collections";
import { lookbookRoute } from "./routes/lookbook";
import { checkoutRoutes } from "./routes/checkout";

type Env = {
  Bindings: {
    DATABASE_URL: string;
    ENVIRONMENT: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_PUBLISHABLE_KEY: string;
    SITE_URL: string;
  };
};

const app = new Hono<Env>();

// ─── Middleware ──────────────────────────────────────────────────
app.use("*", cors());

// ─── API Routes ─────────────────────────────────────────────────
app.route("/api/products", productsRoute);
app.route("/api/collections", collectionsRoute);
app.route("/api/lookbook", lookbookRoute);
app.route("/api/checkout", checkoutRoutes);

// ─── Health Check ───────────────────────────────────────────────
app.get("/api/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Global Error Handler ───────────────────────────────────────
app.onError(async (err, c) => {
  console.error(`[ERROR] ${err.message}`);
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json({ error: "Internal Server Error" }, 500);
});

export default app;
