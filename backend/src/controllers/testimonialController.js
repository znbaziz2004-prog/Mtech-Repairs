const asyncHandler = require('../middleware/asyncHandler');
const { pool } = require('../config/db');

// @desc    Get approved testimonials
// @route   GET /api/testimonials
// @access  Public

const getTestimonials = asyncHandler(async (req, res) => {
  const [testimonials] = await pool.query(
    `
    SELECT
      id,
      name,
      role,
      message,
      rating,
      approved,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM testimonials
    WHERE approved = TRUE
    ORDER BY created_at DESC
    `
  );

  res.json({
    success: true,
    count: testimonials.length,
    data: testimonials,
  });
});

module.exports = {
  getTestimonials,
};