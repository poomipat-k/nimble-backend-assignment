const dotenv = require('dotenv');
dotenv.config();

const { env } = process;
const dbPort = env.DATABASE_PORT || '5432';
const dialect = env.DATABASE_DIALECT || 'postgres';
module.exports = {
  development: {
    username: env.DB_USERNAME || 'poomipat',
    password: env.DB_PASSWORD || null,
    database: env.DB_HOST || 'postgres',
    host: env.DATABASE_ENDPOINT || '127.0.0.1',
    port: dbPort,
    dialect,
  },
  staging: {
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_HOST,
    host: env.DATABASE_ENDPOINT,
    port: dbPort,
    dialect,
  },
  production: {
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_HOST,
    host: env.DATABASE_ENDPOINT,
    port: dbPort,
    dialect,
  },
};
