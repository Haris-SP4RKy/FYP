const services = require("../services");
const config = require("../config");
const kafka = require("../services/kafkaProducer")
module.exports.produceToKafka = async (req, res) => {
  try {
    const result = await kafka.produce(
      config.KAFKA_TOPIC,
      req.body
    );
    

    return res.status(200).json({msg:"SUCCESS"});
  } catch (error) {
    return res
      .status(500)
      .json({
        msg: `Unable to produce message, due to error "${error.message}"`,
      });
  }
};
