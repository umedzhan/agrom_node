const mongoose = require('mongoose');

// A seller's own trade contract draft. "Signing" in the UI is a simulated
// e-imzo flow (no real E-IMZO/PKI integration exists yet) — this model just
// persists the resulting draft/active/completed status instead of losing it
// on reload.
const contractSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    partnerName: {
        type: String,
        required: true
    },
    cropType: {
        type: String,
        required: true
    },
    volume: {
        type: Number,
        required: true
    },
    pricePerKg: {
        type: Number,
        required: true
    },
    paymentTerms: {
        type: String
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'completed', 'cancelled'],
        required: true,
        default: 'draft'
    },
    signedDate: {
        type: Date
    }
}, {
    timestamps: true
});

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
