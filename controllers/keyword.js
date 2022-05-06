const express = require('express');
const path = require('path');
const multer = require('multer');
const mime = require('mime-types');

const auth = require('../middleware/auth');

const keywordService = require('../services/keyword');
const { getRandomChars } = require('../utils/string');

const router = express.Router();

const rootPath = path.join(__dirname, '..');

const userDomain = require('../domains/user');

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

router.post(
  '/keyword/upload',
  auth,
  upload.single('csvFile'),
  async (req, res, next) => {
    try {
      const uploadedFile = req.file;
      const filePath = `${rootPath}/${uploadedFile.path}`;
      const { userId } = req.userData || {};
      // early response
      res.status(200).json({ response: 'received' });
      await keywordService.uploadKeywords(filePath, userId, next);
    } catch (err) {
      console.error(err.message);
    }
  }
);

router.get('/keyword', auth, async (req, res, next) => {
  try {
    const { userId } = req.userData || {};
    const data = await keywordService.getKeywordsByUserId(userId);
    res.status(200).json(data);
  } catch (err) {
    return next(err);
  }
});

router.get('/test', async (req, res, next) => {
  const data = await userDomain.findKeyword({ userId: 1, keyword: 'c++' });
  res.json(data);
});

module.exports = router;
