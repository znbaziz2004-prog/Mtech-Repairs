const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
} = require("../controllers/dashboardController");

// GET /api/admin/dashboard
router.get("/", getDashboardStats);

module.exports = router;