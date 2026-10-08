const asyncHandler = require('express-async-handler');
const Certificate = require('../models/Certificate');

// @desc    List the logged-in user's certificates
// @route   GET /api/certificates
// @access  Private
const getMyCertificates = asyncHandler(async (req, res) => {
    const certificates = await Certificate.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(certificates);
});

// @desc    Upload a new certificate (starts out 'pending')
// @route   POST /api/certificates
// @access  Private
const createCertificate = asyncHandler(async (req, res) => {
    const { name, type, number, issuer, issueDate, expiryDate, fileUrl } = req.body;

    if (!name) {
        res.status(400);
        throw new Error('name is required');
    }

    const certificate = await Certificate.create({
        user: req.user._id,
        name,
        type,
        number,
        issuer,
        issueDate,
        expiryDate,
        fileUrl,
        status: 'pending',
    });

    res.status(201).json(certificate);
});

module.exports = { getMyCertificates, createCertificate };
