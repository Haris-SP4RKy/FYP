
const _ = require('lodash');

module.exports.PORT = _.get(process.env, 'PORT', '3000');

module.exports.TOPIC_REQUEST_QUEUE = _.get(process.env, 'TOPIC_REQUEST_QUEUE', 'notification-push-request');
module.exports.TOPIC_RESPONSE_QUEUE = _.get(process.env, 'TOPIC_RESPONSE_QUEUE', 'notification-push-response');
module.exports.DB_REQUEST_QUEUE = _.get(process.env, 'DB_REQUEST_QUEUE', 'notification-db-request');

module.exports.RABBIT_MQ_HOSTNAME = _.get(process.env, 'RABBIT_MQ_HOSTNAME', 'localhost');
module.exports.RABBIT_MQ_PORT = _.get(process.env, 'RABBIT_MQ_PORT', '5672');
module.exports.RABBIT_MQ_USERNAME = _.get(process.env, 'RABBIT_MQ_USERNAME', 'rabittmq');
module.exports.RABBIT_MQ_PASSWORD = _.get(process.env, 'RABBIT_MQ_PASSWORD', 'rabittmq');
module.exports.SECRET_KEY = _.get(process.env, 'SECRET_KEY', 'saddd332rdsf32r2344r4fsfsf23r43');
module.exports.POSTGRE_HOST = _.get(process.env, 'POSTGRE_HOST', '127.0.0.1');
module.exports.POSTGRE_DB = _.get(process.env, 'POSTGRE_DB', 'GOGREEN');
module.exports.POSTGRE_PORT = _.get(process.env, 'POSTGRE_PORT', '5432');
module.exports.POSTGRE_USERNAME = _.get(process.env, 'POSTGRE_USERNAME', 'postgres');
module.exports.POSTGRE_PASSWORD = _.get(process.env, 'POSTGRE_PASSWORD', 'postgres');

module.exports.REDIS_HOST = _.get(process.env, 'REDIS_HOST', 'localhost');
module.exports.REDIS_PORT = _.get(process.env, 'REDIS_PORT', '6379');

module.exports.KAFKA_TOPIC =_.get(process.env,'KAFKA_TOPIC','test');

module.exports.ELASTIC_URL = _.get(process.env, 'ELASTIC_HOST','http://localhost:9200');
module.exports.ELASTIC_USERNAME = _.get(process.env, 'ELASTIC_USERNAME', 'elastic');
module.exports.ELASTIC_PASSWORD = _.get(process.env, 'ELASTIC_PASSWORD', 'changeme');

