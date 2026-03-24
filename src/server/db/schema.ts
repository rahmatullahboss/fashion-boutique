import { pgTable, text, integer, boolean, timestamp, serial } from "drizzle-orm/pg-core";

// ─── Collections ────────────────────────────────────────────────
export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  season: text("season"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Products ───────────────────────────────────────────────────
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  collectionId: integer("collection_id").references(() => collections.id),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  priceCents: integer("price_cents").notNull(),
  currency: text("currency").default("USD"),
  category: text("category"),
  material: text("material"),
  careInstructions: text("care_instructions"),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Product Variants (size + color) ────────────────────────────
export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  size: text("size").notNull(),
  color: text("color").notNull(),
  colorHex: text("color_hex"),
  sku: text("sku").unique(),
  stockQuantity: integer("stock_quantity").default(0),
  sortOrder: integer("sort_order").default(0),
});

// ─── Product Images ─────────────────────────────────────────────
export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  url: text("url").notNull(),
  altText: text("alt_text"),
  sortOrder: integer("sort_order").default(0),
  isPrimary: boolean("is_primary").default(false),
});

// ─── Lookbook Entries ───────────────────────────────────────────
export const lookbookEntries = pgTable("lookbook_entries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  collectionId: integer("collection_id").references(() => collections.id),
  sortOrder: integer("sort_order").default(0),
});
