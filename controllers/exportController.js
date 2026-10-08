const asyncHandler = require('express-async-handler');
const RegulatoryRequirement = require('../models/RegulatoryRequirement');
const ExportOperation = require('../models/ExportOperation');
const regions = require('../data/regions');
const countries = require('../data/countries');

// @desc    List Uzbekistan regions (static reference data)
// @route   GET /api/regions
// @access  Public
const getRegions = asyncHandler(async (req, res) => {
    res.json(regions);
});

// @desc    List export destination countries (static reference data)
// @route   GET /api/countries
// @access  Public
const getCountries = asyncHandler(async (req, res) => {
    res.json(countries);
});

// @desc    Get one country plus its known requirements
// @route   GET /api/countries/:code
// @access  Public
const getCountryByCode = asyncHandler(async (req, res) => {
    const country = countries.find((c) => c.code === req.params.code.toUpperCase());

    if (!country) {
        res.status(404);
        throw new Error('Country not found');
    }

    const requirements = await RegulatoryRequirement.find({ countryCode: country.code });
    res.json({ country, requirements });
});

// @desc    List regulatory requirements for a country (+ optional category)
// @route   GET /api/export-requirements
// @access  Public
const getExportRequirements = asyncHandler(async (req, res) => {
    const { country, category } = req.query;

    if (!country) {
        res.status(400);
        throw new Error('country is required');
    }

    const filter = { countryCode: country.toUpperCase() };
    if (category) filter.category = category;

    const requirements = await RegulatoryRequirement.find(filter);
    res.json(requirements);
});

// @desc    List the logged-in user's export operations
// @route   GET /api/export-operations
// @access  Private
const getMyExportOperations = asyncHandler(async (req, res) => {
    const operations = await ExportOperation.find({ user: req.user._id })
        .populate('product', 'name image category')
        .sort({ createdAt: -1 });
    res.json(operations);
});

// @desc    Start a new export operation
// @route   POST /api/export-operations
// @access  Private
const startExportOperation = asyncHandler(async (req, res) => {
    const { product, countryCode, quantityTons } = req.body;

    if (!product || !countryCode || !quantityTons) {
        res.status(400);
        throw new Error('product, countryCode and quantityTons are required');
    }

    const operation = await ExportOperation.create({
        user: req.user._id,
        product,
        countryCode: countryCode.toUpperCase(),
        quantityTons,
    });

    res.status(201).json(operation);
});

// @desc    Advance an export operation to the next stage
// @route   PUT /api/export-operations/:id/advance
// @access  Private
const advanceExportOperation = asyncHandler(async (req, res) => {
    const operation = await ExportOperation.findById(req.params.id);

    if (!operation) {
        res.status(404);
        throw new Error('Export operation not found');
    }

    if (!operation.user.equals(req.user._id)) {
        res.status(401);
        throw new Error('Not authorized to update this export operation');
    }

    operation.currentStage += 1;
    const updated = await operation.save();
    res.json(updated);
});

module.exports = {
    getRegions,
    getCountries,
    getCountryByCode,
    getExportRequirements,
    getMyExportOperations,
    startExportOperation,
    advanceExportOperation,
};
