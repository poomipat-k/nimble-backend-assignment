const fs = require('fs');
const puppeteer = require('puppeteer');
const dayjs = require('dayjs');

const userDomain = require('../domains/user');
const keywordDomain = require('../domains/keyword');
const userKeywordDomain = require('../domains/user_keyword');
const HttpError = require('../utils/error');

const googleSearchScraping = async (keyword) => {
  const url = `https://www.google.com/search?q=${encodeURIComponent(keyword)}`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // Await to avoid being blocked by Google (Too many request issue)
  await page.goto(url);
  const pageHtml = await page.content();
  const data = await page.evaluate(() => {
    // Google's adWord element class via DOM inspection
    const adWordClass = '.CnP9N.U3A9Ac.irmCpc';
    const adWords = document.querySelectorAll(adWordClass);
    const adWordCount = Math.ceil(adWords?.length / 2);
    const resultStatsText =
      document.getElementById('result-stats')?.textContent;
    let totalSearchResult = resultStatsText?.trim()?.split(' ')[1];
    if (totalSearchResult) {
      totalSearchResult = totalSearchResult.replace(/,/g, '');
    }
    return {
      totalSearchResult,
      linkCount: document.querySelectorAll('a')?.length,
      adWordCount,
    };
  });
  data.html = pageHtml;
  await browser.close();
  return data;
};

const uploadKeywords = async (filePath, userId) => {
  const user = await userDomain.findOneById(userId);
  if (!user) {
    throw new HttpError('user not found', 400);
  }
  try {
    const result = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
    const keywords = result?.split('\r\n') || [];
    // Delete duplicate keyword in the CSV file
    const setKeywords = new Set(keywords);
    for (let inputKeyword of setKeywords) {
      const existingKeywordModel = await keywordDomain.findOneByKeyword(
        inputKeyword
      );
      if (!existingKeywordModel) {
        const data = await googleSearchScraping(inputKeyword);
        const { adWordCount, linkCount, totalSearchResult, html } = data;
        // save to db
        const now = dayjs();
        await keywordDomain.create({
          keyword: inputKeyword,
          adWordCount,
          linkCount,
          totalSearchResult,
          html,
          searchedAt: now,
          userId: user.id,
        });
      } else {
        // null if user do not have this keyword
        const keywordOfUserModel = await userDomain.findKeyword({
          userId,
          keyword: existingKeywordModel.keyword,
        });
        if (!keywordOfUserModel) {
          // create a new userKeyword
          await userKeywordDomain.create({
            userId,
            keywordId: existingKeywordModel.id,
          });
        }
        const now = dayjs();
        const { searchedAt } = existingKeywordModel;
        const isKeywordResultExpired = dayjs(searchedAt)
          .add(1, 'day')
          .isBefore(now);
        if (isKeywordResultExpired) {
          const data = await googleSearchScraping(inputKeyword);
          const { adWordCount, linkCount, totalSearchResult, html } = data;
          await existingKeywordModel.update({
            adWordCount,
            linkCount,
            totalSearchResult,
            html,
            searchedAt: now,
          });
        }
      }
    }
  } finally {
    // Delete file
    fs.rm(filePath, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
};

const getKeywordsByUserId = async (userId) => {
  const userData = await userDomain.findOneByIdWithKeywords(userId);
  if (!userData) {
    throw new HttpError('User not found', 404);
  }
  const keywordData = userData?.keywords;
  return keywordData;
};

module.exports = {
  uploadKeywords,
  getKeywordsByUserId,
};
