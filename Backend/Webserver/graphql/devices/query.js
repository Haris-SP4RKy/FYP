const db = require('../../../KafkaEgress/db/pg/db');

module.exports.deviceQuery = {
    devicebyId: async (parent, args, info, context) => {

        if(!info.Authenticated){
            throw new GraphQLError('Errors', { msg: 'Not Authenticated' });
        }
        const [device] = await db('devices').where({ "id": args.id ,"sensor_type": args.sensor_type});
        const [group] =await db('groups').where({ "sensor_type": args.sensor_type,"device_id": args.id});
        return {...device,...{group:group}}
    },
    getonlinedevices:async (parent, args, info, context)=>{
        // if(!info.Authenticated){
        //     throw new GraphQLError('Errors', { msg: 'Not Authenticated' });
        // }
        // const devices = await db.raw(`select d.id, d.sensor_type, case when available is null then 0 else available end from devices d left join 
        //     (select device_id, sensor_type, count(distinct (sd.device_id)) filter (where sd.created_at between now()- interval '100 mins' and now()) as available from sensor_data sd
        //     group by device_id , sensor_type ) as t
        //     on t.device_id = d.id and d.sensor_type = t.sensor_type`)
        const devices = await db.from('devices as d').select("d.id", "d.sensor_type","case when available is null then 0 else available end" ).leftJoin("")
        console.log(devices)
        

    }
}
/**
 * {
 * "total":100,
 * "onlinedevices":50,
 * devices:[ devices]
 * 
 * }
 */


// select d.id, d.sensor_type, case when available is null then 0 else available end from devices d left join 
// (select device_id, sensor_type, count(distinct (sd.device_id)) filter (where sd.created_at between now()- interval '10 mins' and now()) as available from sensor_data sd
// group by device_id , sensor_type ) as t
// on t.device_id = d.id and d.sensor_type = t.sensor_type

// select device_id, sensor_type, count(distinct (sd.device_id)) filter (where sd.created_at between now()- interval '10 mins' and now()) as available from sensor_data sd
// group by device_id , sensor_type