const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Order routes
router.post('/confirm-order', orderController.confirmOrder);
router.post('/ship-order', orderController.shipOrder);
router.get('/all-orders', orderController.getAllOrdersBySellerId);
router.get('/some-orders', orderController.getShippedOrdersBySellerId);

module.exports = router;
