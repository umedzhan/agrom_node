const mongoose = require('mongoose');

// A user's own certificate (Halal, Organic, ISO, export license, ...).
// Starts 'pending' until someone on our side has actually looked at the
// uploaded file — never auto-marked 'active' on upload.
const certificateSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Halal', 'Organic', 'Quality', 'Export', 'Other'],
        required: true,
        default: 'Other'
    },
    number: {
        type: String
    },
    issuer: {
        type: String
    },
    issueDate: {
        type: Date
    },
    expiryDate: {
        type: Date
    },
    fileUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'expiring', 'expired'],
        required: true,
        default: 'pending'
    }
}, {
    timestamps: true
});

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;
