const mongoose = require('mongoose');

// A seller's request for help finding a buyer / getting export support.
// We deliberately don't maintain a fake "international buyers" directory —
// this is a lead for a human on our team to follow up on.
const exportLeadSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    countryCode: {
        type: String
    },
    message: {
        type: String
    },
    contactPhone: {
        type: String
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'closed'],
        required: true,
        default: 'new'
    }
}, {
    timestamps: true
});

const ExportLead = mongoose.model('ExportLead', exportLeadSchema);

module.exports = ExportLead;
