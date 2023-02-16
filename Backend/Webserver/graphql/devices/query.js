const db = require('../../../KafkaEgress/db/pg/db');
const { GraphQLError } = require('graphql');
const { getAnalytics } = require('../../services/getanalytics');
const { getGraph } = require('../../services/getgraph');

module.exports.deviceQuery = {
	devicebyId: async (parent, args, info, context) => {
		// if(!info.Authenticated){
		//     throw new Error('Not Authenticated' );
		// }
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

		return {
			id: device.id,
			sensor_type: device.sensor_type,
			group: {
				name: device.name,
				coordinates: device.coordinates,
				long: device.longitude,
				lat: device.latitude
			}
		};
	},
	getonlinedevices: async (parent, args, info, context) => {
		// if(!info.Authenticated){
		//     throw new Error('Not Authenticated' );
		// }
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
		// if(!info.Authenticated){
		//     throw new Error('Not Authenticated' );
		// }
		try {
			const { rows } = await db.raw(`
            WITH active_status as (
            select device_id, sensor_type, count(distinct (sd.device_id)) filter (where sd.created_at between now()- interval '20 mins' and now()) as available from sensor_data sd
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
		try {
            const sensors=['humidity','temperature','carbondioxide','carbonmonoxide','methane']
            if(!sensors.includes(args.sensor_type)){
                throw new Error('Wrong Input')
            }

			const result = await getGraph(args.sensor_type);
			return result;
		} catch (error) {
			throw new Error(error);
		}
	},
	getdashboard: async (parent, args, info, context) => {
		try {
			const result = await getAnalytics(args.by);
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
