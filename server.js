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
var dir =  process.cwd();
app.use(express.static(dir)); //current working directory
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

app.get('/files', function(req, res) {
 var currentDir =  dir;
 var query = req.query.path || '';
 if (query) currentDir = path.join(dir, query);
 console.log("browsing ", currentDir);
 fs.readdir(currentDir, function (err, files) {
     if (err) {
        throw err;
      }
      var data = [];
      files
      .forEach(function (file) {
        try {
                //console.log("processing ", file);
                var isDirectory = fs.statSync(path.join(currentDir,file)).isDirectory();
                if (isDirectory) {
                  data.push({ Name : file, IsDirectory: true, Path : path.join(query, file)  });
                } else {
                  var ext = path.extname(file);
                  if(program.exclude && _.contains(program.exclude, ext)) {
                    console.log("excluding file ", file);
                    return;
                  }
                  data.push({ Name : file, Ext : ext, IsDirectory: false, Path : path.join(query, file) });
                }

        } catch(e) {
          console.log(e);
        }

      });
      data = _.sortBy(data, function(f) { return f.Name });
      res.json(data);
  });
});

app.get('/favicon.ico', function(req, res) {
    res.redirect('/assets/favicon.ico');
});
app.all('*', function (req, res){
	console.log('URL HIT WITH NO ROUTE', req.originalUrl)
	res.sendStatus(404);
})
