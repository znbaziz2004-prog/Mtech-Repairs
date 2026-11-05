
import { useLocation, Link } from 'react-router-dom';
import './PaymentSuccess.css';

export default function PaymentSuccess() {
  const location = useLocation();

  const orderNumber = location.state?.orderNumber || '';

  return (
    <section className="section payment-result-page">
      <div className="container">
        <div className="payment-result-card">
          <div
            className="payment-result-icon payment-result-icon--pending"
            aria-live="polite"
          >
            ⌛
          </div>

          <h1>Bank Transfer Submitted!</h1>

          <p>
            Your order has been placed successfully.
            Your payment is currently pending verification.
          </p>

          {orderNumber && (
            <p className="payment-order-number">
              Order Number: <strong>{orderNumber}</strong>
            </p>
          )}

          <p>
            Our team will verify your bank transfer and update
            your payment status. You will receive confirmation
            once your payment is approved.
          </p>

          <div className="payment-result-actions">
            <Link to="/" className="btn">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
