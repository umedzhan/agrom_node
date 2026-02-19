const path = require('path');
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();

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
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post('/', (req, res) => {
    upload.single('image')(req, res, function (err) {
        if (err) {
            // Agar rasm formati xato bo'lsa (masalan: Images only!)
            return res.send(`Error: ${err}`);
        }
        if (!req.file) {
            // Fayl yetib kelmagan bo'lsa
            return res.send("Error: No file uploaded");
        }
        // Hammasi joyida bo'lsa, yo'lni slashlar bilan to'g'irlab qaytaramiz
        const filePath = req.file.path.replace(/\\/g, "/");
        res.send(`/${filePath}`);
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



