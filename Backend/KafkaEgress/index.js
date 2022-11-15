const config = require('./config');
// const MapDevicesService = require('./services/mapdevices.services');
// const FCMUpdateService = require('./services/fcmupdate.service');
const KafkaJs = require('./lib/Kafkajs');


(async () => {
	await KafkaJs.consume(config.KAFKA_CONSUME, MapDevicesService.consume);
	console.log('DB Conumer Service Started');
})();
