const db = require('../../KafkaEgress/db/pg/db');
const {getAnalytics} = require('../services/getanalyticsbyarea');
const {downloadascsv}=require('../services/CSV')
const { AsyncParser } = require('@json2csv/node');
// import { AsyncParser } from '@json2csv/node';



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



module.exports.downloadascsv = async (req,res)=>{
    try {
        const result= await downloadascsv(req.body.sensor_type,req.body.by,req.body.area)
        const parser = new AsyncParser();
        const csv = await parser.parse(result).promise();
        res.header('Content-Type', 'text/csv');
        res.attachment('data.csv');
        return res.send(csv);    

        
    } catch (error) {
        console.log(error)
        return res.status(400);

    }
}