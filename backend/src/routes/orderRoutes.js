const express = require("express");

const router = express.Router();

const {
  getOrders,
  getOrderStats,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");


router.get("/stats", getOrderStats);

router.get("/", getOrders);

router.post("/", createOrder);

router.get("/:id", getOrderById);

router.patch("/:id", updateOrder);

router.delete("/:id", deleteOrder);


module.exports = router;