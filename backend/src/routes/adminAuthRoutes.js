const express = require("express");

const {
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  updateAdminNotifications,
} = require("../controllers/adminAuthController");

const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// ======================================================
// LOGIN
// POST /api/admin/auth/login
// ======================================================

router.post("/login", loginAdmin);

// ======================================================
// PROFILE
// ======================================================

// GET /api/admin/auth/profile
router.get("/profile", adminAuth, getAdminProfile);

// PUT /api/admin/auth/profile
router.put("/profile", adminAuth, updateAdminProfile);

// ======================================================
// PASSWORD
// ======================================================

// PUT /api/admin/auth/password
router.put("/password", adminAuth, changeAdminPassword);

// ======================================================
// NOTIFICATIONS
// ======================================================

// PUT /api/admin/auth/notifications
router.put(
  "/notifications",
  adminAuth,
  updateAdminNotifications
);

module.exports = router;