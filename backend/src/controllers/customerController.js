const asyncHandler = require('../middleware/asyncHandler');
const { pool } = require('../config/db');

/* =========================================================
   GET ALL CUSTOMERS
   Customers are derived from repair bookings
========================================================= */

const getCustomers = asyncHandler(async (req, res) => {
  const [bookings] = await pool.query(`
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
  `);

  const customerMap = new Map();

  bookings.forEach((booking) => {
    const email = booking.email?.toLowerCase().trim();

    if (!email) return;

    if (!customerMap.has(email)) {
      customerMap.set(email, {
        id: email,
        name: booking.customerName,
        email: booking.email,
        phone: booking.phone,
        repairs: 0,
        lastRepair: booking.createdAt,
        status: 'Active',
      });
    }

    const customer = customerMap.get(email);

    customer.repairs += 1;

    if (
      booking.createdAt &&
      new Date(booking.createdAt) > new Date(customer.lastRepair)
    ) {
      customer.lastRepair = booking.createdAt;
    }
  });

  const customers = Array.from(customerMap.values());

  res.json({
    success: true,
    count: customers.length,
    data: customers,
  });
});

/* =========================================================
   GET CUSTOMER BY EMAIL
========================================================= */

const getCustomerById = asyncHandler(async (req, res) => {
  const email = decodeURIComponent(req.params.id)
    .toLowerCase()
    .trim();

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
    WHERE LOWER(email) = ?
    ORDER BY created_at DESC
    `,
    [email]
  );

  if (!bookings.length) {
    res.status(404);
    throw new Error('Customer not found');
  }

  const firstBooking = bookings[0];

  const customer = {
    id: email,
    name: firstBooking.customerName,
    email: firstBooking.email,
    phone: firstBooking.phone,
    repairs: bookings.length,
    status: 'Active',
    lastRepair: firstBooking.createdAt,
    bookings,
  };

  res.json({
    success: true,
    data: customer,
  });
});

module.exports = {
  getCustomers,
  getCustomerById,
};