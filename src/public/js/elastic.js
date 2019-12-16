const elasticsearch = require('elasticsearch');

/**
 * Instantiate an ElasticSearch client.
 *
 * @param host: http://localhost:9200
 */
const connect = (host) => {
	return new elasticsearch.Client({
		hosts: [host]
	});
};

/**
 * Ping the client to be sure ElasticSearch is up.
 *
 * @param client
 */
const ping = (client) => {
	client.ping({
		requestTimeout: 30000,
	}, (error) => {
		// At this point ElasticSearch is down, please check your ElasticSearch service
		if (error) {
			console.log('ElasticSearch cluster is down!');
		} else {
			console.log('ElasticSearch is up!')
		}
	});
};

/**
 * Create a new index called world_cities_population.
 * If the index has already been created, this function fails safely.
 *
 * @param client
 * @param name: world_cities_population
 */
const createIndex = (client, name) => {
	const mapping = {
		'properties': {
			'Location': {
				'type': 'geo_point'
			},
			'Population': {
				'type': 'integer'
			}
		}
	};

	client.indices.create({
		index: name,
		body: {
			'mappings': mapping
		}
	}, (error, response) => {
		if (error) {
			console.log(error);
		} else {
			console.log("Created a new index:", response);
		}
	});
};

/**
 * Deletes index with given name.
 *
 * @param client
 * @param name: Index name
 */
const deleteIndex = (client, name) => {
	client.indices.delete({
		index: name
	}, (err, res) => {
		if (err) {
			console.error(err.message);
		} else {
			console.log(`Index ${name} have been deleted!`);
		}
	});
};

const ELASTICSEARCH_URL = 'http://localhost:9200';
const INDEX_NAME = 'world_cities_population';

module.exports = {
	connect,
	ping,
	createIndex,
	deleteIndex,
	ELASTICSEARCH_URL,
	INDEX_NAME
};