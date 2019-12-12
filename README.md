# Elastic World City Population

## Starting the server

Run `yarn install` and `yarn start`.

## Run ElasticSearch
> ./bin/elasticsearch

## Cat indices

Open http://localhost:9200/_cat/indices?v in browser.

## Running Logstash
> ./bin/logstash -f data.conf --config.reload.automatic