
import { useState } from "react";
import useCart from "../../hooks/useCart";
import { formatCurrency } from "../../utils/currency";
import { validateCheckout } from "../../utils/validation";
import "./Checkout.css";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
};

function Checkout({ onBack, onSubmitOrder }) {
  const { cartItems, cartTotal } = useCart();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateCheckout(form);
    setErrors(validationErrors);
    setSubmitError("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (cartItems.length === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }

    if (!onSubmitOrder) {
      setSubmitError(
        "Order submission is not connected to a backend yet."
      );
      return;
    }

    setSubmitting(true);

    try {
      await onSubmitOrder({ customer: form, items: cartItems });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to submit your order."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <section className="checkout-page">
        <h2>Checkout</h2>
        <p>Your cart is empty.</p>
        <button type="button" onClick={onBack}>
          Return to Store
        </button>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <h2>Checkout</h2>

      <div className="checkout-total">
        <span>Current cart total</span>
        <strong>{formatCurrency(cartTotal)}</strong>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="checkout-fullName">Full name</label>
        <input
          id="checkout-fullName"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          autoComplete="name"
        />
        {errors.fullName && <p className="field-error">{errors.fullName}</p>}

        <label htmlFor="checkout-email">Email</label>
        <input
          id="checkout-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
        />
        {errors.email && <p className="field-error">{errors.email}</p>}

        <label htmlFor="checkout-phone">Phone</label>
        <input
          id="checkout-phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          autoComplete="tel"
        />
        {errors.phone && <p className="field-error">{errors.phone}</p>}

        <label htmlFor="checkout-address">Delivery address</label>
        <input
          id="checkout-address"
          name="address"
          value={form.address}
          onChange={handleChange}
          autoComplete="street-address"
        />
        {errors.address && <p className="field-error">{errors.address}</p>}

        <label htmlFor="checkout-city">City</label>
        <input
          id="checkout-city"
          name="city"
          value={form.city}
          onChange={handleChange}
          autoComplete="address-level2"
        />
        {errors.city && <p className="field-error">{errors.city}</p>}

        {submitError && (
          <p className="field-error" role="alert">
            {submitError}
          </p>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Place Order"}
        </button>

        <button type="button" onClick={onBack}>
          Back to Cart
        </button>
      </form>
    </section>
  );
}

export default Checkout;
