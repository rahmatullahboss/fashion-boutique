import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import "dotenv/config";
import {
  collections,
  products,
  productVariants,
  productImages,
  lookbookEntries,
} from "./schema";

// ─── Product Image Maps ─────────────────────────────────────────
const PRODUCT_IMAGES: Record<string, string> = {
  "structured-wool-overcoat": "/products/wool-overcoat.webp",
  "cashmere-knit-sweater": "/products/cashmere-sweater.webp",
  "pleated-wide-trousers": "/products/pleated-trousers.webp",
  "merino-turtleneck": "/products/merino-turtleneck.png",
  "silk-drape-blouse": "/products/silk-blouse.webp",
  "linen-field-jacket": "/products/linen-jacket.webp",
  "cotton-poplin-shirt": "/products/cotton-shirt.webp",
  "relaxed-drawstring-pant": "/products/drawstring-pant.webp",
};

const PRODUCT_DETAIL_IMAGES: Record<string, string> = {
  "structured-wool-overcoat": "/products/wool-overcoat-detail.png",
  "cashmere-knit-sweater": "/products/cashmere-sweater-detail.png",
  "pleated-wide-trousers": "/products/pleated-trousers-detail.png",
  "merino-turtleneck": "/products/merino-turtleneck-detail.png",
  "silk-drape-blouse": "/products/silk-blouse-detail.png",
  "linen-field-jacket": "/products/linen-jacket-detail.png",
  "cotton-poplin-shirt": "/products/cotton-shirt-detail.png",
  "relaxed-drawstring-pant": "/products/drawstring-pant-detail.png",
};

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  console.log("🌱 Seeding database...");

  // ─── Clear existing data ──────────────────────────────────────
  await db.delete(productImages);
  await db.delete(productVariants);
  await db.delete(lookbookEntries);
  await db.delete(products);
  await db.delete(collections);
  console.log("🗑️  Cleared existing data");

  // ─── Collections ────────────────────────────────────────────────
  const colRows = await db
    .insert(collections)
    .values([
      {
        name: "Autumn / Winter 2026",
        slug: "autumn-winter-2026",
        description:
          "A study in structure and fluidity. Exploring the tension between rigid architectural silhouettes and the organic drape of fine natural fibers.",
        season: "AW26",
        imageUrl: "/products/wool-overcoat.webp",
        sortOrder: 1,
      },
      {
        name: "Spring / Summer 2026",
        slug: "spring-summer-2026",
        description:
          "Muted earth tones meet translucent layers. A celebration of lightness, restraint, and the quiet confidence of understated elegance.",
        season: "SS26",
        imageUrl: "/products/silk-blouse.webp",
        sortOrder: 2,
      },
    ])
    .returning();

  const aw = colRows[0]!;
  const ss = colRows[1]!;

  console.log(`✅ Created ${2} collections`);

  // ─── Products ───────────────────────────────────────────────────
  const allProducts = await db
    .insert(products)
    .values([
      {
        collectionId: aw.id,
        name: "Structured Wool Overcoat",
        slug: "structured-wool-overcoat",
        description:
          "Double-faced Italian wool overcoat with architectural shoulders and relaxed drop. Fully lined in silk cupro. An exercise in controlled volume.",
        priceCents: 125000,
        category: "outerwear",
        material: "100% Italian virgin wool, silk cupro lining",
        careInstructions: "Dry clean only",
        isFeatured: true,
      },
      {
        collectionId: aw.id,
        name: "Cashmere Knit Sweater",
        slug: "cashmere-knit-sweater",
        description:
          "12-gauge Mongolian cashmere sweater with ribbed raglan sleeves. A second-skin layer of pure warmth.",
        priceCents: 68000,
        category: "knitwear",
        material: "100% Grade-A Mongolian cashmere",
        careInstructions: "Hand wash cold, lay flat to dry",
        isFeatured: true,
      },
      {
        collectionId: aw.id,
        name: "Pleated Wide Trousers",
        slug: "pleated-wide-trousers",
        description:
          "High-waisted, double-pleated wide-leg trousers in Japanese tropical wool. Designed for effortless movement and timeless proportion.",
        priceCents: 28000,
        category: "bottoms",
        material: "Japanese tropical wool blend",
        careInstructions: "Dry clean recommended",
        isFeatured: true,
      },
      {
        collectionId: aw.id,
        name: "Merino Turtleneck",
        slug: "merino-turtleneck",
        description:
          "Extra-fine merino turtleneck with seamless construction. The essential foundation of modern layering.",
        priceCents: 24000,
        category: "knitwear",
        material: "100% Superfine Australian merino",
        careInstructions: "Machine wash cold, delicate cycle",
        isFeatured: false,
      },
      {
        collectionId: ss.id,
        name: "Silk Drape Blouse",
        slug: "silk-drape-blouse",
        description:
          "Heavyweight crêpe de chine blouse with asymmetric drape detail. An exploration of volume and restraint in a single garment.",
        priceCents: 42000,
        category: "tops",
        material: "100% Mulberry silk crêpe de chine",
        careInstructions: "Dry clean only",
        isFeatured: true,
      },
      {
        collectionId: ss.id,
        name: "Linen Field Jacket",
        slug: "linen-field-jacket",
        description:
          "Washed Belgian linen four-pocket jacket. Garment-dyed for a lived-in softness. Unlined for breathability.",
        priceCents: 58000,
        category: "outerwear",
        material: "100% Belgian linen",
        careInstructions: "Machine wash warm, tumble dry low",
        isFeatured: false,
      },
      {
        collectionId: ss.id,
        name: "Cotton Poplin Shirt",
        slug: "cotton-poplin-shirt",
        description:
          "Oversized Thomas Mason cotton poplin shirt with hidden placket and mother-of-pearl buttons. Precision tailoring for modern nonconformity.",
        priceCents: 32000,
        category: "tops",
        material: "Thomas Mason Egyptian cotton poplin",
        careInstructions: "Machine wash warm, iron on medium",
        isFeatured: false,
      },
      {
        collectionId: ss.id,
        name: "Relaxed Drawstring Pant",
        slug: "relaxed-drawstring-pant",
        description:
          "Japanese cotton-linen drawstring trousers with tapered leg. Designed for comfort without compromise.",
        priceCents: 26000,
        category: "bottoms",
        material: "70% cotton, 30% linen",
        careInstructions: "Machine wash cold, hang dry",
        isFeatured: false,
      },
    ])
    .returning();

  console.log(`✅ Created ${allProducts.length} products`);

  // ─── Product Images (unique primary + detail per product) ─────
  const imageData = allProducts.flatMap((p) => {
    const primaryImg = PRODUCT_IMAGES[p.slug] || "/products/wool-overcoat.webp";
    const detailImg = PRODUCT_DETAIL_IMAGES[p.slug] || primaryImg;
    return [
      {
        productId: p.id,
        url: primaryImg,
        altText: `${p.name} — front view`,
        isPrimary: true,
        sortOrder: 0,
      },
      {
        productId: p.id,
        url: detailImg,
        altText: `${p.name} — detail`,
        isPrimary: false,
        sortOrder: 1,
      },
    ];
  });

  await db.insert(productImages).values(imageData);
  console.log(`✅ Created ${imageData.length} product images`);

  // ─── Product Variants ──────────────────────────────────────────
  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = [
    { color: "Charcoal", hex: "#3B3B3B" },
    { color: "Alabaster", hex: "#F0EDE5" },
    { color: "Sage", hex: "#9BB09B" },
  ];

  const variantData = allProducts.flatMap((p) =>
    sizes.flatMap((size, si) =>
      colors.map((c, ci) => ({
        productId: p.id,
        size,
        color: c.color,
        colorHex: c.hex,
        sku: `${p.slug}-${size.toLowerCase()}-${c.color.toLowerCase()}`,
        stockQuantity: Math.floor(Math.random() * 15) + 2,
        sortOrder: si * 10 + ci,
      }))
    )
  );

  await db.insert(productVariants).values(variantData);
  console.log(`✅ Created ${variantData.length} product variants`);

  // ─── Lookbook Entries ──────────────────────────────────────────
  await db.insert(lookbookEntries).values([
    {
      title: "Structural Fluidity",
      subtitle: "Look 01",
      description:
        "Embracing the contrast between rigid architectural forms and the soft drape of natural textiles.",
      imageUrl: "/products/wool-overcoat.webp",
      collectionId: aw.id,
      sortOrder: 1,
    },
    {
      title: "Muted Tones",
      subtitle: "Look 02",
      description:
        "A study in restraint. Exploring the subtle variations of alabaster, charcoal, and sage.",
      imageUrl: "/products/cashmere-sweater.webp",
      collectionId: aw.id,
      sortOrder: 2,
    },
    {
      title: "Light Layers",
      subtitle: "Look 03",
      description:
        "Translucent cottons and washed linens, layered for depth without weight.",
      imageUrl: "/products/linen-jacket.webp",
      collectionId: ss.id,
      sortOrder: 3,
    },
    {
      title: "Earth Communion",
      subtitle: "Look 04",
      description:
        "Raw texture meets refined silhouette. Natural dyes on handwoven cloth.",
      imageUrl: "/products/drawstring-pant.webp",
      collectionId: ss.id,
      sortOrder: 4,
    },
  ]);

  console.log("✅ Created 4 lookbook entries");
  console.log("🎉 Seeding complete!");
}

seed().catch(console.error);
