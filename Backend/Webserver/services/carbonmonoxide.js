const Elasticsearch = require('../lib/elasticsearch');

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
					avg_price: { percentiles: { field: 'data.percentage', percents: [50] } }
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
			},
   
            
		};

		const elk = new Elasticsearch();
		const result = {};
		for (const [key, value] of Object.entries(queryMap)) {
			result[key] = await elk.search({
				index: 'sensor_data',
				size: 0,
				filter_path: 'aggregations',
				body: value
			});
		}
		return result;
	} catch (error) {
		throw error;
	}
};
