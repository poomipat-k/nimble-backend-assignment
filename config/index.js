require('dotenv').config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecretKey: process.env.JWT_SECRET_KEY || 'nimble',
};
