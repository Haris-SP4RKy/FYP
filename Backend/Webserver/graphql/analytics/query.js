// POST /sensor_data/_search?size=0&filter_path=aggregations
// {
//   "query": { "term": { "sensor_type": "carbondioxide" } },
//   "aggs": {
//     "avg_price": { "avg": { "field": "data.value" } }
//   }
// }


// POST /sensor_data/_search?size=0&filter_path=aggregations
// {
//   "query": {
//     "bool": {
//       "must": [
//         { "term": { "sensor_type": "carbondioxide" } },
//         { "range": { "@timestamp": { "gte": "now-1d/d", "lte": "now" } } }
//       ]
//     }
//   },
//   "aggs": {
//     "avg_price": { "avg": { "field": "data.value" } }
//   }
// }



module.exports.analyticsQuery = {

}