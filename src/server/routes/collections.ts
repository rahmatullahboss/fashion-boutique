import { Hono } from "hono";
import { createDb } from "../db";
import { collections, products } from "../db/schema";
import { eq } from "drizzle-orm";

type Env = {
  Bindings: {
    DATABASE_URL: string;
  };
};

export const collectionsRoute = new Hono<Env>();

// GET /api/collections — List all collections
collectionsRoute.get("/", async (c) => {
  const db = createDb(c.env.DATABASE_URL);
  const allCollections = await db.select().from(collections);
  return c.json({ collections: allCollections });
});

// GET /api/collections/:slug — Single collection with products
collectionsRoute.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const db = createDb(c.env.DATABASE_URL);

  const [collection] = await db
    .select()
    .from(collections)
    .where(eq(collections.slug, slug))
    .limit(1);

  if (!collection) {
    return c.json({ error: "Collection not found" }, 404);
  }

  const collectionProducts = await db
    .select()
    .from(products)
    .where(eq(products.collectionId, collection.id));

  return c.json({ collection: { ...collection, products: collectionProducts } });
});
