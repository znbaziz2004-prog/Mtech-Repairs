import { useEffect, useState } from "react";
import axios from "axios";
import {
  MessageSquare,
  Mail,
  Phone,
  Trash2,
  Clock,
  Search,
  Inbox,
  X,
  Reply,
} from "lucide-react";

import "./Messages.css";

const api = axios.create({
  baseURL: "https://mtechnrepairs.hostless.app/api",
});

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("") || "?";

const fmt = (d) => (d ? new Date(d).toLocaleString("en-GB") : "");

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/contact");
      const list = res.data?.data || res.data || [];
      setMessages(Array.isArray(list) ? list : []);
      setError("");
    } catch {
      setError("Messages load nahi hue. Backend mein GET /contact route check karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Ye message delete karein?")) return;
    try {
      await api.delete(`/contact/${id}`);
      setMessages((m) => m.filter((x) => x.id !== id));
      setSelected(null);
    } catch {
      alert("Delete nahi ho saka.");
    }
  };

  const filtered = messages.filter((m) =>
    `${m.name} ${m.email} ${m.subject} ${m.message}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="msg-page">
      {/* HEADER */}
      <div className="msg-header">
        <div>
          <span className="msg-eyebrow">CUSTOMER MESSAGES</span>
          <h1>Messages</h1>
          <p>Messages sent from the website contact form.</p>
        </div>

        <div className="msg-header-actions">
          <span className="msg-count-badge">
            <MessageSquare size={14} />
            {messages.length} total
          </span>
        </div>
      </div>

      {/* SEARCH */}
      <div className="msg-search">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search by name, email, subject or message..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading && <div className="msg-state">Loading messages...</div>}
      {error && <div className="msg-state msg-state-error">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="msg-state">
          <Inbox size={28} />
          <strong>No messages found</strong>
          <span>Naye messages yahan show honge.</span>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className={`msg-grid ${selected ? "has-selected" : ""}`}>
          {/* LIST */}
          <div className="msg-card msg-list">
            {filtered.map((m) => (
              <button
                type="button"
                key={m.id}
                className={`msg-item ${selected?.id === m.id ? "active" : ""}`}
                onClick={() => setSelected(m)}
              >
                <div className="msg-avatar">{initials(m.name)}</div>

                <div className="msg-item-body">
                  <div className="msg-item-top">
                    <strong>{m.name}</strong>
                    <span>{fmt(m.createdAt)}</span>
                  </div>
                  <div className="msg-item-subject">{m.subject}</div>
                  <p>{m.message}</p>
                </div>
              </button>
            ))}
          </div>

          {/* DETAILS */}
          {selected && (
            <div className="msg-card msg-details">
              <div className="msg-card-header">
                <div>
                  <span className="msg-card-eyebrow">MESSAGE DETAILS</span>
                  <h2>{selected.subject}</h2>
                </div>

                <button
                  type="button"
                  className="msg-close"
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="msg-customer">
                <div className="msg-avatar msg-avatar-lg">
                  {initials(selected.name)}
                </div>

                <div className="msg-customer-info">
                  <h3>{selected.name}</h3>
                  <p>
                    <Mail size={12} />
                    <a href={`mailto:${selected.email}`}>{selected.email}</a>
                  </p>
                  {selected.phone && (
                    <p>
                      <Phone size={12} />
                      {selected.phone}
                    </p>
                  )}
                  <p>
                    <Clock size={12} />
                    {fmt(selected.createdAt)}
                  </p>
                </div>
              </div>

              <div className="msg-body">
                <span className="msg-card-eyebrow">MESSAGE</span>
                <p>{selected.message}</p>
              </div>

              <div className="msg-actions">
                <a
                  className="msg-btn-primary"
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                >
                  <Reply size={14} />
                  Reply by email
                </a>

                <button
                  type="button"
                  className="msg-btn-danger"
                  onClick={() => remove(selected.id)}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}