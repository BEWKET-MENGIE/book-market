
import useCart from "../../hooks/useCart";
import { formatCurrency } from "../../utils/currency";
import "./Cart.css";

function Cart({ onContinueShopping, onCheckout }) {
  const {
    cartItems,
    cartCount,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <section className="cart-page">
        <h2>Your Shopping Cart</h2>

        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <p>Find a book you love and add it to your cart.</p>

          <button
            type="button"
            onClick={onContinueShopping}
          >
            Continue Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="cart-heading">
        <div>
          <h2>Your Shopping Cart</h2>
          <p>{cartCount} item(s) in your cart</p>
        </div>

        <button
          type="button"
          className="cart-clear-button"
          onClick={clearCart}
        >
          Clear Cart
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => {
            const imageSrc =
              item.image || item.imageUrl || item.coverImage;

            return (
              <article className="cart-item" key={item.id}>
                {imageSrc ? (
                  <img
                    className="cart-item-image"
                    src={imageSrc}
                    alt={`Cover of ${item.title}`}
                  />
                ) : (
                  <div className="cart-item-image cart-image-placeholder">
                    Book
                  </div>
                )}

                <div className="cart-item-details">
                  <h3>{item.title}</h3>

                  {item.author && <p>{item.author}</p>}

                  <p className="cart-item-price">
                    {formatCurrency(item.price)}
                  </p>

                  <div className="cart-quantity">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                      aria-label={`Decrease quantity of ${item.title}`}
                    >
                      −
                    </button>

                    <span aria-live="polite">{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                      aria-label={`Increase quantity of ${item.title}`}
                    >
                      +
                    </button>
                  </div>

                  <p className="cart-item-subtotal">
                    Subtotal:{" "}
                    {formatCurrency(item.price * item.quantity)}
                  </p>

                  <button
                    type="button"
                    className="cart-remove-button"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="cart-summary">
          <h3>Order Summary</h3>

          <div className="cart-summary-row">
            <span>Items</span>
            <span>{cartCount}</span>
          </div>

          <div className="cart-summary-row cart-total-row">
            <strong>Total</strong>
            <strong>{formatCurrency(cartTotal)}</strong>
          </div>

          <p className="cart-summary-note">
            Shipping and final charges, if applicable, are calculated
            during checkout.
          </p>

          <button
            type="button"
            className="cart-checkout-button"
            onClick={onCheckout}
          >
            Proceed to Checkout
          </button>

          <button
            type="button"
            className="cart-continue-button"
            onClick={onContinueShopping}
          >
            Continue Shopping
          </button>
        </aside>
      </div>
    </section>
  );
}

export default Cart;
