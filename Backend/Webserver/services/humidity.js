const Elasticsearch = require('../lib/elasticsearch');
const _ = require('lodash');

module.exports.Get_Humidity = async (optionsBy) => {
	try {
		const byMap = {
			1: 'now-1d/d',
			2: 'now-7d/d',
			3: 'now-30d/d',
			4: 'now-90d/d'
		};
		const by = byMap[optionsBy] || byMap[1];
		const queryMap = {
			median: {
				query: {
					bool: {
						must: [
							{ term: { sensor_type: 'humidity' } },
							{ range: { '@timestamp': { gte: by, lte: 'now' } } }
						]
					}
				},
				aggregations: {
					count_documents: { value_count: { field: 'data.value' } },
					avg_price: { percentiles: { field: 'data.value', percents: [50] } }
				}
			},
			mediangraph: {
				query: {
					bool: {
						must: [
							{
								term: {
									sensor_type: 'humidity'
								}
							},
							{
								range: {
									created_at: {
										gte: by,
										lte: 'now'
									}
								}
							}
						]
					}
				},
				aggregations: {
					group_by_month: {
						date_histogram: {
							field: 'created_at',
							calendar_interval: 'day',
							missing: '0',
							min_doc_count: 0,
							extended_bounds: {
								min: by,
								max: 'now'
							}
						},
						aggregations: {
							avg_percentage: {
								percentiles: { field: 'data.value', percents: [50] }
							}
						}
					}
				}
			},
			average: {
				query: {
					bool: {
						must: [
							{ term: { sensor_type: 'humidity' } },
							{ range: { '@timestamp': { gte: by, lte: 'now' } } }
						]
					}
				},
				aggregations: {
					avg_price: {
						avg: {
							field: 'data.value'
						}
					}
				}
			},
			averagegrapph: {
				query: {
					bool: {
						must: [
							{
								term: {
									sensor_type: 'humidity'
								}
							},
							{
								range: {
									created_at: {
										gte: by,
										lte: 'now'
									}
								}
							}
						]
					}
				},
				aggregations: {
					group_by_month: {
						date_histogram: {
							field: 'created_at',
							calendar_interval: 'day',
							missing: '0',
							min_doc_count: 0,
							extended_bounds: {
								min: by,
								max: 'now'
							}
						},
						aggregations: {
							avg_percentage: {
								avg: {
									field: 'data.value'
								}
							}
						}
					}
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
		throw error;
	}
};
