
import OrderHistory from "../component/OrderHistory/OrderHistory";

function OrderHistoryPage({ orders = [], onContinueShopping }) {
  return (
    <main className="page-container">
      <OrderHistory
        orders={orders}
        onContinueShopping={onContinueShopping}
      />
    </main>
  );
}

export default OrderHistoryPage;
