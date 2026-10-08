const express = require('express');
const router = express.Router();
const { getMyContracts, createContract, updateContractStatus } = require('../controllers/contractController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMyContracts).post(protect, createContract);
router.patch('/:id', protect, updateContractStatus);

module.exports = router;
