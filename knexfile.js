'use strict'


require('dotenv').config();

module.exports = (SERVER_PORT) = {

  development: {
    client: 'postgresql',
    connection: (SERVER_PORT === 8080) ? {
      host     : process.env.DATABASE_HOST,
      user     : process.env.DATABASE_USER,
      password : process.env.DATABASE_PASS,
      database : process.env.DATABASE_NAME,
      port     : process.env.DATABASE_PORT,
      ssl      : false
    } : process.env.DATABASE_URL,
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
