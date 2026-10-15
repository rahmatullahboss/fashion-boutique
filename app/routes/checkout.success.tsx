import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/CheckoutSuccessPage.css";

const formatPrice = (cents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);

interface VerifyResult {
  sessionId: string;
  paymentStatus: string;
  customerEmail: string | null;
  items: Array<{ name: string; quantity: number; amount: number }>;
  total: number;
}

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const clearCartRef = useRef(clearCart);
  clearCartRef.current = clearCart;
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!sessionId) return;

    fetch("/api/checkout/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Verification failed");
        }
        clearCartRef.current();
        setResult(data.data);
        setStatus("success");
      })
      .catch((err) => {
        console.error("Verify error:", err);
        setErrorMsg(err.message || "Failed to verify payment");
        setStatus("error");
      });
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="success-page">
        <div className="success-card">
          <div className="success-icon success-icon-error">⚠️</div>
          <h1 className="success-title">Missing Session</h1>
          <p className="success-message">No payment session found.</p>
          <Link to="/collection" className="success-btn">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="success-page">
        <div className="success-card">
          <div className="success-spinner" />
          <p className="success-loading-text">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="success-page">
        <div className="success-card">
          <div className="success-icon success-icon-error">⚠️</div>
          <h1 className="success-title">Something went wrong</h1>
          <p className="success-message">{errorMsg}</p>
          <Link to="/collection" className="success-btn">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h1 className="success-title">Payment Confirmed</h1>
        <p className="success-message">
          Thank you for your purchase!
          {result?.customerEmail && (
            <> Payment contact: <strong>{result.customerEmail}</strong>.</>
          )}
        </p>

        {result?.items && result.items.length > 0 && (
          <div className="success-items">
            {result.items.map((item, i) => (
              <div key={i} className="success-item-row">
                <span className="success-item-name">
                  {item.name} {item.quantity > 1 ? `×${item.quantity}` : ""}
                </span>
                <span className="success-item-price">{formatPrice(item.amount)}</span>
              </div>
            ))}
            <div className="success-item-divider" />
            <div className="success-item-row success-item-total">
              <span>Total</span>
              <span>{formatPrice(result.total)}</span>
            </div>
          </div>
        )}

        <p className="success-shipping-note">
          📦 Payment has been verified. Fulfillment details will be confirmed separately.
        </p>

        <div className="success-actions">
          <Link to="/collection" className="success-btn">
            Continue Shopping
          </Link>
          <Link to="/" className="success-btn-outline">
            Back to Home
          </Link>
        </div>

        {sessionId && (
          <p className="success-session-id">
            Session: {sessionId.slice(0, 20)}...
          </p>
        )}
      </div>
    </div>
  );
}
