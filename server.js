/* Import needed dependencies */
const express = require('express');
const http = require('http');
const Q = require('q');
const engine = require('ejs-locals');

const PORT = 1337; //the port the http server will listen on
var connectionsArray = []; //used to track clients that connect to the web socket server

var app = express(); //create the express app
var server = http.createServer(app); //create an http server using the express app

/* This section configures the express app */
app.engine('ejs', engine); //use ejs as the templating engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/assets'));

/* This starts your http server on the given port */
server.listen(PORT, function (){
	console.log('Server started on port ' + PORT)
})

app.get('/index', function(req, res){
	res.render('index');
})
app.get('/', function (req, res){
	res.redirect('/index');
})

app.get('/favicon.ico', function(req, res) {
    res.redirect('/assets/favicon.ico');
});
app.all('*', function (req, res){
	console.log('URL HIT WITH NO ROUTE', req.originalUrl)
	res.sendStatus(404);
})
