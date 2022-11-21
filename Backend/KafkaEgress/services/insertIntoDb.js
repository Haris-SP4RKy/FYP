const db  = require('../db/pg/db');
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
module.exports.Kafkaegress=async (message)=>{
    const recordId = await db('sensor_data').insert(message).returning('id')
const groupName=await db.select('u.name','u.longitude','u.latitude').from('devices_group')
}