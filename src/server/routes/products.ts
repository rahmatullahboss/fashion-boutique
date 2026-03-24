import { Hono } from "hono";
import { createDb } from "../db";
import { products, productVariants, productImages } from "../db/schema";
import { eq, ne, and } from "drizzle-orm";

type Env = {
  Bindings: {
    DATABASE_URL: string;
  };
};

export const productsRoute = new Hono<Env>();

// GET /api/products — List all products
productsRoute.get("/", async (c) => {
  const db = createDb(c.env.DATABASE_URL);
  const category = c.req.query("category");

  // For now, simple query
  const allProducts = await db.select().from(products);

  // Get primary images for each product
  const allImages = await db.select().from(productImages);

  const productsWithImages = allProducts.map((p) => ({
    ...p,
    images: allImages.filter((img) => img.productId === p.id),
  }));

  const filtered = category
    ? productsWithImages.filter((p) => p.category === category)
    : productsWithImages;

  return c.json({ products: filtered });
});

// GET /api/products/:slug — Single product with variants & images
productsRoute.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const db = createDb(c.env.DATABASE_URL);

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (!product) {
    return c.json({ error: "Product not found" }, 404);
  }

  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, product.id));

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, product.id));

  // Fetch related products: same category first, then fill with others
  const sameCategory = product.category
    ? await db
        .select()
        .from(products)
        .where(and(eq(products.category, product.category), ne(products.id, product.id)))
        .limit(7)
    : [];

  const sameCategoryIds = new Set(sameCategory.map((r) => r.id));
  sameCategoryIds.add(product.id);

  const otherProducts = await db
    .select()
    .from(products)
    .limit(20);

  const others = otherProducts.filter((p) => !sameCategoryIds.has(p.id));
  const combined = [...sameCategory, ...others].slice(0, 7);

  const allRelatedImages = combined.length
    ? await db.select().from(productImages)
    : [];

  const relatedProducts = combined.map((r) => ({
    ...r,
    image:
      allRelatedImages.find((img) => img.productId === r.id && img.isPrimary)?.url ||
      allRelatedImages.find((img) => img.productId === r.id)?.url ||
      null,
  }));

  return c.json({
    product: { ...product, variants, images },
    relatedProducts,
  });
});
