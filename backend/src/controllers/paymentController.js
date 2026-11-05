
const { pool } = require('../config/db');
const fs = require('fs');
const path = require('path');

const RECEIPT_DIR = path.resolve(
  __dirname,
  '../../private_uploads/payment_receipts'
);

// Customer submits a bank transfer order
const createBankTransferOrder = async (req, res) => {
  let connection;
  let receiptFilename = req.file?.filename;

  try {
    const {
      customerName,
      email,
      phone,
      address,
      city,
      items: rawItems,
      bankTransferReference,
    } = req.body;

    const items =
      typeof rawItems === 'string'
        ? JSON.parse(rawItems)
        : rawItems;
        const phoneDigits = String(phone || '').replace(/\D/g, '');

if (!/^\d{7,12}$/.test(phoneDigits)) {
  return res.status(400).json({
    success: false,
    message: 'Please enter a valid phone number.',
  });
}

    if (
      !customerName?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !address?.trim() ||
      !city?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all customer and delivery details.',
      });
    }

    if (!bankTransferReference?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your bank transfer reference.',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload your payment receipt.',
      });
    }

    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty or contains too many items.',
      });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const verifiedItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const itemType = item.itemType;
      const itemId = Number(item.id);
      const quantity = Number(item.quantity);

      if (
        !['product', 'accessory'].includes(itemType) ||
        !Number.isSafeInteger(itemId) ||
        itemId < 1 ||
        !Number.isSafeInteger(quantity) ||
        quantity < 1 ||
        quantity > 100
      ) {
        throw new Error('An item in your cart is invalid.');
      }

      const table =
        itemType === 'product' ? 'products' : 'accessories';

      const [rows] = await connection.execute(
        `SELECT id, name, price, in_stock
         FROM ${table}
         WHERE id = ?
         FOR UPDATE`,
        [itemId]
      );

      if (!rows.length || Number(rows[0].in_stock) < quantity) {
        throw new Error(
          `An item is unavailable or has insufficient stock: ${itemId}`
        );
      }

      const dbItem = rows[0];
      const price = Number(dbItem.price);

      if (!Number.isFinite(price) || price < 0) {
        throw new Error('An item has an invalid price.');
      }

      totalAmount += Math.round(price * 100) * quantity;

      verifiedItems.push({
        id: itemId,
        itemType,
        name: dbItem.name,
        price,
        quantity,
      });
    }

    if (totalAmount <= 0) {
      throw new Error('Order total must be greater than zero.');
    }

    const totalInPounds = (totalAmount / 100).toFixed(2);

    const orderNumber = `MTECH-${Date.now()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const notes = `Delivery Address: ${address.trim()}, ${city.trim()}`;

    const [orderResult] = await connection.execute(
      `INSERT INTO orders
       (order_number, customer_name, email, phone, total_amount,
        payment_status, status, notes)
       VALUES (?, ?, ?, ?, ?, 'pending', 'pending', ?)`,
      [
        orderNumber,
        customerName.trim(),
        email.trim(),
        phoneDigits,
        totalInPounds,
        notes,
      ]
    );

    const orderId = orderResult.insertId;

    for (const item of verifiedItems) {
      await connection.execute(
        `INSERT INTO order_items
         (order_id, product_id, product_name, quantity, price,
          item_type, source_item_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.itemType === 'product' ? item.id : null,
          item.name,
          item.quantity,
          item.price.toFixed(2),
          item.itemType,
          item.id,
        ]
      );
    }

    const [paymentResult] = await connection.execute(
      `INSERT INTO payments
       (order_id, amount, currency, status, payment_method,
        bank_transfer_reference, receipt_path)
       VALUES (?, ?, 'gbp', 'pending', 'bank_transfer', ?, ?)`,
      [
        orderId,
        totalInPounds,
        bankTransferReference.trim(),
        receiptFilename,
      ]
    );

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: 'Order submitted. Your bank transfer is awaiting verification.',
      orderNumber,
      orderId,
      paymentId: paymentResult.insertId,
      paymentStatus: 'pending',
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch {}
    }

    if (receiptFilename) {
      try {
        fs.unlinkSync(path.join(RECEIPT_DIR, receiptFilename));
      } catch {}
    }

    console.error('[Bank transfer order]', error.message);

    return res.status(400).json({
      success: false,
      message: error.message || 'Unable to submit your order.',
    });
  } finally {
    if (connection) connection.release();
  }
};


// Admin: view all payments, including pending bank transfers
const getAdminPayments = async (req, res) => {
  try {
    const [payments] = await pool.query(`
      SELECT
        p.id AS paymentId,
        p.order_id AS orderId,
        o.order_number AS orderNumber,
        o.customer_name AS customerName,
        o.email,
        o.phone,
        p.amount,
        p.currency,
        p.status AS paymentStatus,
        p.payment_method AS paymentMethod,
        p.bank_transfer_reference AS bankTransferReference,
        p.receipt_path AS receiptPath,
        p.stripe_session_id AS stripeSessionId,
        p.stripe_payment_intent_id AS stripePaymentIntentId,
        p.created_at AS paymentDate,
        o.status AS orderStatus,
        o.notes
      FROM payments p
      INNER JOIN orders o ON o.id = p.order_id
      ORDER BY p.created_at DESC
    `);

    const [[summary]] = await pool.query(`
      SELECT
        COUNT(*) AS totalPayments,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0)
          AS totalRevenue,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END)
          AS pendingPayments
      FROM payments
    `);

    return res.json({
      success: true,
      data: payments,
      summary: {
        totalPayments: Number(summary.totalPayments || 0),
        totalRevenue: Number(summary.totalRevenue || 0),
        pendingPayments: Number(summary.pendingPayments || 0),
      },
    });
  } catch (error) {
    console.error('[Admin payments]', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch payment records.',
    });
  }
};


// Admin: approve a bank transfer after checking actual bank credit
const approveBankTransfer = async (req, res) => {
  let connection;

  try {
    const paymentId = Number(req.params.id);

    if (!Number.isSafeInteger(paymentId) || paymentId < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment ID.',
      });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [rows] = await connection.execute(
      `SELECT id, order_id, status, payment_method
       FROM payments
       WHERE id = ?
       FOR UPDATE`,
      [paymentId]
    );

    if (
      !rows.length ||
      rows[0].payment_method !== 'bank_transfer' ||
      rows[0].status !== 'pending'
    ) {
      await connection.rollback();

      return res.status(409).json({
        success: false,
        message: 'Payment not found or is no longer pending.',
      });
    }

    await connection.execute(
      `UPDATE payments
       SET status = 'paid'
       WHERE id = ? AND status = 'pending'`,
      [paymentId]
    );

    await connection.execute(
      `UPDATE orders
       SET payment_status = 'paid'
       WHERE id = ?`,
      [rows[0].order_id]
    );

    await connection.commit();

    return res.json({
      success: true,
      message: 'Bank transfer approved successfully.',
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch {}
    }

    console.error('[Approve bank transfer]', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to approve payment.',
    });
  } finally {
    if (connection) connection.release();
  }
};


// Admin: reject a bank transfer
const rejectBankTransfer = async (req, res) => {
  let connection;

  try {
    const paymentId = Number(req.params.id);

    if (!Number.isSafeInteger(paymentId) || paymentId < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment ID.',
      });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [rows] = await connection.execute(
      `SELECT id, order_id, status, payment_method
       FROM payments
       WHERE id = ?
       FOR UPDATE`,
      [paymentId]
    );

    if (
      !rows.length ||
      rows[0].payment_method !== 'bank_transfer' ||
      rows[0].status !== 'pending'
    ) {
      await connection.rollback();

      return res.status(409).json({
        success: false,
        message: 'Payment not found or is no longer pending.',
      });
    }

    await connection.execute(
      `UPDATE payments SET status = 'failed' WHERE id = ?`,
      [paymentId]
    );

    await connection.execute(
      `UPDATE orders SET payment_status = 'failed' WHERE id = ?`,
      [rows[0].order_id]
    );

    await connection.commit();

    return res.json({
      success: true,
      message: 'Bank transfer rejected.',
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch {}
    }

    console.error('[Reject bank transfer]', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to reject payment.',
    });
  } finally {
    if (connection) connection.release();
  }
};


// Admin-only private receipt access
const getPaymentReceipt = async (req, res) => {
  try {
    const paymentId = Number(req.params.id);

    if (!Number.isSafeInteger(paymentId) || paymentId < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment ID.',
      });
    }

    const [rows] = await pool.execute(
      `SELECT receipt_path
       FROM payments
       WHERE id = ? AND payment_method = 'bank_transfer'`,
      [paymentId]
    );

    if (!rows.length || !rows[0].receipt_path) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found.',
      });
    }

    const filename = path.basename(rows[0].receipt_path);
    const receiptFile = path.join(RECEIPT_DIR, filename);

    if (!fs.existsSync(receiptFile)) {
      return res.status(404).json({
        success: false,
        message: 'Receipt file is missing.',
      });
    }

    return res.sendFile(receiptFile);
  } catch (error) {
    console.error('[Payment receipt]', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to open receipt.',
    });
  }
};


module.exports = {
  createBankTransferOrder,
  getAdminPayments,
  approveBankTransfer,
  rejectBankTransfer,
  getPaymentReceipt,
};
