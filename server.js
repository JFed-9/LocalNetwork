/* Import needed dependencies */
const express = require('express');
const session = require('express-session');
const http = require('http');
const Q = require('q');

const PORT = 1337; //the port the http server will listen on
var connectionsArray = []; //used to track clients that connect to the web socket server

var app = express(); //create the express app
var server = http.createServer(app); //create an http server using the express app
var io = require('socket.io').listen(server); //creates a web socket server that will be used for real time updating. You will use this in part 2 of the lab.

/* This section configures the express app */
app.engine('ejs', engine); //use ejs as the templating engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/assets'));

/* This starts your http server on the given port */
server.listen(PORT, function (){
	console.log('Server started on port ' + PORT)
})

app.get('/', function (req, res){
	res.render('index');
})

//Socket handling
io.sockets.on('connection', function (socket){
	connectionsArray.push(socket);
	console.log('A new socket has connected, total connected: ', connectionsArray.length);

	//sets up a handler for the disconnect event
	socket.on('disconnect', function (){
		var socketIndex = connectionsArray.indexOf(socket);
		if (socketIndex >= 0){
			connectionsArray.splice(socketIndex, 1);
			console.log('socket ' + socketIndex + ' disconnected');
		}
	})
})
// Tell the Browser to stop asking for the favicon :)
app.get('/favicon.ico', function(req, res) {
    res.redirect('/assets/favicon.ico');
});
app.all('*', function (req, res){
	console.log('URL HIT WITH NO ROUTE', req.originalUrl)
	res.sendStatus(404);
})