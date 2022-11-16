const config = require('./config');
// const MapDevicesService = require('./services/mapdevices.services');
// const FCMUpdateService = require('./services/fcmupdate.service');
const KafkaJs = require('./lib/Kafkajs');
const Kafkaegress = require('./services/insertIntoDb')

(async () => {
	await KafkaJs.consume(config.KAFKA_CONSUME_TOPIC, Kafkaegress.Kafkaegress);
	console.log('DB Conumer Service Started');
})();
