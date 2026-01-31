const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const category = req.query.category && req.query.category !== 'all'
        ? { category: req.query.category }
        : {};

    // Check if 'myproducts' query param is set (only for authenticated users)
    // Note: To use req.user here, the route technically doesn't force 'protect' middleware for GET.
    // However, the frontend sends a token. We need to handle the case where req.user might be undefined 
    // if the route is public. But for 'myproducts', we expect the user to be logged in.
    // We'll rely on the frontend passing the token. The 'protect' middleware is NOT on the GET route by default.
    // We might need to manually decode the token if we want to support this securely without forcing protect on all GETs.
    // OR, better approach: The frontend only calls this with token. 
    // But since the route is PUBLIC, req.user won't be populated by 'protect'.
    // Wait, the route is: router.route('/').get(getProducts) -- Public.
    // If I want to filter by "my products", I need to know who "me" is.
    // So I should probably check for the token manually here OR make a separate route.
    // But let's check if I can just verify the token if it exists.

    // Actually, simpler: The frontend logic I saw in ProductListScreen calls `/api/products?pageNumber=...&myproducts=true` WITH a token.
    // BUT since the route is NOT protected, `protect` middleware is not running, so `req.user` is undefined.
    // I need to make sure `req.user` is populated. 
    // The cleanest way is to separate the route or manually invoke protect logic.
    // However, since I can't easily change the route structure without breaking public access to products...
    // I will check if `req.query.myproducts` is true, and if so, I need to verify the user.
    // BUT, wait, I can just use the token from the header if it exists.

    let userFilter = {};
    if (req.query.myproducts) {
        // We need to decode the token manually since 'protect' didn't run
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            const jwt = require('jsonwebtoken');
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
                userFilter = { user: decoded.id };
            } catch (error) {
                // Invalid token, ignore or error? ignoring means empty list or public list.
                // Let's error since they asked for THEIR products.
                res.status(401);
                throw new Error('Not authorized, token failed');
            }
        } else {
            res.status(401);
            throw new Error('Not authorized, no token');
        }
    }

    const filter = { ...keyword, ...category, ...userFilter };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin/Farmer
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        if (req.user.isAdmin || (req.user.isFarmer && product.user.equals(req.user._id))) {
            await Product.deleteOne({ _id: product._id });
            res.json({ message: 'Product removed' });
        } else {
            res.status(401);
            throw new Error('Not authorized to delete this product');
        }
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin/Farmer
const createProduct = asyncHandler(async (req, res) => {
    const { name, price, image, brand, category, countInStock, description } = req.body;

    if (!name || !price || !image || !brand || !category || !description) {
        res.status(400);
        throw new Error('Please add all required fields');
    }

    const product = new Product({
        name,
        price,
        user: req.user._id,
        image,
        brand,
        category,
        countInStock,
        numReviews: 0,
        description
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin/Farmer
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        brand,
        category,
        countInStock,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        if (req.user.isAdmin || (req.user.isFarmer && product.user.equals(req.user._id))) {
            product.name = name;
            product.price = price;
            product.description = description;
            product.image = image;
            product.brand = brand;
            product.category = category;
            product.countInStock = countInStock;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(401);
            throw new Error('Not authorized to update this product');
        }
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct
};