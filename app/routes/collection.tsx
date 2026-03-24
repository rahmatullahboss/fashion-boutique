import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/CollectionPage.css";

interface Product {
  id: number;
  name: string;
  slug: string;
  category: string | null;
  priceCents: number;
  isFeatured: boolean | null;
}

const SLUG_IMAGE: Record<string, string> = {
  "structured-wool-overcoat": "/products/wool-overcoat.webp",
  "cashmere-knit-sweater": "/products/cashmere-sweater.webp",
  "pleated-wide-trousers": "/products/pleated-trousers.webp",
  "merino-turtleneck": "/products/cashmere-sweater.webp",
  "silk-drape-blouse": "/products/silk-blouse.webp",
  "linen-field-jacket": "/products/linen-jacket.webp",
  "cotton-poplin-shirt": "/products/cotton-shirt.webp",
  "relaxed-drawstring-pant": "/products/drawstring-pant.webp",
};

interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  season: string | null;
  imageUrl: string | null;
}

const formatPrice = (cents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);

export default function CollectionPage() {
  const { slug } = useParams<{ slug?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      // Single collection view
      fetch(`/api/collections/${slug}`)
        .then((r) => r.json())
        .then((data) => {
          setProducts(data.collection?.products || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      // All collections + all products
      Promise.all([
        fetch("/api/collections").then((r) => r.json()),
        fetch("/api/products").then((r) => r.json()),
      ]).then(([colData, prodData]) => {
        setCollections(colData.collections || []);
        setProducts(prodData.products || []);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [slug]);

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category).filter(Boolean) as string[]),
  ];

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  // Primary product image URL — map by slug
  const getProductImage = (slug: string): string =>
    SLUG_IMAGE[slug] || "/products/wool-overcoat.webp";

  return (
    <div className="collection-page">
      {/* Collection hero on slug pages */}
      {!slug && collections.length > 0 && (
        <div className="collection-hero-banner hide-mobile">
          {collections.map((col) => (
            <Link
              key={col.slug}
              to={`/collection/${col.slug}`}
              className="collection-banner-card"
            >
              <img src={col.imageUrl || ""} alt={col.name} />
              <div className="collection-banner-overlay">
                <span className="collection-banner-season">{col.season}</span>
                <h2 className="collection-banner-name">{col.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="collection-content">
        {/* Header */}
        <div className="collection-header">
          <span className="collection-label">
            {slug ? slug.replace(/-/g, " ") : "All Collections"}
          </span>
          <h1 className="collection-title">
            The <em>Collection</em>
          </h1>
        </div>

        {/* Category Filters */}
        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="collection-loading">
            <span className="material-symbols-outlined loading-spinner">
              progress_activity
            </span>
          </div>
        ) : filtered.length === 0 ? (
          <p className="collection-empty">No products found.</p>
        ) : (
          <div className="collection-grid">
            {filtered.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                className="product-card"
              >
                <div className="product-card-image">
                  <img
                    src={getProductImage(product.slug)}
                    alt={product.name}
                    loading="lazy"
                  />
                </div>
                <div className="product-card-info">
                  {product.category && (
                    <span className="product-card-category">
                      {product.category}
                    </span>
                  )}
                  <h3 className="product-card-name">{product.name}</h3>
                  <span className="product-card-price">
                    {formatPrice(product.priceCents)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
