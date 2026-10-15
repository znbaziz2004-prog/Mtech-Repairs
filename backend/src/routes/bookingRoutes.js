const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
} = require('../controllers/bookingController');

router.route('/').post(createBooking).get(getBookings);
router.route('/:id').get(getBookingById).patch(updateBooking);

module.exports = router;
