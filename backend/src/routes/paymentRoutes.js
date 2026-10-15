
const express = require("express");
const router = express.Router();

const {
  createCheckoutSession,
  verifyCheckoutSession,
  getAdminPayments,
} = require("../controllers/paymentController");

const adminAuth = require("../middleware/adminAuth");

// Stripe checkout routes
router.post("/create-checkout-session", createCheckoutSession);
router.get("/verify-checkout-session", verifyCheckoutSession);

// Admin-only payments route
router.get("/admin", adminAuth, getAdminPayments);

module.exports = router;
