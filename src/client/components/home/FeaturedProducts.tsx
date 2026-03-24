import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./FeaturedProducts.css";

interface Product {
  id: number;
  name: string;
  slug: string;
  priceCents: number;
  isFeatured: boolean | null;
  images?: { url: string; isPrimary: boolean | null }[];
}

const SLUG_IMAGE: Record<string, string> = {
  "structured-wool-overcoat": "/products/wool-overcoat.webp",
  "cashmere-knit-sweater": "/products/cashmere-sweater.webp",
  "pleated-wide-trousers": "/products/pleated-trousers.webp",
  "merino-turtleneck": "/products/merino-turtleneck.png",
  "silk-drape-blouse": "/products/silk-blouse.webp",
  "linen-field-jacket": "/products/linen-jacket.webp",
  "cotton-poplin-shirt": "/products/cotton-shirt.webp",
  "relaxed-drawstring-pant": "/products/drawstring-pant.webp",
};

const formatPrice = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(cents / 100);

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products?featured=true")
      .then((r) => r.json())
      .then((data) => {
        const all: Product[] = data.products || [];
        // Show featured first, max 4
        const featured = all.filter((p) => p.isFeatured);
        setProducts((featured.length >= 4 ? featured : all).slice(0, 4));
      })
      .catch(() => {});
  }, []);

  return (
    <section className="featured-products">
      <div className="featured-header">
        <h2 className="featured-heading">New Arrivals</h2>
        <Link to="/collection" className="featured-view-all">
          View All
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>
      <div className="featured-grid">
        {products.map((product) => {
          const img =
            product.images?.find((i) => i.isPrimary)?.url ||
            SLUG_IMAGE[product.slug] ||
            "/products/wool-overcoat.webp";
          return (
            <Link key={product.slug} to={`/product/${product.slug}`} className="product-card">
              <div className="product-card-image">
                <img src={img} alt={product.name} loading="lazy" />
              </div>
              <div className="product-card-info">
                <h3 className="product-card-name">{product.name}</h3>
                <p className="product-card-price">{formatPrice(product.priceCents)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
