const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/:id', userController.getUser);
router.post('/verify', userController.verifyToken);
router.post('/getTotalSales', userController.getTotalSales);
router.post('/getProductListed', userController.getProductListed);
//router.delete('/cleanup',userController.cleanupController);
//router.post('/upload', userController.uploadProfilePicture);

module.exports = router;



