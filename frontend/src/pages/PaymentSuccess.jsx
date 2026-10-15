
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import { verifyStripeCheckoutSession } from '../utils/api';
import './PaymentSuccess.css';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();

  const [status, setStatus] = useState('checking');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    let active = true;

    const verifyPayment = async () => {
      if (!sessionId) {
        setStatus('error');
        setMessage('Payment session ID is missing.');
        return;
      }

      try {
        const response = await verifyStripeCheckoutSession(sessionId);
        const data = response.data;

        if (!active) return;

        if (data.success && data.paid) {
          setStatus('paid');
          setOrderNumber(data.orderNumber || '');
          setMessage('Your payment has been confirmed.');
          clearCart();
        } else {
          setStatus('pending');
          setMessage(
            data.message ||
              'Your payment is not confirmed yet. Please check again shortly.'
          );
        }
      } catch (error) {
        if (!active) return;

        setStatus('error');
        setMessage(
          error.response?.data?.message ||
            'We could not verify your payment. Please contact support if you were charged.'
        );
      }
    };

    verifyPayment();

    return () => {
      active = false;
    };
  }, [sessionId, clearCart]);

  return (
    <section className="section payment-result-page">
      <div className="container">
        <div className="payment-result-card">
          <div
            className={`payment-result-icon payment-result-icon--${status}`}
            aria-live="polite"
          >
            {status === 'paid'
              ? '✓'
              : status === 'checking'
                ? '…'
                : status === 'pending'
                  ? '⌛'
                  : '!'}
          </div>

          <h1>
            {status === 'paid'
              ? 'Payment Successful!'
              : status === 'checking'
                ? 'Verifying Payment'
                : status === 'pending'
                  ? 'Payment Pending'
                  : 'Payment Verification Failed'}
          </h1>

          <p>{message}</p>

          {orderNumber && (
            <p className="payment-order-number">
              Order Number: <strong>{orderNumber}</strong>
            </p>
          )}

          <div className="payment-result-actions">
            {status === 'pending' && (
              <button
                type="button"
                className="btn"
                onClick={() => window.location.reload()}
              >
                Check Again
              </button>
            )}

            <Link to="/" className="btn">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
