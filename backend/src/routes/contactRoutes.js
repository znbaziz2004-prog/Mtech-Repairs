const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/contactController');

router.route('/').post(sendMessage).get(getMessages);

module.exports = router;
