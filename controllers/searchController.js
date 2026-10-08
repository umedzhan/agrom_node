const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const countries = require('../data/countries');

const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    Search products and (export) countries by a single keyword
// @route   GET /api/search
// @access  Public
const search = asyncHandler(async (req, res) => {
    const q = (req.query.q || '').trim();

    if (!q) {
        return res.json({ products: [], countries: [] });
    }

    const pattern = { $regex: escapeRegex(q), $options: 'i' };

    const [products, matchedCountries] = await Promise.all([
        Product.find({
            $or: [{ name: pattern }, { brand: pattern }, { category: pattern }],
        }).limit(10),
        Promise.resolve(
            countries.filter(
                (c) =>
                    c.name.uz.toLowerCase().includes(q.toLowerCase()) ||
                    c.name.en.toLowerCase().includes(q.toLowerCase()) ||
                    c.name.ru.toLowerCase().includes(q.toLowerCase())
            )
        ),
    ]);

    res.json({ products, countries: matchedCountries });
});

module.exports = { search };
