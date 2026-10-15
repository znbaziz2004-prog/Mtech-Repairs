import {
  Search,
  Eye,
  Package,
  Clock3,
  CheckCircle2,
  Truck,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getOrders,
  getOrderStats,
} from "../services/api";

import "./Orders.css";

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [payment, setPayment] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  // =====================================================
  // LOAD ORDERS
  // =====================================================





const loadOrders = async (page = 1) => {
  try {
    setLoading(true);
    setError("");

    const response = await getOrders({
      search,
      status,
      payment,
      page,
      limit: 10,
    });

    setOrders(response.data || []);

    setPagination(
      response.pagination || {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      }
    );
  } catch (err) {
    console.error("Orders load error:", err);
    setError(err.message || "Failed to load orders.");
  } finally {
    setLoading(false);
  }
};





  // =====================================================
  // LOAD STATS
  // =====================================================

  const loadStats = async () => {
    try {
      const response = await getOrderStats();

      setStats(
        response.data || {
          totalOrders: 0,
          pendingOrders: 0,
          processingOrders: 0,
          completedOrders: 0,
        }
      );
    } catch (err) {
      console.error("Order stats error:", err);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadStats();
    loadOrders(1);
  }, []);

  
useEffect(() => {
  loadOrders(1);
}, [status, payment]);


  // =====================================================
  // SEARCH / FILTER
  // =====================================================

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadOrders(1);
  };



const handleStatusChange = (e) => {
  setStatus(e.target.value);
};



 

const handlePaymentChange = (e) => {
  setPayment(e.target.value);
};



  // =====================================================
  // VIEW ORDER
  // =====================================================

  const handleViewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // FORMAT AMOUNT
  // =====================================================

  const formatAmount = (amount) => {
    return `£${Number(amount || 0).toFixed(2)}`;
  };

  // =====================================================
  // GET FIRST PRODUCT
  // =====================================================

  const getProductName = (order) => {
    if (!order.items || !order.items.length) {
      return "No product";
    }

    if (order.items.length === 1) {
      return order.items[0].productName;
    }

    return `${order.items[0].productName} + ${
      order.items.length - 1
    } more`;
  };

  // =====================================================
  // PAGINATION
  // =====================================================

  const handlePrevious = () => {
    if (pagination.page > 1) {
      loadOrders(pagination.page - 1);
    }
  };

  const handleNext = () => {
    if (pagination.page < pagination.totalPages) {
      loadOrders(pagination.page + 1);
    }
  };

  return (
    <div className="orders-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="orders-page-header">

        <div>
          <span className="orders-eyebrow">
            ORDER MANAGEMENT
          </span>

          <h2>Orders</h2>

          <p>
            View and manage customer orders from one place.
          </p>
        </div>

        <div className="orders-total">

          <Package size={18} />

          <div>
            <span>Total Orders</span>
            <strong>{stats.totalOrders}</strong>
          </div>

        </div>

      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="orders-summary">

        <div className="order-summary-card">

          <div className="summary-icon all">
            <Package size={19} />
          </div>

          <div>
            <span>Total Orders</span>
            <strong>{stats.totalOrders}</strong>
          </div>

        </div>

        <div className="order-summary-card">

          <div className="summary-icon pending">
            <Clock3 size={19} />
          </div>

          <div>
            <span>Pending</span>
            <strong>{stats.pendingOrders}</strong>
          </div>

        </div>

        <div className="order-summary-card">

          <div className="summary-icon processing">
            <Truck size={19} />
          </div>

          <div>
            <span>Processing</span>
            <strong>{stats.processingOrders}</strong>
          </div>

        </div>

        <div className="order-summary-card">

          <div className="summary-icon completed">
            <CheckCircle2 size={19} />
          </div>

          <div>
            <span>Completed</span>
            <strong>{stats.completedOrders}</strong>
          </div>

        </div>

      </div>

      {/* =================================================
          ORDERS CARD
      ================================================= */}

      <div className="orders-card">

        {/* TOOLBAR */}

        <div className="orders-toolbar">

          <form
            className="orders-search"
            onSubmit={handleSearchSubmit}
          >

            <Search size={18} />

            <input
              type="text"
              placeholder="Search by order ID, customer or product..."
              value={search}
              onChange={handleSearch}
            />

          </form>

          <div className="orders-filters">

            <select
              value={status}
              onChange={handleStatusChange}
            >

              <option value="all">
                All Orders
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="processing">
                Processing
              </option>

             

              <option value="completed">
                Completed
              </option>

              <option value="cancelled">
                Cancelled
              </option>

            </select>

            <select
              value={payment}
              onChange={handlePaymentChange}
            >

              <option value="all">
                All Payments
              </option>

              <option value="paid">
                Paid
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="failed">
                Failed
              </option>

              <option value="refunded">
                Refunded
              </option>

            </select>

          </div>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="orders-error">
            {error}
          </div>
        )}

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="orders-table-container">

          <table className="management-orders-table">

            <thead>

              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td colSpan="8">
                    Loading orders...
                  </td>
                </tr>

              ) : orders.length === 0 ? (

                <tr>
                  <td colSpan="8">
                    No orders found.
                  </td>
                </tr>

              ) : (

                orders.map((order) => (

                  <tr key={order.id}>

                    {/* ORDER */}

                    <td>

                      <span className="order-id">
                        #{order.orderNumber}
                      </span>

                    </td>

                    {/* CUSTOMER */}

                    <td>

                      <div className="customer-cell">

                        <strong>
                          {order.customerName}
                        </strong>

                        <span>
                          {order.email}
                        </span>

                      </div>

                    </td>

                    {/* PRODUCT */}

                    <td>

                      <span className="product-name">
                        {getProductName(order)}
                      </span>

                    </td>

                    {/* AMOUNT */}

                    <td>

                      <strong className="order-amount">
                        {formatAmount(order.totalAmount)}
                      </strong>

                    </td>

                    {/* DATE */}

                    <td>

                      <span className="order-date">
                        {formatDate(order.createdAt)}
                      </span>

                    </td>

                    {/* PAYMENT */}

                    <td>

                      <span
                        className={`payment-status ${(
                          order.paymentStatus || ""
                        ).toLowerCase()}`}
                      >
                        {order.paymentStatus
                          ? order.paymentStatus
                              .charAt(0)
                              .toUpperCase() +
                            order.paymentStatus.slice(1)
                          : "-"}
                      </span>

                    </td>

                    {/* STATUS */}

                    <td>

                      <span
                        className={`management-order-status ${(
                          order.status || ""
                        )
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {order.status
                          ? order.status
                              .charAt(0)
                              .toUpperCase() +
                            order.status.slice(1)
                          : "-"}
                      </span>

                    </td>

                    {/* ACTION */}

                    <td>

                      <button
                        type="button"
                        className="order-action-button"
                        onClick={() =>
                          handleViewOrder(order.id)
                        }
                        title="View Order"
                      >
                        <Eye size={17} />
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="orders-table-footer">

          <span>
            Showing{" "}
            <strong>
              {orders.length > 0
                ? (pagination.page - 1) *
                    pagination.limit +
                  1
                : 0}
              –
              {(pagination.page - 1) *
                pagination.limit +
                orders.length}
            </strong>{" "}
            of{" "}
            <strong>
              {pagination.total}
            </strong>{" "}
            orders
          </span>

          <div className="pagination">

            <button
              onClick={handlePrevious}
              disabled={
                pagination.page <= 1 ||
                loading
              }
            >
              Previous
            </button>

            <button className="active-page">
              {pagination.page}
            </button>

            <button
              onClick={handleNext}
              disabled={
                pagination.page >=
                  pagination.totalPages ||
                loading
              }
            >
              Next
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Orders;