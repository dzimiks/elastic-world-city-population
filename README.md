# Elastic World City Population

## Starting the server

Run `yarn install` and `yarn start`.

## Run ElasticSearch

> ./bin/elasticsearch

## Cat indices

Open http://localhost:9200/_cat/indices?v in browser.

## Run Logstash

> ./bin/logstash -f logstash.conf --config.reload.automatic