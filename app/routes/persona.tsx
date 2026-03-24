import { useParams, Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import "../styles/PersonaPage.css";

const PERSONAS: Record<
  string,
  {
    h1: string;
    title: string;
    description: string;
    keywords: string;
    tagline: string;
    body: string;
    products: { slug: string; name: string; price: string; image: string }[];
    faqs: { q: string; a: string }[];
  }
> = {
  "modest-workwear": {
    h1: "Modest Workwear for the Modern Professional",
    title: "Modest Workwear Collection — Atelier Alabaster",
    description: "Discover Atelier Alabaster's curated modest workwear pieces. Tailored coats, structured trousers and elegant blouses designed for the modern professional Muslim woman.",
    keywords: "modest workwear, hijab work outfit, professional modest fashion, Islamic work clothes, modest office wear, hijab professional look",
    tagline: "Dress with authority. Move with ease.",
    body: "The office demands presence. We believe modest dressing amplifies it. Our Autumn/Winter 2026 workwear edit brings together structured wool overcoats, high-waisted pleated trousers, and fluid silk blouses — each piece calibrated for the woman who leads without compromise.",
    products: [
      { slug: "structured-wool-overcoat", name: "Structured Wool Overcoat", price: "$1,250", image: "/products/wool-overcoat.webp" },
      { slug: "pleated-wide-trousers", name: "Pleated Wide Trousers", price: "$280", image: "/products/pleated-trousers.webp" },
      { slug: "silk-drape-blouse", name: "Silk Drape Blouse", price: "$420", image: "/products/silk-blouse.webp" },
      { slug: "linen-field-jacket", name: "Linen Field Jacket", price: "$580", image: "/products/linen-jacket.webp" },
    ],
    faqs: [
      { q: "What makes modest workwear different?", a: "Modest workwear combines professional silhouettes with full coverage — longer hemlines, higher necklines, and long sleeves — without sacrificing tailoring or elegance." },
      { q: "Are these pieces hijab-friendly?", a: "Every piece in our workwear edit is designed to complement hijab styling — loose silhouettes that drape naturally and breathable fabrics that layer comfortably." },
      { q: "How should I style the Wool Overcoat for work?", a: "Layer the Structured Wool Overcoat over our Silk Drape Blouse and Pleated Trousers for a complete, boardroom-ready outfit that transitions beautifully into evening." },
    ],
  },
  "hijab-outerwear": {
    h1: "Hijab-Friendly Outerwear — Modest Coats & Jackets",
    title: "Modest Outerwear for Hijabis — Atelier Alabaster",
    description: "Shop Atelier Alabaster's modest outerwear edit: structured wool overcoats, linen field jackets, and more — designed to complement hijab styling with elegance and warmth.",
    keywords: "hijab outerwear, modest coat, hijab coat, modest winter coat, hijab jacket, Islamic outerwear, long coat hijab",
    tagline: "Wrap up. Stand out.",
    body: "Outerwear is the first impression you make — and for the hijab-wearing woman, it frames everything beneath. Our outerwear is structured to move gracefully over hijab, with clean lapels that sit well and lengths that provide full coverage. No compromises. Only coats worth reaching for.",
    products: [
      { slug: "structured-wool-overcoat", name: "Structured Wool Overcoat", price: "$1,250", image: "/products/wool-overcoat.webp" },
      { slug: "linen-field-jacket", name: "Linen Field Jacket", price: "$580", image: "/products/linen-jacket.webp" },
    ],
    faqs: [
      { q: "What length works best for hijab outerwear?", a: "Knee-length to midi-length coats (100–115cm) provide the most balanced silhouette when worn over hijab, covering the hips without overwhelming the frame." },
      { q: "What fabrics are best for modest outerwear?", a: "Wool and wool blends offer structure and warmth. Linen works beautifully for transitional seasons. Both drape naturally over hijab without adding bulk." },
      { q: "Do your coats run large enough to layer?", a: "Our coats are cut with a relaxed, structured fit — designed to layer comfortably over knitwear and without pulling at the shoulders when wearing hijab." },
    ],
  },
  "modest-occasionwear": {
    h1: "Modest Occasionwear — Elegant Dresses for Special Events",
    title: "Modest Occasion Wear — Atelier Alabaster",
    description: "Atelier Alabaster's modest occasionwear: flowing maxi dresses, elegant blouses and tailored separates for weddings, Eid, and special occasions. Fully hijab-compatible.",
    keywords: "modest occasion wear, hijab dress, modest wedding guest outfit, Eid outfit, modest maxi dress, Islamic formal wear, hijab formal outfit",
    tagline: "For the moments that stay with you.",
    body: "The occasions that matter most deserve dressing that matches their weight. Our occasionwear edit brings together flowing wrap maxi dresses in rich terracotta, draping silk blouses in ivory, and tailored pieces that feel ceremonial without being costume. Designed for Eid, weddings, and every gathering that deserves intention.",
    products: [
      { slug: "silk-drape-blouse", name: "Silk Drape Blouse", price: "$420", image: "/products/silk-blouse.webp" },
      { slug: "cashmere-knit-sweater", name: "Cashmere Knit Sweater", price: "$680", image: "/products/cashmere-sweater.webp" },
      { slug: "pleated-wide-trousers", name: "Pleated Wide Trousers", price: "$280", image: "/products/pleated-trousers.webp" },
    ],
    faqs: [
      { q: "What to wear to a wedding as a hijabi guest?", a: "A fluid maxi dress or a silk blouse paired with wide-leg trousers in muted tones creates an elegant, modest wedding guest look. Layer with a refined coat for evening events." },
      { q: "What are the best Eid outfit ideas?", a: "For Eid, we recommend flowing fabrics in ivory, terracotta, or sage — colours that photograph beautifully and feel celebratory without being loud. Our Silk Drape Blouse with Pleated Trousers is a favourite." },
      { q: "Can modest occasionwear look high-fashion?", a: "Absolutely. Modesty and high fashion are not in conflict. Clean silhouettes, premium fabrics, and intentional colour palettes — these are the pillars of truly elegant modest dressing." },
    ],
  },
  "modest-casual": {
    h1: "Modest Casual Wear — Relaxed, Elevated Everyday Dressing",
    title: "Modest Casual Clothing — Atelier Alabaster",
    description: "Discover Atelier Alabaster's modest casual edit: relaxed cotton shirts, drawstring trousers, and soft knitwear for everyday hijab-friendly dressing with understated elegance.",
    keywords: "modest casual wear, hijab casual outfit, modest everyday clothes, relaxed modest fashion, casual hijab style, modest basics",
    tagline: "Effortless. Covered. Considered.",
    body: "The best wardrobe is the one you reach for without thinking. Our casual edit is built around honest fabrics — crisp cotton poplin, relaxed linen drawstring pants, soft cashmere knitwear. Pieces that make modesty feel natural, never laboured. Built for the days between the occasions.",
    products: [
      { slug: "cotton-poplin-shirt", name: "Cotton Poplin Shirt", price: "$195", image: "/products/cotton-shirt.webp" },
      { slug: "relaxed-drawstring-pant", name: "Relaxed Drawstring Pant", price: "$165", image: "/products/drawstring-pant.webp" },
      { slug: "cashmere-knit-sweater", name: "Cashmere Knit Sweater", price: "$680", image: "/products/cashmere-sweater.webp" },
    ],
    faqs: [
      { q: "How do I build a modest capsule wardrobe?", a: "Start with neutral foundational pieces: a white cotton oversized shirt, relaxed trousers, and a soft knit. These three form the backbone of a modest capsule wardrobe that dresses up or down effortlessly." },
      { q: "What modest casual pieces are most versatile?", a: "An oversized cotton poplin shirt works as outerwear, a standalone top, or tucked into trousers. Drawstring linen pants work from beach to city. Both are endlessly versatile." },
      { q: "How should a hijab style casual outfits?", a: "Layer tones rather than matching them exactly — a taupe hijab with a cream shirt and stone trousers creates a tonal, editorial look that feels curated rather than coordinated." },
    ],
  },
  "minimalist-hijab": {
    h1: "Minimalist Hijab Fashion — Clean Silhouettes, Quiet Luxury",
    title: "Minimalist Hijab Style — Atelier Alabaster",
    description: "Atelier Alabaster for the minimalist hijabi: structured neutrals, clean lines, and quiet luxury. Discover our edit of understated modest fashion for the woman who dresses with intention.",
    keywords: "minimalist hijab fashion, quiet luxury modest, minimal modest style, neutral hijab outfit, clean modest aesthetic, understated Islamic fashion",
    tagline: "Silence is the loudest statement.",
    body: "Minimalism in modest fashion is not absence — it is precision. The right overcoat. The perfectly weighted knit. The trouser with a crease that holds. Atelier Alabaster exists for the woman who has decided that less, done perfectly, is enough. Our edit skews always to structure over decoration, fabric over pattern, and quality over quantity.",
    products: [
      { slug: "structured-wool-overcoat", name: "Structured Wool Overcoat", price: "$1,250", image: "/products/wool-overcoat.webp" },
      { slug: "cashmere-knit-sweater", name: "Cashmere Knit Sweater", price: "$680", image: "/products/cashmere-sweater.webp" },
      { slug: "pleated-wide-trousers", name: "Pleated Wide Trousers", price: "$280", image: "/products/pleated-trousers.webp" },
      { slug: "cotton-poplin-shirt", name: "Cotton Poplin Shirt", price: "$195", image: "/products/cotton-shirt.webp" },
    ],
    faqs: [
      { q: "What is minimalist hijab fashion?", a: "Minimalist hijab fashion emphasises clean silhouettes, neutral or muted colour palettes, and high-quality fabrics over maximalist decoration. The philosophy: fewer, better pieces that work together effortlessly." },
      { q: "What colours define a minimalist hijab wardrobe?", a: "Alabaster, charcoal, sage, stone, and camel form the backbone of a minimalist modest wardrobe. These colours layer naturally without clashing and photograph beautifully in any light." },
      { q: "Is quiet luxury compatible with modest fashion?", a: "Quiet luxury — premium materials, restrained branding, precise tailoring — is deeply compatible with modest fashion. In fact, covering more means fabric quality becomes even more central to the look." },
    ],
  },
};

const formatPersonaSchema = (persona: (typeof PERSONAS)[string], slug: string) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": persona.h1,
  "description": persona.description,
  "url": `https://atelier-alabaster.rahmatullahzisan.workers.dev/for/${slug}`,
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://atelier-alabaster.rahmatullahzisan.workers.dev/" },
      { "@type": "ListItem", "position": 2, "name": "Collections", "item": "https://atelier-alabaster.rahmatullahzisan.workers.dev/collection" },
      { "@type": "ListItem", "position": 3, "name": persona.h1, "item": `https://atelier-alabaster.rahmatullahzisan.workers.dev/for/${slug}` },
    ],
  },
});

const formatFAQSchema = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(({ q, a }) => ({
    "@type": "Question",
    "name": q,
    "acceptedAnswer": { "@type": "Answer", "text": a },
  })),
});

export default function PersonaPage() {
  const { persona } = useParams<{ persona: string }>();
  const data = persona ? PERSONAS[persona] : null;

  useSEO(
    data
      ? {
          title: data.title,
          description: data.description,
          keywords: data.keywords,
          ogImage: data.products[0]?.image,
          ogType: "website",
          canonicalPath: `/for/${persona}`,
          jsonLd: [formatPersonaSchema(data, persona!), formatFAQSchema(data.faqs)],
        }
      : {
          title: "Modest Fashion — Atelier Alabaster",
          description: "Curated modest fashion for the modern woman.",
        }
  );

  if (!data) {
    return (
      <div className="persona-notfound">
        <h1>Style Not Found</h1>
        <p>Explore our full collection instead.</p>
        <Link to="/collection">Browse Collection</Link>
      </div>
    );
  }

  return (
    <div className="persona-page">
      {/* Breadcrumb */}
      <nav className="persona-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/collection">Collection</Link>
        <span>/</span>
        <span>{data.h1}</span>
      </nav>

      {/* Hero */}
      <header className="persona-hero">
        <span className="persona-hero-eyebrow">Atelier Alabaster</span>
        <h1 className="persona-hero-h1">{data.h1}</h1>
        <p className="persona-hero-tagline">{data.tagline}</p>
        <p className="persona-hero-body">{data.body}</p>
      </header>

      {/* Products */}
      <section className="persona-products" aria-label="Recommended products">
        <h2 className="persona-section-title">The Edit</h2>
        <div className="persona-product-grid">
          {data.products.map((p) => (
            <Link key={p.slug} to={`/product/${p.slug}`} className="product-card">
              <div className="product-card-image">
                <img src={p.image} alt={p.name} loading="lazy" />
              </div>
              <div className="product-card-info">
                <h3 className="product-card-name">{p.name}</h3>
                <p className="product-card-price">{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="persona-faq" aria-label="Frequently asked questions">
        <h2 className="persona-section-title">Questions Answered</h2>
        <div className="persona-faq-list">
          {data.faqs.map((faq, i) => (
            <details key={i} className="faq-item">
              <summary className="faq-question">{faq.q}</summary>
              <p className="faq-answer">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Related personas */}
      <section className="persona-related">
        <h2 className="persona-section-title">More Styles</h2>
        <div className="persona-chips">
          {Object.entries(PERSONAS)
            .filter(([slug]) => slug !== persona)
            .map(([slug, p]) => (
              <Link key={slug} to={`/for/${slug}`} className="persona-chip">
                {p.h1.split("—")[0]?.trim()}
              </Link>
            ))}
        </div>
      </section>

      {/* CTA */}
      <div className="persona-cta">
        <Link to="/collection" className="btn-persona-shopall">
          Shop Full Collection
        </Link>
      </div>
    </div>
  );
}
