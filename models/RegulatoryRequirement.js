const mongoose = require('mongoose');

// A requirement is never authored from a guess. Each record points at the
// official body that owns the rule; verification_status stays 'pending'
// until an admin has actually checked source_url and filled in the summary.
const regulatoryRequirementSchema = mongoose.Schema({
    countryCode: {
        type: String,
        required: true
    },
    category: {
        type: String
    },
    requirementType: {
        type: String,
        required: true,
        enum: [
            'exporter_registration', 'product_standard', 'certificate', 'phytosanitary',
            'veterinary', 'food_safety', 'packaging', 'labeling', 'customs',
            'import_duty', 'vat', 'restriction', 'origin', 'contract', 'transport'
        ]
    },
    title: {
        uz: { type: String, required: true },
        ru: String,
        en: String
    },
    summary: {
        uz: String,
        ru: String,
        en: String
    },
    sourceName: {
        type: String
    },
    sourceUrl: {
        type: String
    },
    lastVerified: {
        type: Date
    },
    verificationStatus: {
        type: String,
        enum: ['verified', 'pending', 'outdated'],
        required: true,
        default: 'pending'
    }
}, {
    timestamps: true
});

const RegulatoryRequirement = mongoose.model('RegulatoryRequirement', regulatoryRequirementSchema);

module.exports = RegulatoryRequirement;
