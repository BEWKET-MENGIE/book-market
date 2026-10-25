
import useCart from "../../hooks/useCart";
import { formatCurrency } from "../../utils/currency";
import "./BookDetails.css";

function BookDetails({ book, onBack }) {
  const { addToCart } = useCart();

  if (!book) {
    return (
      <section className="book-details">
        <h2>Book not found</h2>
        <button type="button" onClick={onBack}>
          Back to Books
        </button>
      </section>
    );
  }

  const outOfStock = book.stock === 0;

  return (
    <section className="book-details">
      <button
        type="button"
        className="book-details-back"
        onClick={onBack}
      >
        ← Back to Books
      </button>

      <div className="book-details-layout">
        <div className="book-details-image-wrap">
          <img src={book.image} alt={book.title} />
        </div>

        <div className="book-details-content">
          <p className="book-details-category">
            {book.category}
          </p>

          <h1>{book.title}</h1>
          <p className="book-details-author">
            By {book.author}
          </p>

          <p className="book-details-price">
            {formatCurrency(book.price)}
          </p>

          <p className="book-details-description">
            {book.description}
          </p>

          <p>
            {outOfStock
              ? "Currently unavailable"
              : `${book.stock} copies available`}
          </p>

          <button
            type="button"
            className="book-details-add"
            disabled={outOfStock}
            onClick={() => addToCart(book)}
          >
            {outOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default BookDetails;
