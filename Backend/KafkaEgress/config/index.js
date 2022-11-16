const _ = require('lodash');


module.exports.KAFKA_TOPIC =_.get(process.env,'KAFKA_TOPIC','test')
module.exports.PORT = _.get(process.env, 'PORT', '3000');
module.exports.KAFKA_URL=_.get(process.env,'KAFKA_URL','127.0.0.1:9093')
module.exports.KAFKA_CONSUME_TOPIC =_.get(process.env,'KAFKA_CONSUME_TOPIC','Sensor_data')
module.exports.KAFKA_PRODUCE_TOPIC =_.get(process.env,'KAFKA_PRODUCE_TOPIC','final_data')
