
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { useCart } from '../components/CartContext';
import { createStripeCheckoutSession } from '../utils/api.js';

import './Checkout.css';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });

  const isValidUKPhone = (phone) => {
  const cleaned = phone.replace(/[\s()-]/g, '');

  // UK mobile: 07XXXXXXXXX or +447XXXXXXXXX
  // UK landline: 01/02/03/05/08 numbers or +44 equivalents
  return /^(?:(?:\+44)|0)(?:7\d{9}|[12358]\d{8,9})$/.test(cleaned);
};

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!cart.length) return;

  const phone = form.phone.trim();

if (!isValidUKPhone(phone)) {
  setError(
    'Please enter a valid UK phone number, e.g. 07123 456789 or +44 7123 456789.'
  );
  return;
}

  setLoading(true);
  setError('');

  try {
    const payload = {
      customerName: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      items: cart.map((item) => ({
        id: Number(item.id),
        itemType: item.itemType || 'accessory',
        quantity: Number(item.quantity),
      })),
    };

    const response = await createStripeCheckoutSession(payload);

    if (response.data?.success && response.data?.url) {
      window.location.assign(response.data.url);
    } else {
      throw new Error(
        response.data?.message || 'Unable to start Stripe checkout.'
      );
    }
  } catch (error) {
    console.error('Stripe checkout error:', error);

    setError(
      error.response?.data?.message ||
        error.message ||
        'Unable to start payment. Please try again.'
    );

    setLoading(false);
  }
};


  if (cart.length === 0) {
    return (
      <section className="section checkout-page">
        <div className="container checkout-empty">
          <h1>Your Cart is Empty</h1>

          <p>
            Add some accessories before going to checkout.
          </p>

          <Link to="/accessories" className="btn">
            Browse Accessories
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section checkout-page">
      <div className="container">

        <div className="checkout-header">
          <span>Checkout</span>

          <h1>Complete Your Order</h1>

          <p>
            Enter your details and review your order.
          </p>
        </div>

        <div className="checkout-layout">

          {/* Customer Details */}
          <div className="checkout-form-card">

            <h2>Customer Details</h2>

            <form onSubmit={handleSubmit}>

              {error && (
                <div className="checkout-error">
                  {error}
                </div>
              )}

              <div className="checkout-field">
                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="checkout-row">

                <div className="checkout-field">
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="checkout-field">
  <label htmlFor="phone"> Phone Number</label>

  <input
    id="phone"
    type="tel"
    name="phone"
    value={form.phone}
    onChange={(e) => {
      const value = e.target.value;

      // Allow only phone-number characters and limit input length
      if (/^[0-9+\s()-]*$/.test(value) && value.length <= 20) {
        handleChange(e);
      }
    }}
    placeholder="07123 456789"
    autoComplete="tel"
    maxLength={20}
    required
  />

  <small>Enter a valid  mobile or landline number.</small>
</div>

              </div>

              <div className="checkout-field">
                <label>Address</label>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter your complete address"
                  rows="4"
                  required
                />
              </div>

              <div className="checkout-field">
                <label>City</label>

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  required
                />
              </div>

              <button
                type="submit"
                className="checkout-place-order"
                disabled={loading}
              >
                {loading ? 'Redirecting to payment...' : 'Pay Securely with Stripe'}
              </button>

            </form>
          </div>

          {/* Order Summary */}
          <aside className="checkout-summary">

            <h2>Order Summary</h2>

            <div className="checkout-products">

              {cart.map((item) => (
                <div
                  className="checkout-product"
                  key={item.id}
                >

                  <div className="checkout-product__image">

                    {item.image ? (
                      <img
                        src={
                          item.image.startsWith('http')
                            ? item.image
                            : `http://localhost:5000${item.image}`
                        }
                        alt={item.name}
                      />
                    ) : (
                      <span>No Image</span>
                    )}

                  </div>

                  <div className="checkout-product__info">

                    <h3>{item.name}</h3>

                    <p>
                      Qty: {item.quantity}
                    </p>

                    <strong>
                      £
                      {(
                        Number(item.price || 0) *
                        item.quantity
                      ).toFixed(2)}
                    </strong>

                  </div>

                </div>
              ))}

            </div>

            <div className="checkout-total">

              <span>Total</span>

              <strong>
                £{Number(cartTotal).toFixed(2)}
              </strong>

            </div>

            <Link
              to="/cart"
              className="checkout-back"
            >
              ← Back to Cart
            </Link>

          </aside>

        </div>

      </div>
    </section>
  );
}