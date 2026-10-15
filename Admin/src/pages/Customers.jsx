import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Eye,
  Users,
  Wrench,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { getCustomers } from "../services/api";

import "./Customers.css";

const Customers = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCustomers();

      setCustomers(response.data || []);
    } catch (err) {
      setError(
        err.message ||
          "Failed to load customers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
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

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const filteredCustomers = useMemo(() => {
    const value = search
      .toLowerCase()
      .trim();

    return customers.filter((customer) => {
      const matchesSearch =
        !value ||
        customer.name
          ?.toLowerCase()
          .includes(value) ||
        customer.email
          ?.toLowerCase()
          .includes(value) ||
        customer.phone
          ?.toLowerCase()
          .includes(value);

      const matchesStatus =
        statusFilter === "All" ||
        customer.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    customers,
    search,
    statusFilter,
  ]);

  const activeCustomers =
    customers.filter(
      (customer) =>
        customer.status === "Active"
    ).length;

  const totalRepairs =
    customers.reduce(
      (total, customer) =>
        total +
        (customer.repairs || 0),
      0
    );

  return (
    <div className="customers-page">

      {/* HEADER */}

      <div className="customers-header">

        <div>
          <span className="customers-eyebrow">
            CUSTOMER MANAGEMENT
          </span>

          <h1>Customers</h1>

          <p>
            View and manage customers
            who have interacted with
            Mtech n Repairs.
          </p>
        </div>

        <button
          className="customers-refresh-btn"
          onClick={loadCustomers}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? "customers-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>

      {/* ALERT */}

      {success && (
        <div className="customers-alert customers-success">
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
        <div className="customers-alert customers-error">
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

      <div className="customers-summary-grid">

        <div className="customer-summary-card">

          <div className="customer-summary-icon">
            <Users size={21} />
          </div>

          <div>
            <span>Total Customers</span>
            <strong>
              {customers.length}
            </strong>
          </div>

        </div>

        <div className="customer-summary-card">

          <div className="customer-summary-icon green">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>Active Customers</span>
            <strong>
              {activeCustomers}
            </strong>
          </div>

        </div>

        <div className="customer-summary-card">

          <div className="customer-summary-icon blue">
            <Wrench size={21} />
          </div>

          <div>
            <span>Total Repairs</span>
            <strong>
              {totalRepairs}
            </strong>
          </div>

        </div>

      </div>

      {/* TOOLBAR */}

      <div className="customers-toolbar">

        <div className="customers-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search customer, email or phone..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
        >
          <option value="All">
            All Status
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Inactive">
            Inactive
          </option>
        </select>

      </div>

      {/* TABLE */}

      <div className="customers-table-card">

        <div className="customers-table-header">

          <div>
            <h2>
              Customer List
            </h2>

            <p>
              {filteredCustomers.length}{" "}
              customer
              {filteredCustomers.length !==
              1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>

        </div>

        {loading ? (
          <div className="customers-loading">

            <Loader2
              size={30}
              className="customers-spin"
            />

            <p>
              Loading customers...
            </p>

          </div>
        ) : filteredCustomers.length ===
          0 ? (
          <div className="customers-empty">

            <div className="customers-empty-icon">
              <Users size={32} />
            </div>

            <h3>
              No customers found
            </h3>

            <p>
              {customers.length === 0
                ? "Customers will appear here when they submit repair bookings."
                : "Try changing your search or status filter."}
            </p>

          </div>
        ) : (
          <div className="customers-table-wrapper">

            <table className="customers-table">

              <thead>
                <tr>
                  <th>CUSTOMER</th>
                  <th>CONTACT</th>
                  <th>REPAIRS</th>
                  <th>LAST REPAIR</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>

                {filteredCustomers.map(
                  (customer) => {

                    const initials =
                      customer.name
                        ?.split(" ")
                        .map(
                          (part) =>
                            part.charAt(0)
                        )
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() ||
                      "C";

                    return (
                      <tr
                        key={
                          customer.id
                        }
                      >

                        <td>

                          <div className="customer-table-profile">

                            <div className="customer-table-avatar">
                              {initials}
                            </div>

                            <div>
                              <strong>
                                {
                                  customer.name
                                }
                              </strong>

                              <span>
                                {
                                  customer.email
                                }
                              </span>
                            </div>

                          </div>

                        </td>

                        <td>

                          <span className="customer-phone">
                            {
                              customer.phone ||
                              "—"
                            }
                          </span>

                        </td>

                        <td>

                          <span className="customer-repair-count">
                            {customer.repairs ||
                              0}
                          </span>

                        </td>

                        <td>

                          <span className="customer-date">
                            {formatDate(
                              customer.lastRepair
                            )}
                          </span>

                        </td>

                        <td>

                          <span
                            className={`customer-status ${
                              customer.status ===
                              "Active"
                                ? "active"
                                : "inactive"
                            }`}
                          >
                            {
                              customer.status
                            }
                          </span>

                        </td>

                        <td>

                          <button
                            className="customer-view-button"
                            title="View Customer"
                            onClick={() =>
                              navigate(
                                `/customers/${encodeURIComponent(
                                  customer.id
                                )}`
                              )
                            }
                          >
                            <Eye
                              size={17}
                            />
                          </button>

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

export default Customers;