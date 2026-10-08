const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Contract = require('../models/Contract');
const Notification = require('../models/Notification');

// @desc    Real, platform-only stats for the logged-in user's profile
//          dashboard — no fabricated numbers, everything here is computed
//          from this user's own products/orders/contracts.
// @route   GET /api/dashboard/summary
// @access  Private
const getDashboardSummary = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const [myOrders, activeProducts, contractsActive, contractsDraft, unreadNotifications] = await Promise.all([
        Order.find({ user: userId }),
        Product.countDocuments({ user: userId }),
        Contract.countDocuments({ user: userId, status: 'active' }),
        Contract.countDocuments({ user: userId, status: 'draft' }),
        Notification.countDocuments({ user: userId, read: false }),
    ]);

    const myOrdersCount = myOrders.length;
    const myOrdersTotalUzs = myOrders.reduce((sum, o) => sum + o.totalPrice, 0);

    const myProductIds = await Product.find({ user: userId }).distinct('_id');
    const myProductIdStrings = myProductIds.map((id) => id.toString());

    // Sales of THIS user's own products, across all paid orders (not just
    // orders this user placed as a buyer) — this is what "seller revenue"
    // actually means.
    const allPaidOrders = await Order.find({ isPaid: true, 'orderItems.product': { $in: myProductIds } });

    let totalSalesUzs = 0;
    const monthlyTotals = {};
    for (const order of allPaidOrders) {
        for (const item of order.orderItems) {
            if (myProductIdStrings.includes(item.product.toString())) {
                const amount = item.price * item.qty;
                totalSalesUzs += amount;
                const month = order.paidAt ? order.paidAt.toISOString().slice(0, 7) : order.createdAt.toISOString().slice(0, 7);
                monthlyTotals[month] = (monthlyTotals[month] || 0) + amount;
            }
        }
    }
    const salesTrend = Object.entries(monthlyTotals)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6)
        .map(([month, total]) => ({ month, total }));

    res.json({
        activeProducts,
        contractsActive,
        contractsDraft,
        totalSalesUzs,
        salesTrend,
        myOrdersCount,
        myOrdersTotalUzs,
        unreadNotifications,
    });
});

module.exports = { getDashboardSummary };
