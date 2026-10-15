const asyncHandler = require('../middleware/asyncHandler');
const { pool } = require('../config/db');

// @desc    Create a new repair booking
// @route   POST /api/bookings
// @access  Public

const createBooking = asyncHandler(async (req, res) => {
  const {
    customerName,
    email,
    phone,
    deviceCategory,
    deviceModel,
    issue,
    preferredDate,
  } = req.body;

  if (
    !customerName ||
    !email ||
    !phone ||
    !deviceCategory ||
    !deviceModel ||
    !issue
  ) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  const [result] = await pool.query(
    `
    INSERT INTO bookings
    (
      customer_name,
      email,
      phone,
      device_category,
      device_model,
      issue,
      preferred_date
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      customerName,
      email.toLowerCase().trim(),
      phone.trim(),
      deviceCategory,
      deviceModel.trim(),
      issue,
      preferredDate || null,
    ]
  );

  const [rows] = await pool.query(
    `
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
    WHERE id = ?
    `,
    [result.insertId]
  );

  res.status(201).json({
    success: true,
    data: rows[0],
  });
});

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (admin)

const getBookings = asyncHandler(async (req, res) => {
  const [bookings] = await pool.query(
    `
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
    `
  );

  res.json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private (admin)

const getBookingById = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `
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
    WHERE id = ?
    `,
    [req.params.id]
  );

  if (!rows.length) {
    res.status(404);
    throw new Error('Booking not found');
  }

  res.json({
    success: true,
    data: rows[0],
  });
});

// @desc    Update booking
// @route   PATCH /api/bookings/:id
// @access  Private (admin)

const updateBooking = asyncHandler(async (req, res) => {
  const allowedFields = {
    customerName: 'customer_name',
    email: 'email',
    phone: 'phone',
    deviceCategory: 'device_category',
    deviceModel: 'device_model',
    issue: 'issue',
    preferredDate: 'preferred_date',
    status: 'status',
    notes: 'notes',
  };

  const updates = [];
  const values = [];

  for (const [field, column] of Object.entries(allowedFields)) {
    if (req.body[field] !== undefined) {
      updates.push(`${column} = ?`);
      values.push(
        field === 'preferredDate' && !req.body[field]
          ? null
          : req.body[field]
      );
    }
  }

  if (!updates.length) {
    res.status(400);
    throw new Error('No valid fields provided for update');
  }

  values.push(req.params.id);

  const [result] = await pool.query(
    `
    UPDATE bookings
    SET ${updates.join(', ')}
    WHERE id = ?
    `,
    values
  );

  if (!result.affectedRows) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const [rows] = await pool.query(
    `
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
    WHERE id = ?
    `,
    [req.params.id]
  );

  res.json({
    success: true,
    data: rows[0],
  });
});

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
};