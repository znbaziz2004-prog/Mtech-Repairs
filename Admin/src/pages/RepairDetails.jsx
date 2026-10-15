import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Phone,
  Smartphone,
  User,
  Wrench,
  Mail,
  RefreshCw,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import {
  getBookingById,
  updateBooking,
} from "../services/api";

import "./RepairDetails.css";

const RepairDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [repair, setRepair] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [selectedStatus, setSelectedStatus] =
    useState("pending");

  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadRepair = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getBookingById(id);

      const booking = response.data;

      setRepair(booking);
      setSelectedStatus(
        booking.status || "pending"
      );
      setNotes(booking.notes || "");
    } catch (err) {
      setError(
        err.message ||
          "Failed to load repair booking."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepair();
  }, [id]);

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [success]);

  const statusLabels = {
    pending: "Pending",
    confirmed: "Confirmed",
    "in-progress": "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  const getStatusLabel = (status) => {
    return (
      statusLabels[status] ||
      "Pending"
    );
  };

  const formatDate = (date) => {
    if (!date) return "Not scheduled";

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  const formatTime = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleTimeString(
      "en-GB",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const formatDateTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const customerInitials = useMemo(() => {
    if (!repair?.customerName) return "C";

    return repair.customerName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [repair]);

  const timeline = useMemo(() => {
    if (!repair) return [];

    const currentStatus =
      repair.status || "pending";

    const steps = [
      {
        status: "pending",
        title: "Repair Booking Received",
        description:
          "Customer submitted a new repair booking.",
      },
      {
        status: "confirmed",
        title: "Appointment Confirmed",
        description:
          "The repair appointment has been confirmed.",
      },
      {
        status: "in-progress",
        title: "Repair In Progress",
        description:
          "The device repair is currently in progress.",
      },
      {
        status: "completed",
        title: "Repair Completed",
        description:
          "The device repair has been completed.",
      },
    ];

    const order = [
      "pending",
      "confirmed",
      "in-progress",
      "completed",
    ];

    const currentIndex =
      order.indexOf(currentStatus);

    if (currentStatus === "cancelled") {
      return [
        {
          title: "Repair Booking Received",
          description:
            "Customer submitted a new repair booking.",
          date: formatDateTime(
            repair.createdAt
          ),
          completed: true,
        },
        {
          title: "Repair Cancelled",
          description:
            "This repair booking has been cancelled.",
          date: formatDateTime(
            repair.updatedAt
          ),
          completed: false,
          current: true,
        },
      ];
    }

    return steps.map((step, index) => ({
      ...step,
      date:
        index <= currentIndex
          ? index === 0
            ? formatDateTime(
                repair.createdAt
              )
            : formatDateTime(
                repair.updatedAt
              )
          : "Pending",
      completed:
        index <= currentIndex,
      current:
        index === currentIndex,
    }));
  }, [repair]);

  const handleUpdate = async () => {
    if (!repair) return;

    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      

const response = await updateBooking(
  repair?.id,
  {
    status: selectedStatus,
    notes: notes.trim(),
  }
);

      setRepair(response.data);

      setSelectedStatus(
        response.data.status || "pending"
      );

      setNotes(
        response.data.notes || ""
      );

      setSuccess(
        "Repair booking updated successfully."
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to update repair booking."
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="repair-details-page">
        <div className="repair-details-loading">
          <Loader2
            size={34}
            className="repair-details-spin"
          />

          <p>
            Loading repair details...
          </p>
        </div>
      </div>
    );
  }

  if (error && !repair) {
    return (
      <div className="repair-details-page">
        <div className="repair-details-error">

          <div className="repair-details-error-icon">
            <AlertCircle size={30} />
          </div>

          <h2>
            Repair Booking Not Found
          </h2>

          <p>{error}</p>

          <button
            className="repair-back-button"
            onClick={() =>
              navigate("/repairs")
            }
          >
            <ArrowLeft size={18} />
            Back to Repair Bookings
          </button>

        </div>
      </div>
    );
  }

  if (!repair) {
    return null;
  }

  return (
    <div className="repair-details-page">

      {/* HEADER */}

      <div className="repair-details-header">

        <button
          type="button"
          className="repair-back-button"
          onClick={() =>
            navigate("/repairs")
          }
        >
          <ArrowLeft size={18} />
          Back to Repair Bookings
        </button>

        <div className="repair-header-main">

          <div>
            <span className="repair-details-eyebrow">
              REPAIR MANAGEMENT
            </span>

            <h1>
              Repair Details
            </h1>

            <p>
              Review and manage this customer's
              repair booking.
            </p>
          </div>

          <div className="repair-header-actions">

            <span className="repair-id-badge">
              #
              {repair._id
                ?.slice(-6)
                .toUpperCase()}
            </span>

            <span
              className={`repair-status-badge status-${repair.status}`}
            >
              {getStatusLabel(
                repair.status
              )}
            </span>

          </div>

        </div>

      </div>

      {/* ALERTS */}

      {success && (
        <div className="repair-details-alert success">
          <CheckCircle2 size={18} />

          <span>{success}</span>

          <button
            onClick={() =>
              setSuccess("")
            }
          >
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <div className="repair-details-alert error">
          <AlertCircle size={18} />

          <span>{error}</span>

          <button
            onClick={() =>
              setError("")
            }
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* SUMMARY */}

      <div className="repair-summary-card">

        <div className="repair-summary-main">

          <div className="repair-summary-icon">
            <Wrench size={22} />
          </div>

          <div>
            <span>
              Repair Booking
            </span>

            <strong>
              #
              {repair._id
                ?.slice(-6)
                .toUpperCase()}
            </strong>
          </div>

        </div>

        <div className="repair-summary-item">

          <span>
            Appointment
          </span>

          <strong>
            {formatDate(
              repair.preferredDate
            )}
          </strong>

          <small>
            {formatTime(
              repair.preferredDate
            )}
          </small>

        </div>

        <div className="repair-summary-item">

          <span>
            Device
          </span>

          <strong>
            {repair.deviceModel}
          </strong>

        </div>

        <div className="repair-summary-item">

          <span>
            Status
          </span>

          <strong className="repair-cost">
            {getStatusLabel(
              repair.status
            )}
          </strong>

        </div>

      </div>

      {/* MAIN GRID */}

      <div className="repair-details-grid">

        {/* LEFT */}

        <div className="repair-details-left">

          {/* CUSTOMER */}

          <section className="repair-details-card">

            <div className="repair-card-header">

              <div>
                <span className="repair-card-eyebrow">
                  CUSTOMER
                </span>

                <h2>
                  Customer Information
                </h2>
              </div>

              <div className="repair-card-icon">
                <User size={18} />
              </div>

            </div>

            <div className="repair-customer-profile">

              <div className="repair-customer-avatar">
                {customerInitials}
              </div>

              <div className="repair-customer-info">

                <h3>
                  {repair.customerName}
                </h3>

                <p>
                  <Mail size={14} />
                  {repair.email}
                </p>

                <p className="repair-phone">
                  <Phone size={14} />
                  {repair.phone}
                </p>

              </div>

            </div>

          </section>

          {/* DEVICE */}

          <section className="repair-details-card">

            <div className="repair-card-header">

              <div>
                <span className="repair-card-eyebrow">
                  DEVICE
                </span>

                <h2>
                  Device Information
                </h2>
              </div>

              <div className="repair-card-icon">
                <Smartphone size={18} />
              </div>

            </div>

            <div className="device-details">

              <div className="device-icon">
                <Smartphone size={30} />
              </div>

              <div className="device-information">

                <h3>
                  {repair.deviceModel}
                </h3>

                <div className="device-meta">

                  <div>
                    <span>
                      Category
                    </span>

                    <strong>
                      {
                        repair.deviceCategory
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Issue
                    </span>

                    <strong>
                      {repair.issue}
                    </strong>
                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* REPAIR INFORMATION */}

          <section className="repair-details-card">

            <div className="repair-card-header">

              <div>
                <span className="repair-card-eyebrow">
                  REPAIR INFORMATION
                </span>

                <h2>
                  Repair Details
                </h2>
              </div>

              <div className="repair-card-icon">
                <Wrench size={18} />
              </div>

            </div>

            <div className="repair-info-grid">

              <div className="repair-info-box">

                <span>
                  Device
                </span>

                <strong>
                  {repair.deviceModel}
                </strong>

              </div>

              <div className="repair-info-box">

                <span>
                  Category
                </span>

                <strong>
                  {repair.deviceCategory}
                </strong>

              </div>

              <div className="repair-info-box">

                <span>
                  Booking Status
                </span>

                <strong>
                  {getStatusLabel(
                    repair.status
                  )}
                </strong>

              </div>

              <div className="repair-info-box">

                <span>
                  Booking Created
                </span>

                <strong>
                  {formatDateTime(
                    repair.createdAt
                  )}
                </strong>

              </div>

            </div>

          </section>

          {/* CUSTOMER NOTES */}

          <section className="repair-details-card">

            <div className="repair-card-header">

              <div>
                <span className="repair-card-eyebrow">
                  REPAIR NOTES
                </span>

                <h2>
                  Customer / Admin Notes
                </h2>
              </div>

              <div className="repair-card-icon">
                <FileText size={18} />
              </div>

            </div>

            <div className="repair-notes-box">

              <FileText size={18} />

              <p>
                {repair.notes ||
                  "No notes have been added yet."}
              </p>

            </div>

          </section>

        </div>

        {/* RIGHT */}

        <div className="repair-details-right">

          {/* STATUS */}

          <section className="repair-details-card repair-status-card">

            <div className="repair-card-header">

              <div>
                <span className="repair-card-eyebrow">
                  BOOKING STATUS
                </span>

                <h2>
                  Update Booking
                </h2>
              </div>

              <div className="repair-card-icon">
                <CheckCircle2 size={18} />
              </div>

            </div>

            <div className="repair-current-status">

              <span>
                Current Status
              </span>

              <strong>
                {getStatusLabel(
                  repair.status
                )}
              </strong>

            </div>

            <div className="repair-select-wrapper">

              <label>
                Repair Status
              </label>

              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(
                    e.target.value
                  )
                }
                disabled={updating}
              >
                <option value="pending">
                  Pending
                </option>

                <option value="confirmed">
                  Confirmed
                </option>

                <option value="in-progress">
                  In Progress
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>
              </select>

            </div>

            <div className="repair-select-wrapper">

              <label>
                Notes
              </label>

              <textarea
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                placeholder="Add repair notes..."
                rows="5"
                disabled={updating}
              />

            </div>

            <button
              type="button"
              className="repair-update-button"
              onClick={handleUpdate}
              disabled={updating}
            >
              {updating ? (
                <>
                  <Loader2
                    size={17}
                    className="repair-details-spin"
                  />

                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle2 size={17} />

                  Update Repair
                </>
              )}
            </button>

          </section>

          {/* APPOINTMENT */}

          <section className="repair-details-card">

            <div className="repair-card-header">

              <div>
                <span className="repair-card-eyebrow">
                  APPOINTMENT
                </span>

                <h2>
                  Appointment Details
                </h2>
              </div>

              <div className="repair-card-icon">
                <CalendarDays size={18} />
              </div>

            </div>

            <div className="appointment-box">

              <div className="appointment-icon">
                <CalendarDays size={20} />
              </div>

              <div>
                <span>
                  Appointment Date
                </span>

                <strong>
                  {formatDate(
                    repair.preferredDate
                  )}
                </strong>
              </div>

            </div>

            <div className="appointment-box">

              <div className="appointment-icon">
                <Clock3 size={20} />
              </div>

              <div>
                <span>
                  Appointment Time
                </span>

                <strong>
                  {formatTime(
                    repair.preferredDate
                  )}
                </strong>
              </div>

            </div>

          </section>

          {/* BOOKING RECORD */}

          <section className="repair-details-card">

            <div className="repair-card-header">

              <div>
                <span className="repair-card-eyebrow">
                  RECORD
                </span>

                <h2>
                  Booking Information
                </h2>
              </div>

              <div className="repair-card-icon">
                <Clock3 size={18} />
              </div>

            </div>

            <div className="repair-info-list">

              <div className="repair-info-row">

                <span>
                  Created
                </span>

                <strong>
                  {formatDateTime(
                    repair.createdAt
                  )}
                </strong>

              </div>

              <div className="repair-info-row">

                <span>
                  Last Updated
                </span>

                <strong>
                  {formatDateTime(
                    repair.updatedAt
                  )}
                </strong>

              </div>

            </div>

          </section>

          {/* TIMELINE */}

          <section className="repair-details-card">

            <div className="repair-card-header">

              <div>
                <span className="repair-card-eyebrow">
                  ACTIVITY
                </span>

                <h2>
                  Repair Timeline
                </h2>
              </div>

              <div className="repair-card-icon">
                <Clock3 size={18} />
              </div>

            </div>

            <div className="repair-timeline">

              {timeline.map(
                (item) => (
                  <div
                    className={`repair-timeline-item ${
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

                    <div className="repair-timeline-marker">

                      {item.completed ? (
                        <CheckCircle2
                          size={15}
                        />
                      ) : (
                        <span />
                      )}

                    </div>

                    <div className="repair-timeline-content">

                      <div className="repair-timeline-title">

                        <strong>
                          {item.title}
                        </strong>

                        {item.current && (
                          <span>
                            CURRENT
                          </span>
                        )}

                      </div>

                      <p>
                        {item.description}
                      </p>

                      <small>
                        {item.date}
                      </small>

                    </div>

                  </div>
                )
              )}

            </div>

          </section>

        </div>

      </div>

    </div>
  );
};

export default RepairDetails;