var ssengine = require("./ssengine");
var socket_content = require("./socket_content");

function setnet(io, db) {
    io = io;
    db = db;
    ssengine.setnet(io, db);
    io.sockets.on('connection', function (socket) {
        console.log("client connected!");
		socket_content.setnet(io, socket, db);
		
		
        ssengine.addclient(socket);
        socket.on('disconnect', function () {
            ssengine.disconnectclient(socket);
        });
		
		socket.on('test', function () {
			console.log("incoming....");
		});
    });
}
exports.setnet = setnet;
