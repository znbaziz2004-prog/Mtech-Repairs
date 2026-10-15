
const stripe = require('../config/stripe');
const { pool } = require('../config/db');

const FRONTEND_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const createCheckoutSession = async (req, res) => {
  let connection;
  let orderId;
  let paymentId;

  try {
    const {
      customerName,
      email,
      phone,
      address,
      city,
      items,
    } = req.body;

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

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty.',
      });
    }

    if (items.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Too many different items in one order.',
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

      const table = itemType === 'product' ? 'products' : 'accessories';

      const [rows] = await connection.execute(
        `SELECT id, name, price, in_stock
         FROM ${table}
         WHERE id = ? FOR UPDATE`,
        [itemId]
      );

     if (!rows.length || Number(rows[0].in_stock) < quantity) {
  throw new Error(`An item is unavailable or has insufficient stock: ${itemId}`);
}

      const dbItem = rows[0];
      const price = Number(dbItem.price);

      if (!Number.isFinite(price) || price < 0) {
        throw new Error('An item has an invalid price.');
      }

      const lineTotal = Math.round(price * 100) * quantity;
      totalAmount += lineTotal;

      verifiedItems.push({
        id: itemId,
        itemType,
        name: dbItem.name,
        price,
        quantity,
      });
    }

    if (totalAmount < 50) {
      throw new Error('The minimum Stripe payment is £0.50.');
    }

    const orderNumber = `MTECH-${Date.now()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const totalInPounds = totalAmount / 100;
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
        phone.trim(),
        totalInPounds.toFixed(2),
        notes,
      ]
    );

    orderId = orderResult.insertId;

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
      `INSERT INTO payments (order_id, amount, currency, status, payment_method)
       VALUES (?, ?, 'gbp', 'pending', 'card')`,
      [orderId, totalInPounds.toFixed(2)]
    );

    paymentId = paymentResult.insertId;

    await connection.commit();

    const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  customer_email: email.trim(),
      line_items: verifiedItems.map((item) => ({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      metadata: {
        orderId: String(orderId),
        paymentId: String(paymentId),
        orderNumber,
      },
      success_url: `${FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/checkout?payment=cancelled`,
    });

    await connection.execute(
      `UPDATE payments SET stripe_session_id = ? WHERE id = ?`,
      [session.id, paymentId]
    );

    return res.json({
      success: true,
      url: session.url,
      orderNumber,
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch {}
    }

    console.error('[Stripe checkout]', error.message);

    return res.status(400).json({
      success: false,
      message: error.message || 'Unable to start checkout.',
    });
  } finally {
    if (connection) connection.release();
  }
};


const verifyCheckoutSession = async (req, res) => {
  try {
    const sessionId = req.query.session_id;

    if (
      typeof sessionId !== 'string' ||
      !sessionId.startsWith('cs_test_')
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid test checkout session ID.',
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.json({
        success: true,
        paid: false,
        message: 'Payment has not been confirmed yet.',
      });
    }

    const orderId = Number(session.metadata?.orderId);
    const paymentId = Number(session.metadata?.paymentId);

    if (!orderId || !paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment metadata is missing.',
      });
    }

    const [rows] = await pool.execute(
      `SELECT p.id, p.order_id, p.stripe_session_id, p.status,
              o.order_number
       FROM payments p
       INNER JOIN orders o ON o.id = p.order_id
       WHERE p.id = ? AND p.order_id = ?`,
      [paymentId, orderId]
    );

    if (
      !rows.length ||
      rows[0].stripe_session_id !== session.id
    ) {
      return res.status(404).json({
        success: false,
        message: 'Payment record could not be verified.',
      });
    }

    await pool.execute(
      `UPDATE payments
       SET status = 'paid',
           stripe_payment_intent_id = ?
       WHERE id = ? AND order_id = ?`,
      [
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : null,
        paymentId,
        orderId,
      ]
    );

    await pool.execute(
      `UPDATE orders
       SET payment_status = 'paid'
       WHERE id = ?`,
      [orderId]
    );

    return res.json({
      success: true,
      paid: true,
      orderNumber: rows[0].order_number,
    });
  } catch (error) {
    console.error('[Payment verification]', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to verify payment right now.',
    });
  }
};


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
        p.stripe_session_id AS stripeSessionId,
        p.stripe_payment_intent_id AS stripePaymentIntentId,
        p.created_at AS paymentDate,
        o.status AS orderStatus,
        o.notes
      FROM payments p
      INNER JOIN orders o ON o.id = p.order_id
      WHERE p.status = 'paid'
      ORDER BY p.created_at DESC
    `);

    const [[summary]] = await pool.query(`
      SELECT
        COUNT(*) AS totalPayments,
        COALESCE(SUM(amount), 0) AS totalRevenue
      FROM payments
      WHERE status = 'paid'
    `);

    res.json({
      success: true,
      data: payments,
      summary: {
        totalPayments: Number(summary.totalPayments || 0),
        totalRevenue: Number(summary.totalRevenue || 0),
      },
    });
  } catch (error) {
    console.error('[Admin payments]', error.message);

    res.status(500).json({
      success: false,
      message: 'Unable to fetch payment records.',
    });
  }
};


module.exports = {
  createCheckoutSession,
  verifyCheckoutSession,
   getAdminPayments,
};

