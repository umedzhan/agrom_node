const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct
} = require('../controllers/productController');

const { protect, admin, adminOrFarmer } = require('../middleware/authMiddleware');
const { validate, productValidation } = require('../middleware/validator');

router.route('/').get(getProducts).post(protect, adminOrFarmer, validate(productValidation), createProduct);
router.route('/:id').get(getProductById).delete(protect, adminOrFarmer, deleteProduct).put(protect, adminOrFarmer, validate(productValidation), updateProduct);

module.exports = router;
