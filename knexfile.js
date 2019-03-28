'use strict'


require('dotenv').config();

module.exports = {

  local: {
    client: 'postgresql',
    connection: {
      host     : process.env.DATABASE_HOST,
      user     : process.env.DATABASE_USER,
      password : process.env.DATABASE_PASS,
      database : process.env.DATABASE_NAME,
      port     : process.env.DATABASE_PORT,
      ssl      : false
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  },

  development : {
    client: 'postgresql',
    connection: {
      host      : '127.0.0.01',
      user      : process.env.TODO_DB_USER,
      password  : process.env.TODO_DB_PW,
      database  : process.env.DATABASE_URL
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL + '?ssl=true',
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations'
    }
  }
};
