const Elasticsearch = require('../lib/elasticsearch');
const _ = require('lodash');


module.exports.Get_Carbonmonoxide = async (optionsBy) => {
	try {
		const byMap = {
			1: 'now-1d/d',
			2: 'now-7d/d',
			3: 'now-30d/d',
			4: 'now-90d/d'
		};
		const by = byMap[optionsBy] || byMap[1];
		const queryMap = {
			dayintervals: {
				query: {
					bool: {
						must: [
							{
								term: {
									sensor_type: 'carbonmonoxide'
								}
							},
							{
								range: {
									created_at: {
										gte: by, // last 24 hours
										lte: 'now'
									}
								}
							}
						]
					}
				},
				aggs: {
					group_by_time_of_day: {
						range: {
							field: 'created_at',
							ranges: [
								{
									from: 'now-1d/d', // last 24 hours
									to: 'now-1d/d+6h' // morning (6am - 12pm)
								},
								{
									from: 'now-1d/d+6h', // morning (6am - 12pm)
									to: 'now-1d/d+12h' // afternoon (12pm - 6pm)
								},
								{
									from: 'now-1d/d+12h', // afternoon (12pm - 6pm)
									to: 'now-1d/d+18h' // evening (6pm - 12am)
								},
								{
									from: 'now-1d/d+18h', // evening (6pm - 12am)
									to: 'now' // night (12am - 6am)
								}
							]
						},
						aggs: {
							avg_temperature: {
								avg: {
									field: 'data.percentage'
								}
							}
						}
					}
				}
			},
			median: {
				query: {
					bool: {
						must: [
							{ term: { sensor_type: 'carbonmonoxide' } },
							{ range: { '@timestamp': { gte: by, lte: 'now' } } }
						]
					}
				},
				aggregations: {
					count_documents: { value_count: { field: 'data.value' } },
					avg_price: {
						percentiles: { field: 'data.percentage', percents: [50] }
					}
				}
			},
			mediangraph: {
				query: {
					bool: {
						must: [
							{
								term: {
									sensor_type: 'carbonmonoxide'
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
								percentiles: { field: 'data.percentage', percents: [50] }
							}
						}
					}
				}
			},
			average: {
				query: {
					bool: {
						must: [
							{ term: { sensor_type: 'carbonmonoxide' } },
							{ range: { '@timestamp': { gte: by, lte: 'now' } } }
						]
					}
				},
				aggregations: {
					avg_price: {
						avg: {
							field: 'data.percentage'
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
									sensor_type: 'carbonmonoxide'
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
									field: 'data.percentage'
								}
							}
						}
					}
				}
			},
			avergeppm: {
				query: {
					bool: {
						must: [
							{ term: { sensor_type: 'carbonmonoxide' } },
							{ range: { created_at: { gte: by, lte: 'now' } } }
						]
					}
				},
				aggregations: {
					avg_price: {
						avg: {
							field: 'data.ppm'
						}
					}
				}
			},
			averageppmgraph: {
				query: {
					bool: {
						must: [
							{
								term: {
									sensor_type: 'carbonmonoxide'
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
									field: 'data.ppm'
								}
							}
						}
					}
				}
			},
			medianppm: {
				query: {
					bool: {
						must: [
							{ term: { sensor_type: 'carbonmonoxide' } },
							{ range: { created_at: { gte: by, lte: 'now' } } }
						]
					}
				},
				aggregations: {
					avg_price: {
						percentiles: { field: 'data.ppm', percents: [50] }
					}
				}
			},
			medianppmgraph: {
				query: {
					bool: {
						must: [
							{
								term: {
									sensor_type: 'carbonmonoxide'
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
								percentiles: { field: 'data.ppm', percents: [50] }
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
