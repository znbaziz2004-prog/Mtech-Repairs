
const express = require('express');
const router = express.Router();

const {
  createBankTransferOrder,
  getAdminPayments,
  approveBankTransfer,
  rejectBankTransfer,
  getPaymentReceipt,
} = require('../controllers/paymentController');

const adminAuth = require('../middleware/adminAuth');
const uploadReceipt = require('../middleware/receiptUpload');

// Customer bank transfer submission
router.post(
  '/bank-transfer',
  uploadReceipt.single('receipt'),
  createBankTransferOrder
);

// Admin-only routes
router.get('/admin', adminAuth, getAdminPayments);
router.get('/admin/:id/receipt', adminAuth, getPaymentReceipt);
router.patch('/admin/:id/approve', adminAuth, approveBankTransfer);
router.patch('/admin/:id/reject', adminAuth, rejectBankTransfer);

module.exports = router;
