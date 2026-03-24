import { Link } from "react-router-dom";
import LookCard from "./LookCard";
import "./FeaturedLooks.css";

const featuredLooks = [
  {
    id: 1,
    title: "Structured Wool Overcoat",
    category: "Outerwear",
    price: "$1,280",
    image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&h=800&fit=crop",
    slug: "structured-wool-overcoat",
  },
  {
    id: 2,
    title: "Cashmere Blend Sweater",
    category: "Knitwear",
    price: "$680",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cda3a95?w=600&h=800&fit=crop",
    slug: "cashmere-blend-sweater",
  },
  {
    id: 3,
    title: "Deconstructed Blazer",
    category: "Outerwear",
    price: "$950",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
    slug: "deconstructed-blazer",
  },
  {
    id: 4,
    title: "Silk Drape Dress",
    category: "Dresses",
    price: "$1,450",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop",
    slug: "silk-drape-dress",
  },
];

export default function FeaturedLooks() {
  return (
    <section className="featured section">
      <div className="container">
        <div className="featured-header">
          <div>
            <span className="text-label">Curated Selection</span>
            <h2 className="featured-title">The Season's<br /><em>Defining Pieces</em></h2>
          </div>
          <Link to="/collection" className="btn btn-outline hide-mobile">
            View Full Collection
          </Link>
        </div>

        <div className="featured-grid stagger-children">
          {featuredLooks.map((look) => (
            <LookCard key={look.id} {...look} />
          ))}
        </div>

        <div className="featured-cta hide-desktop">
          <Link to="/collection" className="btn btn-outline" style={{ width: "100%" }}>
            View Full Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
