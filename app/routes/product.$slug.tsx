import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/ProductPage.css";

interface Variant {
  id: number;
  size: string;
  color: string;
  colorHex: string | null;
  stockQuantity: number | null;
}

interface ProductImage {
  id: number;
  url: string;
  altText: string | null;
  isPrimary: boolean | null;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  priceCents: number;
  category: string | null;
  material: string | null;
  careInstructions: string | null;
  variants: Variant[];
  images: ProductImage[];
}

interface RelatedProduct {
  id: number;
  name: string;
  slug: string;
  priceCents: number;
  category: string | null;
  image: string | null;
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
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);

function AccordionSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`accordion-section ${open ? "open" : ""}`}>
      <button className="accordion-trigger" onClick={() => setOpen(!open)}>
        <span className="accordion-left">
          <span className="material-symbols-outlined accordion-icon">
            {icon}
          </span>
          <span className="accordion-title">{title}</span>
        </span>
        <span className="material-symbols-outlined accordion-chevron">
          expand_more
        </span>
      </button>
      <div className="accordion-content">
        <div className="accordion-inner">{children}</div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setActiveImage(0);
    setSelectedSize(null);
    setAdded(false);
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data.product || null);
        setRelatedProducts(data.relatedProducts || []);
        setLoading(false);
        // Select first color
        if (data.product?.variants?.length) {
          const colors = [
            ...new Set(
              data.product.variants.map((v: Variant) => v.color)
            ),
          ];
          if (colors.length > 0) setSelectedColor(colors[0] as string);
        }
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="product-page product-loading">
        <span className="material-symbols-outlined loading-spinner">
          progress_activity
        </span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-page product-not-found">
        <h2>Product not found</h2>
        <Link to="/collection" className="btn btn-primary">
          Back to Collection
        </Link>
      </div>
    );
  }

  const sizes = [...new Set(product.variants.map((v) => v.size))];
  const colors = [...new Set(product.variants.map((v) => v.color))];
  const colorHexMap = Object.fromEntries(
    product.variants.map((v) => [v.color, v.colorHex])
  );

  const isInStock =
    selectedSize && selectedColor
      ? product.variants.some(
          (v) =>
            v.size === selectedSize &&
            v.color === selectedColor &&
            (v.stockQuantity || 0) > 0
        )
      : true;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor || !product) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.priceCents,
      size: selectedSize,
      color: selectedColor,
      image: product.images[0]?.url || "",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-page">
      <div className="product-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/collection">Collection</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="product-layout">
        {/* Image Gallery */}
        <div className="product-gallery">
          <div className="product-main-image">
            <img
              src={product.images[activeImage]?.url || ""}
              alt={product.images[activeImage]?.altText || product.name}
            />
          </div>
          {product.images.length > 1 && (
            <div className="product-thumbs">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  className={`product-thumb ${i === activeImage ? "active" : ""}`}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={img.url} alt={img.altText || ""} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          {product.category && (
            <span className="product-category">{product.category}</span>
          )}
          <h1 className="product-name">{product.name}</h1>
          <p className="product-price">{formatPrice(product.priceCents)}</p>

          <p className="product-description">{product.description}</p>

          {/* Color Selector */}
          {colors.length > 0 && (
            <div className="product-option">
              <label className="option-label">
                Color — {selectedColor}
              </label>
              <div className="color-options">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`color-swatch ${selectedColor === color ? "active" : ""}`}
                    style={{ backgroundColor: colorHexMap[color] || "#ccc" }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {sizes.length > 0 && (
            <div className="product-option">
              <label className="option-label">Size</label>
              <div className="size-options">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? "active" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <button
            className={`btn-add-to-cart ${added ? "added" : ""}`}
            onClick={handleAddToCart}
            disabled={!selectedSize || !selectedColor || !isInStock}
          >
            {added
              ? "Added ✓"
              : !isInStock
              ? "Out of Stock"
              : "Add to Cart"}
          </button>

          {/* Accordion Details */}
          <div className="product-accordions">
            <AccordionSection
              title="Product Details"
              icon="info"
              defaultOpen={true}
            >
              {product.description && (
                <p>{product.description}</p>
              )}
              {product.material && (
                <div className="detail-item">
                  <strong>Material:</strong> {product.material}
                </div>
              )}
              {product.category && (
                <div className="detail-item">
                  <strong>Category:</strong> {product.category}
                </div>
              )}
              <div className="detail-item">
                <strong>Available Sizes:</strong> {sizes.join(", ") || "One Size"}
              </div>
              <div className="detail-item">
                <strong>Available Colors:</strong> {colors.join(", ") || "—"}
              </div>
            </AccordionSection>

            <AccordionSection title="Fabric & Care" icon="dry_cleaning">
              {product.material && (
                <div className="detail-item">
                  <strong>Composition:</strong> {product.material}
                </div>
              )}
              {product.careInstructions ? (
                <div className="detail-item">
                  <strong>Care Instructions:</strong>{" "}
                  {product.careInstructions}
                </div>
              ) : (
                <div className="detail-item">
                  <strong>Care:</strong> Dry clean recommended.
                  Store in a cool, dry place. Iron on low heat if needed.
                </div>
              )}
              <div className="detail-item">
                <strong>Sustainability:</strong> Ethically sourced materials
                with eco-conscious manufacturing practices.
              </div>
            </AccordionSection>

            <AccordionSection title="Shipping & Returns" icon="local_shipping">
              <div className="detail-item">
                <strong>Free Shipping:</strong> On all orders over $150
              </div>
              <div className="detail-item">
                <strong>Delivery:</strong> Standard 5–7 business days.
                Express 2–3 business days available.
              </div>
              <div className="detail-item">
                <strong>Returns:</strong> 30-day return policy. Items must be
                unworn with original tags attached.
              </div>
              <div className="detail-item">
                <strong>Exchanges:</strong> Free size exchanges within 14
                days of delivery.
              </div>
            </AccordionSection>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="related-products">
          <h2 className="related-heading">You May Also Like</h2>
          <div className="related-grid">
            {relatedProducts.map((rp) => {
              const img =
                rp.image || SLUG_IMAGE[rp.slug] || "/products/wool-overcoat.webp";
              return (
                <Link
                  key={rp.slug}
                  to={`/product/${rp.slug}`}
                  className="related-card"
                >
                  <div className="related-card-image">
                    <img src={img} alt={rp.name} loading="lazy" />
                  </div>
                  <div className="related-card-info">
                    <h3 className="related-card-name">{rp.name}</h3>
                    <p className="related-card-price">
                      {formatPrice(rp.priceCents)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
