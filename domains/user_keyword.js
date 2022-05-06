const models = require('../models');

const HttpError = require('../utils/error');

const create = async ({ userId, keywordId }, options) => {
  if (!userId) {
    throw HttpError('userId is required for creating keyword', 400);
  }
  const createdUserKeyword = await models.userKeyword.create(
    {
      userId,
      keywordId,
    },
    options
  );
  return createdUserKeyword;
};

module.exports = {
  create,
};
