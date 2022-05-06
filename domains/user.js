const models = require('../models');

const create = ({ email, password }, options) =>
  models.user.create(
    {
      email,
      password,
    },
    options
  );

const findOneByEmail = (email) =>
  models.user.findOne({
    where: {
      email,
    },
  });

module.exports = {
  create,
  findOneByEmail,
};
