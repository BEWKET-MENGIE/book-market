
import Cart from "../component/Cart/Cart";

function CartPage({ onContinueShopping, onCheckout }) {
  return (
    <main className="page-container">
      <Cart
        onContinueShopping={onContinueShopping}
        onCheckout={onCheckout}
      />
    </main>
  );
}

export default CartPage;
