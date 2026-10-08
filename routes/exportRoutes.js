const express = require('express');
const router = express.Router();
const {
    getRegions,
    getCountries,
    getCountryByCode,
    getExportRequirements,
    getLocalRequirements,
    getMyExportOperations,
    startExportOperation,
    advanceExportOperation,
    createExportLead,
    getMyExportLeads,
    getExportLeads,
    getLogisticsEstimate,
} = require('../controllers/exportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/regions', getRegions);
router.get('/countries', getCountries);
router.get('/countries/:code', getCountryByCode);
router.get('/export-requirements', getExportRequirements);
router.get('/local-requirements', protect, getLocalRequirements);
router.route('/export-operations').get(protect, getMyExportOperations).post(protect, startExportOperation);
router.put('/export-operations/:id/advance', protect, advanceExportOperation);
router.get('/logistics/estimate', getLogisticsEstimate);
router.get('/export-leads/mine', protect, getMyExportLeads);
router.route('/export-leads').get(protect, admin, getExportLeads).post(protect, createExportLead);

module.exports = router;
