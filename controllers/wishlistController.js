const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist');

    if (user) {
        res.json(user.wishlist);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
        // Check if product already exists
        if (user.wishlist.includes(productId)) {
            res.status(400);
            throw new Error('Product already in wishlist');
        }

        user.wishlist.push(productId);
        await user.save();

        // Return populated wishlist for immediate UI update if needed, 
        // or just the list of IDs. Populating is safer for context sync.
        const updatedUser = await User.findById(req.user._id).populate('wishlist');
        res.status(201).json(updatedUser.wishlist);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const user = await User.findById(req.user._id);

    if (user) {
        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();

        const updatedUser = await User.findById(req.user._id).populate('wishlist');
        res.json(updatedUser.wishlist);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist
};
