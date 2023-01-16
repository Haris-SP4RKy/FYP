const { flatten, unflatten } = require('flat');

const redis = require('./redis_client');

module.exports.registerHeartbeat=(key)=>{
		const client = redis.getClient();
	try {
		client.hset(key, 'status', );
	} catch (err) {
		return err;
	}
	return true;
}
//const keys = require('../../../utils/redis_keys');

// /**
//  * Takes a key for campaign
//  * eg:tenantid:campaignid:batchid
//  * and returns the stauts of campaign
//  * @param {string} key
//  * @param {boolean}
//  */
// module.exports.isCanceled = (key) => {
// 	const client = redis.getClient();
// 	const value = client.hget(key, 'status');

// 	if (value === 'CANCELED') {
// 		return true;
// 	}
// 	return false;
// };
// /**
//  *
//  * @param {string} key ---gets status from key
//  * @returns {string}
//  */
// module.exports.getstatusofcampaign = (key) => {
// 	const client = redis.getClient();
// 	const value = client.hget(key, 'status');
// 	return value;
// };
// /**
//  * Takes a key to update status
//  * eg:tenantid:campaignid:batchid
//  * @param {string} key
//  * @param {string} status
//  */
// module.exports.updateCampaignStatus = (key, status) => {
// 	const client = redis.getClient();
// 	try {
// 		client.hset(key, 'status', status);
// 	} catch (err) {
// 		return err;
// 	}
// 	return true;
// };

// /**
//  * Gets an object and set hash on redis
//  * @param {obj} campaign - campaign object containig
//  * @param {boolean} -promise
//  */
// module.exports.insertCampaign = async (campaign) => {
// 	try {
// 		const client = await redis.getClient();
// 		const data = flatten(campaign);
// 		const key = keys.getCampaignById(campaign.meta.tenant_id, campaign.id);

// 		const saved = await client.hset(key, data);
// 		// const _campaign = await client.hgetall(key);
// 		return true;
// 	} catch (error) {
// 		console.log(error);
// 		return false;
// 	}
// };

// /**
//  * gets campaign by id from redis
//  * @param {string} key
//  * @returns {object}
//  */
// module.exports.GetCampaign = async (key) => {
// 	try {
// 		const client = await redis.getClient();

// 		const data = await client.hgetall(key);
// 		const campaign = unflatten(data);
// 		return campaign;
// 	} catch (error) {
// 		console.log(error);
// 		return error;
// 	}
// };

// /**
//  * Inserts a batch according to campaign in redis
//  * @param {*} batch batch obj
//  * @returns {boolean} true if inserted successfully
//  */
// module.exports.insertBatch = async (tenantId, campaignId, batch) => {
// 	try {
// 		const client = await redis.getClient();
// 		const data = flatten(batch);
// 		const key = keys.getBatchById(tenantId, campaignId, batch.batch_id);

// 		const saved = await client.hset(key, data);
// 		return true;
// 	} catch (error) {
// 		console.log(error);
// 		return false;
// 	}
// };

// /**
//  * Updates status of batch on the basis of key
//  * @param {string} key
//  * @param {string}} status
//  * @returns {boolean}
//  */

// module.exports.updateBatchStatus = (key, status) => {
// 	const client = redis.getClient();
// 	try {
// 		client.hset(key, 'status', status);
// 	} catch (err) {
// 		return err;
// 	}
// 	return true;
// };

// /**
//  * Get batch by id
//  * @param {string} key  ${batch.meta.tenantId}:PUSH_CAMPAIGN:${batch.campaignId}:${batch.batchId}
//  * @returns {object} batch
//  */
// module.exports.GetBatch = async (key) => {
// 	try {
// 		const client = await redis.getClient();

// 		const data = await client.hgetall(key);
// 		const campaign = unflatten(data);
// 		return campaign;
// 	} catch (error) {
// 		console.log(error);
// 		return error;
// 	}
// };
// /**
//  *
//  * @param {*} campaignId
//  * @param {*} tenantId
//  * @param {*} batchId
//  * @returns
//  */
// const isBatchCompleted = async (tenantId, campaignId, batchId) => {
// 	const client = redis.getClient();
// 	try {
// 		const value = await client.hget(keys.getBatchById(tenantId, campaignId, batchId), 'status');

// 		if (value === 'COMPLETED') {
// 			return true;
// 		}
// 		return false;
// 	} catch (error) {
// 		console.log(error);
// 		return error;
// 	}
// };

// module.exports.isBatchCompleted = isBatchCompleted;

// /**
//  * @param  {string} key key of campaign
//  * @return {boolean}
//  */
// module.exports.isCampaignCompleted = async (tenantId, campaignId) => {
// 	try {
// 		const client = await redis.getClient();

// 		const data = await client.smembers(keys.getAllBatches(tenantId, campaignId));
// 		const allBatches = await Promise.allSettled(data.map((batchId) => isBatchCompleted(tenantId, campaignId, batchId)));

// 		const isAllBatchesCompleted = allBatches.every(({ value }) => value === true);
// 		return isAllBatchesCompleted;
// 	} catch (error) {
// 		console.log(error);
// 		return error;
// 	}
// };

// module.exports.incrementBatchMetrics = async (tenantId, campaignId, batchId, field, increment) => {
// 	try {
// 		const client = await redis.getClient();

// 		const data = await client.hincrby(keys.getBatchById(tenantId, campaignId, batchId), field, increment);
// 		return data;
// 	} catch (error) {
// 		console.log(error);
// 		return error;
// 	}
// };

// /**
//  *
//  * @param {*} tenantId
//  * @returns {object}
//  */
// module.exports.getCertById = async (tenantId, fcmId) => {
// 	try {
// 		const client = await redis.getClient();
// 		const data = await client.get(keys.getCertById(tenantId, fcmId));
// 		const bytes = CryptoJS.AES.decrypt(data, config.CRYPTO_SECRET);
// 		const originalText = bytes.toString(CryptoJS.enc.Utf8);
// 		return JSON.parse(originalText);
// 	} catch (error) {
// 		console.log(error);
// 		return error;
// 	}
// };

// /**
//  *
//  * @param {*} tenantId tenant id
//  * @param {*} cert certificate json
//  * @returns
//  */
// module.exports.insertTenantCert = async (tenantId, fcmId, cert) => {
// 	try {
// 		const client = await redis.getClient();

// 		const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(cert), config.CRYPTO_SECRET).toString();

// 		const saved = await client.set(keys.getCertById(tenantId, fcmId), ciphertext);
// 		return true;
// 	} catch (error) {
// 		console.log(error);
// 		return false;
// 	}
// };
