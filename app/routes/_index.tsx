import Hero from "../components/home/Hero";
import FloatingLookbook from "../components/home/FloatingLookbook";
import EditorialLooks from "../components/home/EditorialLooks";
import FeaturedProducts from "../components/home/FeaturedProducts";
import BrandStatement from "../components/home/BrandStatement";
import "../styles/HomePage.css";

export default function HomePage() {
  return (
    <div className="home-page">
      <Hero />

      {/* Desktop: Asymmetric editorial lookbook grid */}
      <EditorialLooks />

      {/* Both: Brand philosophy statement */}
      <BrandStatement />

      {/* Both: Featured product cards (2-col mobile, 4-col desktop) */}
      <FeaturedProducts />

      {/* Mobile: Horizontal snap-scroll lookbook cards */}
      <FloatingLookbook />

      {/* Desktop: CTA */}
      <section className="home-cta-desktop hide-mobile">
        <a href="/collection" className="btn btn-primary btn-lg">
          View Full Collection
        </a>
      </section>

      {/* Mobile: CTA + Tagline */}
      <section className="home-cta-mobile hide-desktop">
        <a href="/collection" className="btn btn-primary btn-full">
          Explore Collection
        </a>
        <p className="home-tagline">Curating the Digital Atelier</p>
      </section>
    </div>
  );
}
