const Redis = require('ioredis');
const config = require('../../config');

const client = new Redis({
	host: config.REDIS_HOST,
	port: config.REDIS_PORT
});

module.exports = {
	/**
	* Get the application's connected Redis client instance.
	*
	* @returns {Object} - a connected node_redis client instance.
	*/
	getClient: () => client,
};
