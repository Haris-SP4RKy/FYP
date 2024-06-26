const Elasticsearch = require('../lib/elasticsearch');
const _=require('lodash');

module.exports.getAnalytics = async (optionsBy, area) => {
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
				query: {
					bool: {
						must: [
							{ term: { sensor_type: 'carbondioxide' } },
							{ term: { group_id: area } },
							{ range: { '@timestamp': { gte: by, lte: 'now' } } }
						]
					}
				},
				aggregations: {
                    avg_ppm:{percentiles: { field: 'data.ppm', percents: [50] }},
					avg_price: {
						percentiles: { field: 'data.percentage', percents: [50] }
					}
				}
			},
			temperature: {
				query: {
					bool: {
						must: [
							{ term: { sensor_type: 'temperature' } },
                            { term: { group_id: area } },
							{ range: { '@timestamp': { gte: by, lte: 'now' } } }
						]
					}
				},
				aggregations: {
					avg_price: { percentiles: { field: 'data.value', percents: [50] } }
				}
			},
			carbonmonoxide: {
				query: {
					bool: {
						must: [
							{ term: { sensor_type: 'carbonmonoxide' } },
                            { term: { group_id: area } },
							{ range: { '@timestamp': { gte: by, lte: 'now' } } }
						]
					}
				},
				aggregations: {
                    avg_ppm:{percentiles: { field: 'data.ppm', percents: [50] }},
					avg_price: {
						percentiles: { field: 'data.percentage', percents: [50] }
					}
				}
			},
			methane: {
				query: {
					bool: {
						must: [
							{ term: { sensor_type: 'methane' } },
                            { term: { group_id: area } },
							{ range: { '@timestamp': { gte: by, lte: 'now' } } }
						]
					}
				},
				aggregations: {
                    avg_ppm:{percentiles: { field: 'data.ppm', percents: [50] }},
					avg_price: {
                      
						percentiles: { field: 'data.percentage', percents: [50] }
					}
				}
			},
			humidity: {
				query: {
					bool: {
						must: [
							{ term: { sensor_type: 'humidity' } },
                            { term: { group_id: area } },
							{ range: { '@timestamp': { gte: by, lte: 'now' } } }
						]
					}
				},
				aggregations: {
					avg_price: { percentiles: { field: 'data.value', percents: [50] } }
				}
			}
		};
		const elk = new Elasticsearch();
		const queries = [];
		const keys = [];
		for (const [key, value] of Object.entries(queryMap)) {
			keys.push(key);
			queries.push({
				index: 'sensor_data',
				size: 0,
				filter_path: 'aggregations',
				body: value
			});
		}
		const res = await Promise.allSettled(queries.map((o) => elk.search(o)));
		return _.zipObject(
			keys,
			res.map((o) => o.value)
		);
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
};
