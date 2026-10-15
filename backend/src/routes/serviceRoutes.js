const express = require('express');

const router = express.Router();

const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');


// Get all services
router.get('/', getServices);

// Create service
router.post('/', createService);

// Get single service
router.get('/:id', getServiceById);

// Update service
router.put('/:id', updateService);

// Delete service
router.delete('/:id', deleteService);


module.exports = router;