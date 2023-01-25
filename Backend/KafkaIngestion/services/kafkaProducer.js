const { Kafka } = require("kafkajs");
const config = require("../config");
const kafka = new Kafka({
  clientId: 'KafkaIngestor',
  brokers: [config.KAFKA_URL],
})

module.exports.produce = async (Topic, message) => {

  console.log({
    topic: Topic,
    messages: [
      { value: message },
    ],
  })
  try {


    const producer = kafka.producer()

    await producer.connect()
    await producer.send({
      topic: Topic,
      messages: [
        { value: JSON.stringify(message) },
      ],
    })

    await producer.disconnect()
    return true
  } catch (error) {
    throw new Error(` Error thrown at Kafka producer, "${error.message}".`);
  }
};
