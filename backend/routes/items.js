const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Item routes
router.post('/add', itemController.addItem);
router.post('/add-quantity', itemController.addQuantity);
router.post('/remove-item', itemController.removeItem);
router.post('/decrease-quantity', itemController.decreaseQuantity);
router.put('/update/:id', itemController.updateItem);
router.get('/all', itemController.getAllItems);
router.get('/some', itemController.getSomeItems); // Add query handling in controller
router.get('/search', itemController.searchItems);
router.get('/:id', itemController.getItemById);

// Cart-related item actions
router.post('/add-to-cart', itemController.addToCart);
router.post('/remove-from-cart', itemController.removeFromCart);

module.exports = router;
