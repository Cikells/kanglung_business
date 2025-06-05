const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { upload, setUploadType } = require('../controllers/multerController');

// Existing routes
router.get('/', productController.getAllProducts);
router.get('/shops/:shopId', productController.getProductsByShop);
router.get('/:id/buy', productController.getBuyForm);
router.post('/:id/buy', productController.postBuyRequest);

// ✅ New route for adding a product with image upload
router.post(
  '/add',
  setUploadType('product'),
  upload.single('productImage'),  // expects form field name 'productImage'
  productController.addProduct
);

module.exports = router;
