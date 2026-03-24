import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      {/* LCP hero image — real img tag for browser preload discovery */}
      <img
        className="hero-bg"
        src="/hero-hijab.webp"
        alt="Atelier Alabaster hero"
        width={1920}
        height={1080}
        fetchPriority="high"
        loading="eager"
        decoding="sync"
      />
      <div className="hero-overlay" />

      {/* Desktop: Centered text */}
      <div className="hero-content-desktop hide-mobile">
        <h1 className="hero-heading-desktop animate-fadeInUp">
          Fluid Modernity
        </h1>
        <p className="hero-subtext-desktop animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
          Immersive brand introduction
        </p>
        <div className="hero-explore animate-fadeInUp" style={{ animationDelay: "0.4s" }}>
          <button className="hero-explore-btn">
            <span>Explore</span>
            <span className="material-symbols-outlined">arrow_downward</span>
          </button>
        </div>
      </div>

      {/* Mobile: Bottom-aligned text */}
      <div className="hero-content-mobile hide-desktop">
        <div className="hero-text-block animate-fadeInUp">
          <p className="hero-label">The New Era</p>
          <h2 className="hero-title-mobile">
            AUTUMN<br />
            <span className="hero-title-italic">/WINTER</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
