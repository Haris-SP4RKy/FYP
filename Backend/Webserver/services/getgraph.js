const Elasticsearch = require ('../lib/elasticsearch');

module.exports.getGraph= async(sensor_type)=>{
    try {
        const sensors=['humidity','temperature']
        let field='data.percentage'
        if(sensors.includes(sensor_type)){
            field='data.value'
        }
        const query = {
            query: {
              bool: {
                must: [
                  {
                    term: {
                      sensor_type: sensor_type
                    }
                  },
                  {
                    range: {
                      'created_at': {
                        gte: 'now-5M',
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
                  calendar_interval: 'month',
                  missing: '0',
                  min_doc_count: 0,
                  extended_bounds: {
                    min: 'now-5M',
                    max: 'now'
                  }
                },
                aggregations: {
                  avg_percentage: {
                    avg: {
                      field: field
                    }
                  }
                }
              }
            }
          };
          const elk = new Elasticsearch();  
          result= await elk.search({
            index: 'sensor_data',
            size: 0,
            filter_path: 'aggregations',
            body: query
          });
          return result.aggregations.group_by_month
          
    } catch (error) {
        console.error(error);
        throw new Error(error)
    }
}


// (async()=>{
//     console.log(await getgraph('temperature'))
// })()


