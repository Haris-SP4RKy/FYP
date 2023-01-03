const _ = require('lodash');


module.exports.KAFKA_TOPIC =_.get(process.env,'KAFKA_TOPIC','test')
module.exports.PORT = _.get(process.env, 'PORT', '3000');
module.exports.KAFKA_URL=_.get(process.env,'KAFKA_URL','127.0.0.1:9093')
module.exports.KAFKA_CONSUME_TOPIC =_.get(process.env,'KAFKA_CONSUME_TOPIC','Sensor_data')
module.exports.KAFKA_PRODUCE_TOPIC =_.get(process.env,'KAFKA_PRODUCE_TOPIC','final_data')
module.exports.POSTGRE_HOST = _.get(process.env, 'POSTGRE_HOST', '127.0.0.1');
module.exports.POSTGRE_DB = _.get(process.env, 'POSTGRE_DB', 'postgres');
module.exports.POSTGRE_PORT = _.get(process.env, 'POSTGRE_PORT', '5432');
module.exports.POSTGRE_USERNAME = _.get(process.env, 'POSTGRE_USERNAME', 'postgres');
module.exports.POSTGRE_PASSWORD = _.get(process.env, 'POSTGRE_PASSWORD', 'postgres');