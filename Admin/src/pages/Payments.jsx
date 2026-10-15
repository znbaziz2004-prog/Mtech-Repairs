
import { useEffect, useState } from "react";
import { getAdminPayments } from "../services/api";
import "./Payments.css";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({
    totalPayments: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminPayments();

      if (response?.success) {
        setPayments(response.data || []);
        setSummary(
          response.summary || {
            totalPayments: 0,
            totalRevenue: 0,
          }
        );
      } else {
        setError(response?.message || "Unable to load payments.");
      }
    } catch (err) {
      setError(err.message || "Unable to load payments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const formatAmount = (amount, currency) => {
    const value = Number(amount || 0);
    const code = (currency || "GBP").toUpperCase();

    try {
      return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: code,
      }).format(value);
    } catch {
      return `${value.toFixed(2)} ${code}`;
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleString();
  };

  const filteredPayments = payments.filter((payment) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return [
      payment.orderNumber,
      payment.customerName,
      payment.email,
      payment.phone,
      payment.paymentMethod,
      payment.stripeSessionId,
      payment.stripePaymentIntentId,
    ].some((value) =>
      String(value || "").toLowerCase().includes(query)
    );
  });

  const copyToClipboard = async (value) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error("Unable to copy payment ID:", err);
    }
  };

  return (
    <div className="payments-page">
      <div className="payments-header">
        <div>
          <h1>Payments</h1>
          <p>View and manage online payment transactions.</p>
        </div>

        <button
          className="payments-refresh-btn"
          onClick={loadPayments}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="payments-summary">
        <div className="payments-summary-card">
          <span>Total Paid Transactions</span>
          <h2>{summary.totalPayments}</h2>
        </div>

        <div className="payments-summary-card">
          <span>Total Revenue</span>
          <h2>
            {formatAmount(
              summary.totalRevenue,
              payments[0]?.currency || "GBP"
            )}
          </h2>
        </div>
      </div>

      <div className="payments-toolbar">
        <input
          type="text"
          placeholder="Search customer, order or Stripe ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="payments-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="payments-message">
          Loading payment records...
        </div>
      ) : (
        <div className="payments-table-wrapper">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
                <th>Stripe Details</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.paymentId}>
                  <td>
                    <strong>
                      {payment.orderNumber || `Order #${payment.orderId}`}
                    </strong>
                    <small>Payment #{payment.paymentId}</small>
                  </td>

                  <td>
                    <strong>{payment.customerName || "—"}</strong>
                    <small>{payment.email || "—"}</small>
                    <small>{payment.phone || "—"}</small>
                  </td>

                  <td className="payments-amount">
                    {formatAmount(payment.amount, payment.currency)}
                  </td>

                  <td>
                    {payment.paymentMethod || "Card"}
                  </td>

                  <td>
                    <span className="payments-status">
                      {payment.paymentStatus || "Paid"}
                    </span>
                  </td>

                  <td>{formatDate(payment.paymentDate)}</td>

                  <td className="payments-stripe-details">
                    <div>
                      <small>Session ID</small>
                      <span>
                        {payment.stripeSessionId || "—"}
                      </span>
                      {payment.stripeSessionId && (
                        <button
                          onClick={() =>
                            copyToClipboard(payment.stripeSessionId)
                          }
                        >
                          Copy
                        </button>
                      )}
                    </div>

                    <div>
                      <small>Payment Intent</small>
                      <span>
                        {payment.stripePaymentIntentId || "—"}
                      </span>
                      {payment.stripePaymentIntentId && (
                        <button
                          onClick={() =>
                            copyToClipboard(
                              payment.stripePaymentIntentId
                            )
                          }
                        >
                          Copy
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan="7" className="payments-empty">
                    {search
                      ? "No payments match your search."
                      : "No paid transactions found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Payments;
