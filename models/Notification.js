const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    kind: {
        type: String,
        enum: ['order', 'contract', 'export', 'system'],
        required: true,
        default: 'system'
    },
    title: {
        type: String,
        required: true
    },
    href: {
        type: String
    },
    read: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
