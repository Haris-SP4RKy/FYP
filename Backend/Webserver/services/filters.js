const db = require('../db/pg/db');

const { getAnalyticsByAreaAndSensor } = require('./analyticsbyareaandsensor');
module.exports.filters = async (area, sensor) => {
	try {
		const analytics = await getAnalyticsByAreaAndSensor(2, area, sensor);
		const devices = await db
			.select('*')
			.from('groups')
			.where({ group_id: area });
		if (devices.length === 0) throw new Error('No devices in this area');
		// console.log(devices)
		const res = await Promise.allSettled(
			devices.map(async (o) => {
				return await db
					.select('created_at as Last_heart_beat', 'data')
					.from('sensor_data')
					.where({ sensor_type: o.sensor_type, device_id: o.device_id })
					.orderBy('created_at', 'desc')
					.limit(1);
			})
		);

		return {
			analytics,
			devices: res.map((o) => o.value.pop())
		};
	} catch (error) {
		throw error;
	}
};
