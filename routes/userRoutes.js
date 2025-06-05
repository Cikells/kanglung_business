const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const isAuth = require('../middleware/authMiddleware');
const { upload, setUploadType } = require('../controllers/multerController');

// Dashboard route
router.get('/dashboard', isAuth, userController.getDashboard);

// Add product with image
router.post(
  '/products',
  isAuth,
  setUploadType('product'),
  upload.single('productImage'),
  userController.addProduct
);

// Edit product with optional image update
router.post(
  '/products/:id/edit',
  isAuth,
  setUploadType('product'),
  upload.single('productImage'),
  userController.editProduct
);

// Delete product
router.post('/products/:id/delete', isAuth, userController.deleteProduct);

module.exports = router;
