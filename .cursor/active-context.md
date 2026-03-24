> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `src/client/pages/CollectionPage.tsx` (Domain: **Frontend (React/UI)**)

### 📐 Frontend (React/UI) Conventions & Fixes
- **[decision] Optimized Record — parallelizes async operations for speed**: - interface Collection {
+ const SLUG_IMAGE: Record<string, string> = {
-   id: number;
+   "structured-wool-overcoat": "/products/wool-overcoat.webp",
-   name: string;
+   "cashmere-knit-sweater": "/products/cashmere-sweater.webp",
-   slug: string;
+   "pleated-wide-trousers": "/products/pleated-trousers.webp",
-   description: string | null;
+   "merino-turtleneck": "/products/cashmere-sweater.webp",
-   season: string | null;
+   "silk-drape-blouse": "/products/silk-blouse.webp",
-   imageUrl: string | null;
+   "linen-field-jacket": "/products/linen-jacket.webp",
- }
+   "cotton-poplin-shirt": "/products/cotton-shirt.webp",
- 
+   "relaxed-drawstring-pant": "/products/drawstring-pant.webp",
- const formatPrice = (cents: number) =>
+ };
-   new Intl.NumberFormat("en-US", {
+ 
-     style: "currency",
+ interface Collection {
-     currency: "USD",
+   id: number;
-     minimumFractionDigits: 0,
+   name: string;
-   }).format(cents / 100);
+   slug: string;
- 
+   description: string | null;
- export default function CollectionPage() {
+   season: string | null;
-   const { slug } = useParams<{ slug?: string }>();
+   imageUrl: string | null;
-   const [products, setProducts] = useState<Product[]>([]);
+ }
-   const [collections, setCollections] = useState<Collection[]>([]);
+ 
-   const [activeCategory, setActiveCategory] = useState("All");
+ const formatPrice = (cents: number) =>
-   const [loading, setLoading] = useState(true);
+   new Intl.NumberFormat("en-US", {
- 
+     style: "currency",
-   useEffect(() => {
+     currency: "USD",
-     if (slug) {
+     minimumFractionDigits: 0,
-       // Single collection view
+   }).format(cents / 100);
-       fetch(`/api/collections/${slug}`)
+ 
-         .then((r) => r.json())
+ export default function CollectionPage() {
-         .then((data) => {
+   const { slug } = useParams<{ slug?: string }>();
-           setProducts(data.collection?.products || []);
+   const [products, setProducts] = useState<Product[]>(
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [Product, SLUG_IMAGE, Collection, formatPrice, CollectionPage]
- **[what-changed] what-changed in CollectionPage.tsx**: -                     src={getProductImage(product)}
+                     src={getProductImage()}

📌 IDE AST Context: Modified symbols likely include [Product, Collection, formatPrice, CollectionPage]
- **[decision] Optimized Single — parallelizes async operations for speed**: -     setLoading(true);
+     if (slug) {
- 
+       // Single collection view
-     if (slug) {
+       fetch(`/api/collections/${slug}`)
-       // Single collection view
+         .then((r) => r.json())
-       fetch(`/api/collections/${slug}`)
+         .then((data) => {
-         .then((r) => r.json())
+           setProducts(data.collection?.products || []);
-         .then((data) => {
+           setLoading(false);
-           setProducts(data.collection?.products || []);
+         })
-           setLoading(false);
+         .catch(() => setLoading(false));
-         })
+     } else {
-         .catch(() => setLoading(false));
+       // All collections + all products
-     } else {
+       Promise.all([
-       // All collections + all products
+         fetch("/api/collections").then((r) => r.json()),
-       Promise.all([
+         fetch("/api/products").then((r) => r.json()),
-         fetch("/api/collections").then((r) => r.json()),
+       ]).then(([colData, prodData]) => {
-         fetch("/api/products").then((r) => r.json()),
+         setCollections(colData.collections || []);
-       ]).then(([colData, prodData]) => {
+         setProducts(prodData.products || []);
-         setCollections(colData.collections || []);
+         setLoading(false);
-         setProducts(prodData.products || []);
+       }).catch(() => setLoading(false));
-         setLoading(false);
+     }
-       }).catch(() => setLoading(false));
+   }, [slug]);
-     }
+ 
-   }, [slug]);
+   const categories = [
- 
+     "All",
-   const categories = [
+     ...new Set(products.map((p) => p.category).filter(Boolean) as string[]),
-     "All",
+   ];
-     ...new Set(products.map((p) => p.category).filter(Boolean) as string[]),
+ 
-   ];
+   const filtered =
- 
+     activeCategory === "All"
-   const filtered =
+       ? products
-     activeCategory === "All"
+       : products.filter((p) => p.category === activeCategory);
-       ? products
+ 
-       : products.filter((p) => p.
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [Product, Collection, formatPrice, CollectionPage]
- **[what-changed] Updated react database schema — improves module reusability**: - import { useState } from "react";
+ import { Link, useNavigate } from "react-router-dom";
- import { Link } from "react-router-dom";
+ import { useCart } from "../context/CartContext";
- interface CartItem {
+ const formatPrice = (cents: number) =>
-   slug: string;
+   new Intl.NumberFormat("en-US", {
-   name: string;
+     style: "currency",
-   price: number;
+     currency: "USD",
-   size: string;
+     minimumFractionDigits: 0,
-   color: string;
+   }).format(cents / 100);
-   quantity: number;
+ 
-   image: string;
+ export default function CartPage() {
- }
+   const { items, removeItem, updateQuantity, subtotal } = useCart();
- 
+   const navigate = useNavigate();
- // Demo cart items — in a real app this would come from state/context
+   const shipping = 0;
- const demoItems: CartItem[] = [
+   const total = subtotal + shipping;
-   {
+ 
-     slug: "structured-wool-overcoat",
+   return (
-     name: "Structured Wool Overcoat",
+     <div className="cart-page">
-     price: 125000,
+       <div className="cart-header">
-     size: "M",
+         <h1 className="cart-title">Your Cart</h1>
-     color: "Charcoal",
+         <span className="cart-count">
-     quantity: 1,
+           {items.length} {items.length === 1 ? "item" : "items"}
-     image:
+         </span>
-       "https://lh3.googleusercontent.com/aida-public/AB6AXuB1RDUosd9I2y_IJqvzGl5lKALWd0QMcZpwCq8eEl41nucOuoHx1USEZnHk4hUXNOGwQdQnOQmrYbTGvmtYzC1xG75MXKrTdYZYz1PhofFiOcKzX7KlkPB0QgoqK2j2zziykU0dnOpRjphVnIkfmv6hAN50BnX6MsnuLP79SWyq8tHtcw8qBiuHqB8DUDN1wfil8vfbqDtFY4C_VC4YW0WwIoOjIwgFbb2I-h_3dk734K1EBdEkW1pr4bJ5olrP5ttOolix1UV-gaxU",
+       </div>
-   },
+ 
-   {
+       {items.length === 0 ? (
-     slug: "cashmere-knit-sweater",
+         <div className="cart-empty">
-     name: "Cashmere Knit Sweater",
+           <span className="material-symbols-outlined cart-empty-icon">
-     price: 68000,
+             shopping_bag
-     size: "S",
+           </span>
-     color: "Alabaster",
+      
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [formatPrice, CartPage]
- **[problem-fix] Fixed null crash in Product — prevents null/undefined runtime crashes**: -   const [product, setProduct] = useState<Product | null>(null);
+   const { addItem } = useCart();
-   const [loading, setLoading] = useState(true);
+   const [product, setProduct] = useState<Product | null>(null);
-   const [selectedSize, setSelectedSize] = useState<string | null>(null);
+   const [loading, setLoading] = useState(true);
-   const [selectedColor, setSelectedColor] = useState<string | null>(null);
+   const [selectedSize, setSelectedSize] = useState<string | null>(null);
-   const [activeImage, setActiveImage] = useState(0);
+   const [selectedColor, setSelectedColor] = useState<string | null>(null);
-   const [added, setAdded] = useState(false);
+   const [activeImage, setActiveImage] = useState(0);
- 
+   const [added, setAdded] = useState(false);
-   useEffect(() => {
+ 
-     if (!slug) return;
+   useEffect(() => {
-     fetch(`/api/products/${slug}`)
+     if (!slug) return;
-       .then((r) => r.json())
+     fetch(`/api/products/${slug}`)
-       .then((data) => {
+       .then((r) => r.json())
-         setProduct(data.product || null);
+       .then((data) => {
-         setLoading(false);
+         setProduct(data.product || null);
-         // Select first color
+         setLoading(false);
-         if (data.product?.variants?.length) {
+         // Select first color
-           const colors = [...new Set(data.product.variants.map((v: Variant) => v.color))];
+         if (data.product?.variants?.length) {
-           if (colors.length > 0) setSelectedColor(colors[0] as string);
+           const colors = [...new Set(data.product.variants.map((v: Variant) => v.color))];
-         }
+           if (colors.length > 0) setSelectedColor(colors[0] as string);
-       })
+         }
-       .catch(() => setLoading(false));
+       })
-   }, [slug]);
+       .catch(() => setLoading(false));
- 
+   }, [slug]);
-   if (loading) {
+ 
-     return (
+   if (loading) {
-       <div className="product-page product-loading">
+     return (
-       
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [Variant, ProductImage, Product, formatPrice, ProductPage]
- **[what-changed] Replaced dependency FeaturedProducts — improves module reusability**: - import "./HomePage.css";
+ import FeaturedProducts from "../components/home/FeaturedProducts";
- 
+ import BrandStatement from "../components/home/BrandStatement";
- export default function HomePage() {
+ import "./HomePage.css";
-   return (
+ 
-     <div className="home-page">
+ export default function HomePage() {
-       <Hero />
+   return (
- 
+     <div className="home-page">
-       {/* Desktop: Asymmetric editorial lookbook grid */}
+       <Hero />
-       <EditorialLooks />
+ 
- 
+       {/* Desktop: Asymmetric editorial lookbook grid */}
-       {/* Desktop: CTA button */}
+       <EditorialLooks />
-       <section className="home-cta-desktop hide-mobile">
+ 
-         <button className="btn btn-primary btn-lg">
+       {/* Both: Brand philosophy statement */}
-           View Full Collection
+       <BrandStatement />
-         </button>
+ 
-       </section>
+       {/* Both: Featured product cards (2-col mobile, 4-col desktop) */}
- 
+       <FeaturedProducts />
-       {/* Mobile: Horizontal snap-scroll lookbook cards */}
+ 
-       <FloatingLookbook />
+       {/* Mobile: Horizontal snap-scroll lookbook cards */}
- 
+       <FloatingLookbook />
-       {/* Mobile: CTA + Tagline */}
+ 
-       <section className="home-cta-mobile hide-desktop">
+       {/* Desktop: CTA */}
-         <button className="btn btn-primary btn-full">
+       <section className="home-cta-desktop hide-mobile">
-           Explore Collection
+         <a href="/collection" className="btn btn-primary btn-lg">
-         </button>
+           View Full Collection
-         <p className="home-tagline">Curating the Digital Atelier</p>
+         </a>
-     </div>
+ 
-   );
+       {/* Mobile: CTA + Tagline */}
- }
+       <section className="home-cta-mobile hide-desktop">
- 
+         <a href="/collection" className="btn btn-primary btn-full">
+           Explore Collection
+         </a>
+         <p className="home-tagline">Curating the Digital Atelier</p>
+       </section>
+ 
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [HomePage]
- **[what-changed] what-changed in HomePage.css**: -   padding-bottom: 2rem;
+ }
- }
+ 
- 
+ /* ═══════════════════════════════════════
- /* CTA Section */
+    Desktop CTA
- .home-cta {
+    ═══════════════════════════════════════ */
-   padding: 1rem 2rem;
+ .home-cta-desktop {
-   flex-direction: column;
+   justify-content: center;
-   align-items: center;
+   padding: 4rem 2rem 2rem;
- .home-cta .btn-full {
+ /* ═══════════════════════════════════════
-   width: 100%;
+    Mobile CTA
-   max-width: 400px;
+    ═══════════════════════════════════════ */
-   padding: 1.5rem;
+ .home-cta-mobile {
-   border-radius: var(--radius-pill);
+   padding: 1rem 2rem 2rem;
-   font-family: var(--font-heading);
+   display: flex;
-   font-size: 0.875rem;
+   flex-direction: column;
-   letter-spacing: 0.15em;
+   align-items: center;
-   text-transform: uppercase;
+ }
-   background: var(--color-primary);
+ 
-   color: var(--color-on-primary);
+ .home-cta-mobile .btn-full {
-   box-shadow: 0 8px 24px rgba(96, 94, 91, 0.1);
+   width: 100%;
-   transition: all var(--duration-slow) var(--ease-fluid);
+   max-width: 400px;
- }
+   padding: 1.5rem;
- 
+   border-radius: var(--radius-pill);
- .home-cta .btn-full:active {
+ }
-   transform: scale(0.95);
+ 
- }
+ .home-tagline {
- 
+   margin-top: 2rem;
- .home-tagline {
+   font-family: var(--font-heading);
-   margin-top: 2rem;
+   font-size: 10px;
-   font-family: var(--font-heading);
+   letter-spacing: 0.3em;
-   font-size: 10px;
+   text-transform: uppercase;
-   letter-spacing: 0.3em;
+   color: rgba(27, 28, 24, 0.4);
-   text-transform: uppercase;
+ }
-   color: rgba(27, 28, 24, 0.4);
+ 
- }
- 

📌 IDE AST Context: Modified symbols likely include [.home-page, .home-cta-desktop, .home-cta-mobile, .home-cta-mobile .btn-full, .home-tagline]
- **[what-changed] Replaced dependency EditorialLooks — improves module reusability**: - import "./HomePage.css";
+ import EditorialLooks from "../components/home/EditorialLooks";
- 
+ import "./HomePage.css";
- export default function HomePage() {
+ 
-   return (
+ export default function HomePage() {
-     <div className="home-page">
+   return (
-       <Hero />
+     <div className="home-page">
-       <FloatingLookbook />
+       <Hero />
-       {/* CTA Section */}
+       {/* Desktop: Asymmetric editorial lookbook grid */}
-       <section className="home-cta">
+       <EditorialLooks />
-         <button className="btn btn-primary btn-full">
+ 
-           Explore Collection
+       {/* Desktop: CTA button */}
-         </button>
+       <section className="home-cta-desktop hide-mobile">
-         <p className="home-tagline">Curating the Digital Atelier</p>
+         <button className="btn btn-primary btn-lg">
-       </section>
+           View Full Collection
-     </div>
+         </button>
-   );
+       </section>
- }
+ 
- 
+       {/* Mobile: Horizontal snap-scroll lookbook cards */}
+       <FloatingLookbook />
+ 
+       {/* Mobile: CTA + Tagline */}
+       <section className="home-cta-mobile hide-desktop">
+         <button className="btn btn-primary btn-full">
+           Explore Collection
+         </button>
+         <p className="home-tagline">Curating the Digital Atelier</p>
+       </section>
+     </div>
+   );
+ }
+ 

📌 IDE AST Context: Modified symbols likely include [HomePage]
- **[what-changed] what-changed in HomePage.css**: - }
+   padding-bottom: 2rem;
- 
+ }
+ 
+ /* CTA Section */
+ .home-cta {
+   padding: 1rem 2rem;
+   display: flex;
+   flex-direction: column;
+   align-items: center;
+ }
+ 
+ .home-cta .btn-full {
+   width: 100%;
+   max-width: 400px;
+   padding: 1.5rem;
+   border-radius: var(--radius-pill);
+   font-family: var(--font-heading);
+   font-size: 0.875rem;
+   letter-spacing: 0.15em;
+   text-transform: uppercase;
+   background: var(--color-primary);
+   color: var(--color-on-primary);
+   box-shadow: 0 8px 24px rgba(96, 94, 91, 0.1);
+   transition: all var(--duration-slow) var(--ease-fluid);
+ }
+ 
+ .home-cta .btn-full:active {
+   transform: scale(0.95);
+ }
+ 
+ .home-tagline {
+   margin-top: 2rem;
+   font-family: var(--font-heading);
+   font-size: 10px;
+   letter-spacing: 0.3em;
+   text-transform: uppercase;
+   color: rgba(27, 28, 24, 0.4);
+ }
+ 

📌 IDE AST Context: Modified symbols likely include [.home-page, .home-cta, .home-cta .btn-full, .home-cta .btn-full:active, .home-tagline]
- **[what-changed] Replaced dependency FloatingLookbook — improves module reusability**: - import Marquee from "../components/home/Marquee";
+ import FloatingLookbook from "../components/home/FloatingLookbook";
- import FeaturedLooks from "../components/home/FeaturedLooks";
+ import "./HomePage.css";
- import "./HomePage.css";
+ 
- 
+ export default function HomePage() {
- export default function HomePage() {
+   return (
-   return (
+     <div className="home-page">
-     <div className="home-page">
+       <Hero />
-       <Hero />
+       <FloatingLookbook />
-       <Marquee />
+ 
-       <FeaturedLooks />
+       {/* CTA Section */}
-     </div>
+       <section className="home-cta">
-   );
+         <button className="btn btn-primary btn-full">
- }
+           Explore Collection
- 
+         </button>
+         <p className="home-tagline">Curating the Digital Atelier</p>
+       </section>
+     </div>
+   );
+ }
+ 

📌 IDE AST Context: Modified symbols likely include [HomePage]
- **[what-changed] Removed react-router-dom dependency — improves module reusability**: - import { Link } from "react-router-dom";
+ import "./Hero.css";
- import "./Hero.css";
+ 
- 
+ export default function Hero() {
- export default function Hero() {
+   return (
-   return (
+     <section className="hero">
-     <section className="hero">
+       {/* Background image — used by both layouts */}
-       {/* Background image — used by both layouts */}
+       <div
-       <div
+         className="hero-bg"
-         className="hero-bg"
+         style={{
-         style={{
+           backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAlw4lqR7GtX5kOmlpvvgD7wUP_lo1yNwrqlKp5edeoZ4UaHJg-vHO9rewlTInm20JcXABk7M4N0hOpd3487qLsbcyrSAACYPMsyalyrGSwfd--xwEukC-YWb9s6IcMpiO2xqCAx8CCrAi8TugtGVLuTVDUka_dqygahfQPiPxu4iojHXiCwm4MVJJRVGBj3Ae4bqu2uDywml2ERRmEYYYgepTq4TX5Vh34UAgpTp05jrKGudNFtwyqkQf06Z09wcOMhMPShCHg7RE1')`,
-           backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAlw4lqR7GtX5kOmlpvvgD7wUP_lo1yNwrqlKp5edeoZ4UaHJg-vHO9rewlTInm20JcXABk7M4N0hOpd3487qLsbcyrSAACYPMsyalyrGSwfd--xwEukC-YWb9s6IcMpiO2xqCAx8CCrAi8TugtGVLuTVDUka_dqygahfQPiPxu4iojHXiCwm4MVJJRVGBj3Ae4bqu2uDywml2ERRmEYYYgepTq4TX5Vh34UAgpTp05jrKGudNFtwyqkQf06Z09wcOMhMPShCHg7RE1')`,
+         }}
-         }}
+       />
-       />
+       <div className="hero-overlay" />
-       <div className="hero-overlay" />
+ 
- 
+       {/* Desktop: Centered text */}
-       {/* Desktop: Centered text */}
+       <div className="hero-content-desktop hide-mobile">
-       <div className="hero-content-desktop hide-mobile">
+         <h1 className="hero-heading-desktop animate-fadeInUp">
-         <h1 className="hero-heading-desktop animate-fadeInUp">
+           Fluid Modernity
-           Fluid Modernity
+         </h1>
-         </h1>
+         <p className="hero-subtext-desktop animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
-         <p className="hero-subtext-desktop animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
+           Immersive brand introdu
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [Hero]
- **[how-it-works] how-it-works in Hero.tsx**: -       {/* Full-bleed editorial image */}
+       {/* Background image — used by both layouts */}
-       <img
+       <div
-         className="hero-image"
+         className="hero-bg"
-         src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJQsBxQYXpPBzpwiHGHyyUEGPDOOBH504VFOziqKDJEUeaiKbWoplXXj8sLrGu4zaemegkFE6_qV9eTkOF5Mxvgpjja0Gd7gGiakWlC7TO5D8gk1HKmtOxgRH_uR4VW924pKXbR19MrvflLoFIQIwXlnh0EuukbDSgrr1SfMf6VP9VhAtq0CDi2F3jZFGKktC-uUzKfJ_qXqtTHXq5qG-2T8rTs_IZ0xvtELHeeaB3Turp3byP4GRPpskM8sPUSqwJXambku8D17Fq"
+         style={{
-         alt="High fashion editorial shot of a woman in flowing silk Alabaster garments"
+           backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAlw4lqR7GtX5kOmlpvvgD7wUP_lo1yNwrqlKp5edeoZ4UaHJg-vHO9rewlTInm20JcXABk7M4N0hOpd3487qLsbcyrSAACYPMsyalyrGSwfd--xwEukC-YWb9s6IcMpiO2xqCAx8CCrAi8TugtGVLuTVDUka_dqygahfQPiPxu4iojHXiCwm4MVJJRVGBj3Ae4bqu2uDywml2ERRmEYYYgepTq4TX5Vh34UAgpTp05jrKGudNFtwyqkQf06Z09wcOMhMPShCHg7RE1')`,
-       />
+         }}
- 
+       />
-       {/* Gradient overlay */}
+       <div className="hero-overlay" />
-       <div className="hero-gradient" />
+ 
- 
+       {/* Desktop: Centered text */}
-       {/* Text overlay at bottom */}
+       <div className="hero-content-desktop hide-mobile">
-       <div className="hero-content">
+         <h1 className="hero-heading-desktop animate-fadeInUp">
-         <div className="hero-text-block animate-fadeInUp">
+           Fluid Modernity
-           <p className="hero-label">The New Era</p>
+         </h1>
-           <h2 className="hero-title">
+         <p className="hero-subtext-desktop animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
-             AUTUMN<br />
+           Immersive brand introduction
-             <span className="hero-title-italic">/WINTER</span>
+         </p>
-           </h2>
+         <div className="hero-explore animate-fadeInUp" style={{ animationDelay: "0.4s" }}>
-         </div>
+           <button classNa
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [Hero]
- **[how-it-works] how-it-works in Hero.tsx**: -       <div className="hero-bg">
+       {/* Full-bleed editorial image */}
-         <div className="hero-gradient" />
+       <img
-       </div>
+         className="hero-image"
- 
+         src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJQsBxQYXpPBzpwiHGHyyUEGPDOOBH504VFOziqKDJEUeaiKbWoplXXj8sLrGu4zaemegkFE6_qV9eTkOF5Mxvgpjja0Gd7gGiakWlC7TO5D8gk1HKmtOxgRH_uR4VW924pKXbR19MrvflLoFIQIwXlnh0EuukbDSgrr1SfMf6VP9VhAtq0CDi2F3jZFGKktC-uUzKfJ_qXqtTHXq5qG-2T8rTs_IZ0xvtELHeeaB3Turp3byP4GRPpskM8sPUSqwJXambku8D17Fq"
-       <div className="hero-content">
+         alt="High fashion editorial shot of a woman in flowing silk Alabaster garments"
-         <div className="hero-label text-label animate-fadeInUp">Autumn/Winter 2026</div>
+       />
-         <h1 className="hero-title animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
+       {/* Gradient overlay */}
-           <span className="hero-title-line">Fluid</span>
+       <div className="hero-gradient" />
-           <span className="hero-title-line hero-title-italic">Modernity</span>
+ 
-         </h1>
+       {/* Text overlay at bottom */}
- 
+       <div className="hero-content">
-         <p className="hero-subtitle animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
+         <div className="hero-text-block animate-fadeInUp">
-           Curating the digital atelier where architectural silhouettes meet organic elegance
+           <p className="hero-label">The New Era</p>
-         </p>
+           <h2 className="hero-title">
- 
+             AUTUMN<br />
-         <div className="hero-cta animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
+             <span className="hero-title-italic">/WINTER</span>
-           <Link to="/collection" className="btn btn-accent btn-lg">
+           </h2>
-             Explore Collection
+         </div>
-           </Link>
+       </div>
-         </div>
+     </section>
- 
+   );
-         <div className="hero-scroll-indicator animate-fadeIn" style={{ animation
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [Hero]
