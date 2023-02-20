const db = require('../../KafkaEgress/db/pg/db');
const {getAnalytics} = require('../services/getanalyticsbyarea');


module.exports.recommendations=async(req,res)=>{

    try {

        const result = await db.raw(` SELECT id, name,
        TRUNC(ST_Distance(ST_GeomFromText('POINT( ${req.body.long} ${req.body.lat})',4326), coordinates  )*100000)::integer as distance             
 FROM devices_group S
 ORDER BY 
         coordinates  <-> ST_GeomFromText('POINT(${req.body.long} ${req.body.lat})', 4326)
 LIMIT 1`)
   
    const result2= await getAnalytics(1,result.rows[0].id)
    return res.status(200).json(result2);    
    } catch (error) {
        return res.status(400);
    }
};