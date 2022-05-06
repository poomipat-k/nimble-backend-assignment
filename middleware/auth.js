const jwt = require('jsonwebtoken');
const config = require('../config');

const { jwtSecretKey } = config;

const HttpError = require('../utils/error');

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer Token'

    if (!token) {
      throw new Error('Must login to proceed!');
    }

    const decodedToken = jwt.verify(token, jwtSecretKey);
    req.userData = {
      userId: decodedToken.userId,
    };
    next();
  } catch (err) {
    const error = new HttpError('Must login to proceed!', 403);
    return next(error);
  }
};

module.exports = auth;
