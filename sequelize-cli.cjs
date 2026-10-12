require('dotenv').config();

const dbUrl = process.env.DB_URL || '';

const dbConfig = dbUrl
  ? {
      use_env_variable: 'DB_URL',
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    }
  : {
      dialect: 'sqlite',
      storage: process.env.DB_STORAGE || './storage/pingui.db'
    };

module.exports = {
  development: dbConfig,
  test: dbConfig,
  production: dbConfig
};
