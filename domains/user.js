const { head } = require('lodash');

const models = require('../models');

const create = ({ email, password }, options) =>
  models.user.create(
    {
      email,
      password,
    },
    options
  );

const findOneById = (id) => models.user.findByPk(id);

const findOneByEmail = (email) =>
  models.user.findOne({
    where: {
      email,
    },
  });

const findOneByIdWithKeywords = (id) =>
  models.user.findByPk(id, {
    attributes: ['id'],
    include: {
      model: models.keyword,
      attributes: ['id', 'keyword'],
    },
  });

const findKeyword = async ({ userId, keyword }) => {
  const data = await models.user.findOne({
    where: {
      id: userId,
    },
    include: {
      model: models.keyword,
      where: {
        keyword,
      },
      attributes: ['id', 'keyword', 'searchedAt'],
    },
  });
  const foundKeyword = head(data?.keywords);
  return foundKeyword;
};

module.exports = {
  create,
  findOneById,
  findOneByEmail,
  findOneByIdWithKeywords,
  findKeyword,
};
