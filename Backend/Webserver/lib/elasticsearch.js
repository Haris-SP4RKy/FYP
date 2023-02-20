const config = require('../config')
const Elasticsearch = require('@elastic/elasticsearch');

class ElasticsearchWrapper {
    static instance = null;
    constructor() {
        if (ElasticsearchWrapper.instance) {
            return ElasticsearchWrapper.instance;
          }
      this.client = new Elasticsearch.Client( {node: config.ELASTIC_URL,
      auth: {
        username: config.ELASTIC_USERNAME,
        password: config.ELASTIC_PASSWORD
      }});
    }
  
    async search(params) {
      return this.client.search(params);
    }
  
    async index(params) {
      return this.client.index(params);
    }
  
    async update(params) {
      return this.client.update(params);
    }
  
    async delete(params) {
      return this.client.delete(params);
    }
  
    async get(params) {
      return this.client.get(params);
    }

    async scroll(params) {
      return this.client.scroll(params);
    }
  }
module.exports = ElasticsearchWrapper;