const asyncHandler = require('express-async-handler');
const Contract = require('../models/Contract');

// @desc    List the logged-in user's contracts
// @route   GET /api/contracts
// @access  Private
const getMyContracts = asyncHandler(async (req, res) => {
    const contracts = await Contract.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(contracts);
});

// @desc    Create a contract draft
// @route   POST /api/contracts
// @access  Private
const createContract = asyncHandler(async (req, res) => {
    const { partnerName, cropType, volume, pricePerKg, paymentTerms } = req.body;

    if (!partnerName || !volume || !pricePerKg) {
        res.status(400);
        throw new Error('partnerName, volume and pricePerKg are required');
    }

    const contract = await Contract.create({
        user: req.user._id,
        partnerName,
        cropType,
        volume,
        pricePerKg,
        paymentTerms,
        status: 'draft',
    });

    res.status(201).json(contract);
});

// @desc    Update a contract's status (e.g. "sign" it)
// @route   PATCH /api/contracts/:id
// @access  Private
const updateContractStatus = asyncHandler(async (req, res) => {
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
        res.status(404);
        throw new Error('Contract not found');
    }

    if (!contract.user.equals(req.user._id)) {
        res.status(401);
        throw new Error('Not authorized to update this contract');
    }

    const { status } = req.body;
    contract.status = status;
    if (status === 'active' && !contract.signedDate) {
        contract.signedDate = new Date();
    }

    const updated = await contract.save();
    res.json(updated);
});

module.exports = { getMyContracts, createContract, updateContractStatus };
