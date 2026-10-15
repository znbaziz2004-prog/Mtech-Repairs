import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Eye,
  Mail,
  Phone,
  CalendarDays,
  RefreshCw,
  Loader2,
  MessageSquare,
  X,
} from "lucide-react";

import { getContactMessages } from "../services/api";
import "./ContactMessages.css";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getContactMessages();
      setMessages(response.data || []);
    } catch (err) {
      setError(err.message || "Failed to load contact messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

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

  const filteredMessages = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return messages;

    return messages.filter((message) =>
      [
        message.name,
        message.email,
        message.phone,
        message.subject,
        message.message,
      ].some((field) =>
        field?.toLowerCase().includes(value)
      )
    );
  }, [messages, search]);

  const todayMessages = messages.filter((message) => {
    if (!message.createdAt) return false;

    const date = new Date(message.createdAt);
    const today = new Date();

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }).length;

  const uniqueCustomers = new Set(
    messages
      .map((message) => message.email?.toLowerCase())
      .filter(Boolean)
  ).size;

  return (
    <div className="contact-messages-page">

      {/* HEADER */}
      <div className="contact-messages-header">
        <div>
          <span className="contact-messages-eyebrow">
            CUSTOMER COMMUNICATION
          </span>

          <h1>Contact Messages</h1>

          <p>
            View messages submitted through the MTech n Repairs website.
          </p>
        </div>

        <button
          className="contact-refresh-btn"
          onClick={loadMessages}
          disabled={loading}
        >
          {loading ? (
            <Loader2 size={17} className="contact-spin" />
          ) : (
            <RefreshCw size={17} />
          )}
          Refresh
        </button>
      </div>

      {/* SUMMARY */}
      <div className="contact-summary-grid">

        <div className="contact-summary-card">
          <div className="contact-summary-icon">
            <MessageSquare size={22} />
          </div>

          <div>
            <span>Total Messages</span>
            <strong>{messages.length}</strong>
          </div>
        </div>

        <div className="contact-summary-card">
          <div className="contact-summary-icon">
            <Mail size={22} />
          </div>

          <div>
            <span>Today</span>
            <strong>{todayMessages}</strong>
          </div>
        </div>

        <div className="contact-summary-card">
          <div className="contact-summary-icon">
            <Phone size={22} />
          </div>

          <div>
            <span>Customers</span>
            <strong>{uniqueCustomers}</strong>
          </div>
        </div>

      </div>

      {/* ERROR */}
      {error && (
        <div className="contact-alert contact-alert-error">
          <span>{error}</span>

          <button onClick={() => setError("")}>
            <X size={17} />
          </button>
        </div>
      )}

      {/* TOOLBAR */}
      <div className="contact-toolbar">

        <div className="contact-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search name, email, subject or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="contact-results">
          {filteredMessages.length}{" "}
          {filteredMessages.length === 1
            ? "message"
            : "messages"}
        </div>

      </div>

      {/* TABLE */}
      <div className="contact-table-card">

        {loading ? (
          <div className="contact-state">
            <Loader2 size={30} className="contact-spin" />
            <p>Loading messages...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="contact-state">
            <div className="contact-empty-icon">
              <MessageSquare size={28} />
            </div>

            <h3>No messages found</h3>

            <p>
              {search
                ? "Try a different search."
                : "No contact messages have been submitted yet."}
            </p>
          </div>
        ) : (
          <div className="contact-table-wrapper">

            <table className="contact-table">

              <thead>
                <tr>
                  <th>CUSTOMER</th>
                  <th>SUBJECT</th>
                  <th>PHONE</th>
                  <th>MESSAGE</th>
                  <th>DATE</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>

                {filteredMessages.map((message) => (
                  <tr key={message._id}>

                    <td>
                      <div className="contact-customer">

                        <div className="contact-avatar">
                          {message.name
                            ?.charAt(0)
                            .toUpperCase() || "?"}
                        </div>

                        <div>
                          <strong>
                            {message.name || "Unknown"}
                          </strong>

                          <span>
                            {message.email || "—"}
                          </span>
                        </div>

                      </div>
                    </td>

                    <td>
                      <span className="contact-subject">
                        {message.subject || "General Enquiry"}
                      </span>
                    </td>

                    <td>
                      <span className="contact-phone">
                        {message.phone || "—"}
                      </span>
                    </td>

                    <td>
                      <p className="contact-message-preview">
                        {message.message || "—"}
                      </p>
                    </td>

                    <td>
                      <div className="contact-date">

                        <span>
                          <CalendarDays size={14} />
                          {formatDate(message.createdAt)}
                        </span>

                        <small>
                          {formatTime(message.createdAt)}
                        </small>

                      </div>
                    </td>

                    <td>
                      <button
                        className="contact-view-btn"
                        onClick={() =>
                          setSelectedMessage(message)
                        }
                        title="View message"
                      >
                        <Eye size={17} />
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* MESSAGE MODAL */}
      {selectedMessage && (
        <div
          className="contact-modal-overlay"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="contact-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="contact-modal-header">

              <div>
                <span>MESSAGE DETAILS</span>

                <h2>
                  {selectedMessage.subject ||
                    "General Enquiry"}
                </h2>
              </div>

              <button
                className="contact-modal-close"
                onClick={() => setSelectedMessage(null)}
              >
                <X size={20} />
              </button>

            </div>

            <div className="contact-modal-customer">

              <div className="contact-modal-avatar">
                {selectedMessage.name
                  ?.charAt(0)
                  .toUpperCase() || "?"}
              </div>

              <div>
                <strong>
                  {selectedMessage.name || "Unknown"}
                </strong>

                <span>
                  {selectedMessage.email || "—"}
                </span>
              </div>

            </div>

            <div className="contact-info-grid">

              <div className="contact-info-item">
                <Mail size={17} />

                <div>
                  <span>Email</span>

                  <strong>
                    {selectedMessage.email || "—"}
                  </strong>
                </div>
              </div>

              <div className="contact-info-item">
                <Phone size={17} />

                <div>
                  <span>Phone</span>

                  <strong>
                    {selectedMessage.phone || "—"}
                  </strong>
                </div>
              </div>

              <div className="contact-info-item">
                <CalendarDays size={17} />

                <div>
                  <span>Submitted</span>

                  <strong>
                    {formatDate(
                      selectedMessage.createdAt
                    )}
                  </strong>
                </div>
              </div>

            </div>

            <div className="contact-message-box">

              <div className="contact-message-box-title">
                <MessageSquare size={17} />
                Message
              </div>

              <p>
                {selectedMessage.message ||
                  "No message content."}
              </p>

            </div>

            <div className="contact-modal-footer">

              <button
                className="contact-close-btn"
                onClick={() => setSelectedMessage(null)}
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ContactMessages;