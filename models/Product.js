const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
    },
    // Optional "Market" fields (local/export trade listing). Left unset on
    // older products, so nothing here can be required.
    region: {
        type: String
    },
    grade: {
        type: String,
        enum: ['premium', 'grade1', 'grade2']
    },
    certificates: [{
        type: String
    }],
    harvestDate: {
        type: Date
    },
    buyerTypes: [{
        type: String,
        enum: ['wholesale', 'retail', 'processing', 'horeca', 'distributor', 'exporter']
    }],
    delivery: [{
        type: String,
        enum: ['pickup', 'seller', 'partner']
    }],
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
