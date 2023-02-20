const Elasticsearch = require('../lib/elasticsearch');


module.exports.Get_Temperature= async (optionsBy)=>{

    try {
        const byMap = {
			1: 'now-1d/d',
			2: 'now-7d/d',
			3: 'now-30d/d',
			4: 'now-90d/d'
		};
		const by = byMap[optionsBy] || byMap[1];
        
    } catch (error) {
        
    }



};