const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const HttpError = require('../utils/error');
const userDomain = require('../domains/user');

const models = require('../models');

const config = require('../config');

const { jwtSecretKey } = config;

const signup = async ({ email, password, confirmPassword }) => {
  if (!validator.isEmail) {
    throw new HttpError('Email is not valid', 400);
  }
  let existingUser;
  if (password !== confirmPassword) {
    throw new HttpError(
      'Password is not match with confirmation password',
      400
    );
  }
  try {
    existingUser = await userDomain.findOneByEmail(email);
  } catch (err) {
    throw new HttpError('Signing up failed, please try again later.', 500);
  }

  if (existingUser) {
    throw new HttpError('User exists already.', 422);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    throw new HttpError(`Could not create user: ${err.message}`, 500);
  }

  let createdUser;
  const transaction = await models.sequelize.transaction();
  try {
    createdUser = await userDomain.create(
      {
        email,
        password: hashedPassword,
      },
      { transaction }
    );
  } catch (err) {
    await transaction.rollback();
    throw new HttpError(`Could not create user: ${err.message}`, 500);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      jwtSecretKey,
      { expiresIn: '1d' }
    );
  } catch (err) {
    await transaction.rollback();
    throw new HttpError(
      `Signing up failed (data not correct), please try again: ${err.message}`,
      500
    );
  }
  await transaction.commit();
  return { token, email, userId: createdUser.id };
};

const login = async ({ email, password }) => {
  if (!validator.isEmail) {
    throw new HttpError('Email is not valid', 400);
  }
  let existingUser;
  try {
    existingUser = await userDomain.findOneByEmail(email);
  } catch (err) {
    throw new HttpError('Logging in failed, please try again later.', 500);
  }

  if (!existingUser) {
    throw new HttpError('Invalid credentials, could not log you in.', 403);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    throw new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
  }

  if (!isValidPassword) {
    throw new HttpError('Invalid credentials, could not log you in.', 403);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      jwtSecretKey,
      { expiresIn: '1d' }
    );
  } catch (err) {
    throw new HttpError(
      'Loging in failed (data not correct), please try again.',
      500
    );
  }

  return {
    userId: existingUser.id,
    email: existingUser.email,
    token,
  };
};

module.exports = {
  signup,
  login,
};
