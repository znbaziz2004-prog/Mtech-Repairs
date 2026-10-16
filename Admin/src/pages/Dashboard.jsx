import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Package,
  Wrench,
  ClipboardList,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("mtech_admin_token");

      const response = await fetch(
        "https://mtechnrepairs.hostless.app/api/admin/dashboard",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load dashboard data."
        );
      }

      setDashboardData(result.data);
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError(err.message || "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ---------------------------------------------------------
  // DATE
  // ---------------------------------------------------------

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // ---------------------------------------------------------
  // LOADING
  // ---------------------------------------------------------

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <RefreshCw size={24} className="loading-spinner" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // ERROR
  // ---------------------------------------------------------

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <strong>Unable to load dashboard</strong>

          <span>{error}</span>

          <button onClick={fetchDashboard}>
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const recentBookings = dashboardData?.recentBookings || [];

  // ---------------------------------------------------------
  // STATUS FORMATTER
  // ---------------------------------------------------------

  const formatStatus = (status) => {
    if (!status) return "";

    return status
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  // ---------------------------------------------------------
  // DATE FORMATTER
  // ---------------------------------------------------------

  const formatBookingDate = (date) => {
    if (!date) return "No date selected";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ---------------------------------------------------------
  // STATS
  // ---------------------------------------------------------

  const statCards = [
    {
      title: "Repair Bookings",
      value: stats.totalBookings ?? 0,
      subtitle: `${stats.inProgressBookings ?? 0} currently in progress`,
      icon: Wrench,
      onClick: () => navigate("/repairs"),
    },
    {
      title: "Products",
      value: stats.totalProducts ?? 0,
      subtitle: "Products listed",
      icon: Package,
      onClick: () => navigate("/products"),
    },
    {
      title: "Pending Bookings",
      value: stats.pendingBookings ?? 0,
      subtitle: `${stats.confirmedBookings ?? 0} confirmed`,
      icon: ClipboardList,
      onClick: () => navigate("/repairs"),
    },
  ];

  return (
    <div className="dashboard-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="dashboard-hero">
        <div>
          <span className="dashboard-eyebrow">
            MTECH REPAIRS ADMIN
          </span>

          <h2>
            Welcome back, Admin
            <span> 👋</span>
          </h2>

          <p>
            Here's what's happening with your repair business today.
          </p>
        </div>

        <div className="dashboard-date">
          <CalendarDays size={18} />

          <span>{formattedDate}</span>
        </div>
      </section>


      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="stats-grid">

        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <button
              key={card.title}
              className="dashboard-stat-card"
              onClick={card.onClick}
              type="button"
            >
              <div className="dashboard-stat-icon">
                <Icon size={21} />
              </div>

              <div className="dashboard-stat-content">
                <span>{card.title}</span>

                <strong>{card.value}</strong>

                <small>{card.subtitle}</small>
              </div>

              <ArrowRight
                size={17}
                className="dashboard-stat-arrow"
              />
            </button>
          );
        })}

      </section>


      {/* =====================================================
          CONTENT GRID
      ===================================================== */}

      <section className="dashboard-content-grid">

        {/* ===================================================
            RECENT BOOKINGS
        =================================================== */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h3>Recent Repair Bookings</h3>

              <span>
                Latest customer repair requests
              </span>
            </div>

            <button
              className="view-all-button"
              onClick={() => navigate("/repairs")}
              type="button"
            >
              View All
              <ArrowRight size={15} />
            </button>

          </div>


          <div className="orders-table-wrapper">

            {recentBookings.length === 0 ? (
              <div className="dashboard-empty">
                <Wrench size={25} />

                <span>
                  No repair bookings found.
                </span>
              </div>
            ) : (

              <table className="orders-table">

                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Device</th>
                    <th>Issue</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {recentBookings.map((booking) => (

                    <tr
                      key={booking._id}
                      className="clickable-row"
                      onClick={() =>
                        navigate(`/repairs/${booking._id}`)
                      }
                    >

                      <td>
                        <strong>
                          {booking.customerName}
                        </strong>

                        <small>
                          {booking.email}
                        </small>
                      </td>

                      <td>
                        {booking.deviceModel}
                      </td>

                      <td>
                        {booking.issue}
                      </td>

                      <td>
                        {formatBookingDate(
                          booking.preferredDate
                        )}
                      </td>

                      <td>
                        <span
                          className={`order-status ${booking.status}`}
                        >
                          {formatStatus(booking.status)}
                        </span>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

          </div>

        </div>


        {/* ===================================================
            TODAY'S BOOKINGS
        =================================================== */}

        <div className="dashboard-panel repair-panel">

          <div className="panel-header">

            <div>
              <h3>Today's Bookings</h3>

              <span>
                Appointments scheduled for today
              </span>
            </div>

            <button
              className="view-all-button"
              onClick={() => navigate("/repairs")}
              type="button"
            >
              View All
              <ArrowRight size={15} />
            </button>

          </div>


          <div className="repair-list">

            {dashboardData?.todaysBookings?.length > 0 ? (

              dashboardData.todaysBookings.map((booking) => (

                <div
                  className="repair-item clickable-repair"
                  key={booking._id}
                  onClick={() =>
                    navigate(`/repairs/${booking._id}`)
                  }
                >

                  <div className="repair-icon">
                    <Clock3 size={18} />
                  </div>

                  <div className="repair-info">

                    <strong>
                      {booking.customerName}
                    </strong>

                    <span>
                      {booking.deviceModel} ·{" "}
                      {booking.issue}
                    </span>

                  </div>

                  <div className="repair-time">

                    <strong>
                      Today
                    </strong>

                    <span>
                      {formatStatus(booking.status)}
                    </span>

                  </div>

                </div>

              ))

            ) : (

              <div className="dashboard-empty compact">
                <CalendarDays size={22} />

                <span>
                  No bookings scheduled for today.
                </span>
              </div>

            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          BOOKING STATUS OVERVIEW
      ===================================================== */}

      <section className="quick-actions">

        <div className="quick-actions-heading">

          <div>
            <h3>Booking Overview</h3>

            <span>
              Current repair booking status
            </span>
          </div>

        </div>


        <div className="quick-actions-grid">

          <button
            className="quick-action"
            onClick={() => navigate("/repairs")}
            type="button"
          >

            <div className="quick-action-icon">
              <Wrench size={19} />
            </div>

            <div>
              <strong>
                Manage Repairs
              </strong>

              <span>
                {stats.totalBookings ?? 0} total bookings
              </span>
            </div>

            <ArrowRight size={17} />

          </button>


          <button
            className="quick-action"
            onClick={() => navigate("/products")}
            type="button"
          >

            <div className="quick-action-icon">
              <Package size={19} />
            </div>

            <div>
              <strong>
                Manage Products
              </strong>

              <span>
                {stats.totalProducts ?? 0} products available
              </span>
            </div>

            <ArrowRight size={17} />

          </button>

        </div>

      </section>

    </div>
  );
};

export default Dashboard;
