
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { useCart } from '../components/CartContext';
import { createBankTransferOrder } from '../utils/api.js';

import './Checkout.css';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [reference, setReference] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });

  

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleReceiptChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setReceipt(null);
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a JPG, PNG or PDF receipt.');
      e.target.value = '';
      setReceipt(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Receipt must be smaller than 5MB.');
      e.target.value = '';
      setReceipt(null);
      return;
    }

    setError('');
    setReceipt(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cart.length) return;

    const phoneDigits = form.phone.replace(/\D/g, '');

if (!/^\d{7,12}$/.test(phoneDigits)) {
  setError('Please enter a valid phone number.');
  return;
}

    if (!reference.trim()) {
      setError('Please enter your bank transfer reference.');
      return;
    }

    if (!receipt) {
      setError('Please upload your bank transfer receipt.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();

      formData.append('customerName', form.name.trim());
      formData.append('email', form.email.trim());
      formData.append('phone', form.phone.trim());
      formData.append('address', form.address.trim());
      formData.append('city', form.city.trim());
      formData.append('bankTransferReference', reference.trim());

      formData.append(
        'items',
        JSON.stringify(
          cart.map((item) => ({
            id: Number(item.id),
            itemType: item.itemType || 'accessory',
            quantity: Number(item.quantity),
          }))
        )
      );

      formData.append('receipt', receipt);

      const response = await createBankTransferOrder(formData);

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || 'Unable to submit your order.'
        );
      }

      const orderNumber = response.data.orderNumber;

      clearCart();

      navigate('/payment-success', {
        state: {
          orderNumber,
          paymentStatus: 'pending',
        },
      });
    } catch (err) {
      console.error('Bank transfer submission error:', err);

      setError(
        err.response?.data?.message ||
        err.message ||
        'Unable to submit your order. Please try again.'
      );

      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <section className="section checkout-page">
        <div className="container checkout-empty">
          <h1>Your Cart is Empty</h1>
          <p>Add some accessories before going to checkout.</p>
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
          <p>Enter your details and submit your bank transfer information.</p>
        </div>

        <div className="checkout-layout">
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
  <label htmlFor="phone">Phone Number</label>
  
  <input
    id="phone"
    type="tel"
    name="phone"
    value={form.phone}
    onChange={handleChange}
    placeholder="07123 123456"
    autoComplete="tel"
    maxLength={12}
    required
  />
  <small>Enter a valid phone number.</small>
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

              <div className="checkout-bank-info">
                <h2>Bank Transfer</h2>
                <p>
                  Please transfer the order amount using the
                  business's verified bank details. Confirm the
                  account details with the business before making
                  your transfer.
                </p>
                <p>
                  Your order will remain pending until the business
                  verifies the payment in its bank account.
                </p>
              </div>

              <div className="checkout-field">
                <label htmlFor="bankReference">
                  Bank Transaction Reference
                </label>
                <input
                  id="bankReference"
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Enter your transaction reference"
                  maxLength={255}
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="receipt">
                  Upload Payment Receipt
                </label>
                <input
                  id="receipt"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleReceiptChange}
                  required
                />
                <small>
                  JPG, PNG or PDF. Maximum file size: 5MB.
                </small>
                {receipt && (
                  <p>Selected: {receipt.name}</p>
                )}
              </div>

              <button
                type="submit"
                className="checkout-place-order"
                disabled={loading}
              >
                {loading
                  ? 'Submitting Order...'
                  : 'Submit Bank Transfer'}
              </button>
            </form>
          </div>

          <aside className="checkout-summary">
            <h2>Order Summary</h2>

            <div className="checkout-products">
              {cart.map((item) => (
                <div
                  className="checkout-product"
                  key={`${item.itemType || 'accessory'}-${item.id}`}
                >
                  <div className="checkout-product__image">
                    {item.image ? (
                      <img
                        src={
                          item.image.startsWith('http')
                            ? item.image
                            : `https://mtechnrepairs.hostless.app${item.image}`
                        }
                        alt={item.name}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </div>

                  <div className="checkout-product__info">
                    <h3>{item.name}</h3>
                    <p>Qty: {item.quantity}</p>
                    <strong>
                      £{(
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

            <div className="bank-details">
  <h3>Bank Transfer Details</h3>
  <p><strong>Bank:</strong> Lloyds Bank</p>
  <p><strong>Account Title:</strong> Green Getty Limited</p>
  <p><strong>Sort Code:</strong> 30-54-66</p>
  <p><strong>Account Number:</strong> 23435562</p>
  <p>Please transfer the total amount to this account and submit your payment reference with the receipt.</p>
</div>

            <Link to="/cart" className="checkout-back">
              ← Back to Cart
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
