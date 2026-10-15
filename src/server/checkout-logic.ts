/** Pricing must come from the authoritative product catalog, never browser cart data. */
export interface CheckoutSelection {
  productId: number;
  size: string;
  color: string;
  quantity: number;
}

export interface CatalogProduct {
  id: number;
  name: string;
  priceCents: number;
  currency: string | null;
}

export interface CatalogVariant {
  productId: number | null;
  size: string;
  color: string;
  stockQuantity: number | null;
}

export interface PricedCheckoutLine {
  productName: string;
  description: string;
  unitAmount: number;
  quantity: number;
}

export class CheckoutValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CheckoutValidationError";
  }
}

export function priceCheckoutCart(
  selections: CheckoutSelection[],
  products: CatalogProduct[],
  variants: CatalogVariant[],
): PricedCheckoutLine[] {
  if (selections.length === 0 || selections.length > 20) {
    throw new CheckoutValidationError("Cart must contain between 1 and 20 items");
  }

  const grouped = new Map<string, CheckoutSelection>();
  let itemCount = 0;
  for (const item of selections) {
    if (!Number.isSafeInteger(item.productId) || item.productId <= 0 ||
        !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 10 ||
        typeof item.size !== "string" || !item.size.trim() ||
        typeof item.color !== "string" || !item.color.trim()) {
      throw new CheckoutValidationError("Invalid product variant or quantity");
    }
    itemCount += item.quantity;
    if (itemCount > 50) throw new CheckoutValidationError("Cart quantity limit exceeded");
    const key = JSON.stringify([item.productId, item.size, item.color]);
    const old = grouped.get(key);
    const quantity = (old?.quantity ?? 0) + item.quantity;
    if (quantity > 10) throw new CheckoutValidationError("Per-variant quantity limit exceeded");
    grouped.set(key, { ...item, quantity });
  }

  const byProduct = new Map(products.map(product => [product.id, product]));
  const byVariant = new Map(variants.map(variant =>
    [JSON.stringify([variant.productId, variant.size, variant.color]), variant]));

  return [...grouped.values()].map(item => {
    const product = byProduct.get(item.productId);
    const variant = byVariant.get(JSON.stringify([item.productId, item.size, item.color]));
    if (!product || !variant) throw new CheckoutValidationError("Product or variant unavailable");
    if (product.currency !== "USD" || !Number.isSafeInteger(product.priceCents) ||
        product.priceCents < 50 || product.priceCents > 99_999_999) {
      throw new CheckoutValidationError("Product is not available for USD checkout");
    }
    if (!Number.isSafeInteger(variant.stockQuantity) ||
        (variant.stockQuantity ?? 0) < item.quantity) {
      throw new CheckoutValidationError("Requested product quantity is out of stock");
    }
    return {
      productName: product.name,
      description: `${item.color} / ${item.size}`,
      unitAmount: product.priceCents,
      quantity: item.quantity,
    };
  });
}
