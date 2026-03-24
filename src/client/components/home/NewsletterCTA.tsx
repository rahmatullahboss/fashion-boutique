import { Link } from "react-router-dom";
import "./NewsletterCTA.css";

export default function NewsletterCTA() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector<HTMLInputElement>("input[type=email]");
    if (input?.value) {
      input.value = "";
      // Show success state
      const btn = form.querySelector<HTMLButtonElement>("button");
      if (btn) {
        btn.textContent = "✓ Thank you";
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = "Subscribe";
          btn.disabled = false;
        }, 3000);
      }
    }
  };

  return (
    <section className="newsletter-cta" aria-label="Newsletter signup">
      {/* Trust signals strip */}
      <div className="trust-strip">
        <div className="trust-item">
          <span className="material-symbols-outlined">local_shipping</span>
          <span>Free shipping over $150</span>
        </div>
        <div className="trust-item">
          <span className="material-symbols-outlined">cached</span>
          <span>Free returns within 14 days</span>
        </div>
        <div className="trust-item">
          <span className="material-symbols-outlined">verified</span>
          <span>Ethically sourced materials</span>
        </div>
        <div className="trust-item">
          <span className="material-symbols-outlined">lock</span>
          <span>Secure checkout</span>
        </div>
      </div>

      {/* Newsletter */}
      <div className="newsletter-inner">
        <div className="newsletter-copy">
          <span className="newsletter-eyebrow">Stay in the Atelier</span>
          <h2 className="newsletter-heading">New Arrivals. Quiet Drops. Yours First.</h2>
          <p className="newsletter-sub">
            Join our circle of considered dressers. Seasonal lookbooks, early access to new collections, and quiet styling notes — never spam.
          </p>
        </div>
        <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            placeholder="Your email address"
            required
            aria-label="Email address"
            className="newsletter-input"
          />
          <button type="submit" className="newsletter-btn">Subscribe</button>
        </form>
        <p className="newsletter-note">Unsubscribe anytime. No noise, just craft.</p>
      </div>

      {/* Persona links — programmatic SEO */}
      <div className="persona-links">
        <span className="persona-label">Discover by style</span>
        <div className="persona-chips">
          <Link to="/for/modest-workwear" className="persona-chip">Modest Workwear</Link>
          <Link to="/for/hijab-outerwear" className="persona-chip">Hijab Outerwear</Link>
          <Link to="/for/modest-occasionwear" className="persona-chip">Occasion Wear</Link>
          <Link to="/for/modest-casual" className="persona-chip">Casual Modest</Link>
          <Link to="/for/minimalist-hijab" className="persona-chip">Minimalist Hijab</Link>
        </div>
      </div>
    </section>
  );
}
