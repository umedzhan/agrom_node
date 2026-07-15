const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct
} = require('../controllers/productController');

const { protect } = require('../middleware/authMiddleware');
const { validate, productValidation } = require('../middleware/validator');

// Any authenticated user can create/edit/delete products; ownership of
// individual products (not just admin/farmer role) is enforced in the
// controller so users can only modify their own listings.
router.route('/').get(getProducts).post(protect, validate(productValidation), createProduct);
router.route('/:id').get(getProductById).delete(protect, deleteProduct).put(protect, validate(productValidation), updateProduct);

module.exports = router;
