const Notification = require('../models/Notification');

// Fire-and-forget: a failed notification should never break the action that
// triggered it (e.g. marking an order as paid), so this swallows its own
// errors instead of throwing into the caller's request handler.
const notify = async (userId, kind, title, href) => {
    try {
        await Notification.create({ user: userId, kind, title, href });
    } catch (error) {
        console.error('Failed to create notification:', error.message);
    }
};

module.exports = notify;
