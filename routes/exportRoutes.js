const express = require('express');
const router = express.Router();
const {
    getRegions,
    getCountries,
    getCountryByCode,
    getExportRequirements,
    getMyExportOperations,
    startExportOperation,
    advanceExportOperation,
} = require('../controllers/exportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/regions', getRegions);
router.get('/countries', getCountries);
router.get('/countries/:code', getCountryByCode);
router.get('/export-requirements', getExportRequirements);
router.route('/export-operations').get(protect, getMyExportOperations).post(protect, startExportOperation);
router.put('/export-operations/:id/advance', protect, advanceExportOperation);

module.exports = router;
