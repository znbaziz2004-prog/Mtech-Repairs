import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  Tag,
  Boxes,
  DollarSign,
  CalendarDays,
  Building2,
  ShieldCheck,
} from "lucide-react";

import {
  getProductById,
  deleteProduct,
} from "../services/api";

import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProductById(id);

      setProduct(response.data);
    } catch (err) {
      setError(
        err.message || "Failed to load product details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!product) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await deleteProduct(product.id);

      setSuccess("Product deleted successfully.");

      setTimeout(() => {
        navigate("/products");
      }, 800);
    } catch (err) {
      setError(
        err.message || "Failed to delete product."
      );
      setDeleting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <div className="product-details-loading">
          <Loader2
            size={34}
            className="product-details-spin"
          />

          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="product-details-page">
        <div className="product-details-error">
          <div className="product-details-error-icon">
            <AlertCircle size={30} />
          </div>

          <h2>Product Not Found</h2>

          <p>{error}</p>

          <button
            className="product-back-btn"
            onClick={() => navigate("/products")}
          >
            <ArrowLeft size={17} />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const stock = Number(product.stock || 0);
  const isInStock = stock > 0;

  return (
    <div className="product-details-page">

      {/* HEADER */}
      <div className="product-details-header">

        <button
          className="product-back-btn"
          onClick={() => navigate("/products")}
        >
          <ArrowLeft size={17} />
          Back to Products
        </button>

        <div className="product-details-header-main">
          <div>
            <span className="product-details-eyebrow">
              PRODUCT DETAILS
            </span>

            <h1>{product.name}</h1>

            <p>
              View complete product information,
              inventory and pricing.
            </p>
          </div>

          <div className="product-details-actions">

            <button
              className="product-edit-btn"
              onClick={() => navigate("/products")}
            >
              <Pencil size={17} />
              Edit Product
            </button>

            <button
              className="product-delete-btn"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2
                  size={17}
                  className="product-details-spin"
                />
              ) : (
                <Trash2 size={17} />
              )}

              {deleting ? "Deleting..." : "Delete"}
            </button>

          </div>
        </div>
      </div>

      {/* ALERTS */}
      {success && (
        <div className="product-details-alert success">
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && product && (
        <div className="product-details-alert error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* TOP SUMMARY */}
      <div className="product-details-summary">

        <div className="product-details-summary-card">

          <div className="product-details-summary-icon">
            <Package size={22} />
          </div>

          <div>
            <span>Product</span>
            <strong>{product.name}</strong>
          </div>

        </div>

        <div className="product-details-summary-card">

          <div className="product-details-summary-icon">
            <Tag size={22} />
          </div>

          <div>
            <span>Category</span>
            <strong>
              {product.category || "Uncategorized"}
            </strong>
          </div>

        </div>

        <div className="product-details-summary-card">

          <div className="product-details-summary-icon">
            <Boxes size={22} />
          </div>

          <div>
            <span>Stock</span>
            <strong>{stock}</strong>
          </div>

        </div>

        <div className="product-details-summary-card">

          <div className="product-details-summary-icon">
            <DollarSign size={22} />
          </div>

          <div>
            <span>Price</span>
            <strong>
              £{Number(product.price || 0).toFixed(2)}
            </strong>
          </div>

        </div>

      </div>

      {/* MAIN GRID */}
      <div className="product-details-grid">

        {/* PRODUCT INFORMATION */}
        <div className="product-details-card">

          <div className="product-details-card-header">
            <div>
              <span>GENERAL INFORMATION</span>
              <h2>Product Information</h2>
            </div>

            <div className="product-details-card-icon">
              <Package size={20} />
            </div>
          </div>

          <div className="product-info-list">

            <div className="product-info-row">
              <span>Product Name</span>
              <strong>{product.name || "—"}</strong>
            </div>

            <div className="product-info-row">
              <span>Brand</span>
              <strong>{product.brand || "—"}</strong>
            </div>

            <div className="product-info-row">
              <span>Condition</span>
              <strong>{product.condition || "—"}</strong>
            </div>

            <div className="product-info-row">
              <span>Category</span>
              <strong>
                {product.category || "—"}
              </strong>
            </div>

            <div className="product-info-row">
              <span>SKU</span>
              <strong>
                {product.sku || "—"}
              </strong>
            </div>

            <div className="product-info-row">
              <span>Listing Type</span>
              <strong>
                {product.listingType || "—"}
              </strong>
            </div>

          </div>

        </div>

        {/* INVENTORY */}
        <div className="product-details-card">

          <div className="product-details-card-header">
            <div>
              <span>INVENTORY</span>
              <h2>Stock Information</h2>
            </div>

            <div className="product-details-card-icon">
              <Boxes size={20} />
            </div>
          </div>

          <div className="inventory-main">

            <div className="inventory-number">
              <strong>{stock}</strong>
              <span>Units Available</span>
            </div>

            <span
              className={`inventory-status ${
                isInStock
                  ? "inventory-active"
                  : "inventory-out"
              }`}
            >
              <span />
              {isInStock
                ? "In Stock"
                : "Out of Stock"}
            </span>

          </div>

          <div className="inventory-progress">

            <div className="inventory-progress-track">
              <div
                className="inventory-progress-fill"
                style={{
                  width: `${Math.min(
                    stock * 5,
                    100
                  )}%`,
                }}
              />
            </div>

            <span>
              {stock > 0
                ? "Product is currently available."
                : "Product needs restocking."}
            </span>

          </div>

        </div>

        {/* PRICING */}
        <div className="product-details-card">

          <div className="product-details-card-header">
            <div>
              <span>PRICING</span>
              <h2>Price Details</h2>
            </div>

            <div className="product-details-card-icon">
              <DollarSign size={20} />
            </div>
          </div>

          <div className="pricing-main">

            <span>Selling Price</span>

            <strong>
              £{Number(product.price || 0).toFixed(2)}
            </strong>

          </div>

          <div className="pricing-note">
            Current selling price configured for
            this product.
          </div>

        </div>

        {/* ADDITIONAL DETAILS */}
        <div className="product-details-card">

          <div className="product-details-card-header">
            <div>
              <span>ADDITIONAL DETAILS</span>
              <h2>Device Information</h2>
            </div>

            <div className="product-details-card-icon">
              <Building2 size={20} />
            </div>
          </div>

          <div className="product-info-list">

            <div className="product-info-row">
              <span>Storage</span>
              <strong>
                {product.storage || "Not specified"}
              </strong>
            </div>

            <div className="product-info-row">
              <span>Color</span>
              <strong>
                {product.color || "Not specified"}
              </strong>
            </div>

            <div className="product-info-row">
              <span>Image</span>
              <strong>
                {product.image
                  ? "Available"
                  : "Not uploaded"}
              </strong>
            </div>

            <div className="product-info-row">
              <span>Availability</span>
              <strong>
                {product.inStock
                  ? "Available"
                  : "Unavailable"}
              </strong>
            </div>

          </div>

        </div>

        {/* DESCRIPTION */}
        <div className="product-details-card product-description-card">

          <div className="product-details-card-header">
            <div>
              <span>DESCRIPTION</span>
              <h2>Product Description</h2>
            </div>

            <div className="product-details-card-icon">
              <ShieldCheck size={20} />
            </div>
          </div>

          <p className="product-description-text">
            {product.description ||
              "No product description has been added yet."}
          </p>

        </div>

        {/* RECORD */}
        <div className="product-details-card">

          <div className="product-details-card-header">
            <div>
              <span>RECORD</span>
              <h2>Product History</h2>
            </div>

            <div className="product-details-card-icon">
              <CalendarDays size={20} />
            </div>
          </div>

          <div className="product-info-list">

            <div className="product-info-row">
              <span>Created</span>
              <strong>
                {formatDate(product.createdAt)}
              </strong>
            </div>

            <div className="product-info-row">
              <span>Last Updated</span>
              <strong>
                {formatDate(product.updatedAt)}
              </strong>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductDetails;