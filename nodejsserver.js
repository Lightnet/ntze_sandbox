/*
 * Work in progress test build
 * Main file
*/

var http = require("http")
var path = require("path")
var express = require("express")
var index = require("./contents/routes/index")
var user = require("./contents/routes/user");
var sio = require("socket.io");
var fs = require("fs");
var mongo = require("mongoskin");
//var serversocket = require("./libs/serversocket");
var data = fs.readFileSync('./config.json'), Config;
try  {
    Config = JSON.parse(data);
} catch (err) {
    console.log('There has been an error parsing your config JSON.');
    console.log(err);
}
if(Config.blocaldb) {
    console.log("Local DataBase");
    var db = mongo.db('http://' + "127.0.0.1" + ':' + "27017" + '/' + Config.database.name + '', {
        safe: false
    });
} else {
    console.log("Network DataBase");
    var db = mongo.db('mongodb://' + Config.database.user + ':' + Config.database.pass + '@' + Config.database.host + ':' + Config.database.port + '/' + Config.database.name + '', {
        safe: false
    });
}
//var app = express.createServer();
var app = express();
var port = 80;

if(Config.port !=null){
	port = Config.port;
}

app.configure(function () {
    app.set('port', process.env.PORT || port);
    //app.set('views', __dirname + '/contents/views');
    app.set('views',  './contents/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    //app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join('./', 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

//app.get('/', index.index);
//app.get('/users', user.list);

app.get('/', function(req, res) {

    //res.render('public/index3.html');
    //res.sendfile(__dirname + '/public/turbulenz_scene.html');
    res.sendfile('./public/turbulenz_scene.html');
});


var IsServerUp = "false";
var httpServer;
var io_server;

//var ssengine = require("./libs/ssengine");
//var socket_content = require("./libs/socket_content");


try {
	httpServer = http.createServer(app);
	io_server = sio.listen(httpServer);
	io_server.set('log level', 1);
	//serversocket.setnet(io_server, db);
	//ssengine.setnet(io_server, db);
    io_server.sockets.on('connection', function (socket) {
        console.log("client connected!");
		//socket_content.setnet(io_server, socket, db);
		
        //ssengine.addclient(socket);
        socket.on('disconnect', function () {
            //ssengine.disconnectclient(socket);
        });
		
		socket.on('test', function () {
			console.log("incoming....");
		});
    });
	
	io_server.configure(function (){
		io_server.set('authorization', function (handshakeData, callback) {
			// findDatabyip is an async example function
			console.log("handshake...");
			callback(null, true); // error first callback style 
		});
		io_server.set('transports', [
			'websocket'
			, 'flashsocket'
			, 'htmlfile'
			, 'xhr-polling'
			, 'jsonp-polling'
		]);  
	});
	httpServer.listen(app.get('port'), function () {
		console.log("Express server listening on port " + app.get('port'));
	});
	IsServerUp = "true";
} catch(err) {
	console.log(err);
	IsServerUp = "false";
}