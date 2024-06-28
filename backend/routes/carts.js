const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Cart routes
router.post('/buy-cart', cartController.buyCart);
router.get('/get-cart/:userId', cartController.getCartByUserId);
router.get('/get-cart-items/:cartId', cartController.getCartItems);

module.exports = router;
