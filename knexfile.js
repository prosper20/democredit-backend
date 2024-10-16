require('dotenv').config();

const {
  DB_USER,
  DB_PASS,
  DB_HOST,
  DB_NAME,
  DB_URL,
  NODE_ENV,
} = process.env;

const config = {
  development: {
    client: 'mysql2',
    connection: {
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
    },
    pool: {
      min: 0,
      max: 10,
    },
    migrations: {
      directory: './db/migrations',
    },
  },
  production: {
    client: 'mysql2',
    connection: DB_URL,
    pool: {
      min: 0,
      max: 10,
    },
    migrations: {
      directory: './db/migrations',
    },
  },
};

module.exports = config[NODE_ENV || 'development'];
