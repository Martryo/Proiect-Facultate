const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// This matches: POST http://localhost:5000/api/products/update
router.post('/update', productController.updateProduct);
// This matches: GET http://localhost:5000/api/products/zotac-4090
router.get('/:id', productController.getProductDetails);

module.exports = router;