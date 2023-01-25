const config = require('./config');
// const MapDevicesService = require('./services/mapdevices.services');
// const FCMUpdateService = require('./services/fcmupdate.service');
const KafkaJs = require('./lib/Kafkajs');
const { kafkaegress } = require("./services/insertIntoDb");

	(async () => {
		await KafkaJs.consume(config.KAFKA_CONSUME_TOPIC, kafkaegress);
		console.log('Kafka Egress Service Started');
	})();
