module.exports = {
  nodeEnv: process.env.NODE_ENV,
  dbConfig: {
    username: process.env.DB_USERNAME || 'poomipat',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_DATABASE || 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: process.env.DB_DIALECT || 'postgres',
  },
  jwtSecretKey: process.env.JWT_SECRET_KEY || 'nimble',
};
