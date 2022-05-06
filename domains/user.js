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

module.exports = {
  create,
  findOneById,
  findOneByEmail,
  findOneByIdWithKeywords,
};
