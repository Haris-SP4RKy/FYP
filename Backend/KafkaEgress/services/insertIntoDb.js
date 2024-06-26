const db = require("../db/pg/db");
const KafkaJs = require("../lib/Kafkajs");
const config = require("../config");

/**
 * //
 * message={
 * device_id:uuid
 * sensor_type:string
 * data:obj
 *
 * }
 * @param {*} message
 */
const kafkaegress = async (topic, message) => {
  try {
    if (!message.device_id || !message.sensor_type || !message.data) {
      throw new Error("Invalid message");
    }
    const data = {
      device_id: message.device_id,
      sensor_type: message.sensor_type,
      data: message.data,
      created_at: message.created_at,
      updated_at: message.updated_at,
    };
    const recordId = await db("sensor_data").insert(data).returning("id");
    // console.log(data,recordId)

    // const groupName = await db.select('name','id','longitude','latitude').from('devices_group',function(){this.select('group_id').from('groups').where({ "device_id":message.device_id,
    // "sensor_type":message.sensor_type,}).as('t1')}).where({ "id":"groups.group_id"})
    const temp = await db("devices_group")
      .select(
        "devices_group.name as group",
        "devices_group.coordinates as coordinates",
        "devices_group.id as group_id",
        "devices_group.longitude",
        "devices_group.latitude"
      )
      .where(
        "id",
        "=",
        db("groups").select("group_id").where({
          device_id: message.device_id,
          sensor_type: message.sensor_type,
        })
      );

    const final_data = { ...data, ...temp[0], ...recordId[0] };
    // console.log(recordId,temp)
    console.log(final_data);
    await KafkaJs.sendToTopic(config.KAFKA_PRODUCE_TOPIC, final_data);
  } catch (error) {
    console.log(message, error);
    throw error;
  }
};

process.on("uncaughtException", (e) => {
  console.log("uncaughtException", e);
});
process.on("unhandledRejection", (e) => {
  console.log("unhandledRejection", e);
});

// kafkaegress('sensor_data', { "device_id": "f2e388e7-7a39-4871-b7c6-c5e663505dfe", "sensor_type": "carbondioxide", "data": { "value": 10 } })
module.exports = {
  kafkaegress,
};
