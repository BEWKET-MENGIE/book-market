
import useWishlist from "../../hooks/useWishlist";
import useCart from "../../hooks/useCart";
import { formatCurrency } from "../../utils/currency";
import "./Wishlist.css";

function Wishlist({ onContinueShopping }) {
  const {
    wishlistItems,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <section className="wishlist-page">
        <h2>My Wishlist</h2>
        <p>You have not saved any books yet.</p>

        <button
          type="button"
          onClick={onContinueShopping}
          className="wishlist-primary-button"
        >
          Browse Books
        </button>
      </section>
    );
  }

  return (
    <section className="wishlist-page">
      <div className="wishlist-heading">
        <h2>My Wishlist</h2>

        <button type="button" onClick={clearWishlist}>
          Clear Wishlist
        </button>
      </div>

      <div className="wishlist-grid">
        {wishlistItems.map((book) => (
          <article className="wishlist-card" key={book.id}>
            <img src={book.image} alt={book.title} />

            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <strong>{formatCurrency(book.price)}</strong>

            <div className="wishlist-card-actions">
              <button
                type="button"
                disabled={book.stock === 0}
                onClick={() => addToCart(book)}
              >
                Add to Cart
              </button>

              <button
                type="button"
                onClick={() => removeFromWishlist(book.id)}
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Wishlist;
