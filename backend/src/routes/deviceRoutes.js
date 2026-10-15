const express = require('express');
const router = express.Router();
const { getDevices, getDeviceBySlug } = require('../controllers/deviceController');

router.get('/', getDevices);
router.get('/:slug', getDeviceBySlug);

module.exports = router;
