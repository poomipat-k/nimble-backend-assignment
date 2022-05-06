const models = require('../models');

const HttpError = require('../utils/error');

const create = async (payload, options) => {
  const { userId } = payload;
  if (!userId) {
    throw HttpError('userId is required for creating keyword', 400);
  }
  const keywordModel = await models.keyword.create(payload, options);
  await models.userKeyword.create(
    {
      userId,
      keywordId: keywordModel.id,
    },
    options
  );
  return keywordModel;
};

const findOneByKeyword = (keyword) =>
  models.keyword.findOne({
    where: {
      keyword,
    },
  });

module.exports = {
  create,
  findOneByKeyword,
};
