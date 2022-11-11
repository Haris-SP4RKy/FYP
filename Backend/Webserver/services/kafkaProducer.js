const { Kafka } = require('kafkajs');
const config = require('../config');
const kafka = new Kafka({
	clientId: '1',
	brokers: ['kafka1:9092']
});
const producer = kafka.producer();

module.exports.produce = async (topic, message) => {
	await producer.connect();
	await producer.send({
		topic: topic,
		messages: message
	});

	await producer.disconnect();
};
