import test from "node:test";
import assert from "node:assert/strict";
import { priceCheckoutCart, CheckoutValidationError } from "../src/server/checkout-logic.ts";

const products = [{ id: 5, name: "Wool Coat", priceCents: 12000, currency: "USD" }];
const variants = [{ productId: 5, size: "M", color: "Black", stockQuantity: 3 }];
const item = { productId: 5, size: "M", color: "Black", quantity: 1 };

test("uses catalog price/name even if malicious browser sends altered values", () => {
  assert.deepEqual(priceCheckoutCart([{ ...item, price: 1, name: "Fake" }], products, variants), [
    { productName: "Wool Coat", description: "Black / M", unitAmount: 12000, quantity: 1 },
  ]);
});

test("rejects unknown products and size/color combinations", () => {
  assert.throws(() => priceCheckoutCart([{ ...item, productId: 999 }], products, variants), CheckoutValidationError);
  assert.throws(() => priceCheckoutCart([{ ...item, size: "XL" }], products, variants), CheckoutValidationError);
});

test("enforces stock including duplicate-cart quantities", () => {
  assert.throws(() => priceCheckoutCart([{ ...item, quantity: 4 }], products, variants), CheckoutValidationError);
  assert.throws(() => priceCheckoutCart([{ ...item, quantity: 2 }, { ...item, quantity: 2 }], products, variants), CheckoutValidationError);
});

test("aggregates duplicate selections at the authoritative catalog price", () => {
  assert.deepEqual(priceCheckoutCart([item, { ...item, quantity: 2 }], products, variants), [
    { productName: "Wool Coat", description: "Black / M", unitAmount: 12000, quantity: 3 },
  ]);
});

test("rejects non-USD, invalid price or implausible quantities", () => {
  assert.throws(() => priceCheckoutCart([item], [{ ...products[0], currency: "BDT" }], variants), CheckoutValidationError);
  assert.throws(() => priceCheckoutCart([item], [{ ...products[0], priceCents: -1 }], variants), CheckoutValidationError);
  assert.throws(() => priceCheckoutCart([{ ...item, quantity: 11 }], products, variants), CheckoutValidationError);
});
