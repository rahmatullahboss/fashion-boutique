# Fashion Portal: checkout/security release gate

## Changes proposed in this review branch

- The browser now submits product IDs and size/color/quantity, **never trusted prices**.
- The server resolves current USD product price and real variant/stock from Neon before creating a Stripe session.
- Duplicate variant requests are aggregated before stock checks; invalid/foreign/out-of-stock items fail closed.
- Stripe, not the discarded in-page form, collects the shipping address. Incorrect hardcoded 8% tax text is removed.
- The cart survives a cancelled payment; only a Stripe-verified paid session clears it.
- Verification only accepts paid `atelier-alabaster` Checkout Sessions and uses `Cache-Control: no-store`.
- Public Wrangler vars no longer embed `DATABASE_URL`. Tracked `.env` is deleted **on the review branch** and ignored going forward.

## Urgent credential incident

A database connection credential and a tracked `.env` appeared in a **public** GitHub repository. Removing files **does not erase Git history, fork copies, caches or any previously read credential**. Before enabling checkout or merging/deploying:

1. **Rotate/revoke the exposed Neon database password now** through authorized Neon administration. Review login history and minimum privileges; confirm no suspicious writes.
2. Rotate any Stripe/server/API secrets that were ever present in tracked `.env` or other public files. Treat old keys as compromised. Do not paste them into issues, PRs, or chat.
3. Set fresh secrets via Cloudflare secret bindings, not `wrangler.jsonc` vars: `npx wrangler secret put DATABASE_URL`, `npx wrangler secret put STRIPE_SECRET_KEY`. Publishable Stripe key may remain public.
4. Ensure your actual Worker environment, Neon schema and Stripe account agree with the branch before enabling payment. If emergency credential removal from remote history is required, coordinate a reviewed history rewrite/force-update separately; this branch does not rewrite history.
5. Audit Cloudflare deployments for cached/old settings. **This branch is not deployed**.

## Validation performed / not performed

- Five deterministic pure catalog-pricing security tests run offline with Node 22's TS stripping and **5/5 PASS**.
- App-wide `npm install`, Vite/TypeScript build, real Neon requests, Stripe API calls and production checkout tests were **not performed**. They require a dedicated, authorized project runtime and rotated development keys.
- Run `npm run test:checkout`, `npm run build`, then Stripe **test mode** checkout (with altered browser price, foreign product ID, sold-out size, duplicate line item, cancellation, successful verification) before merging.
- Complete an independent payment-security review, include origin/CORS rate-limit safeguards and Stripe webhook/order persistence before merchant production launch.

## Known release blockers

**Payments are not ready for production yet.** Product inventory is checked before creating a session but **not reserved**. The project has no durable order ledger, secure Stripe webhook reconciliation, stock decrement with transaction/idempotency, shipping fulfillment, refund/return workflow, or consistent tax handling. A paid session must not automatically imply fulfillment. Stripe test-mode evidence and a verified merchant decision for tax/shipping are required.

The checkout page intentionally displays a provisional catalog subtotal; the authoritative final amount is shown by Stripe. Do not claim an order email was sent unless a real email service is connected.

## Rollout constraints

Create a separate reviewed PR, keep current `main` untouched until approval, do not reuse the leaked DB credentials or enable live Stripe charges. This is a safety slice, not a declaration that Fashion Portal is feature-complete.
