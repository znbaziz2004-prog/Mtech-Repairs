import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Headphones,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react";

import {
  getAccessories,
  createAccessory,
  updateAccessory,
  deleteAccessory,
  imageUrl,
} from "../services/api";

import ImageUpload from "../components/ImageUpload";

import "./Products.css"; // reuse existing admin styling
import "./Accessories.css";

// must match the enum in backend/src/models/Accessory.js
const CATEGORIES = [
  "Chargers",
  "Cables",
  "Cases",
  "Screen Protectors",
  "Audio",
  "Other",
];

const emptyForm = {
  name: "",
  category: "Chargers",
  price: "",
  stock: "",
  image: "",
};

const Accessories = () => {
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // ---------- LOAD ----------
  const loadItems = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAccessories();
      setItems(response.data || []);
    } catch (err) {
      setError(err.message || "Failed to load accessories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 3000);
    return () => clearTimeout(timer);
  }, [success]);

  // ---------- FORM ----------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name || "",
      category: item.category || "Chargers",
      price: item.price ?? "",
      stock: item.stock ?? 0,
      image: item.image || "",
    });
    setError("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (saving) return;
    setShowModal(false);
    setEditing(null);
    setForm(emptyForm);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || form.price === "") {
      setError("Name and price are required.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      image: form.image,
    };

    try {
      setSaving(true);
      setError("");

      if (editing) {
        await updateAccessory(editing.id, payload);
        setSuccess("Accessory updated successfully.");
      } else {
        await createAccessory(payload);
        setSuccess("Accessory added successfully.");
      }

      setShowModal(false);
      setEditing(null);
      setForm(emptyForm);
      await loadItems();
    } catch (err) {
      setError(err.message || "Failed to save accessory.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;

    try {
      setDeletingId(item.id);
      setError("");

      await deleteAccessory(item.id);
      setSuccess("Accessory deleted.");
      await loadItems();
    } catch (err) {
      setError(err.message || "Failed to delete accessory.");
    } finally {
      setDeletingId(null);
    }
  };

  // ---------- FILTER + STATS ----------
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return items.filter((a) => {
      const matchesSearch = !q || a.name.toLowerCase().includes(q);
      const matchesCategory =
        categoryFilter === "All" || a.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, categoryFilter]);

  const total = items.length;
  const inStockCount = items.filter((a) => Number(a.stock) > 0).length;
  const outCount = total - inStockCount;

  return (
    <div className="products-page">
      {/* HEADER */}
      <div className="products-header">
        <div>
          <span className="products-eyebrow">INVENTORY MANAGEMENT</span>
          <h1>Accessories</h1>
          <p>Add accessories with photos — they appear on the website instantly.</p>
        </div>

        <div className="products-header-actions">
          <button
            className="products-refresh-btn"
            onClick={loadItems}
            disabled={loading}
          >
            <RefreshCw size={17} className={loading ? "products-spin" : ""} />
            Refresh
          </button>

          <button className="products-add-btn" onClick={handleAdd}>
            <Plus size={18} />
            Add Accessory
          </button>
        </div>
      </div>

      {success && (
        <div className="products-alert products-success">
          <CheckCircle size={18} />
          {success}
        </div>
      )}

      {error && !showModal && (
        <div className="products-alert products-error">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* SUMMARY */}
      <div className="products-summary-grid">
        <div className="product-summary-card">
          <div className="product-summary-icon">
            <Headphones size={21} />
          </div>
          <div>
            <span>Total Accessories</span>
            <strong>{total}</strong>
          </div>
        </div>

        <div className="product-summary-card">
          <div className="product-summary-icon green">
            <CheckCircle size={21} />
          </div>
          <div>
            <span>In Stock</span>
            <strong>{inStockCount}</strong>
          </div>
        </div>

        <div className="product-summary-card">
          <div className="product-summary-icon orange">
            <AlertCircle size={21} />
          </div>
          <div>
            <span>Out of Stock</span>
            <strong>{outCount}</strong>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="products-toolbar">
        <div className="products-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search accessory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="products-filters">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="products-table-card">
        <div className="products-table-header">
          <div>
            <h2>Accessory Inventory</h2>
            <p>
              {filtered.length} accessor{filtered.length !== 1 ? "ies" : "y"} found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="products-loading">
            <Loader2 size={30} className="products-spin" />
            <p>Loading accessories...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="products-empty">
            <div className="products-empty-icon">
              <Headphones size={32} />
            </div>
            <h3>No accessories found</h3>
            <p>
              {items.length === 0
                ? "Add your first accessory."
                : "Try changing your search or filter."}
            </p>
            {items.length === 0 && (
              <button className="products-add-btn" onClick={handleAdd}>
                <Plus size={17} />
                Add First Accessory
              </button>
            )}
          </div>
        ) : (
          <div className="products-table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>ACCESSORY</th>
                  <th>CATEGORY</th>
                  <th>PRICE</th>
                  <th>STOCK</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((item) => {
                  const stock = Number(item.stock || 0);
                  const isInStock = stock > 0;

                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="product-name-cell">
                          {item.image ? (
                            <img
                              className="acc-thumb"
                              src={imageUrl(item.image)}
                              alt={item.name}
                            />
                          ) : (
                            <div className="product-image-placeholder">
                              <Headphones size={18} />
                            </div>
                          )}
                          <div>
                            <strong>{item.name}</strong>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="product-category">{item.category}</span>
                      </td>

                      <td>
                        <strong className="product-price">
                          £{Number(item.price).toFixed(2)}
                        </strong>
                      </td>

                      <td>
                        <span className={`product-stock ${isInStock ? "" : "out"}`}>
                          {stock}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`product-status ${
                            isInStock ? "active" : "out"
                          }`}
                        >
                          {isInStock ? "Active" : "Out of Stock"}
                        </span>
                      </td>

                      <td>
                        <div className="product-actions">
                          <button
                            className="product-action edit"
                            title="Edit"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            className="product-action delete"
                            title="Delete"
                            disabled={deletingId === item.id}
                            onClick={() => handleDelete(item)}
                          >
                            {deletingId === item.id ? (
                              <Loader2 size={17} className="products-spin" />
                            ) : (
                              <Trash2 size={17} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="product-modal-overlay">
          <div className="product-modal">
            <div className="product-modal-header">
              <div>
                <span>{editing ? "UPDATE ACCESSORY" : "NEW ACCESSORY"}</span>
                <h2>{editing ? "Edit Accessory" : "Add Accessory"}</h2>
              </div>

              <button
                className="product-modal-close"
                onClick={handleCloseModal}
                disabled={saving}
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="modal-error">
                <AlertCircle size={17} />
                {error}
              </div>
            )}

            <form className="product-form" onSubmit={handleSubmit}>
              <div className="product-form-grid">
                <div className="product-form-group full">
                  <label>Accessory Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. 20W USB-C Fast Charger"
                    value={form.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="product-form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="product-form-group">
                  <label>Price (£) *</label>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={form.price}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="product-form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={form.stock}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="product-form-group full">
                  <label>Image</label>
                  <ImageUpload
                    value={form.image}
                    onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
                  />
                </div>
              </div>

              <div className="product-modal-footer">
                <button
                  type="button"
                  className="product-cancel-btn"
                  onClick={handleCloseModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button type="submit" className="product-save-btn" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 size={17} className="products-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={17} />
                      {editing ? "Update Accessory" : "Add Accessory"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accessories;
