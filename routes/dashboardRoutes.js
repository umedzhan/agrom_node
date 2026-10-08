const express = require('express');
const router = express.Router();
const { getDashboardSummary } = require('../controllers/dashboardController');
const { search } = require('../controllers/searchController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard/summary', protect, getDashboardSummary);
router.get('/search', search);

module.exports = router;
