import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  Wrench,
  Clock3,
  CheckCircle,
  XCircle,
  RefreshCw,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";

import {
  getBookings,
  updateBooking,
} from "../services/api";

import "./Repairs.css";

const Repairs = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getBookings();

      console.log("BOOKINGS API RESPONSE:", response);
console.log("FIRST BOOKING:", response.data?.[0]);

      setBookings(response.data || []);
    } catch (err) {
      setError(
        err.message || "Failed to load repair bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [success]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Pending",
      confirmed: "Confirmed",
      "in-progress": "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
    };

    return labels[status] || status || "Pending";
  };

  const handleStatusChange = async (booking, newStatus) => {

   
    try {
      setUpdatingId(booking.id);
      setError("");
      setSuccess("");

      console.log("BOOKING TO UPDATE:", booking);

const response = await updateBooking(
  booking.id,
  { status: newStatus }
);

      setBookings((previous) =>
        previous.map((item) =>
          item.id === booking.id
            ? response.data
            : item
        )
      );

      setSuccess(
        `Repair ${getStatusLabel(newStatus).toLowerCase()} successfully.`
      );
    } catch (err) {
      setError(
        err.message || "Failed to update repair status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = useMemo(() => {
    const searchValue = search
      .toLowerCase()
      .trim();

    return bookings.filter((booking) => {
      const matchesSearch =
        !searchValue ||
        booking.customerName
          ?.toLowerCase()
          .includes(searchValue) ||
        booking.email
          ?.toLowerCase()
          .includes(searchValue) ||
        booking.phone
          ?.toLowerCase()
          .includes(searchValue) ||
        booking.deviceModel
          ?.toLowerCase()
          .includes(searchValue) ||
        booking.deviceCategory
          ?.toLowerCase()
          .includes(searchValue) ||
        booking.issue
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const totalRepairs = bookings.length;

  const pendingRepairs = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const inProgressRepairs = bookings.filter(
    (booking) =>
      booking.status === "in-progress"
  ).length;

  const completedRepairs = bookings.filter(
    (booking) =>
      booking.status === "completed"
  ).length;

  return (
    <div className="repairs-page">

      {/* HEADER */}

      <div className="repairs-header">
        <div>
          <span className="repairs-eyebrow">
            REPAIR MANAGEMENT
          </span>

          <h1>Repair Bookings</h1>

          <p>
            Manage customer repair appointments and
            booking statuses.
          </p>
        </div>

        <button
          className="repairs-refresh-btn"
          onClick={loadBookings}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={
              loading ? "repairs-spin" : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* SUCCESS */}

      {success && (
        <div className="repairs-alert repairs-success">
          <CheckCircle size={18} />

          <span>{success}</span>

          <button
            onClick={() => setSuccess("")}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ERROR */}

      {error && (
        <div className="repairs-alert repairs-error">
          <AlertCircle size={18} />

          <span>{error}</span>

          <button
            onClick={() => setError("")}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* SUMMARY */}

      <div className="repairs-summary-grid">

        <div className="repair-summary-card">

          <div className="repair-summary-icon">
            <Wrench size={21} />
          </div>

          <div>
            <span>Total Repairs</span>
            <strong>{totalRepairs}</strong>
          </div>

        </div>

        <div className="repair-summary-card">

          <div className="repair-summary-icon orange">
            <Clock3 size={21} />
          </div>

          <div>
            <span>Pending</span>
            <strong>{pendingRepairs}</strong>
          </div>

        </div>

        <div className="repair-summary-card">

          <div className="repair-summary-icon blue">
            <Wrench size={21} />
          </div>

          <div>
            <span>In Progress</span>
            <strong>{inProgressRepairs}</strong>
          </div>

        </div>

        <div className="repair-summary-card">

          <div className="repair-summary-icon green">
            <CheckCircle size={21} />
          </div>

          <div>
            <span>Completed</span>
            <strong>{completedRepairs}</strong>
          </div>

        </div>

      </div>

      {/* TOOLBAR */}

      <div className="repairs-toolbar">

        <div className="repairs-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search customer, phone, device or issue..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="All">
            All Status
          </option>

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

      {/* TABLE */}

      <div className="repairs-table-card">

        <div className="repairs-table-header">
          <div>
            <h2>Repair Requests</h2>

            <p>
              {filteredBookings.length} booking
              {filteredBookings.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="repairs-loading">
            <Loader2
              size={30}
              className="repairs-spin"
            />

            <p>
              Loading repair bookings...
            </p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="repairs-empty">

            <div className="repairs-empty-icon">
              <Wrench size={32} />
            </div>

            <h3>No repair bookings found</h3>

            <p>
              {bookings.length === 0
                ? "No customer repair bookings have been received yet."
                : "Try changing your search or status filter."}
            </p>

          </div>
        ) : (
          <div className="repairs-table-wrapper">

            <table className="repairs-table">

              <thead>
                <tr>
                  <th>CUSTOMER</th>
                  <th>DEVICE</th>
                  <th>ISSUE</th>
                  <th>APPOINTMENT</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>

                {filteredBookings.map(
                  (booking) => {

                    const isUpdating =
                      updatingId ===
                      booking.id;

                    return (
                      <tr
                        key={booking.id}
                      >

                        {/* CUSTOMER */}

                        <td>
                          <div className="repair-customer-cell">

                            <div className="repair-avatar">
                              {booking.customerName
                                ?.charAt(0)
                                ?.toUpperCase() || "C"}
                            </div>

                            <div>
                              <strong>
                                {
                                  booking.customerName
                                }
                              </strong>

                              <span>
                                {booking.phone}
                              </span>
                            </div>

                          </div>
                        </td>

                        {/* DEVICE */}

                        <td>
                          <div className="repair-device-cell">

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

                          </div>
                        </td>

                        {/* ISSUE */}

                        <td>
                          <span className="repair-issue">
                            {booking.issue}
                          </span>
                        </td>

                        {/* APPOINTMENT */}

                        <td>
                          <div className="repair-date-cell">

                            <strong>
                              {formatDate(
                                booking.preferredDate
                              )}
                            </strong>

                            <span>
                              {formatTime(
                                booking.preferredDate
                              )}
                            </span>

                          </div>
                        </td>

                        {/* STATUS */}

                        <td>
                          <select
                            className={`repair-status-select status-${booking.status}`}
                            value={
                              booking.status ||
                              "pending"
                            }
                            disabled={
                              isUpdating
                            }
                            onChange={(e) =>
                              handleStatusChange(
                                booking,
                                e.target.value
                              )
                            }
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
                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="repair-actions">

                            <button
                              className="repair-action view"
                              title="View Details"
                              onClick={() =>
                                navigate(
                                  `/repairs/${booking.id}`
                                )
                              }
                            >
                              <Eye size={17} />
                            </button>

                            {isUpdating && (
                              <Loader2
                                size={16}
                                className="repairs-spin"
                              />
                            )}

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
};

export default Repairs;