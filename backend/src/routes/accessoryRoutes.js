const express = require('express');

const router = express.Router();

const {
  getAccessories,
  getAccessoryById,
  createAccessory,
  updateAccessory,
  deleteAccessory,
} = require('../controllers/accessoryController');

router.get('/', getAccessories);

router.post('/', createAccessory);

router.get('/:id', getAccessoryById);

router.patch('/:id', updateAccessory);

router.delete('/:id', deleteAccessory);

module.exports = router;