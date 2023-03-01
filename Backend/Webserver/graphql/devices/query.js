const db = require('../../db/pg/db');
const { GraphQLError } = require('graphql');
const { getAnalytics } = require('../../services/getanalytics');
const { getGraph } = require('../../services/getgraph');
const {Get_Humidity}= require('../../services/humidity');
const {Get_Temperature}= require('../../services/temperature');
const {Get_Carbondioxide}= require('../../services/carbondioxide');
const {Get_Carbonmonoxide}= require('../../services/carbonmonoxide');
const {Get_Methane}= require('../../services/methane');
const {filters}= require('../../services/filters');
const { flatten, unflatten } = require('flat');
// const redis = require('../../db/redis/redis');
const _ = require('lodash')


module.exports.deviceQuery = {
	devicebyId: async (parent, args, info, context) => {
		if(!info.Authenticated){
		    throw new Error('Not Authenticated' );
		}
		// const [device] = await db('devices').where({ "devices.id": args.id ,"devices.sensor_type": args.sensor_type}).join('groups',{'groups.device_id':args.id,'groups.sensor_type':args.sensor_type});
		//const [group] =await db('groups').where({ "sensor_type": args.sensor_type,"device_id": args.id}).join('devices_group','group_id','groups.id');
		const [device] = await db
			.select(
				'devices.id',
				'devices.sensor_type',
				'groups.device_id',
				'devices_group.name',
				'devices_group.coordinates',
				'devices_group.latitude',
				'devices_group.longitude'
			)
			.from('groups')
			.innerJoin('devices', 'devices.id', 'groups.device_id')
			.innerJoin('devices_group', 'devices_group.id', 'groups.group_id')
			.where({
				'devices.sensor_type': args.sensor_type,
				'devices.id': args.id,
				'groups.sensor_type': args.sensor_type
			});
        const [lastOnline] = await db.select('created_at as Last_heart_beat','data').from('sensor_data').where({'sensor_type': args.sensor_type,
        'device_id': args.id
        }).orderBy('created_at','desc').limit(1)
		return {
			id: device.id,
			sensor_type: device.sensor_type,
			group: {
				name: device.name,
				coordinates: device.coordinates,
				long: device.longitude,
				lat: device.latitude,
                lastheartbeat:lastOnline
			}
		};
	},
	getonlinedevices: async (parent, args, info, context) => {
		if(!info.Authenticated){
		    throw new Error('Not Authenticated' );
		}
		try {
			const { rows } = await db.raw(`WITH active_status as (
                select device_id, sensor_type, count(distinct (sd.device_id)) filter (where sd.created_at between now()- interval '5 mins' and now()) as available from sensor_data sd
                group by device_id , sensor_type
                ),
                active_sensors as (
                select d.id, d.sensor_type, case when available is null then 0 else available end from devices d left join active_status
                on active_status.device_id = d.id and d.sensor_type = active_status.sensor_type
                )
                
                SELECT SUM(active_sensors.available) as online_devices,  COUNT(active_sensors) as total_devices  FROM active_sensors;
                `);
			// const devices = await db.from('devices as d').select("d.id", "d.sensor_type","case when available is null then 0 else available end" ).leftJoin("")
			//console.log(rows)
			return rows.pop();
		} catch (error) {
			console.error(error);
			throw new Error('Internal error: ');
		}
	},
	getdevicesstatus: async (parent, args, info, context) => {
		if(!info.Authenticated){
		    throw new Error('Not Authenticated' );
		}
		try {
			const { rows } = await db.raw(`
            WITH active_status as (
            select device_id, sensor_type, count(distinct (sd.device_id)) filter (where sd.created_at between now()- interval '5 mins' and now()) as available from sensor_data sd
            group by device_id , sensor_type
            )
            select d.id, d.sensor_type, case when available is null then 0 else available end from devices d left join active_status
            on active_status.device_id = d.id and d.sensor_type = active_status.sensor_type
            `);
			// const devices = await db.from('devices as d').select("d.id", "d.sensor_type","case when available is null then 0 else available end" ).leftJoin("")
			//console.log(rows)
			return rows;
		} catch (error) {
			console.error(error);
			throw new Error('Internal server error: ');
		}
	},
	getgraph: async (parent, args, info, context) => {
		if(!info.Authenticated){
		    throw new Error('Not Authenticated' );
		}
		try {
            // const client = redis.getClient();
            // let result = await client.hgetall('getgraph:'+args.sensor_type)
            // if(!_.isEmpty(result)) return unflatten(result)
            const sensors=['humidity','temperature','carbondioxide','carbonmonoxide','methane']
            if(!sensors.includes(args.sensor_type)){
                throw new Error('Wrong Input')
            }

			const result = await getGraph(args.sensor_type);
            // const data = flatten(result)
            // await client.hset('getgraph:'+args.sensor_type,data)
            // await client.expire('getgraph:'+args.sensor_type,120)
			return result;
		} catch (error) {
			throw new Error(error);
		}
	},
	getdashboard: async (parent, args, info, context) => {
		try {
			if(!info.Authenticated){
				throw new Error('Not Authenticated' );
			}
            // const client = redis.getClient();
            // let result = await client.hgetall('getdashboard:'+args.by)
            // if(!_.isEmpty(result)) return unflatten(result)
			const result = await getAnalytics(args.by);
            // const data = flatten(result)
            // await client.hset('getdashboard:'+args.by,data)
            // await client.expire('getdashboard:'+args.by,120)
			return result;
		} catch (error) {
			throw new Error(error);
		}
	},
    gettemperature: async (parent, args, info, context) => {
		if(!info.Authenticated){
		    throw new Error('Not Authenticated' );
		}
		try {
            // const client = redis.getClient();
            // let result = await client.hgetall('gettemperature:'+args.by)
            // if(!_.isEmpty(result)) return unflatten(result)
		    const result = await Get_Temperature(args.by);
            // const data = flatten(result)
            // await client.hset('gettemperature:'+args.by,data)
            // await client.expire('gettemperature:'+args.by,120)
			return result;
		} catch (error) {
			throw new Error(error);
		}
	},
    gethumidity: async (parent, args, info, context) => {
		if(!info.Authenticated){
		    throw new Error('Not Authenticated' );
		}
		try {
            // const client = redis.getClient();
            // let result = await client.hgetall('gethumidity:'+args.by)
            // if(!_.isEmpty(result)) return unflatten(result)
			const result = await Get_Humidity(args.by);
            // const data = flatten(result)
            // await client.hset('gethumidity:'+args.by,data)
            // await client.expire('gethumidity:'+args.by,120)
			return result;
		} catch (error) {
			throw new Error(error);
		}
	},
    getcarbonmonoxide: async (parent, args, info, context) => {
		if(!info.Authenticated){
		    throw new Error('Not Authenticated' );
		}
		try {
          
            // const client = redis.getClient();
            // let result = await client.hgetall('getcarbonmonoxide:'+args.by)
            // if(!_.isEmpty(result)) return unflatten(result)
			const result = await Get_Carbonmonoxide(args.by);
            // const data = flatten(result)
            // await client.hset('getcarbonmonoxide:'+args.by,data)
            // await client.expire('getcarbonmonoxide:'+args.by,120)
			return result;
		} catch (error) {
			throw new Error(error);
		}
	},
    getcarbondioxide: async (parent, args, info, context) => {
		if(!info.Authenticated){
		    throw new Error('Not Authenticated' );
		}
		try {
          
            // const client = redis.getClient();
            // let result = await client.hgetall('getcarbondioxide:'+args.by)
            // if(!_.isEmpty(result)) return unflatten(result)
			const result = await Get_Carbondioxide(args.by);
            // const data = flatten(result)
            // await client.hset('getcarbondioxide:'+args.by,data)
            // await client.expire('getcarbondioxide:'+args.by,120)
			return result;
		} catch (error) {
			throw new Error(error);
		}
	},
    getmethane: async (parent, args, info, context) => {
		if(!info.Authenticated){
		    throw new Error('Not Authenticated' );
		}
		try {
          
            // const client = redis.getClient();
            // let result = await client.hgetall('getmethane:'+args.by)
            // if(!_.isEmpty(result)) return unflatten(result)
			result = await Get_Methane(args.by);
            const data = flatten(result)
            // await client.hset('getmethane:'+args.by,data)
            // await client.expire('getmethane:'+args.by,120)
			return result;
		} catch (error) {
			throw new Error(error);
		}
	},
	getfilterss: async (parent, args, info, context) =>{
		if(!info.Authenticated){
		    throw new Error('Not Authenticated' );
		}

		try {
          
            // const client = redis.getClient();
            // let result = await client.hgetall('getmethane:'+args.by)
            // if(!_.isEmpty(result)) return unflatten(result)
			result = await filters(args.area,args.sensor);
            // const data = flatten(result)
            // await client.hset('getmethane:'+args.by,data)
            // await client.expire('getmethane:'+args.by,120)
			return result;
		} catch (error) {
			throw new Error(error);
		}
	}
};
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
