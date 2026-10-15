const asyncHandler = require('../middleware/asyncHandler');
const { pool } = require('../config/db');

const UPDATABLE_FIELDS = {
  customerName: 'customer_name',
  email: 'email',
  phone: 'phone',
  totalAmount: 'total_amount',
  paymentStatus: 'payment_status',
  status: 'status',
  notes: 'notes',
};

// Escape LIKE wildcards so user input is matched literally
const escapeLike = (value) =>
  value.replace(/[\\%_]/g, '\\$&');

const normalizeItems = (items) =>
  items.map((item) => ({
    productId: item.productId || null,
    productName: item.productName,
    quantity: item.quantity,
    price: item.price,
  }));

// ======================================================
// GET ORDER WITH ITEMS
// ======================================================

const getOrderWithItems = async (orderId) => {
  const [orders] = await pool.query(
    `
    SELECT
      id,
      order_number AS orderNumber,
      customer_name AS customerName,
      email,
      phone,
      total_amount AS totalAmount,
      payment_status AS paymentStatus,
      status,
      notes,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM orders
    WHERE id = ?
    `,
    [orderId]
  );

  if (!orders.length) {
    return null;
  }

  const [items] = await pool.query(
    `
    SELECT
      id,
      order_id AS orderId,
      product_id AS productId,
      product_name AS productName,
      quantity,
      price,
      created_at AS createdAt
    FROM order_items
    WHERE order_id = ?
    ORDER BY id ASC
    `,
    [orderId]
  );

  return {
    ...orders[0],
    items,
  };
};

// ======================================================
// GET ALL ORDERS
// ======================================================

// @desc    Get all orders
// @route   GET /api/orders

const getOrders = asyncHandler(async (req, res) => {
  const {
    search = '',
    status = 'all',
    payment = 'all',
    page = 1,
    limit = 10,
  } = req.query;

  const currentPage = Math.max(Number(page) || 1, 1);
  const itemsPerPage = Math.max(Number(limit) || 10, 1);
  const offset = (currentPage - 1) * itemsPerPage;

  const conditions = [];
  const params = [];

  // ------------------------------------------------------
  // SEARCH
  // ------------------------------------------------------

  if (search.trim()) {
    const searchValue = `%${escapeLike(search.trim())}%`;

    conditions.push(`
      (
        o.order_number LIKE ? ESCAPE '\\'
        OR o.customer_name LIKE ? ESCAPE '\\'
        OR o.email LIKE ? ESCAPE '\\'
        OR EXISTS (
          SELECT 1
          FROM order_items oi_search
          WHERE oi_search.order_id = o.id
          AND oi_search.product_name LIKE ? ESCAPE '\\'
        )
      )
    `);

    params.push(
      searchValue,
      searchValue,
      searchValue,
      searchValue
    );
  }

  // ------------------------------------------------------
  // ORDER STATUS FILTER
  // ------------------------------------------------------

  if (status !== 'all') {
    conditions.push('o.status = ?');
    params.push(status);
  }

  // ------------------------------------------------------
  // PAYMENT STATUS FILTER
  // ------------------------------------------------------

  if (payment !== 'all') {
    conditions.push('o.payment_status = ?');
    params.push(payment);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  // ------------------------------------------------------
  // TOTAL COUNT
  // ------------------------------------------------------

  const [[countResult]] = await pool.query(
    `
    SELECT COUNT(*) AS total
    FROM orders o
    ${whereClause}
    `,
    params
  );

  const total = Number(countResult.total);

  // ------------------------------------------------------
  // GET ORDERS
  // ------------------------------------------------------

  const [orders] = await pool.query(
    `
    SELECT
      o.id,
      o.order_number AS orderNumber,
      o.customer_name AS customerName,
      o.email,
      o.phone,
      o.total_amount AS totalAmount,
      o.payment_status AS paymentStatus,
      o.status,
      o.notes,
      o.created_at AS createdAt,
      o.updated_at AS updatedAt
    FROM orders o
    ${whereClause}
    ORDER BY o.created_at DESC
    LIMIT ? OFFSET ?
    `,
    [...params, itemsPerPage, offset]
  );

  // ------------------------------------------------------
  // GET ITEMS FOR EACH ORDER
  // ------------------------------------------------------

  for (const order of orders) {
    const [items] = await pool.query(
      `
      SELECT
        id,
        order_id AS orderId,
        product_id AS productId,
        product_name AS productName,
        quantity,
        price,
        created_at AS createdAt
      FROM order_items
      WHERE order_id = ?
      ORDER BY id ASC
      `,
      [order.id]
    );

    order.items = items;
  }

  res.json({
    success: true,
    data: orders,
    pagination: {
      total,
      page: currentPage,
      limit: itemsPerPage,
      totalPages: Math.ceil(total / itemsPerPage),
    },
  });
});

// ======================================================
// GET ORDER STATISTICS
// ======================================================

// @desc    Get order statistics
// @route   GET /api/orders/stats

const getOrderStats = asyncHandler(async (req, res) => {
  const [[stats]] = await pool.query(`
    SELECT
      COUNT(*) AS totalOrders,
      SUM(status = 'pending') AS pendingOrders,
      SUM(status = 'processing') AS processingOrders,
      SUM(status = 'completed') AS completedOrders
    FROM orders
  `);

  res.json({
    success: true,
    data: {
      totalOrders: Number(stats.totalOrders || 0),
      pendingOrders: Number(stats.pendingOrders || 0),
      processingOrders: Number(stats.processingOrders || 0),
      completedOrders: Number(stats.completedOrders || 0),
    },
  });
});

// ======================================================
// GET SINGLE ORDER
// ======================================================

// @desc    Get single order
// @route   GET /api/orders/:id

const getOrderById = asyncHandler(async (req, res) => {
  const order = await getOrderWithItems(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.json({
    success: true,
    data: order,
  });
});

// ======================================================
// CREATE ORDER
// ======================================================

// @desc    Create order
// @route   POST /api/orders

const createOrder = asyncHandler(async (req, res) => {
  const {
    orderNumber,
    customerName,
    email,
    phone,
    items,
    totalAmount,
    paymentStatus,
    status,
    notes,
  } = req.body;

  if (
    !orderNumber ||
    !customerName ||
    !email ||
    !items ||
    !items.length
  ) {
    res.status(400);
    throw new Error(
      'Order number, customer details and at least one product are required.'
    );
  }

  // ------------------------------------------------------
  // CHECK DUPLICATE ORDER NUMBER
  // ------------------------------------------------------

  const [existingOrders] = await pool.query(
    `
    SELECT id
    FROM orders
    WHERE order_number = ?
    LIMIT 1
    `,
    [orderNumber]
  );

  if (existingOrders.length) {
    res.status(400);
    throw new Error('Order number already exists.');
  }

  // ------------------------------------------------------
  // TRANSACTION
  // ------------------------------------------------------

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      `
      INSERT INTO orders
      (
        order_number,
        customer_name,
        email,
        phone,
        total_amount,
        payment_status,
        status,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        orderNumber,
        customerName,
        email,
        phone || '',
        totalAmount || 0,
        paymentStatus || 'pending',
        status || 'pending',
        notes || '',
      ]
    );

    const orderId = orderResult.insertId;

    const normalizedItems = normalizeItems(items);

    for (const item of normalizedItems) {
      await connection.query(
        `
        INSERT INTO order_items
        (
          order_id,
          product_id,
          product_name,
          quantity,
          price
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          orderId,
          item.productId,
          item.productName,
          item.quantity,
          item.price,
        ]
      );
    }

    await connection.commit();

    const order = await getOrderWithItems(orderId);

    res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      data: order,
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

// ======================================================
// UPDATE ORDER
// ======================================================

// @desc    Update order
// @route   PATCH /api/orders/:id

const updateOrder = asyncHandler(async (req, res) => {
  const order = await getOrderWithItems(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const updates = [];
  const values = [];

  Object.entries(UPDATABLE_FIELDS).forEach(
    ([field, column]) => {
      if (req.body[field] !== undefined) {
        updates.push(`${column} = ?`);
        values.push(req.body[field]);
      }
    }
  );

  const hasItemsUpdate = Array.isArray(req.body.items);

  if (!updates.length && !hasItemsUpdate) {
    res.status(400);
    throw new Error('No valid fields provided for update');
  }

  if (hasItemsUpdate && !req.body.items.length) {
    res.status(400);
    throw new Error('Order must contain at least one product.');
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // ----------------------------------------------------
    // UPDATE ORDER FIELDS
    // ----------------------------------------------------

    if (updates.length) {
      await connection.query(
        `
        UPDATE orders
        SET ${updates.join(', ')}
        WHERE id = ?
        `,
        [...values, req.params.id]
      );
    }

    // ----------------------------------------------------
    // REPLACE ORDER ITEMS
    // ----------------------------------------------------

    if (hasItemsUpdate) {
      await connection.query(
        `
        DELETE FROM order_items
        WHERE order_id = ?
        `,
        [req.params.id]
      );

      const normalizedItems = normalizeItems(req.body.items);

      for (const item of normalizedItems) {
        await connection.query(
          `
          INSERT INTO order_items
          (
            order_id,
            product_id,
            product_name,
            quantity,
            price
          )
          VALUES (?, ?, ?, ?, ?)
          `,
          [
            req.params.id,
            item.productId,
            item.productName,
            item.quantity,
            item.price,
          ]
        );
      }
    }

    await connection.commit();

    const updated = await getOrderWithItems(req.params.id);

    res.json({
      success: true,
      message: 'Order updated successfully.',
      data: updated,
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

// ======================================================
// DELETE ORDER
// ======================================================

// @desc    Delete order
// @route   DELETE /api/orders/:id

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await getOrderWithItems(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  await pool.query(
    `
    DELETE FROM orders
    WHERE id = ?
    `,
    [req.params.id]
  );

  res.json({
    success: true,
    message: 'Order deleted successfully.',
  });
});

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getOrders,
  getOrderStats,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};