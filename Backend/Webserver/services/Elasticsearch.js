// GET _cat/indices

const Elasticsearch = require('../lib/elasticsearch');
(async()=>{
    try {
        const elk=new Elasticsearch();
          const result = await elk.search({
        index: 'sensor_data',
        // query: {
        //   match: {}
        // }
        body:{}
    }
        )
        console.log(result.hits.hits)
    } catch (error) {
        console.log(error);
    }

    //   console.log(client)
    // const result = await client.search({
    //     index: 'sensor_data',
    //     query: {
    //       match: {}
    //     }
    //   })
    
})()
