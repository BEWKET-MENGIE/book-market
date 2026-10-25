
import useCart from "../../hooks/useCart";
import { formatCurrency } from "../../utils/currency";
import "./ProductCard.css";

function ProductCard({
  book,
  onViewDetails,
  isWishlisted = false,
  onToggleWishlist,
}) {
  const { addToCart } = useCart();

  if (!book) return null;

  function handleAddToCart() {
    try {
      addToCart(book);
    } catch (error) {
      console.error("Unable to add book to cart:", error);
      window.alert(error.message || "Unable to add this book.");
    }
  }

  const imageSrc = book.image || book.imageUrl || book.coverImage;

  return (
    <article className="product-card">
      <button
        className="product-card-image-button"
        type="button"
        onClick={() => onViewDetails?.(book)}
        aria-label={`View details for ${book.title}`}
      >
        {imageSrc ? (
          <img
            className="product-card-image"
            src={imageSrc}
            alt={`Cover of ${book.title}`}
            loading="lazy"
          />
        ) : (
          <div className="product-card-image-placeholder">
            Book cover
          </div>
        )}
      </button>

      <div className="product-card-content">
        <h3>{book.title}</h3>

        {book.author && (
          <p className="product-card-author">
            By {book.author}
          </p>
        )}

        <p className="product-card-price">
          {formatCurrency(book.price)}
        </p>

        <p className="product-card-description">
          {book.description}
        </p>

        <div className="product-card-actions">
          <button
            type="button"
            className="add-to-cart-button"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>

          {onToggleWishlist && (
            <button
              type="button"
              className="wishlist-button"
              onClick={() => onToggleWishlist(book.id)}
              aria-pressed={isWishlisted}
            >
              {isWishlisted
                ? "♥ Remove from Wishlist"
                : "♡ Add to Wishlist"}
            </button>
          )}

          <button
            type="button"
            className="details-button"
            onClick={() => onViewDetails?.(book)}
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
