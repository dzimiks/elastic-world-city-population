const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const elasticsearch = require('elasticsearch');

const indexRouter = require('./src/routes/index');

const app = express();

const INDEX_NAME = 'world_cities_population';
const client = new elasticsearch.Client({
	hosts: ['http://localhost:9200']
});

// view engine setup
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.use('/', indexRouter);

// Define the /search route that should return elastic search results
app.get('/search', (req, res) => {
	console.log('Search Query:', req.query);

	// Declare the query object to search elastic search and return only 200 results from the first result found.
	// also match any data where the name is like the query string sent in
	const body = {
		size: 200,
		from: 0,
		query: {
			match: {
				AccentCity: req.query['q']
			}
		}
	};

	// Perform the actual search passing in the index, the search query and the type
	client.search({index: INDEX_NAME, body: body})
		.then((results) => {
			res.send(results.hits.hits);
		})
		.catch((err) => {
			console.log(err);
			res.send([]);
		});
});

app.get('/filter', (req, res) => {
	console.log('Filter Query:', req.query);

	const body = {
		size: 200,
		from: 0,
		query: {
			match: {
				Country: req.query['q']
			}
		}
	};

	client.search({index: INDEX_NAME, body: body})
		.then((results) => {
			res.send(results.hits.hits);
		})
		.catch((err) => {
			console.log(err);
			res.send([]);
		});
});

app.get('/range/gte', (req, res) => {
	console.log('Range Query gte:', req.query);

	const body = {
		size: 200,
		from: 0,
		query: {
			range: {
				Population: {
					gte: req.query['q']
				}
			}
		}
	};

	client.search({index: INDEX_NAME, body: body})
		.then((results) => {
			res.send(results.hits.hits);
		})
		.catch((err) => {
			console.log(err);
			res.send([]);
		});
});

app.get('/range/lte', (req, res) => {
	console.log('Range Query lte:', req.query);

	const body = {
		size: 200,
		from: 0,
		query: {
			range: {
				Population: {
					lte: req.query['q']
				}
			}
		}
	};

	client.search({index: INDEX_NAME, body: body})
		.then((results) => {
			res.send(results.hits.hits);
		})
		.catch((err) => {
			console.log(err);
			res.send([]);
		});
});

app.get('/sort/asc', (req, res) => {
	console.log('Sort Ascending');

	const body = {
		size: 200,
		sort: [{
			Population: {
				order: 'asc'
			}
		}]
	};

	client.search({index: INDEX_NAME, body: body})
		.then((results) => {
			res.send(results.hits.hits);
		})
		.catch((err) => {
			console.log(err);
			res.send([]);
		});
});

app.get('/sort/desc', (req, res) => {
	console.log('Sort Descending');

	const body = {
		size: 200,
		sort: [{
			Population: {
				order: 'desc'
			}
		}]
	};

	client.search({index: INDEX_NAME, body: body})
		.then((results) => {
			res.send(results.hits.hits);
		})
		.catch((err) => {
			console.log(err);
			res.send([]);
		});
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
