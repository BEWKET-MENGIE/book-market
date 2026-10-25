
import { formatCurrency } from "../../utils/currency";
import "./OrderHistory.css";

function OrderHistory({ orders = [], onContinueShopping }) {
  if (orders.length === 0) {
    return (
      <section className="order-history">
        <h2>My Orders</h2>
        <p>You do not have any saved orders yet.</p>

        <button type="button" onClick={onContinueShopping}>
          Browse Books
        </button>
      </section>
    );
  }

  return (
    <section className="order-history">
      <h2>My Orders</h2>

      <div className="order-list">
        {orders.map((order) => (
          <article className="order-card" key={order.id}>
            <div className="order-card-heading">
              <h3>Order {order.id}</h3>
              <span>{order.status || "Pending"}</span>
            </div>

            <p>
              Date:{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : "Not available"}
            </p>

            <ul>
              {(order.items || []).map((item) => (
                <li key={item.id}>
                  {item.title} × {item.quantity}
                </li>
              ))}
            </ul>

            <strong>
              Total: {formatCurrency(order.total ?? 0)}
            </strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export default OrderHistory;
