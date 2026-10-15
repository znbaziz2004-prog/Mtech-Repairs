const asyncHandler = require('../middleware/asyncHandler');
const { pool } = require('../config/db');

// ======================================================
// GET ALL PRODUCTS
// ======================================================

// @desc    Get all products for sale
// @route   GET /api/products

const getProducts = asyncHandler(async (req, res) => {
  let query = `
    SELECT
      id,
      name,
      brand,
      category,
      condition_type AS \`condition\`,
      price,
      storage,
      color,
      image,
      in_stock AS stock,
      description,
      listing_type AS listingType,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM products
    WHERE listing_type = 'buy'
  `;

  const params = [];

  if (req.query.condition) {
    query += ' AND condition_type = ?';
    params.push(req.query.condition);
  }

  if (req.query.brand) {
    query += ' AND brand = ?';
    params.push(req.query.brand);
  }

  query += ' ORDER BY created_at DESC';

  const [products] = await pool.query(query, params);

  res.json({
    success: true,
    count: products.length,
    data: products,
  });
});

// ======================================================
// GET PRODUCT BY ID
// ======================================================

// @route   GET /api/products/:id

const getProductById = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      name,
      brand,
      category,
      condition_type AS \`condition\`,
      price,
      storage,
      color,
      image,
      in_stock AS stock,
      description,
      listing_type AS listingType,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM products
    WHERE id = ?
    `,
    [req.params.id]
  );

  if (!rows.length) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({
    success: true,
    data: rows[0],
  });
});

// ======================================================
// CREATE PRODUCT
// ======================================================

// @route   POST /api/products

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    brand,
    category,
    condition,
    price,
    storage,
    color,
    image,
    inStock,
    stock,
    description,
    listingType,
  } = req.body;

  if (!name || !brand || !condition || price === undefined) {
    res.status(400);
    throw new Error(
      'Name, brand, condition and price are required.'
    );
  }

  // Support both inStock and stock
  const finalStock =
    stock !== undefined
      ? Number(stock)
      : inStock !== undefined
        ? Boolean(inStock)
          ? 1
          : 0
        : 1;

  const [result] = await pool.query(
    `
    INSERT INTO products
    (
      name,
      brand,
      category,
      condition_type,
      price,
      storage,
      color,
      image,
      in_stock,
      description,
      listing_type
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      name.trim(),
      brand.trim(),
      category?.trim() || '',
      condition,
      Number(price),
      storage || '',
      color || '',
      image || '',
      finalStock,
      description || '',
      listingType || 'buy',
    ]
  );

  const [rows] = await pool.query(
    `
    SELECT
      id,
      name,
      brand,
      category,
      condition_type AS \`condition\`,
      price,
      storage,
      color,
      image,
      in_stock AS stock,
      description,
      listing_type AS listingType,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM products
    WHERE id = ?
    `,
    [result.insertId]
  );

  res.status(201).json({
    success: true,
    message: 'Product created successfully.',
    data: rows[0],
  });
});

// ======================================================
// UPDATE PRODUCT
// ======================================================

// @route   PUT /api/products/:id

const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    brand,
    category,
    condition,
    price,
    storage,
    color,
    image,
    stock,
    inStock,
    description,
    listingType,
  } = req.body;

  const [existing] = await pool.query(
    'SELECT id FROM products WHERE id = ?',
    [req.params.id]
  );

  if (!existing.length) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Support both stock and old inStock field
  const finalStock =
    stock !== undefined
      ? Number(stock)
      : inStock !== undefined
        ? Boolean(inStock)
          ? 1
          : 0
        : 0;

  await pool.query(
    `
    UPDATE products
    SET
      name = ?,
      brand = ?,
      category = ?,
      condition_type = ?,
      price = ?,
      storage = ?,
      color = ?,
      image = ?,
      in_stock = ?,
      description = ?,
      listing_type = ?
    WHERE id = ?
    `,
    [
      name?.trim() || '',
      brand?.trim() || '',
      category?.trim() || '',
      condition || 'New',
      Number(price || 0),
      storage || '',
      color || '',
      image || '',
      finalStock,
      description || '',
      listingType || 'buy',
      req.params.id,
    ]
  );

  const [rows] = await pool.query(
    `
    SELECT
      id,
      name,
      brand,
      category,
      condition_type AS \`condition\`,
      price,
      storage,
      color,
      image,
      in_stock AS stock,
      description,
      listing_type AS listingType,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM products
    WHERE id = ?
    `,
    [req.params.id]
  );

  res.json({
    success: true,
    message: 'Product updated successfully.',
    data: rows[0],
  });
});

// ======================================================
// DELETE PRODUCT
// ======================================================

// @route   DELETE /api/products/:id

const deleteProduct = asyncHandler(async (req, res) => {
  const [result] = await pool.query(
    `
    DELETE FROM products
    WHERE id = ?
    `,
    [req.params.id]
  );

  if (!result.affectedRows) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({
    success: true,
    message: 'Product deleted successfully.',
  });
});

// ======================================================
// CUSTOMER SELL REQUEST
// ======================================================

// @route   POST /api/products/sell-request

const submitSellRequest = asyncHandler(async (req, res) => {
  const {
    name,
    brand,
    condition,
    storage,
    color,
    description,
  } = req.body;

  if (!name || !brand || !condition) {
    res.status(400);
    throw new Error(
      'Please provide device name, brand, and condition'
    );
  }

  const [result] = await pool.query(
    `
    INSERT INTO products
    (
      name,
      brand,
      condition_type,
      price,
      storage,
      color,
      description,
      listing_type,
      in_stock
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      name,
      brand,
      condition,
      0,
      storage || '',
      color || '',
      description || '',
      'sell-request',
      false,
    ]
  );

  const [rows] = await pool.query(
    `
    SELECT
      id,
      name,
      brand,
      category,
      condition_type AS \`condition\`,
      price,
      storage,
      color,
      image,
      in_stock AS stock,
      description,
      listing_type AS listingType,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM products
    WHERE id = ?
    `,
    [result.insertId]
  );

  res.status(201).json({
    success: true,
    data: rows[0],
  });
});

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  submitSellRequest,
};