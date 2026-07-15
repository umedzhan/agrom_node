const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');

// Escapes regex special characters so user search input can't be used to
// build unintended or catastrophically slow ($regex) patterns.
const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            name: {
                $regex: escapeRegex(req.query.keyword),
                $options: 'i',
            },
        }
        : {};

    const category = req.query.category && req.query.category !== 'all'
        ? { category: req.query.category }
        : {};

    // The product list route is public, so 'protect' doesn't run and req.user
    // is never populated. 'myproducts' still needs to know who the caller is,
    // so decode the token here only when that filter is requested.
    let userFilter = {};
    if (req.query.myproducts) {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userFilter = { user: decoded.id };
            } catch (error) {
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
        if (req.user.isAdmin || product.user.equals(req.user._id)) {
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
        if (req.user.isAdmin || product.user.equals(req.user._id)) {
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