// Update with your config settings.
const config = require('../../config');

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {


  development: {
    client: 'postgresql',
    connection: {
      host: config.POSTGRE_HOST,
      port: config.POSTGRE_PORT,
      database: config.POSTGRE_DB,
      user: config.POSTGRE_USERNAME,
      password: config.POSTGRE_PASSWORD
    },
    pool: {
      min: 1,
      max: 10
    },
    migrations: {
      directory: './migrations',
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: 'growgreen-api.harisaqeel.com',
      port: '5432',
      user: 'postgres',
      password: 'postgres',
      database: 'postgres'
    },
    pool: {
      min: 1,
      max: 10
    },
    migrations: {
      directory: './migrations',

    }
  }

};
