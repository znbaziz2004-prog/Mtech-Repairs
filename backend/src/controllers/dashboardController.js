const asyncHandler = require('../middleware/asyncHandler');

const { pool } = require('../config/db');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (admin)

const getDashboardStats = asyncHandler(async (req, res) => {
  // ---------------------------------------------------------
  // BASIC COUNTS
  // ---------------------------------------------------------

  const [[bookingCount]] = await pool.query(`
    SELECT COUNT(*) AS totalBookings
    FROM bookings
  `);

  const [[productCount]] = await pool.query(`
    SELECT COUNT(*) AS totalProducts
    FROM products
  `);

  // ---------------------------------------------------------
  // BOOKING STATUS COUNTS
  // ---------------------------------------------------------

  const [statusRows] = await pool.query(`
    SELECT
      status,
      COUNT(*) AS count
    FROM bookings
    GROUP BY status
  `);

  const statusCounts = {};

  statusRows.forEach((row) => {
    statusCounts[row.status] = Number(row.count);
  });

  const pendingBookings = statusCounts.pending || 0;
  const confirmedBookings = statusCounts.confirmed || 0;
  const inProgressBookings = statusCounts['in-progress'] || 0;
  const completedBookings = statusCounts.completed || 0;
  const cancelledBookings = statusCounts.cancelled || 0;

  // ---------------------------------------------------------
  // TODAY'S BOOKINGS
  // ---------------------------------------------------------

  const [todaysBookings] = await pool.query(`
    SELECT
      id,
      customer_name AS customerName,
      email,
      phone,
      device_category AS deviceCategory,
      device_model AS deviceModel,
      issue,
      preferred_date AS preferredDate,
      status,
      notes,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM bookings
    WHERE preferred_date >= CURDATE()
      AND preferred_date < DATE_ADD(CURDATE(), INTERVAL 1 DAY)
    ORDER BY preferred_date ASC
    LIMIT 10
  `);

  // ---------------------------------------------------------
  // RECENT BOOKINGS
  // ---------------------------------------------------------

  const [recentBookings] = await pool.query(`
    SELECT
      id,
      customer_name AS customerName,
      email,
      phone,
      device_category AS deviceCategory,
      device_model AS deviceModel,
      issue,
      preferred_date AS preferredDate,
      status,
      notes,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM bookings
    ORDER BY created_at DESC
    LIMIT 5
  `);

  // ---------------------------------------------------------
  // RESPONSE
  // ---------------------------------------------------------

  res.json({
    success: true,

    data: {
      stats: {
        totalBookings: Number(bookingCount.totalBookings),
        totalProducts: Number(productCount.totalProducts),

        pendingBookings,
        confirmedBookings,
        inProgressBookings,
        completedBookings,
        cancelledBookings,

        // Orders and revenue are not available yet
        totalOrders: 0,
        totalRevenue: 0,
      },

      todaysBookings,

      recentBookings,
    },
  });
});

module.exports = {
  getDashboardStats,
};