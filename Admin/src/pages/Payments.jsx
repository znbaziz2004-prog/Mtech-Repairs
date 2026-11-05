
import { useEffect, useState } from "react";
import {
  getAdminPayments,
  approveBankTransfer,
  rejectBankTransfer,
  getPaymentReceipt,
} from "../services/api";
import "./Payments.css";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({
    totalPayments: 0,
    totalRevenue: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

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
            pendingPayments: 0,
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
      payment.paymentStatus,
      payment.bankTransferReference,
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
      alert("Copied successfully.");
    } catch {
      alert("Unable to copy.");
    }
  };

  const handleApprove = async (payment) => {
    const confirmed = window.confirm(
      `Have you verified the bank payment in your bank account for order ${payment.orderNumber || payment.orderId}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(payment.paymentId);

      await approveBankTransfer(payment.paymentId);

      alert("Bank transfer approved successfully.");
      await loadPayments();
    } catch (err) {
      alert(err.message || "Unable to approve payment.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (payment) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this bank transfer?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(payment.paymentId);

      await rejectBankTransfer(payment.paymentId);

      alert("Bank transfer rejected.");
      await loadPayments();
    } catch (err) {
      alert(err.message || "Unable to reject payment.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReceipt = async (payment) => {
    try {
      const blob = await getPaymentReceipt(payment.paymentId);
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `payment-receipt-${payment.paymentId}`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || "Unable to download receipt.");
    }
  };

  return (
    <div className="payments-page">
      <div className="payments-header">
        <div>
          <h1>Payments</h1>
          <p>Manage bank transfers and payment transactions.</p>
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

        <div className="payments-summary-card">
          <span>Pending Transfers</span>
          <h2>{summary.pendingPayments || 0}</h2>
        </div>
      </div>

      <div className="payments-toolbar">
        <input
          type="text"
          placeholder="Search customer, order or transfer reference..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="payments-error">{error}</div>
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
                <th>Reference / Receipt</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map((payment) => {
                const status = String(
                  payment.paymentStatus || payment.status || "pending"
                ).toLowerCase();

                const isBankTransfer =
                  String(payment.paymentMethod || "").toLowerCase() ===
                  "bank_transfer";

                const isPending = status === "pending";

                return (
                  <tr key={payment.paymentId}>
                    <td>
                      <strong>
                        {payment.orderNumber ||
                          `Order #${payment.orderId}`}
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
                      {isBankTransfer ? "Bank Transfer" : payment.paymentMethod || "Card"}
                    </td>

                    <td>
                      <span className={`payments-status payments-status--${status}`}>
                        {status.toUpperCase()}
                      </span>
                    </td>

                    <td>
                      {isBankTransfer ? (
                        <>
                          <small>
                            Reference:{" "}
                            {payment.bankTransferReference || "—"}
                          </small>

                          {payment.bankTransferReference && (
                            <button
                              type="button"
                              onClick={() =>
                                copyToClipboard(payment.bankTransferReference)
                              }
                            >
                              Copy Reference
                            </button>
                          )}

                          {payment.receiptPath && (
                            <button
                              type="button"
                              onClick={() => handleReceipt(payment)}
                            >
                              Download Receipt
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="payments-stripe-details">
                          <small>
                            Session: {payment.stripeSessionId || "—"}
                          </small>
                          <small>
                            Intent: {payment.stripePaymentIntentId || "—"}
                          </small>
                        </div>
                      )}
                    </td>

                    <td>{formatDate(payment.paymentDate)}</td>

                    <td>
                      {isBankTransfer && isPending ? (
                        <div className="payments-actions">
                          <button
                            type="button"
                            className="payments-approve-btn"
                            disabled={actionLoading === payment.paymentId}
                            onClick={() => handleApprove(payment)}
                          >
                            {actionLoading === payment.paymentId
                              ? "Please wait..."
                              : "Approve"}
                          </button>

                          <button
                            type="button"
                            className="payments-reject-btn"
                            disabled={actionLoading === payment.paymentId}
                            onClick={() => handleReject(payment)}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan="8" className="payments-empty">
                    {search
                      ? "No payments match your search."
                      : "No payment records found."}
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
