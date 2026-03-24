import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/CartPage.css";

const formatPrice = (cents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const navigate = useNavigate();
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="cart-title">Your Cart</h1>
        <span className="cart-count">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="cart-empty">
          <span className="material-symbols-outlined cart-empty-icon">
            shopping_bag
          </span>
          <h2>Your cart is empty</h2>
          <p>Discover pieces that speak to you.</p>
          <Link to="/collection" className="btn btn-primary">
            Browse Collection
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <div key={`${item.slug}-${item.size}-${item.color}`} className="cart-item">
                <Link to={`/product/${item.slug}`} className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </Link>
                <div className="cart-item-info">
                  <div className="cart-item-top">
                    <Link to={`/product/${item.slug}`} className="cart-item-name">
                      {item.name}
                    </Link>
                    <button
                      className="cart-remove-btn"
                      onClick={() => removeItem(item.slug, item.size, item.color)}
                      aria-label="Remove"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  <p className="cart-item-variant">
                    {item.color} / {item.size}
                  </p>
                  <div className="cart-item-bottom">
                    <div className="cart-quantity">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.slug, item.size, item.color, -1)}
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.slug, item.size, item.color, 1)}
                      >
                        +
                      </button>
                    </div>
                    <span className="cart-item-price">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3 className="cart-summary-title">Order Summary</h3>
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</span>
            </div>
            <div className="cart-summary-divider" />
            <div className="cart-summary-row cart-summary-total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button className="btn-checkout" onClick={() => navigate("/checkout")}>
              Checkout
            </button>
            <p className="cart-note">
              Taxes calculated at checkout. Free returns within 14 days.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
