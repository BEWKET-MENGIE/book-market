
import Checkout from "../component/Checkout/Checkout";

function CheckoutPage({ onBack, onSubmitOrder }) {
  return (
    <main className="page-container">
      <Checkout
        onBack={onBack}
        onSubmitOrder={onSubmitOrder}
      />
    </main>
  );
}

export default CheckoutPage;
