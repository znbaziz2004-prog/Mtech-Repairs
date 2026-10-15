import { useEffect, useMemo, useState } from "react";
import ImageUpload from "../components/ImageUpload";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Package,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  RefreshCw,
  
} from "lucide-react";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  imageUrl,
} from "../services/api";

import "./Products.css";

const emptyForm = {
  name: "",
  brand: "",
  condition: "New",
  category: "",
  sku: "",
  price: "",
  stock: "",
  description: "",
  image: "",     
};

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState(emptyForm);

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts();

      setProducts(response.data || []);
    } catch (err) {
      setError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ==========================================
  // AUTO CLEAR MESSAGES
  // ==========================================

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [success]);

  // ==========================================
  // FORM HANDLING
  // ==========================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const handleAddProduct = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const handleEditProduct = (product) => {
     console.log("EDIT PRODUCT:", product);
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      brand: product.brand || "",
      condition: product.condition || "New",
      category: product.category || "",
      sku: product.sku || "",
      price: product.price ?? "",
      stock: product.stock ?? 0,
      description: product.description || "",
      image: product.image || "", 
    });

    setError("");
    setShowModal(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const handleCloseModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingProduct(null);
    setForm(emptyForm);
  };

  // ==========================================
  // SAVE PRODUCT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.brand.trim()) {
      setError("Brand is required.");
      return;
    }

    if (!form.category.trim()) {
      setError("Category is required.");
      return;
    }

    if (form.price === "" || Number(form.price) < 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (form.stock === "" || Number(form.stock) < 0) {
      setError("Please enter a valid stock quantity.");
      return;
    }

    const productData = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      condition: form.condition,
      category: form.category.trim(),
      sku: form.sku.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      description: form.description.trim(),
       image: form.image,   
    };

    try {
      setSaving(true);

      if (editingProduct) {
        const response = await updateProduct(
          editingProduct.id,
          productData
        );

        setProducts((previous) =>
          previous.map((product) =>
            product.id === editingProduct.id
              ? response.data
              : product
          )
        );

        setSuccess("Product updated successfully.");
      } else {
        const response = await createProduct(productData);

        setProducts((previous) => [
          response.data,
          ...previous,
        ]);

        setSuccess("Product added successfully.");
      }

      setShowModal(false);
      setEditingProduct(null);
      setForm(emptyForm);
    } catch (err) {
      setError(err.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(product.id);
      setError("");
      setSuccess("");

      await deleteProduct(product.id);

      setProducts((previous) =>
        previous.filter(
          (item) => item.id !== product.id
        )
      );

      setSuccess("Product deleted successfully.");
    } catch (err) {
      setError(err.message || "Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // VIEW PRODUCT
  // ==========================================

  const handleViewProduct = (id) => {
    navigate(`/products/${id}`);
  };

  // ==========================================
  // FILTER OPTIONS
  // ==========================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [products]);

  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        product.name?.toLowerCase().includes(searchValue) ||
        product.brand?.toLowerCase().includes(searchValue) ||
        product.sku?.toLowerCase().includes(searchValue);

      const matchesCategory =
        categoryFilter === "All" ||
        product.category === categoryFilter;

      const productStatus =
        Number(product.stock) > 0
          ? "Active"
          : "Out of Stock";

      const matchesStatus =
        statusFilter === "All" ||
        productStatus === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    products,
    search,
    categoryFilter,
    statusFilter,
  ]);

  // ==========================================
  // SUMMARY
  // ==========================================

  const totalProducts = products.length;

  const activeProducts = products.filter(
    (product) => Number(product.stock) > 0
  ).length;

  const outOfStockProducts = products.filter(
    (product) => Number(product.stock) === 0
  ).length;

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.stock || 0),
    0
  );

  return (
    <div className="products-page">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="products-header">
        <div>
          <span className="products-eyebrow">
            INVENTORY MANAGEMENT
          </span>

          <h1>Products</h1>

          <p>
            Manage products, stock and pricing from one
            place.
          </p>
        </div>

        <div className="products-header-actions">
          <button
            className="products-refresh-btn"
            onClick={loadProducts}
            disabled={loading}
          >
            <RefreshCw
              size={17}
              className={loading ? "products-spin" : ""}
            />
            Refresh
          </button>

          <button
            className="products-add-btn"
            onClick={handleAddProduct}
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      {/* =====================================
          SUCCESS MESSAGE
      ===================================== */}

      {success && (
        <div className="products-alert products-success">
          <CheckCircle size={18} />
          <span>{success}</span>

          <button onClick={() => setSuccess("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* =====================================
          ERROR MESSAGE
      ===================================== */}

      {error && !showModal && (
        <div className="products-alert products-error">
          <AlertCircle size={18} />
          <span>{error}</span>

          <button onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* =====================================
          SUMMARY CARDS
      ===================================== */}

      <div className="products-summary-grid">
        <div className="product-summary-card">
          <div className="product-summary-icon">
            <Package size={21} />
          </div>

          <div>
            <span>Total Products</span>
            <strong>{totalProducts}</strong>
          </div>
        </div>

        <div className="product-summary-card">
          <div className="product-summary-icon green">
            <CheckCircle size={21} />
          </div>

          <div>
            <span>Active Products</span>
            <strong>{activeProducts}</strong>
          </div>
        </div>

        <div className="product-summary-card">
          <div className="product-summary-icon orange">
            <AlertCircle size={21} />
          </div>

          <div>
            <span>Out of Stock</span>
            <strong>{outOfStockProducts}</strong>
          </div>
        </div>

        <div className="product-summary-card">
          <div className="product-summary-icon blue">
            <Package size={21} />
          </div>

          <div>
            <span>Total Stock</span>
            <strong>{totalStock}</strong>
          </div>
        </div>
      </div>

      {/* =====================================
          FILTER BAR
      ===================================== */}

      <div className="products-toolbar">
        <div className="products-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search product, brand or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="products-filters">
          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
          >
            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category === "All"
                  ? "All Categories"
                  : category}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Out of Stock">
              Out of Stock
            </option>
          </select>
        </div>
      </div>

      {/* =====================================
          TABLE
      ===================================== */}

      <div className="products-table-card">
        <div className="products-table-header">
          <div>
            <h2>Product Inventory</h2>

            <p>
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""}{" "}
              found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="products-loading">
            <Loader2
              size={30}
              className="products-spin"
            />

            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="products-empty">
            <div className="products-empty-icon">
              <Package size={32} />
            </div>

            <h3>No products found</h3>

            <p>
              {products.length === 0
                ? "Your inventory is empty. Add your first product."
                : "Try changing your search or filters."}
            </p>

            {products.length === 0 && (
              <button
                className="products-add-btn"
                onClick={handleAddProduct}
              >
                <Plus size={17} />
                Add First Product
              </button>
            )}
          </div>
        ) : (
          <div className="products-table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>PRODUCT</th>
                  <th>CATEGORY</th>
                  <th>SKU</th>
                  <th>PRICE</th>
                  <th>STOCK</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const stock = Number(
                    product.stock || 0
                  );

                  const isInStock = stock > 0;

                  return (
                    <tr key={product.id}>
                      <td>
                        <div className="product-name-cell">
                          {product.image ? (
  <img
    src={imageUrl(product.image)}
    alt={product.name}
    style={{ width: 42, height: 42, borderRadius: 11, objectFit: "cover" }}
  />
) : (
  <div className="product-image-placeholder">
    <Package size={18} />
  </div>
)}

                          <div>
                            <strong>
                              {product.name}
                            </strong>

                            <span>
                              {product.brand} •{" "}
                              {product.condition}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="product-category">
                          {product.category || "—"}
                        </span>
                      </td>

                      <td>
                        <span className="product-sku">
                          {product.sku || "—"}
                        </span>
                      </td>

                      <td>
                        <strong className="product-price">
                          £
                          {Number(
                            product.price || 0
                          ).toFixed(2)}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`product-stock ${
                            !isInStock
                              ? "stock-empty"
                              : ""
                          }`}
                        >
                          {stock}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`product-status ${
                            isInStock
                              ? "status-active"
                              : "status-out"
                          }`}
                        >
                          <span />
                          {isInStock
                            ? "Active"
                            : "Out of Stock"}
                        </span>
                      </td>

                      <td>
                        <div className="product-actions">
                          <button
                            className="product-action view"
                            title="View"
                            onClick={() =>
                              handleViewProduct(
                                product.id
                              )
                            }
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            className="product-action edit"
                            title="Edit"
                            onClick={() =>
                              handleEditProduct(product)
                            }
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            className="product-action delete"
                            title="Delete"
                            disabled={
                              deletingId ===
                              product.id
                            }
                            onClick={() =>
                              handleDeleteProduct(
                                product
                              )
                            }
                          >
                            {deletingId ===
                            product.id ? (
                              <Loader2
                                size={17}
                                className="products-spin"
                              />
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

      {/* =====================================
          ADD / EDIT MODAL
      ===================================== */}

      {showModal && (
        <div className="product-modal-overlay">
          <div className="product-modal">
            <div className="product-modal-header">
              <div>
                <span>
                  {editingProduct
                    ? "UPDATE INVENTORY"
                    : "NEW INVENTORY ITEM"}
                </span>

                <h2>
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>
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

            <form
              className="product-form"
              onSubmit={handleSubmit}
            >
              <div className="product-form-grid">
                <div className="product-form-group full">
                  <label>Product Name *</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. iPhone 14 Pro Screen"
                    value={form.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="product-form-group">
                  <label>Brand *</label>

                  <input
                    type="text"
                    name="brand"
                    placeholder="e.g. Apple"
                    value={form.brand}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="product-form-group">
                  <label>Condition *</label>

                  <select
                    name="condition"
                    value={form.condition}
                    onChange={handleInputChange}
                  >
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                    <option value="Refurbished">
                      Refurbished
                    </option>
                  </select>
                </div>

                <div className="product-form-group">
                  <label>Category *</label>

                  <input
                    type="text"
                    name="category"
                    placeholder="e.g. iPhone Parts"
                    value={form.category}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="product-form-group">
                  <label>SKU</label>

                  <input
                    type="text"
                    name="sku"
                    placeholder="e.g. IPH14-SCR-01"
                    value={form.sku}
                    onChange={handleInputChange}
                  />
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

                <div className="product-form-group full">
                  <label>Description</label>

                  <textarea
                    name="description"
                    rows="4"
                    placeholder="Enter product description..."
                    value={form.description}
                    onChange={handleInputChange}
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

                <button
                  type="submit"
                  className="product-save-btn"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                        className="products-spin"
                      />

                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={17} />

                      {editingProduct
                        ? "Update Product"
                        : "Add Product"}
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

export default Products;