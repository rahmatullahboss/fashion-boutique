# Tasks: Boutique Website Prototype

## Phase 1: Project Foundation

- [ ] **T1: Scaffold Cloudflare Workers + React project**
  - Run `npm create cloudflare@latest -- ./ --framework=react` (uses Vite 8 + `@cloudflare/vite-plugin`)
  - Install: `hono`, `@hono/zod-validator`, `zod`, `react-router-dom`
  - Configure `wrangler.jsonc` — Workers entry, `assets.directory`, `not_found_handling: single-page-application`, D1/R2/KV bindings
  - Configure `vite.config.ts` with `cloudflare()` plugin
  - Set `compatibility_date: "2026-03-24"`, `compatibility_flags: ["nodejs_compat"]`
  - Run `npx wrangler types` to generate binding types
  - Verify dev server starts with `npm run dev`

- [ ] **T2: Design system (CSS foundation)**
  - Create `src/client/index.css` with all design tokens from Stitch screens
  - Color palette: `#F5F3EF` bg, `#1A1A1A` dark, `#AAFF00` accent
  - Self-host fonts (Inter, Playfair Display, DM Mono) in `public/fonts/`
  - CSS reset, base responsive styles, animation keyframes (marquee, fade-in)
  - Component tokens: shadows, border-radius, transitions

- [ ] **T3: Database schema + seed data**
  - Write `migrations/0001_init.sql` (collections, products, variants, images, lookbook)
  - Write `src/server/db/seed.ts` with 8-10 sample products across 2 collections
  - Apply migration: `npx wrangler d1 execute DB --local --file=migrations/0001_init.sql`

## Phase 2: API Layer (Hono Workers)

- [ ] **T4: Hono API setup + product routes**
  - Create `src/server/index.ts` — Hono app with CORS, HTTPException error handler
  - `GET /api/products` (list + category filter), `GET /api/products/:slug`
  - `GET /api/collections`, `GET /api/collections/:slug/products`
  - Zod schemas in `src/server/schemas/product.ts`

- [ ] **T5: Cart + lookbook routes**
  - `src/server/routes/cart.ts` — KV-backed session cart
  - `src/server/routes/lookbook.ts` — `GET /api/lookbook`

## Phase 3: React Pages

- [ ] **T6: Layout components + routing**
  - Floating `Header.tsx` nav bar (brand logo, Collections, Archive, Cart icon)
  - `MobileNav.tsx` bottom tab bar (Home, Collections, Lookbook, Profile)
  - `Footer.tsx` with "JOIN THE ATELIER" newsletter signup
  - React Router setup with all page routes

- [ ] **T7: Home page**
  - `Hero.tsx` — full-bleed hero with "Fluid Modernity" / brand tagline
  - `Marquee.tsx` — infinite scrolling "AUTUMN/WINTER" ticker
  - `LookCard.tsx` — featured look cards with hover animations
  - "VIEW FULL COLLECTION" CTA, mobile-responsive layout

- [ ] **T8: Collection index page**
  - `CategoryFilter.tsx` — horizontal pill filters
  - `ProductGrid.tsx` — masonry-style responsive grid
  - `ProductCard.tsx` — image + hover zoom, product name, price

- [ ] **T9: Product detail page (PDP)**
  - `ImageGallery.tsx` — vertical multi-image gallery
  - `SizeSelector.tsx`, `ColorSelector.tsx` — pills and swatches
  - `ProductInfo.tsx` — collapsible details accordion
  - "ACQUIRE PIECE" CTA, mobile floating card overlay

- [ ] **T10: Lookbook page**
  - `LookbookHero.tsx` — "Fluidity in motion" editorial hero
  - `EditorialGrid.tsx` — photo spreads, series cards
  - "SCROLL TO EXPLORE" animated prompt

- [ ] **T11: Cart (drawer + mobile page)**
  - `CartDrawer.tsx` — desktop right slide-over
  - `CartItem.tsx`, `CartSummary.tsx` — items, quantities, subtotal
  - Mobile `CartPage.tsx` — full-page shopping bag
  - Cart state via React context

## Phase 4: Polish & Deploy

- [ ] **T12: Animations & micro-interactions**
  - Page transitions, image hover scale, cart drawer slide, skeleton loading
  - Button hover glow, scroll-triggered fade-in
  - Responsive breakpoints (375px / 768px / 1280px)

- [ ] **T13: Images, SEO & performance**
  - Generate product/hero/lookbook images
  - SEO meta tags, Open Graph, favicon
  - Lighthouse 95+ target

- [ ] **T14: Cloudflare Workers deployment**
  - Apply D1 migration to production: `npx wrangler d1 execute DB --remote`
  - Upload images to R2
  - Deploy: `npx wrangler deploy`
  - Verify all pages + API endpoints in production
