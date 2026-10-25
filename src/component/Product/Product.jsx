
import ProductCard from "../ProductCard/ProductCard";
import "./Product.css";

function Product({
  books = [],
  onViewDetails,
  isWishlisted,
  onToggleWishlist,
}) {
  if (books.length === 0) {
    return (
      <div className="product-empty">
        <h3>No books available</h3>
        <p>Please try another search or category.</p>
      </div>
    );
  }

  return (
    <section className="product-section">
      <div className="product-grid">
        {books.map((book) => (
          <ProductCard
            key={book.id}
            book={book}
            onViewDetails={onViewDetails}
            isWishlisted={isWishlisted?.(book.id)}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>
    </section>
  );
}

export default Product;
