const Elasticsearch = require('../lib/elasticsearch');

module.exports.downloadascsv = async (sensor_type, optionsBy, area) => {
	try {
		const byMap = {
			1: 'now-1d/d',
			2: 'now-7d/d',
			3: 'now-30d/d',
			4: 'now-90d/d'
		};
		const by = byMap[optionsBy] || byMap[1];
		const queryMap = {
			carbondioxide: {
				_source: [
					'data.value',
					'data.percenage',
					'data.ppm',
					'group_id',
					'sensor_type',
					'group',
					'created_at',
					'latitude',
					'longitude'
				],
				query: {
					bool: {
						must: [
							{ term: { sensor_type: 'carbondioxide' } },
							{ term: { group_id: area } },
							{ range: { created_at: { gte: by, lte: 'now' } } }
						]
					}
				}
			},
			temperature: {
				fields: [
					'data.value',
					'data.percenage',
					'data.ppm',
					'group_id',
					'sensor_type',
					'group',
					'created_at',
					'latitude',
					'longitude'
				],
				_source: false,
				query: {
					bool: {
						must: [
							{ term: { sensor_type: 'temperature' } },
							{ term: { group_id: area } },
							{ range: { created_at: { gte: by, lte: 'now' } } }
						]
					}
				}
			},
			carbonmonoxide: {
				_source: [
					'data.value',
					'data.percenage',
					'data.ppm',
					'group_id',
					'sensor_type',
					'group',
					'created_at',
					'latitude',
					'longitude'
				],
				query: {
					bool: {
						must: [
							{ term: { sensor_type: 'carbonmonoxide' } },
							{ term: { group_id: area } },
							{ range: { created_at: { gte: by, lte: 'now' } } }
						]
					}
				}
			},
			methane: {
				_source: [
					'data.value',
					'data.percenage',
					'data.ppm',
					'group_id',
					'sensor_type',
					'group',
					'created_at',
					'latitude',
					'longitude'
				],
				query: {
					bool: {
						must: [
							{ term: { sensor_type: 'methane' } },
							{ term: { group_id: area } },
							{ range: { created_at: { gte: by, lte: 'now' } } }
						]
					}
				}
			},
			humidity: {
				_source: [
					'data.value',
					'data.percenage',
					'data.ppm',
					'group_id',
					'sensor_type',
					'group',
					'created_at',
					'latitude',
					'longitude'
				],
				query: {
					bool: {
						must: [
							{ term: { sensor_type: 'humidity' } },
							{ term: { group_id: area } },
							{ range: { created_at: { gte: by, lte: 'now' } } }
						]
					}
				}
			},
			allsensors: {
				_source: [
					'data.value',
					'data.percenage',
					'data.ppm',
					'group_id',
					'sensor_type',
					'group',
					'created_at',
					'latitude',
					'longitude'
				],
				query: {
					bool: {
						must: [
							{ term: { group_id: area } },
							{ range: { created_at: { gte: by, lte: 'now' } } }
						]
					}
				}
			},
			allareas: {
				_source: [
					'data.value',
					'data.percenage',
					'data.ppm',
					'group_id',
					'sensor_type',
					'group',
					'created_at',
					'latitude',
					'longitude'
				],
				query: {
					bool: {
						must: [{ range: { '@timestamp': { gte: by, lte: 'now' } } }]
					}
				}
			}
		};

		// const result=[]
		const elk = new Elasticsearch();
		// const result= await elk.search({
		//     index: 'sensor_data',
		//     size: 10000,
		//     body: queryMap[sensor_type]
		// });
		// const results = result.hits.hits.map(hit => hit._source);
		const results = await elk.search({
			index: 'sensor_data',
			scroll: '1m',
			size: 5000,
			body: queryMap[sensor_type]
		});
		let hits = results.hits.hits;
		const result = hits.map((hit) => hit._source);
		// const result = [];
		await Promise.all(
			hits.map(async (hit) => {
				const temp = await elk.scroll({
					scroll: '1m',
					scroll_id: results._scroll_id
					//   size:5000,
					//   body:queryMap[sensor_type]
				});
				const _hits = temp.hits.hits;
				// console.log(hits2)
				_hits.forEach((hit) => {
					// Do something with each hit, such as saving it to an array
					result.push(hit._source);
					// console.log(result.length);
				});
			})
		);
		// while (hits.length) {
		//     const temp = await elk.scroll({
		//       scroll: '1m',
		//       scroll_id: results._scroll_id,
		//     //   size:5000,
		//     //   body:queryMap[sensor_type]
		//     });
		//     hits = temp.hits.hits;
		//     // console.log(hits2)
		//     Promise.all( hits.forEach(hit => {
		//       // Do something with each hit, such as saving it to an array
		//       result.push(hit._source)
		//       console.log(hit);
		//     }))

		//   }

		return result;
	} catch (error) {
		throw error;
	}
};
