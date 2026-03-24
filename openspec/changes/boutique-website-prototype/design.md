# Design: Boutique Website Prototype

## Architecture (Workers-Only, 2026 Best Practice)

```
┌──────────────────────────────────────────────────────────┐
│              Cloudflare Workers (Edge)                    │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │            Single Worker Deployment                 │  │
│  │                                                    │  │
│  │  Static Assets ──▶ React SPA (Vite 8 build)       │  │
│  │  assets.directory = "./dist/client"                │  │
│  │  not_found_handling = "single-page-application"    │  │
│  │                                                    │  │
│  │  Worker Script ──▶ Hono API (/api/*)               │  │
│  │  main = "./dist/server/index.js"                   │  │
│  └────────────────────┬───────────────────────────────┘  │
│                       │                                   │
│         ┌─────────────┼─────────────┐                    │
│         │             │             │                    │
│   ┌─────▼────┐  ┌─────▼────┐  ┌────▼─────┐             │
│   │   D1     │  │   R2     │  │   KV     │             │
│   │ (SQLite) │  │ (Images) │  │ (Cache/  │             │
│   │ Products │  │ Product  │  │  Cart)   │             │
│   │ Orders   │  │ Photos   │  │          │             │
│   └──────────┘  └──────────┘  └──────────┘             │
└──────────────────────────────────────────────────────────┘
```

> **Key difference from old Pages approach:** Everything deploys as ONE Worker — static assets + API. No separate Pages project needed. Cloudflare serves static files for free via the `ASSETS` binding, and unmatched routes hit the Worker script (Hono API).

## Project Structure

```
fashion-boutique/
├── src/
│   ├── client/                    # React SPA (Vite 8 + Rolldown)
│   │   ├── App.tsx                # Root component + router
│   │   ├── main.tsx               # Entry point
│   │   ├── index.css              # Global design system
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx     # Floating nav bar
│   │   │   │   ├── Footer.tsx     # Newsletter + links
│   │   │   │   └── MobileNav.tsx  # Bottom tab navigation
│   │   │   ├── home/
│   │   │   │   ├── Hero.tsx       # Full-bleed hero section
│   │   │   │   ├── Marquee.tsx    # Scrolling text ticker
│   │   │   │   └── LookCard.tsx   # Featured look cards
│   │   │   ├── collection/
│   │   │   │   ├── ProductGrid.tsx    # Masonry layout
│   │   │   │   ├── CategoryFilter.tsx # Pill filters
│   │   │   │   └── ProductCard.tsx    # Individual card
│   │   │   ├── product/
│   │   │   │   ├── ImageGallery.tsx   # Multi-image viewer
│   │   │   │   ├── SizeSelector.tsx   # Size pills
│   │   │   │   ├── ColorSelector.tsx  # Color swatches
│   │   │   │   └── ProductInfo.tsx    # Details accordion
│   │   │   ├── lookbook/
│   │   │   │   ├── LookbookHero.tsx   # Editorial hero
│   │   │   │   └── EditorialGrid.tsx  # Photo editorial
│   │   │   └── cart/
│   │   │       ├── CartDrawer.tsx     # Slide-over panel
│   │   │       ├── CartItem.tsx       # Line item
│   │   │       └── CartSummary.tsx    # Subtotal + CTA
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── CollectionPage.tsx
│   │   │   ├── ProductPage.tsx
│   │   │   ├── LookbookPage.tsx
│   │   │   └── CartPage.tsx       # Mobile full-page cart
│   │   ├── hooks/
│   │   │   ├── useCart.ts
│   │   │   └── useProducts.ts
│   │   └── lib/
│   │       ├── api.ts             # Hono RPC client
│   │       └── types.ts
│   │
│   └── server/                    # Hono Workers API
│       ├── index.ts               # Main Hono app entry
│       ├── routes/
│       │   ├── products.ts
│       │   ├── collections.ts
│       │   └── cart.ts
│       ├── schemas/
│       │   └── product.ts
│       └── db/
│           └── seed.ts
│
├── migrations/
│   └── 0001_init.sql
├── public/
│   └── fonts/
├── wrangler.jsonc                 # Workers config with D1, R2, KV, static assets
├── vite.config.ts                 # @cloudflare/vite-plugin
├── tsconfig.json
└── package.json
```

## Wrangler Config (Workers Static Assets)

```jsonc
{
  "name": "atelier-alabaster",
  "compatibility_date": "2026-03-24",
  "compatibility_flags": ["nodejs_compat"],
  "main": "./src/server/index.ts",
  "assets": {
    "directory": "./dist/client",
    "not_found_handling": "single-page-application"
  },
  "d1_databases": [
    { "binding": "DB", "database_name": "atelier-db", "database_id": "..." }
  ],
  "r2_buckets": [
    { "binding": "IMAGES", "bucket_name": "atelier-images" }
  ],
  "kv_namespaces": [
    { "binding": "CACHE", "id": "..." }
  ]
}
```

## Vite 8 Config

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    cloudflare()  // Handles Workers integration, runs workerd locally
  ]
});
```

## Design System (from Stitch Screens)

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#F5F3EF` | Off-white page background |
| `--color-surface` | `#FFFFFF` | Cards, overlays |
| `--color-dark` | `#1A1A1A` | Hero backgrounds, text |
| `--color-accent` | `#AAFF00` | CTAs, active indicators, brand accent |
| `--color-muted` | `#6B6B6B` | Secondary text |
| `--color-border` | `#E5E2DC` | Subtle borders |

### Typography
- **Headings**: `"Playfair Display"` — large editorial serifs
- **Body**: `"Inter"` — clean sans-serif
- **Labels/UI**: `"DM Mono"` — monospaced for prices, categories

### Component Tokens
- Border radius: `16px` (cards), `24px` (images), `999px` (pills/buttons)
- Shadows: `0 4px 24px rgba(0,0,0,0.08)` (cards)
- Transitions: `0.3s cubic-bezier(0.4, 0, 0.2, 1)` (standard)

## Database Schema (D1)

```sql
CREATE TABLE collections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  season TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  collection_id TEXT REFERENCES collections(id),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  category TEXT,
  material TEXT,
  care_instructions TEXT,
  is_featured INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id),
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  color_hex TEXT,
  sku TEXT UNIQUE,
  stock_quantity INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE product_images (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id),
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary INTEGER DEFAULT 0
);

CREATE TABLE lookbook_entries (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  collection_id TEXT REFERENCES collections(id),
  sort_order INTEGER DEFAULT 0
);
```
