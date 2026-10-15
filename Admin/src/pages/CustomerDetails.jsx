import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Wrench,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getCustomerById,
} from "../services/api";

import "./CustomerDetails.css";

const CustomerDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [customer, setCustomer] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getCustomerById(id);

        setCustomer(response.data);
      } catch (err) {
        setError(
          err.message ||
            "Failed to load customer."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  const formatStatus = (status) => {
    const labels = {
      pending: "Pending",
      confirmed: "Confirmed",
      "in-progress": "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
    };

    return (
      labels[status] ||
      status ||
      "Pending"
    );
  };

  if (loading) {
    return (
      <div className="customer-details-page">

        <div className="customer-details-loading">

          <Loader2
            size={34}
            className="customer-details-spin"
          />

          <p>
            Loading customer details...
          </p>

        </div>

      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="customer-details-page">

        <div className="customer-details-error">

          <div className="customer-details-error-icon">
            <AlertCircle size={30} />
          </div>

          <h2>
            Customer Not Found
          </h2>

          <p>
            {error ||
              "This customer could not be found."}
          </p>

          <button
            className="customer-back-button"
            onClick={() =>
              navigate("/customers")
            }
          >
            <ArrowLeft size={18} />
            Back to Customers
          </button>

        </div>

      </div>
    );
  }

  const initials =
    customer.name
      ?.split(" ")
      .map(
        (part) => part.charAt(0)
      )
      .join("")
      .slice(0, 2)
      .toUpperCase() || "C";

  return (
    <div className="customer-details-page">

      {/* HEADER */}

      <div className="customer-details-header">

        <button
          className="customer-back-button"
          onClick={() =>
            navigate("/customers")
          }
        >
          <ArrowLeft size={18} />
          Back to Customers
        </button>

        <div className="customer-header-main">

          <div>

            <span className="customer-details-eyebrow">
              CUSTOMER MANAGEMENT
            </span>

            <h1>
              Customer Details
            </h1>

            <p>
              View customer information
              and repair history.
            </p>

          </div>

          <span
            className={`customer-details-status ${
              customer.status ===
              "Active"
                ? "active"
                : "inactive"
            }`}
          >
            {customer.status}
          </span>

        </div>

      </div>

      {/* PROFILE */}

      <div className="customer-profile-card">

        <div className="customer-profile-avatar">
          {initials}
        </div>

        <div className="customer-profile-content">

          <span>
            CUSTOMER
          </span>

          <h2>
            {customer.name}
          </h2>

          <div className="customer-profile-contact">

            <span>
              <Mail size={15} />
              {customer.email}
            </span>

            <span>
              <Phone size={15} />
              {customer.phone}
            </span>

          </div>

        </div>

      </div>

      {/* STATS */}

      <div className="customer-detail-stats">

        <div className="customer-detail-stat">

          <div className="customer-detail-stat-icon">
            <Wrench size={20} />
          </div>

          <div>
            <span>
              Total Repairs
            </span>

            <strong>
              {customer.repairs ||
                0}
            </strong>
          </div>

        </div>

        <div className="customer-detail-stat">

          <div className="customer-detail-stat-icon green">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>
              Completed Repairs
            </span>

            <strong>
              {customer.bookings.filter(
                (booking) =>
                  booking.status ===
                  "completed"
              ).length}
            </strong>
          </div>

        </div>

        <div className="customer-detail-stat">

          <div className="customer-detail-stat-icon blue">
            <Clock3 size={20} />
          </div>

          <div>
            <span>
              Last Repair
            </span>

            <strong>
              {formatDate(
                customer.lastRepair
              )}
            </strong>
          </div>

        </div>

      </div>

      {/* INFORMATION */}

      <div className="customer-details-grid">

        <section className="customer-details-card">

          <div className="customer-card-header">

            <div>
              <span>
                CONTACT
              </span>

              <h2>
                Contact Information
              </h2>
            </div>

            <User size={19} />

          </div>

          <div className="customer-info-list">

            <div className="customer-info-row">

              <span>
                <User size={15} />
                Name
              </span>

              <strong>
                {customer.name}
              </strong>

            </div>

            <div className="customer-info-row">

              <span>
                <Mail size={15} />
                Email
              </span>

              <strong>
                {customer.email}
              </strong>

            </div>

            <div className="customer-info-row">

              <span>
                <Phone size={15} />
                Phone
              </span>

              <strong>
                {customer.phone}
              </strong>

            </div>

          </div>

        </section>

        {/* REPAIR SUMMARY */}

        <section className="customer-details-card">

          <div className="customer-card-header">

            <div>
              <span>
                CUSTOMER RECORD
              </span>

              <h2>
                Repair Summary
              </h2>
            </div>

            <Wrench size={19} />

          </div>

          <div className="customer-info-list">

            <div className="customer-info-row">

              <span>
                Total Repairs
              </span>

              <strong>
                {customer.repairs ||
                  0}
              </strong>

            </div>

            <div className="customer-info-row">

              <span>
                Current Status
              </span>

              <strong>
                {customer.status}
              </strong>

            </div>

            <div className="customer-info-row">

              <span>
                Last Repair
              </span>

              <strong>
                {formatDate(
                  customer.lastRepair
                )}
              </strong>

            </div>

          </div>

        </section>

      </div>

      {/* REPAIR HISTORY */}

      <section className="customer-details-card customer-repair-history">

        <div className="customer-card-header">

          <div>
            <span>
              REPAIR HISTORY
            </span>

            <h2>
              Customer Repairs
            </h2>
          </div>

          <CalendarDays size={19} />

        </div>

        {customer.bookings.length ===
        0 ? (
          <div className="customer-no-repairs">
            <Wrench size={28} />

            <p>
              No repair history found.
            </p>
          </div>
        ) : (
          <div className="customer-repairs-list">

            {customer.bookings.map(
              (booking) => (
                <div
                  className="customer-repair-item"
                  key={booking._id}
                >

                  <div className="customer-repair-icon">
                    <Wrench size={18} />
                  </div>

                  <div className="customer-repair-main">

                    <strong>
                      {
                        booking.deviceModel
                      }
                    </strong>

                    <span>
                      {
                        booking.deviceCategory
                      }
                    </span>

                    <p>
                      {booking.issue}
                    </p>

                  </div>

                  <div className="customer-repair-meta">

                    <span
                      className={`customer-repair-status status-${booking.status}`}
                    >
                      {formatStatus(
                        booking.status
                      )}
                    </span>

                    <small>
                      {formatDate(
                        booking.createdAt
                      )}
                    </small>

                  </div>

                  <button
                    className="customer-repair-view"
                    onClick={() =>
                      navigate(
                        `/repairs/${booking._id}`
                      )
                    }
                  >
                    View
                  </button>

                </div>
              )
            )}

          </div>
        )}

      </section>

    </div>
  );
};

export default CustomerDetails;