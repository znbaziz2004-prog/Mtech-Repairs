const express = require('express');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image uploaded');
  }
  res.status(201).json({ success: true, url: `/uploads/${req.file.filename}` });
});

module.exports = router;