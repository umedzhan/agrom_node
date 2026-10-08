const asyncHandler = require('express-async-handler');
const RegulatoryRequirement = require('../models/RegulatoryRequirement');
const ExportOperation = require('../models/ExportOperation');
const ExportLead = require('../models/ExportLead');
const Product = require('../models/Product');
const Certificate = require('../models/Certificate');
const Contract = require('../models/Contract');
const regions = require('../data/regions');
const countries = require('../data/countries');
const logisticsEstimates = require('../data/logisticsEstimates');
const notify = require('../utils/notify');

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
    notify(operation.user, 'export', `Eksport jarayoni ${updated.currentStage}-bosqichga o'tdi`, '/export');
    res.json(updated);
});

// @desc    A seller's local-market readiness checklist — not legal
//          requirements, just a reflection of this user's own real data
//          (do they have products, certificates, delivery info, ...).
// @route   GET /api/local-requirements
// @access  Private
const getLocalRequirements = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const [myProducts, activeCertCount, contractCount] = await Promise.all([
        Product.find({ user: userId }),
        Certificate.countDocuments({ user: userId, status: 'active' }),
        Contract.countDocuments({ user: userId }),
    ]);

    const hasProduct = myProducts.length > 0;
    const hasGrade = myProducts.some((p) => p.grade);
    const hasDelivery = myProducts.some((p) => p.delivery && p.delivery.length > 0);

    const items = [
        {
            group: 'seller',
            title: 'Email tasdiqlangan hisob',
            status: 'ready',
        },
        {
            group: 'product',
            title: 'Kamida bitta mahsulot joylangan',
            status: hasProduct ? 'ready' : 'required',
        },
        {
            group: 'quality',
            title: 'Mahsulotda sifat darajasi (grade) ko\'rsatilgan',
            status: hasGrade ? 'ready' : 'optional',
        },
        {
            group: 'certificates',
            title: 'Faol sertifikat mavjud',
            status: activeCertCount > 0 ? 'ready' : 'optional',
        },
        {
            group: 'transport',
            title: 'Yetkazib berish usuli belgilangan',
            status: hasDelivery ? 'ready' : 'optional',
        },
        {
            group: 'contract',
            title: 'Hamkor bilan shartnoma tuzilgan',
            status: contractCount > 0 ? 'ready' : 'optional',
        },
    ];

    res.json(items);
});

// @desc    Create an export lead (request help finding a buyer / support)
// @route   POST /api/export-leads
// @access  Private
const createExportLead = asyncHandler(async (req, res) => {
    const { product, countryCode, message, contactPhone } = req.body;

    const lead = await ExportLead.create({
        user: req.user._id,
        product,
        countryCode,
        message,
        contactPhone,
    });

    res.status(201).json(lead);
});

// @desc    List the logged-in user's own export leads
// @route   GET /api/export-leads/mine
// @access  Private
const getMyExportLeads = asyncHandler(async (req, res) => {
    const leads = await ExportLead.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(leads);
});

// @desc    List all export leads (for the team to follow up on)
// @route   GET /api/export-leads
// @access  Private/Admin
const getExportLeads = asyncHandler(async (req, res) => {
    const leads = await ExportLead.find({})
        .populate('user', 'name email')
        .populate('product', 'name')
        .sort({ createdAt: -1 });
    res.json(leads);
});

// @desc    Rough, clearly-estimated logistics cost for one destination
// @route   GET /api/logistics/estimate
// @access  Public
const getLogisticsEstimate = asyncHandler(async (req, res) => {
    const { country, weightTons } = req.query;
    const estimate = logisticsEstimates[(country || '').toUpperCase()];

    if (!estimate || !weightTons) {
        res.status(400);
        throw new Error('country and weightTons are required, and country must be a known destination');
    }

    const tons = Number(weightTons);
    res.json({
        countryCode: country.toUpperCase(),
        mode: estimate.mode,
        pricePerTonUsd: estimate.pricePerTonUsd,
        estimatedTotalUsd: Math.round(estimate.pricePerTonUsd * tons),
        transitDays: estimate.transitDays,
        provenance: 'estimate',
        note: "Bu taxminiy baho. Haqiqiy narx tashuvchi kompaniyaga bog'liq holda farq qilishi mumkin.",
    });
});

module.exports = {
    getRegions,
    getCountries,
    getCountryByCode,
    getExportRequirements,
    getLocalRequirements,
    getMyExportOperations,
    startExportOperation,
    advanceExportOperation,
    createExportLead,
    getMyExportLeads,
    getExportLeads,
    getLogisticsEstimate,
};
