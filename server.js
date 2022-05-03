import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import multer from 'multer';
import mime from 'mime-types';

const __dirname = path.resolve();

import { getRandomChars } from './utils/string.js';

const app = express();

const port = process.env.PORT || 5000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

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

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

app.get('/test', async (req, res) => {
  console.log('==test route');
  res.status(200).json({ test: true });
});

app.post('/api/keywords/upload', upload.single('csvFile'), async (req, res) => {
  console.log('===upload route');
  const uploadedFile = req.file;
  const filePath = `${__dirname}/${uploadedFile.path}`;
  // Read file asynchronously
  fs.readFile(filePath, 'utf8', async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    // Handle data
    const keywords = data?.split('\r\n');
    console.log('===before FOR loop');
    console.time('for');
    for (let keyword of keywords) {
      const response = await axios.get(
        `https://www.google.com/search?q=${encodeURIComponent(keyword)}`
      );
      const rawHtml = response?.data;
      // parse HfsTML
      // Extract data
      // Save to Database
      // await sleep(1000);
      console.log('==Inside keyword', keyword);
      console.log(rawHtml.substring(0, 100));
      console.log('==============');
    }
    console.timeEnd('for');
    console.log('====after FOR loop');
  });
  console.log('====after readfile async');
  res.status(200).json({ response: 'received' });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
