const express = require('express');
const router = express.Router();
const { getMyCertificates, createCertificate } = require('../controllers/certificateController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMyCertificates).post(protect, createCertificate);

module.exports = router;
