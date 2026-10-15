const asyncHandler = require('../middleware/asyncHandler');
const { pool } = require('../config/db');

// ======================================================
// GET ALL ACCESSORIES
// ======================================================

// @route GET /api/accessories

const getAccessories = asyncHandler(async (req, res) => {
  let query = `
    SELECT
      id,
      name,
      category,
      price,
      image,
      in_stock AS inStock,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM accessories
  `;

  const params = [];

  if (req.query.category) {
    query += ' WHERE category = ?';
    params.push(req.query.category);
  }

  query += ' ORDER BY category ASC, name ASC';

  const [accessories] = await pool.query(query, params);

  res.json({
    success: true,
    count: accessories.length,
    data: accessories,
  });
});

// ======================================================
// GET ACCESSORY BY ID
// ======================================================

// @route GET /api/accessories/:id

const getAccessoryById = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      name,
      category,
      price,
      image,
      in_stock AS inStock,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM accessories
    WHERE id = ?
    `,
    [req.params.id]
  );

  if (!rows.length) {
    res.status(404);
    throw new Error('Accessory not found');
  }

  res.json({
    success: true,
    data: rows[0],
  });
});

// ======================================================
// CREATE ACCESSORY
// ======================================================

// @route POST /api/accessories

const createAccessory = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    price,
    image,
    inStock,
  } = req.body;

  if (!name || !category || price === undefined) {
    res.status(400);
    throw new Error(
      'Name, category and price are required.'
    );
  }

  const [result] = await pool.query(
    `
    INSERT INTO accessories
    (
      name,
      category,
      price,
      image,
      in_stock
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      name.trim(),
      category,
      Number(price),
      image || '',
      inStock !== undefined ? Boolean(inStock) : true,
    ]
  );

  const [rows] = await pool.query(
    `
    SELECT
      id,
      name,
      category,
      price,
      image,
      in_stock AS inStock,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM accessories
    WHERE id = ?
    `,
    [result.insertId]
  );

  res.status(201).json({
    success: true,
    message: 'Accessory created successfully.',
    data: rows[0],
  });
});

// ======================================================
// UPDATE ACCESSORY
// ======================================================

// @route PATCH /api/accessories/:id

const updateAccessory = asyncHandler(async (req, res) => {
  const allowedFields = {
    name: 'name',
    category: 'category',
    price: 'price',
    image: 'image',
    inStock: 'in_stock',
  };

  const updates = [];
  const values = [];

  for (const [field, column] of Object.entries(allowedFields)) {
    if (req.body[field] !== undefined) {
      updates.push(`${column} = ?`);

      if (field === 'inStock') {
        values.push(Boolean(req.body[field]));
      } else if (field === 'price') {
        values.push(Number(req.body[field]));
      } else {
        values.push(req.body[field]);
      }
    }
  }

  if (!updates.length) {
    res.status(400);
    throw new Error('No valid fields provided for update.');
  }

  values.push(req.params.id);

  const [result] = await pool.query(
    `
    UPDATE accessories
    SET ${updates.join(', ')}
    WHERE id = ?
    `,
    values
  );

  if (!result.affectedRows) {
    res.status(404);
    throw new Error('Accessory not found');
  }

  const [rows] = await pool.query(
    `
    SELECT
      id,
      name,
      category,
      price,
      image,
      in_stock AS inStock,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM accessories
    WHERE id = ?
    `,
    [req.params.id]
  );

  res.json({
    success: true,
    message: 'Accessory updated successfully.',
    data: rows[0],
  });
});

// ======================================================
// DELETE ACCESSORY
// ======================================================

// @route DELETE /api/accessories/:id

const deleteAccessory = asyncHandler(async (req, res) => {
  const [result] = await pool.query(
    `
    DELETE FROM accessories
    WHERE id = ?
    `,
    [req.params.id]
  );

  if (!result.affectedRows) {
    res.status(404);
    throw new Error('Accessory not found');
  }

  res.json({
    success: true,
    message: 'Accessory deleted successfully.',
  });
});

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getAccessories,
  getAccessoryById,
  createAccessory,
  updateAccessory,
  deleteAccessory,
};