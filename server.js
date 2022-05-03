import fs from 'fs';
import readline from 'readline';
import events from 'events';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import multer from 'multer';
import mime from 'mime-types';
import cors from 'cors';
import jsdom from 'jsdom';
import puppeteer from 'puppeteer';

const { JSDOM } = jsdom;

const __dirname = path.resolve();

import { getRandomChars } from './utils/string.js';

const app = express();

const port = process.env.PORT || 5000;

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

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

app.get('/test/:q', async (req, res) => {
  const { q } = req.params;
  const url = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });
  const data = await page.content();
  res.send(data);
});

app.post(
  '/api/keywords/upload3',
  upload.single('csvFile'),
  async (req, res) => {
    console.log('===upload3 route');
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
  }
);

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
    for (let keyword of keywords) {
      // Await to avoid being blocked by Google (Too many request issue)
      const response = await axios.get(
        `https://www.google.com/search?q=${encodeURIComponent(keyword)}`
      );
      const rawHtml = response?.data;
      // parse HTML by jsdom
      const dom = new JSDOM(rawHtml);
      const document = dom.window.document;
      const links = document.querySelectorAll('a');
      console.log('==Inside keyword', keyword);
      console.log('==total links', links.length);
      const stats = document.getElementById('result-stats');
      console.log(stats?.textContent);
      // throw new Error('debugging');
    }
    console.timeEnd('for');
    console.log('====after FOR loop');
    console.log('=====DELETING FILE: ', filePath);
    // Delete file
    fs.rm(filePath, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
  console.log('====after readfile async');
  res.status(200).json({ response: 'received' });
});

app.post(
  '/api/keywords/upload2',
  upload.single('csvFile'),
  async (req, res) => {
    console.log('===upload2 route');
    const uploadedFile = req.file;
    const filePath = `${__dirname}/${uploadedFile.path}`;
    try {
      const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity,
      });
      console.log('===filePath', filePath);

      rl.on('line', async (line) => {
        console.log('before sleep');
        await sleep(1000);
        console.log(line);
        console.log('after sleep');
      });

      await events.once(rl, 'close');

      console.log('Reading file line by line with readline done.');
      const used = process.memoryUsage().heapUsed / 1024 / 1024;
      console.log(
        `The script uses approximately ${Math.round(used * 100) / 100} MB`
      );
    } catch (err) {
      console.error(err);
    }
    console.log('====LAST LINE===');
    res.json({ message: 'From kun' });
  }
);

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
