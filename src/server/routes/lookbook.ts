import { Hono } from "hono";
import { createDb } from "../db";
import { lookbookEntries } from "../db/schema";

type Env = {
  Bindings: {
    DATABASE_URL: string;
  };
};

export const lookbookRoute = new Hono<Env>();

// GET /api/lookbook — List all lookbook entries
lookbookRoute.get("/", async (c) => {
  const db = createDb(c.env.DATABASE_URL);
  const entries = await db.select().from(lookbookEntries);
  return c.json({ entries });
});
