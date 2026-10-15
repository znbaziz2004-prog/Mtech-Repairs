const asyncHandler = require('../middleware/asyncHandler');
const { pool } = require('../config/db');

// @desc    Get all devices (optionally filter by category)
// @route   GET /api/devices?category=Mobile Phone&brand=Apple
// @access  Public

const getDevices = asyncHandler(async (req, res) => {
  let query = `
    SELECT
      id,
      name,
      category,
      brand,
      image,
      slug,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM devices
  `;

  const conditions = [];
  const params = [];

  if (req.query.category) {
    conditions.push('category = ?');
    params.push(req.query.category);
  }

  if (req.query.brand) {
    conditions.push('brand = ?');
    params.push(req.query.brand);
  }

  if (conditions.length) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ' ORDER BY brand ASC, name ASC';

  const [devices] = await pool.query(query, params);

  res.json({
    success: true,
    count: devices.length,
    data: devices,
  });
});

// @desc    Get single device by slug
// @route   GET /api/devices/:slug
// @access  Public

const getDeviceBySlug = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      name,
      category,
      brand,
      image,
      slug,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM devices
    WHERE slug = ?
    `,
    [req.params.slug]
  );

  if (!rows.length) {
    res.status(404);
    throw new Error('Device not found');
  }

  res.json({
    success: true,
    data: rows[0],
  });
});

module.exports = {
  getDevices,
  getDeviceBySlug,
};