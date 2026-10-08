const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// @desc    List the logged-in user's notifications
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(50);
    res.json(notifications);
});

// @desc    Mark a notification as read
// @route   PATCH /api/notifications/:id
// @access  Private
const markNotificationRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    if (!notification.user.equals(req.user._id)) {
        res.status(401);
        throw new Error('Not authorized to update this notification');
    }

    notification.read = true;
    const updated = await notification.save();
    res.json(updated);
});

// @desc    Mark all of the logged-in user's notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
const markAllNotificationsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ ok: true });
});

module.exports = { getMyNotifications, markNotificationRead, markAllNotificationsRead };
