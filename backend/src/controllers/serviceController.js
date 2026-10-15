const asyncHandler = require('../middleware/asyncHandler');
const { pool } = require('../config/db');

// @desc    Get all services
// @route   GET /api/services
// @access  Public

const getServices = asyncHandler(async (req, res) => {
  let query = `
    SELECT
      id,
      title,
      description,
      category,
      level,
      price_from AS priceFrom,
      est_time AS estTime,
      icon,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM services
  `;

  const params = [];

  if (req.query.category) {
    query += ' WHERE category = ?';
    params.push(req.query.category);
  }

  query += ' ORDER BY category ASC, title ASC';

  const [services] = await pool.query(query, params);

  res.json({
    success: true,
    count: services.length,
    data: services,
  });
});


// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public

const getServiceById = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      title,
      description,
      category,
      level,
      price_from AS priceFrom,
      est_time AS estTime,
      icon,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM services
    WHERE id = ?
    `,
    [req.params.id]
  );

  if (!rows.length) {
    res.status(404);
    throw new Error('Service not found');
  }

  res.json({
    success: true,
    data: rows[0],
  });
});


// @desc    Create service
// @route   POST /api/services
// @access  Admin

const createService = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    level,
    priceFrom,
    estTime,
    icon,
  } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Service title is required');
  }

  const [result] = await pool.query(
    `
    INSERT INTO services
    (
      title,
      description,
      category,
      level,
      price_from,
      est_time,
      icon
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      title,
      description || null,
      category || null,
      level || null,
      priceFrom ?? 0,
      estTime || null,
      icon || null,
    ]
  );

  const [rows] = await pool.query(
    `
    SELECT
      id,
      title,
      description,
      category,
      level,
      price_from AS priceFrom,
      est_time AS estTime,
      icon,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM services
    WHERE id = ?
    `,
    [result.insertId]
  );

  res.status(201).json({
    success: true,
    message: 'Service created successfully',
    data: rows[0],
  });
});


// @desc    Update service
// @route   PUT /api/services/:id
// @access  Admin

const updateService = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    title,
    description,
    category,
    level,
    priceFrom,
    estTime,
    icon,
  } = req.body;

  const [existing] = await pool.query(
    'SELECT id FROM services WHERE id = ?',
    [id]
  );

  if (!existing.length) {
    res.status(404);
    throw new Error('Service not found');
  }

  await pool.query(
    `
    UPDATE services
    SET
      title = ?,
      description = ?,
      category = ?,
      level = ?,
      price_from = ?,
      est_time = ?,
      icon = ?
    WHERE id = ?
    `,
    [
      title,
      description || null,
      category || null,
      level || null,
      priceFrom ?? 0,
      estTime || null,
      icon || null,
      id,
    ]
  );

  const [rows] = await pool.query(
    `
    SELECT
      id,
      title,
      description,
      category,
      level,
      price_from AS priceFrom,
      est_time AS estTime,
      icon,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM services
    WHERE id = ?
    `,
    [id]
  );

  res.json({
    success: true,
    message: 'Service updated successfully',
    data: rows[0],
  });
});


// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Admin

const deleteService = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existing] = await pool.query(
    'SELECT id FROM services WHERE id = ?',
    [id]
  );

  if (!existing.length) {
    res.status(404);
    throw new Error('Service not found');
  }

  await pool.query(
    'DELETE FROM services WHERE id = ?',
    [id]
  );

  res.json({
    success: true,
    message: 'Service deleted successfully',
  });
});


module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};