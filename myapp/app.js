var express = require('express');
var app = express();
var qhttp = require('q-io/http');
var hbs = require('hbs');

var cache = require('lru-cache')({
    max: 100, // The maximum number of items allowed in the cache
    max_age: 1000 * 60 * 60 // The maximum life of a cached item in milliseconds
});


var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies

hbs.registerPartials(__dirname + '/views/partials');

// Register our {{{block}}} and {{#extend}}{{/extend}} helpers
require('./block-helpers')(hbs);

app.set('view engine', 'hbs');

app.set('views', './views');

app.use('/', express.static('public'));

app.get('/', function(req, res) {
    res.render('index', {title: 'My Index Page', 
                        isActive: {index: true}
                    });
});

app.get('/cache', function(req, res) {
    res.render('cache', {title: 'My Cache Page', 
                        isActive: {cache: true}
                    });
});

app.post('/cache/information', function(req, res) {
    res.send(cache.keys());
});

app.delete('/cache/information', function(req, res) {
    res.send(cache.reset());
});

app.post('/search/movie', function(req, res) {
    if (!(cache.has(req.body.movie))) {

        var omdbapiURL = 'https://www.omdbapi.com/?s=' + encodeURIComponent(req.body.movie).replace(/%20/g, "+");

        qhttp.read(omdbapiURL).then(function(json) {
            var responseJSON = JSON.parse(json);
            cache.set(req.body.movie, responseJSON);
            console.log(cache);
            res.send(responseJSON);
        }).then(null, console.error).done();
    } else {
        res.send(cache.get(req.body.movie));
    }
});


app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});


