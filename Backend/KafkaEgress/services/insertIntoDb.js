const db = require('../db/pg/db');
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
 const kafkaegress = async (message) => {
    const data={
        "device_id":message.device_id,
        "sensor_type":message.sensor_type,
        "data":message.data
    }
    const recordId = await db('sensor_data').insert(data).returning('id')
    const groupName = await db.select('u.name', 'u.longitude', 'u.latitude').from('devices_group').where({ "device_id":message.device_id,
    "sensor_type":message.sensor_type,})
    console.log(recordId,groupName)
}

module.exports = {
    kafkaegress
}