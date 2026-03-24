import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer hide-mobile">
      {/* JOIN THE ATELIER — Big statement section */}
      <div className="footer-newsletter-section">
        <h2 className="footer-headline">
          JOIN THE<br />ATELIER
        </h2>
        <div className="footer-email-form">
          <form className="footer-input-wrap" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="footer-email-input"
              aria-label="Email address"
            />
            <button type="submit" className="footer-submit-btn" aria-label="Subscribe">
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>
          <p className="footer-subscribe-text">
            Subscribe to receive private invitations to archive<br />
            sales and early access to new collections.
          </p>
        </div>
      </div>
    </footer>
  );
}
