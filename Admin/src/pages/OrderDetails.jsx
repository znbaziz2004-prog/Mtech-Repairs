import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  Phone,
  User,
  Truck,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getOrderById, updateOrderStatus } from "../services/api";

import "./OrderDetails.css";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // GET ORDER
  // =====================================================

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getOrderById(id);

        const data = response?.data || response;

        setOrder(data);
        setSelectedStatus(data?.status || "pending");
      } catch (err) {
        console.error("Failed to load order:", err);

        setError(
          err.message || "Failed to load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadOrder();
    }
  }, [id]);

  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const handleUpdateStatus = async () => {
    if (!order) return;

    try {
      setUpdating(true);
      setError("");

      const response = await updateOrderStatus(
        id,
        selectedStatus
      );

      const updatedOrder =
        response?.data || response;

      setOrder((current) => ({
        ...current,
        ...(updatedOrder || {}),
        status: selectedStatus,
      }));

      alert("Order status updated successfully!");
    } catch (err) {
      console.error("Failed to update order:", err);

      setError(
        err.message || "Failed to update order status."
      );
    } finally {
      setUpdating(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="order-details-page">
        <div className="order-loading">
          Loading order details...
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR / NOT FOUND
  // =====================================================

  if (!order) {
    return (
      <div className="order-details-page">
        <div className="order-error">
          <h2>Order Not Found</h2>

          <p>
            {error || "Unable to find this order."}
          </p>

          <button
            className="order-back-button"
            onClick={() => navigate("/orders")}
          >
            <ArrowLeft size={18} />
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // DATA
  // =====================================================

  const orderNumber =
    order.orderNumber ||
    order.order_number ||
    order.id;

  const customerName =
    order.customerName ||
    order.customer_name ||
    "Unknown Customer";

  const customerEmail =
    order.email || "No email";

  const customerPhone =
    order.phone || "No phone";

  const total =
    Number(
      order.totalAmount ??
        order.total_amount ??
        0
    );

  const items = Array.isArray(order.items)
    ? order.items
    : [];

  const status =
    order.status || "pending";

  const paymentStatus =
    order.paymentStatus ||
    order.payment_status ||
    "pending";

  const orderDate =
    order.createdAt ||
    order.created_at;

  const formattedDate = orderDate
    ? new Date(orderDate).toLocaleString()
    : "N/A";

  const getStatusLabel = (value) => {
    if (!value) return "Pending";

    return value
      .charAt(0)
      .toUpperCase() + value.slice(1);
  };

  // =====================================================
  // TIMELINE
  // =====================================================

  const timeline = [
    {
      title: "Order Placed",
      description:
        "Customer placed the order.",
      date: formattedDate,
      completed: true,
    },
    {
      title: "Processing",
      description:
        "Order is being prepared.",
      date:
        status === "processing"
          ? formattedDate
          : "Pending",
      completed: [
        "processing",
        "shipped",
        "completed",
      ].includes(status),
      current: status === "processing",
    },
    {
      title: "Shipped",
      description:
        "Order has been handed over to the courier.",
      date:
        status === "shipped" ||
        status === "completed"
          ? formattedDate
          : "Pending",
      completed: [
        "shipped",
        "completed",
      ].includes(status),
      current: status === "shipped",
    },
    {
      title: "Completed",
      description:
        "Order has been delivered to the customer.",
      date:
        status === "completed"
          ? formattedDate
          : "Pending",
      completed: status === "completed",
      current: status === "completed",
    },
  ];

  return (
    <div className="order-details-page">

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="order-error-banner">
          {error}
        </div>
      )}

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="order-details-header">

        <button
          className="order-back-button"
          onClick={() => navigate("/orders")}
        >
          <ArrowLeft size={18} />
          Back to Orders
        </button>

        <div className="order-header-main">

          <div>
            <span className="order-details-eyebrow">
              ORDER MANAGEMENT
            </span>

            <h1>Order Details</h1>

            <p>
              Review complete information about this
              customer order.
            </p>
          </div>

          <div className="order-header-actions">

            <span className="order-id-badge">
              #{orderNumber}
            </span>

            <span className="order-status-badge">
              {getStatusLabel(status)}
            </span>

          </div>

        </div>

      </div>

      {/* =====================================================
          ORDER SUMMARY
      ===================================================== */}

      <div className="order-summary-card">

        <div className="summary-main">

          <div className="summary-icon">
            <Package size={23} />
          </div>

          <div>
            <span>Order Number</span>

            <strong>
              #{orderNumber}
            </strong>
          </div>

        </div>

        <div className="summary-item">
          <span>Order Date</span>

          <strong>
            {formattedDate}
          </strong>
        </div>

        <div className="summary-item">

          <span>Payment</span>

          <strong className="paid-text">
            <CheckCircle2 size={16} />

            {getStatusLabel(paymentStatus)}
          </strong>

        </div>

        <div className="summary-item">

          <span>Total Amount</span>

          <strong className="summary-total">
            £{total.toFixed(2)}
          </strong>

        </div>

      </div>

      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <div className="order-details-grid">

        {/* LEFT SIDE */}

        <div className="order-details-left">

          {/* CUSTOMER */}

          <section className="details-card">

            <div className="details-card-header">

              <div>
                <span className="card-eyebrow">
                  CUSTOMER
                </span>

                <h2>
                  Customer Information
                </h2>
              </div>

              <div className="card-header-icon">
                <User size={19} />
              </div>

            </div>

            <div className="customer-profile">

              <div className="customer-avatar">
                {customerName
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div className="customer-info">

                <h3>
                  {customerName}
                </h3>

                <p>
                  {customerEmail}
                </p>

                <p className="customer-phone">
                  <Phone size={14} />
                  {customerPhone}
                </p>

              </div>

            </div>

          </section>

          {/* ORDER ITEMS */}

          <section className="details-card">

            <div className="details-card-header">

              <div>
                <span className="card-eyebrow">
                  ORDER ITEMS
                </span>

                <h2>
                  Product Information
                </h2>
              </div>

              <div className="card-header-icon">
                <Package size={19} />
              </div>

            </div>

            {items.length > 0 ? (
              <div className="order-items-list">

                {items.map((item, index) => {

                  const quantity =
                    Number(item.quantity || 0);

                  const price =
                    Number(item.price || 0);

                  const itemTotal =
                    quantity * price;

                  return (
                    <div
                      className="product-row"
                      key={
                        item.id ||
                        item.productId ||
                        `${item.productName}-${index}`
                      }
                    >

                      <div className="product-image">
                        📦
                      </div>

                      <div className="product-information">

                        <h3>
                          {item.productName ||
                            item.product_name ||
                            "Product"}
                        </h3>

                        <span>
                          Product ID:{" "}
                          {item.productId ||
                            item.product_id ||
                            "N/A"}
                        </span>

                        <div className="product-meta">

                          <span>
                            Quantity: {quantity}
                          </span>

                          <strong>
                            £{itemTotal.toFixed(2)}
                          </strong>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>
            ) : (
              <p>
                No items found for this order.
              </p>
            )}

          </section>

          {/* SHIPPING */}

          <section className="details-card">

            <div className="details-card-header">

              <div>
                <span className="card-eyebrow">
                  DELIVERY
                </span>

                <h2>
                  Shipping Information
                </h2>
              </div>

              <div className="card-header-icon">
                <MapPin size={19} />
              </div>

            </div>

            <div className="address-box">

              <div className="address-icon">
                <MapPin size={18} />
              </div>

              <div>

                <strong>
                  Delivery Address
                </strong>

                <p>
                  {order.notes ||
                    "Address information not provided."}
                </p>

              </div>

            </div>

          </section>

          {/* PAYMENT */}

          <section className="details-card">

            <div className="details-card-header">

              <div>
                <span className="card-eyebrow">
                  PAYMENT
                </span>

                <h2>
                  Payment Information
                </h2>
              </div>

              <div className="card-header-icon">
                <CreditCard size={19} />
              </div>

            </div>

            <div className="payment-details">

              <div className="payment-row">
  <span>Payment Method</span>
  <strong>
    {order.paymentMethod ||
      order.payment_method ||
      "Not specified"}
  </strong>
</div>

              <div className="payment-row">

                <span>
                  Payment Status
                </span>

                <strong className="payment-paid">
                  <CheckCircle2 size={15} />
                  {getStatusLabel(paymentStatus)}
                </strong>

              </div>

              <div className="payment-divider" />

              <div className="payment-row">

                <span>
                  Total
                </span>

                <strong>
                  £{total.toFixed(2)}
                </strong>

              </div>

            </div>

          </section>

        </div>

        {/* RIGHT SIDE */}

        <div className="order-details-right">

          {/* STATUS */}

          <section className="details-card status-card">

            <div className="details-card-header">

              <div>

                <span className="card-eyebrow">
                  ORDER STATUS
                </span>

                <h2>
                  Order Progress
                </h2>

              </div>

              <div className="card-header-icon">
                <Truck size={19} />
              </div>

            </div>

            <div className="current-status">

              <span>
                Current Status
              </span>

              <strong>
                {getStatusLabel(status)}
              </strong>

            </div>

            <div className="status-select-wrapper">

              <label>
                Update Status
              </label>

              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(
                    e.target.value
                  )
                }
              >
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

            </div>

            <button
              className="update-status-button"
              onClick={handleUpdateStatus}
              disabled={
                updating ||
                selectedStatus === status
              }
            >
              {updating
                ? "Updating..."
                : "Update Order Status"}
            </button>

          </section>

          {/* TIMELINE */}

          <section className="details-card">

            <div className="details-card-header">

              <div>

                <span className="card-eyebrow">
                  ACTIVITY
                </span>

                <h2>
                  Order Timeline
                </h2>

              </div>

              <div className="card-header-icon">
                <Clock3 size={19} />
              </div>

            </div>

            <div className="order-timeline">

              {timeline.map((item) => (

                <div
                  className={`timeline-item ${
                    item.completed
                      ? "completed"
                      : ""
                  } ${
                    item.current
                      ? "current"
                      : ""
                  }`}
                  key={item.title}
                >

                  <div className="timeline-marker">

                    {item.completed ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <span />
                    )}

                  </div>

                  <div className="timeline-content">

                    <div className="timeline-title-row">

                      <strong>
                        {item.title}
                      </strong>

                      {item.current && (
                        <span className="timeline-current">
                          CURRENT
                        </span>
                      )}

                    </div>

                    <p>
                      {item.description}
                    </p>

                    <span className="timeline-date">
                      {item.date}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          </section>

        </div>

      </div>

    </div>
  );
};

export default OrderDetails;