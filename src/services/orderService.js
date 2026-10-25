
const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000/api"
).replace(/\/+$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Order request failed: ${response.status}`);
  }

  return response.json();
}

export async function createOrder(order) {
  if (!order || !Array.isArray(order.items) || !order.items.length) {
    throw new Error("At least one order item is required.");
  }

  // The server must calculate the authoritative price and verify stock.
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

export async function getMyOrders() {
  return request("/orders/me");
}

export async function getOrderById(id) {
  if (!id) {
    throw new Error("An order ID is required.");
  }

  return request(`/orders/${encodeURIComponent(id)}`);
}
