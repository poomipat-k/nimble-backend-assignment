/* eslint-disable no-undef */
const fs = require('fs');
const puppeteer = require('puppeteer');

const uploadKeywords = (filePath) => {
  try {
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
          const adWordsCount = Math.ceil(adWords?.length / 2);
          const resultStatsText =
            document.getElementById('result-stats')?.textContent;
          let totalResults = resultStatsText?.trim()?.split(' ')[1];
          if (totalResults) {
            totalResults = parseFloat(totalResults.replace(/,/g, ''));
          }
          return {
            statText: resultStatsText,
            totalResults,
            linksCount: document.querySelectorAll('a')?.length,
            adWordsCount,
          };
        });
        // TODO: store data to database
        console.log('==keyword', keyword);
        console.log(data);
        data.html = pageHtml;
        await browser.close();
      }
    });
  } catch (err) {
    console.error(err);
  } finally {
    // Delete file
    fs.rm(filePath, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
};

module.exports = {
  uploadKeywords,
};
