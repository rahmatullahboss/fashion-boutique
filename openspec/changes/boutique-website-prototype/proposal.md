# Boutique Website Prototype

## What

Build a professional, ultra-fast e-commerce website for **Atelier Alabaster** — a premium USA-based clothing boutique. The website will be a pixel-perfect implementation of the 10 Stitch-generated design screens (5 desktop + 5 mobile) with a **brutalist elegance** aesthetic.

## Why

- Establish a polished online presence for a new boutique brand entering the US market
- Leverage Cloudflare's edge network for sub-100ms global load times
- Create an immersive shopping experience with editorial photography, bold typography, and fluid animations
- Mobile-first design to capture the majority of fashion shoppers browsing on phones

## Core Pages (from Stitch Designs)

| Page | Desktop Screen | Mobile Screen |
|------|---------------|---------------|
| **Home** | Hero with "Fluid Modernity" tagline, seasonal looks carousel, scrolling marquee | Full-bleed hero, Autumn/Winter collection, bottom tab nav |
| **Collection Index** | Masonry grid with category filters (All/Outerwear/Knitwear/Accessories), newsletter signup | 2-column grid, pill filters, editorial "Process Series" section |
| **Product Detail (PDP)** | Multi-image gallery, color/size selectors, "ACQUIRE PIECE" CTA, material details | Floating product card overlay, image gallery, "ACQUIRE PIECE" CTA |
| **Lookbook** | Full editorial spread with "Fluidity in motion" hero, model photography | Seasonal editorial with "Ephemeral Silence" theme, scroll-to-explore |
| **Cart** | Slide-over panel with item list, quantity controls, subtotal, "ACQUIRE PIECES" | Full-page shopping bag with pricing breakdown, "PROCEED TO CHECKOUT" |

## Tech Stack (2026 Best Practices)

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | React 19 + **Vite 8** | Latest Vite with Rolldown Rust bundler, 10-30x faster builds |
| Build Plugin | `@cloudflare/vite-plugin` | Official Cloudflare Vite integration, runs `workerd` locally |
| Routing | React Router v7 | Client-side SPA routing |
| API | Hono on Cloudflare Workers | Ultra-fast edge API framework, zero cold starts |
| Database | Cloudflare D1 (SQLite) | Edge-native database for products/orders |
| Images | Cloudflare R2 | CDN-optimized product photography |
| Deployment | **Cloudflare Workers** (NOT Pages) | Workers Static Assets is the 2026 recommended approach; Pages is deprecated |
| Validation | Zod | Type-safe schema validation |

> **Why Workers instead of Pages?** Cloudflare's Feb 2026 best practices explicitly recommend Workers Static Assets for all new projects. Workers now handle static files natively via `assets.directory` in wrangler config, provide access to Durable Objects, Cron Triggers, Queues, and better observability — features Pages could never offer.

## Non-Goals (Phase 1)

- Payment processing integration (Stripe — future phase)
- User accounts / authentication
- Admin dashboard / CMS
- Search functionality
- Internationalization
