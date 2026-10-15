import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/CheckoutPage.css";

const formatPrice = (cents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = 0;
  const total = subtotal + shipping;

  const [email, setEmail] = useState("");

  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
          customerEmail: email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Checkout failed");
      }

      // Preserve cart when checkout is cancelled; clear only after confirmed payment.
      window.location.href = data.data.checkoutUrl;
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <span className="material-symbols-outlined checkout-empty-icon">shopping_bag</span>
          <h2>Your cart is empty</h2>
          <p>Add some items before checking out.</p>
          <Link to="/collection" className="btn-back-shop">
            Browse Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <Link to="/cart" className="checkout-back">← Back to Cart</Link>
        <h1 className="checkout-title">Checkout</h1>
      </div>

      <form className="checkout-layout" onSubmit={handleStripeCheckout}>
        {/* Left: Form */}
        <div className="checkout-form">

          {/* Contact */}
          <section className="form-section">
            <h3 className="form-section-title">Contact</h3>
            <input
              type="email"
              placeholder="Email address"
              required
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </section>

          {/* Address is collected once, by Stripe, not silently discarded here. */}
          <section className="form-section">
            <h3 className="form-section-title">Shipping</h3>
            <p>Stripe Checkout will securely collect your shipping address after confirming product price and availability.</p>
          </section>

          {/* Payment — Stripe branded */}
          <section className="form-section">
            <h3 className="form-section-title">Payment</h3>
            <div className="stripe-payment-block">
              <div className="stripe-payment-header">
                <svg viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg" width="46" height="19" aria-label="Stripe">
                  <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.45.94V6.27h3.96l.1 1.05c.55-.73 1.75-1.33 3.31-1.33 3.51 0 6.07 2.99 6.07 7.5 0 4.94-2.84 6.81-6.07 6.81zm-.58-11.03c-1.06 0-2.01.48-2.3 1.37v4.99c.3.85 1.27 1.32 2.3 1.32 1.7 0 2.5-1.35 2.5-3.9 0-2.25-.84-3.78-2.5-3.78zM22.27 20.3c-1.44 0-2.32-.6-2.9-1.04l-.01 4.63-4.45.94V6.27h3.96l.1 1.05c.55-.73 1.75-1.33 3.31-1.33 3.51 0 6.07 2.99 6.07 7.5 0 4.94-2.85 6.81-6.08 6.81zm-.58-11.03c-1.06 0-2.01.48-2.3 1.37v4.99c.3.85 1.27 1.32 2.3 1.32 1.7 0 2.5-1.35 2.5-3.9 0-2.25-.84-3.78-2.5-3.78zM13.74 20H9.27V6.27h4.47V20zM11.5 4.58A2.58 2.58 0 1 1 11.5-.5a2.58 2.58 0 0 1 0 5.08zM7.85 4.82L3.5 5.77V2.86L7.85 1.9l-.01 2.92zM3.5 6.27H7.9V20H3.5V6.27z" fill="#635BFF"/>
                </svg>
                <span className="stripe-secure-label">
                  <span className="material-symbols-outlined" style={{fontSize:"14px"}}>lock</span>
                  Secure Payment
                </span>
              </div>

              <p className="stripe-payment-desc">
                You will be securely redirected to Stripe's official checkout to enter your card details. Your payment info is never stored on our servers.
              </p>

              <div className="stripe-accepted-cards">
                {/* Visa */}
                <div className="stripe-card-badge">
                  <svg viewBox="0 0 38 24" width="38" height="24"><rect width="38" height="24" rx="4" fill="#1A1F71"/><text x="19" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial">VISA</text></svg>
                </div>
                {/* Mastercard */}
                <div className="stripe-card-badge">
                  <svg viewBox="0 0 38 24" width="38" height="24"><rect width="38" height="24" rx="4" fill="#fff" stroke="#e0dcd4"/><circle cx="14" cy="12" r="7" fill="#EB001B" opacity="0.9"/><circle cx="24" cy="12" r="7" fill="#F79E1B" opacity="0.9"/><path d="M19 6.5a7 7 0 0 1 0 11A7 7 0 0 1 19 6.5z" fill="#FF5F00"/></svg>
                </div>
                {/* Amex */}
                <div className="stripe-card-badge">
                  <svg viewBox="0 0 38 24" width="38" height="24"><rect width="38" height="24" rx="4" fill="#007BC1"/><text x="19" y="16" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="bold" fontFamily="Arial">AMEX</text></svg>
                </div>
                {/* Apple Pay */}
                <div className="stripe-card-badge">
                  <svg viewBox="0 0 38 24" width="38" height="24"><rect width="38" height="24" rx="4" fill="#000"/><text x="5" y="16" fill="white" fontSize="10" fontFamily="Arial"> Pay</text></svg>
                </div>
                {/* Google Pay */}
                <div className="stripe-card-badge">
                  <svg viewBox="0 0 38 24" width="38" height="24"><rect width="38" height="24" rx="4" fill="#fff" stroke="#e0dcd4"/><text x="4" y="16" fill="#444" fontSize="7.5" fontWeight="bold" fontFamily="Arial">Google Pay</text></svg>
                </div>
              </div>
            </div>
          </section>

          {error && (
            <div className="checkout-error">
              <span className="material-symbols-outlined">warning</span>
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            className={`btn-place-order ${processing ? "processing" : ""}`}
            disabled={processing}
          >
            {processing ? (
              <>
                <span className="spinner" />
                Redirecting to Stripe...
              </>
            ) : (
              `Continue to payment · ${formatPrice(total)} →`
            )}
          </button>

          <p className="checkout-secure">
            🔒 256-bit SSL · PCI DSS Compliant · Powered by Stripe
          </p>
        </div>

        {/* Right: Summary */}
        <div className="checkout-summary">
          <h3 className="summary-title">Order Summary</h3>
          <div className="summary-items">
            {items.map((item) => (
              <div key={`${item.slug}-${item.size}-${item.color}`} className="summary-item">
                <div className="summary-item-image">
                  <img src={item.image} alt={item.name} />
                  <span className="summary-item-qty">{item.quantity}</span>
                </div>
                <div className="summary-item-info">
                  <p className="summary-item-name">{item.name}</p>
                  <p className="summary-item-variant">{item.color} / {item.size}</p>
                </div>
                <span className="summary-item-price">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="summary-divider" />
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </form>
    </div>
  );
}
