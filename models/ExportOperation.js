const mongoose = require('mongoose');

// A user's progress through the export trade journey for one product/country
// pair: Mahsulot -> Bozor -> Talablar -> Hujjatlar -> Xaridor -> Shartnoma ->
// Logistika -> To'lov -> Yetkazib berish. Stage is just an index for now;
// Phase 2/3 attach real documents/contracts/logistics to each stage.
const exportOperationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    countryCode: {
        type: String,
        required: true
    },
    quantityTons: {
        type: Number,
        required: true
    },
    currentStage: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

const ExportOperation = mongoose.model('ExportOperation', exportOperationSchema);

module.exports = ExportOperation;
