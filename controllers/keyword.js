const express = require('express');
const path = require('path');
const multer = require('multer');
const mime = require('mime-types');

const keywordService = require('../services/keyword');
const { getRandomChars } = require('../utils/string');

const router = express.Router();

const rootPath = path.join(__dirname, '..');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${getRandomChars(5)}_${getRandomChars(5)}.${mime.extension(
        file?.mimetype
      )}`
    );
  },
});
const upload = multer({ storage: storage });

router.post('/keyword/upload', upload.single('csvFile'), (req, res) => {
  const uploadedFile = req.file;
  const filePath = `${rootPath}/${uploadedFile.path}`;
  // Read file asynchronously
  keywordService.uploadKeywords(filePath);
  res.status(200).json({ response: 'received' });
});

module.exports = router;
