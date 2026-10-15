const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { notFound, errorHandler } = require('./middleware/errorHandler');

const bookingRoutes = require('./routes/bookingRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const productRoutes = require('./routes/productRoutes');
const accessoryRoutes = require('./routes/accessoryRoutes');
const contactRoutes = require('./routes/contactRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const customerRoutes = require('./routes/customerRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { handleStripeWebhook } = require('./controllers/stripeWebhookController');


const app = express();



/* =========================================================
   SECURITY & PARSING
========================================================= */

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

/* =========================================================
   CORS
========================================================= */

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://mtechnrepairs.hostless.site',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an origin
      // such as Postman/server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked origin: ${origin}`)
      );
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/* =========================================================
   LOGGER
========================================================= */

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

/* =========================================================
   RATE LIMITING
========================================================= */

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Mtech & Repairs API is running',
  });
});

/* =========================================================
   ROUTES
========================================================= */

app.use('/api/bookings', bookingRoutes);

app.use('/api/devices', deviceRoutes);

app.use('/api/services', serviceRoutes);

app.use('/api/products', productRoutes);

app.use('/api/accessories', accessoryRoutes);

app.use('/api/contact', contactRoutes);

app.use('/api/testimonials', testimonialRoutes);

app.use('/api/customers', customerRoutes);

app.use('/api/admin/dashboard', dashboardRoutes);

app.use('/api/admin/auth', adminAuthRoutes);

app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.use('/api/payments', paymentRoutes);


/* =========================================================
   ERROR HANDLING
========================================================= */

app.use(notFound);

app.use(errorHandler);

module.exports = app;