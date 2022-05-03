/* eslint-disable no-unused-vars */
import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import mime from 'mime-types';
import cors from 'cors';
import puppeteer from 'puppeteer';

const __dirname = path.resolve();

import { getRandomChars } from './utils/string.js';

const app = express();

const port = process.env.PORT || 5000;

// CORS
app.use(cors());

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

app.post('/api/keywords/upload', upload.single('csvFile'), async (req, res) => {
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
    for (let keyword of keywords) {
      // Await to avoid being blocked by Google (Too many request issue)
      const url = `https://www.google.com/search?q=${encodeURIComponent(
        keyword
      )}`;
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);
      const pageHtml = await page.content();
      const data = await page.evaluate(() => {
        // Google's adWord element class via DOM inspection
        const adWordClass = '.CnP9N.U3A9Ac.irmCpc';
        const adWords = document.querySelectorAll(adWordClass);
        const adWordsCount = Math.ceil(adWords.length / 2);
        return {
          stats: document.getElementById('result-stats')?.textContent,
          linksCount: document.querySelectorAll('a')?.length,
          adWordsCount,
        };
      });
      data.html = pageHtml;
      await browser.close();
    }

    // Delete file
    fs.rm(filePath, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
  res.status(200).json({ response: 'received' });
});

// Catch not found url
app.use((req, res, next) => {
  const error = new Error('Could not find this route');
  error.code = 404;
  throw error;
});

// Catch unknown errors
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
