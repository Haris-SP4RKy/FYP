const _ = require('lodash');


module.exports.KAFKA_TOPIC = _.get(process.env, 'KAFKA_TOPIC', 'Sensor_data')
module.exports.PORT = _.get(process.env, 'PORT', '3000');
module.exports.KAFKA_URL = _.get(process.env, 'KAFKA_URL', '127.0.0.1:9093')