
import Wishlist from "../component/Wishlist/Wishlist";

function WishlistPage({ onContinueShopping }) {
  return (
    <main className="page-container">
      <Wishlist onContinueShopping={onContinueShopping} />
    </main>
  );
}

export default WishlistPage;
