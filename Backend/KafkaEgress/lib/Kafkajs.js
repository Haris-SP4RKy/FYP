const config = require("../config");
const KAFKA_NAME = "default";
const KAFKA = new Map();
const { Kafka } = require("kafkajs");

class KafkaJs {
  static async init() {
    try {
      if (!KAFKA.has(KAFKA_NAME)) {
        const connection = new Kafka({
          clientId: "KafkaIngestor",
          brokers: [config.KAFKA_URL],
        });
        KAFKA.set(KAFKA_NAME, { connection });
      }
    } catch (e) {
      console.error("[KAFKA]", e.message);
      return setTimeout(() => KafkaJs.init(), 7000);
    }

    return KAFKA.get(KAFKA_NAME);
  }

  static async sendToTopic(Topic, message, options = {}) {
    try {
      const { connection } = await KafkaJs.get();
      const producer = connection.producer();
      await producer.connect();

      await producer.send({
        topic: Topic,
        messages: [{ value: JSON.stringify(message) }],
      });
      await producer.disconnect();
    } catch (error) {
      throw new Error(` Error thrown at Kafka producer, "${error.message}".`);
    }
  }

  static async consume(Topic, cb) {
    const { connection } = await KafkaJs.get();
    const consumer = connection.consumer({ groupId: 'Kafka-egress' })
    await consumer.connect()
    await consumer.subscribe({ topic: Topic, fromBeginning: true })

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        // console.log({
        //   value: message.value.toString(),
        // })
        cb(Topic, JSON.parse(message.value.toString()))
      },
    })

  }

  //   static async close() {
  //     const mQ = RabbitMQMap.get(RABBIT_MQ_NAME);
  //     if (mQ) {
  //       await mQ.connection.close();
  //     }
  //   }

  // static async closeAll() {
  // 	KAFKA.forEach(async (v, k) => {
  // 		await v.connection.close();
  // 	});
  // }

  static async get() {
    let kf = KAFKA.get(KAFKA_NAME);

    if (!kf) {
      kf = await KafkaJs.init();
    }
    return kf;
  }
}

module.exports = KafkaJs;
