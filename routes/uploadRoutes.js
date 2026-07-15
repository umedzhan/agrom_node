const path = require('path');
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
  const ok = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
  ].includes(file.mimetype);

  if (ok) return cb(null, true);
  cb(new Error(`Images only! mimetype=${file.mimetype}`));
}


const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// Any authenticated user can upload an image for their own product listing.
router.post('/', protect, (req, res) => {
    upload.single('image')(req, res, function (err) {
        if (err) {
            return res.status(400).json({ success: false, error: String(err) });
        }
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        const filePath = req.file.path.replace(/\\/g, '/');
        res.json({ success: true, path: `/${filePath}` });
    });
});

router.post('/php', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        error: String(err),
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path.replace(/\\/g, "/");
    return res.json({
      success: true,
      path: `/${filePath}`,
    });
  });
});

module.exports = router;

