const asyncHandler = require('../middleware/asyncHandler');
const { pool } = require('../config/db');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public

const sendMessage = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    subject,
    message,
  } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Name, email, and message are required');
  }

  const [result] = await pool.query(
    `
    INSERT INTO contact_messages
    (
      name,
      email,
      phone,
      subject,
      message
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      name.trim(),
      email.toLowerCase().trim(),
      phone || '',
      subject || 'General Enquiry',
      message.trim(),
    ]
  );

  const [rows] = await pool.query(
    `
    SELECT
      id,
      name,
      email,
      phone,
      subject,
      message,
      is_read AS \`read\`,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM contact_messages
    WHERE id = ?
    `,
    [result.insertId]
  );

  res.status(201).json({
    success: true,
    data: rows[0],
  });
});

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private (admin)

const getMessages = asyncHandler(async (req, res) => {
  const [messages] = await pool.query(
    `
    SELECT
      id,
      name,
      email,
      phone,
      subject,
      message,
      is_read AS \`read\`,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM contact_messages
    ORDER BY created_at DESC
    `
  );

  res.json({
    success: true,
    count: messages.length,
    data: messages,
  });
});

module.exports = {
  sendMessage,
  getMessages,
};