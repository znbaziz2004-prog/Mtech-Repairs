const express = require("express");

const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  submitSellRequest,
} = require("../controllers/productController");

// =========================================================
// GET ALL PRODUCTS
// GET /api/products
// =========================================================

router.get("/", getProducts);

// =========================================================
// CUSTOMER SELL REQUEST
// POST /api/products/sell-request
// =========================================================

router.post("/sell-request", submitSellRequest);

// =========================================================
// GET SINGLE PRODUCT
// GET /api/products/:id
// =========================================================

router.get("/:id", getProductById);

// =========================================================
// ADMIN CREATE PRODUCT
// POST /api/products
// =========================================================

router.post("/", createProduct);

// =========================================================
// ADMIN UPDATE PRODUCT
// PUT /api/products/:id
// =========================================================

router.put("/:id", updateProduct);

// =========================================================
// ADMIN DELETE PRODUCT
// DELETE /api/products/:id
// =========================================================

router.delete("/:id", deleteProduct);

module.exports = router;