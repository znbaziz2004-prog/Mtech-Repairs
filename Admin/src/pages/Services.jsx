import { useEffect, useState } from "react";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../services/api";

import "./Services.css";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    priceFrom: "",
    estTime: "",
    icon: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getServices();

      const data = response?.data || [];

      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load services:", err);
      setError(err.message || "Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      category: "",
      level: "",
      priceFrom: "",
      estTime: "",
      icon: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setError("");
    setSuccess("");

    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      level: form.level,
      priceFrom: Number(form.priceFrom || 0),
      estTime: form.estTime,
      icon: form.icon,
    };

    if (editingId) {
      await updateService(editingId, payload);
      setSuccess("Service updated successfully!");
    } else {
      await createService(payload);
      setSuccess("Service added successfully!");
    }

    resetForm();
    await loadServices();
  } catch (err) {
    console.error("Failed to save service:", err);
    setError(err.message || "Failed to save service.");
  }
};

  const handleEdit = (service) => {
    setForm({
      title: service.title || "",
      description: service.description || "",
      category: service.category || "",
      level: service.level || "",
      priceFrom: service.priceFrom ?? "",
      estTime: service.estTime || "",
      icon: service.icon || "",
    });

    setEditingId(service.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this service?"
  );

  if (!confirmed) return;

  try {
    setError("");
    setSuccess("");

    await deleteService(id);

    setSuccess("Service deleted successfully!");

    await loadServices();
  } catch (err) {
    console.error("Failed to delete service:", err);
    setError(err.message || "Failed to delete service.");
  }
};

  return (
    <div className="services-page">
      <div className="services-header">
        <div>
          <h1>Services</h1>
          <p>
            Manage repair and diagnostic services, prices and
            service details.
          </p>
        </div>

        <button
          className="services-add-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add Service
        </button>
      </div>

      {error && (
  <div className="services-error">
    {error}
  </div>
)}

{success && (
  <div className="services-success">
    {success}
  </div>
)}

      {showForm && (
        <div className="services-form-card">
          <div className="services-form-header">
            <h2>
              {editingId ? "Edit Service" : "Add New Service"}
            </h2>

            <button
              type="button"
              className="services-close-btn"
              onClick={resetForm}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="services-form-row">
              <div className="services-form-group">
                <label>Service Title</label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Diagnostic Check"
                  required
                />
              </div>

              <div className="services-form-group">
                <label>Category</label>

                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Diagnostics"
                />
              </div>
            </div>

            <div className="services-form-row">
              <div className="services-form-group">
                <label>Level</label>

                <input
                  type="text"
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  placeholder="e.g. Level 3"
                />
              </div>

              <div className="services-form-group">
                <label>Price From</label>

                <input
                  type="number"
                  name="priceFrom"
                  value={form.priceFrom}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="services-form-row">
              <div className="services-form-group">
                <label>Estimated Time</label>

                <input
                  type="text"
                  name="estTime"
                  value={form.estTime}
                  onChange={handleChange}
                  placeholder="e.g. 30 minutes"
                />
              </div>

              <div className="services-form-group">
                <label>Icon</label>

                <input
                  type="text"
                  name="icon"
                  value={form.icon}
                  onChange={handleChange}
                  placeholder="e.g. 🔧"
                />
              </div>
            </div>

            <div className="services-form-group">
              <label>Description</label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter service description"
                rows="4"
              />
            </div>

            <div className="services-form-actions">
              <button
                type="button"
                className="services-cancel-btn"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="services-save-btn"
              >
                {editingId
                  ? "Update Service"
                  : "Save Service"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="services-card">
        <div className="services-card-header">
          <h2>All Services</h2>

          <span>
            {services.length} Services
          </span>
        </div>

        {loading ? (
          <div className="services-loading">
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="services-empty">
            <h3>No services found</h3>

            <p>
              Add your first repair or diagnostic service.
            </p>
          </div>
        ) : (
          <div className="services-table-wrapper">
            <table className="services-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Service</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Price From</th>
                  <th>Est. Time</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>#{service.id}</td>

                    <td>
                      <div className="service-title-cell">
                        {service.icon && (
                          <span className="service-icon">
                            {service.icon}
                          </span>
                        )}

                        <strong>
                          {service.title}
                        </strong>
                      </div>
                    </td>

                    <td>
                      {service.category || "-"}
                    </td>

                    <td>
                      {service.level || "-"}
                    </td>

                    <td>
                      <strong>
                        £
                        {Number(
                          service.priceFrom || 0
                        ).toFixed(2)}
                      </strong>
                    </td>

                    <td>
                      {service.estTime || "-"}
                    </td>

                    <td>
                      <div className="services-actions">
                        <button
                          className="services-edit-btn"
                          onClick={() =>
                            handleEdit(service)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="services-delete-btn"
                          onClick={() =>
                            handleDelete(service.id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}