/*
 *
*/

var fs = require("fs");

function SetDialogConfig(socket, _id, _title, _config, _text) {
	//create dialog
    socket.emit('content', {
        ui: "createdialog",
        title: _title,
        parent: "mainbody",
        child: _id,
        text: _text
    });
	//config dialog setting/config
    var _uiconfig = JSON.parse(_config);
    socket.emit('content', {
        ui: "setdialog",
        id: _id,
        settings: _uiconfig
    });
	//close dialog
    socket.emit('content', {
        ui: "setdialog",
        id: _id,
        settings: 'close'
    });	
}

function CreateButtonNavMenu(_socket,_id,_text){
	//create button info
	_socket.emit('content', {
        uinavmenu: "createbutton",
        id: _id,
        settings: "close",
        text: _text
    });
	//create ui button
	_socket.emit('content', {
        uinavmenu: "setbutton",
        id: _id
    });
}
//binding test
function SetKOBinding(_socket,_bind){
	_socket.emit('binding', {
        bind: _bind
    });
	console.log("sent binding...");
}

function ShowDialog(_socket,_id){
	_socket.emit('content', {
		ui: "setdialog",
		id: _id,
		settings: "open"
	});
}

//create layout once connect is working...
function LoadNavMenu(socket){
	//home
	CreateButtonNavMenu(socket,"home","<a href='#' onclick='UIAction(\"home\");'>Home</a>");
	//news
	CreateButtonNavMenu(socket,"news","<a href='#' onclick='UIAction(\"news\");'>News</a>");
	
	//unit info
	CreateButtonNavMenu(socket,"unitinfo","<a href='#' onclick='UIAction(\"unitinfo\");'>Unit info</a>");
	SetDialogConfig(socket, "dialogunitinfo", "unitinfo", '{"resizable": "false", "width":"320"}', "");
	
	//research
	CreateButtonNavMenu(socket,"research","<a href='#' onclick='UIAction(\"research\");'>Research</a>");
	SetDialogConfig(socket, "dialogresearch", "research", '{"resizable": "false", "width":"320"}', "");
	
	//base
	CreateButtonNavMenu(socket,"base","<a href='#' onclick='UIAction(\"base\");'>Base</a>");
	//map
	CreateButtonNavMenu(socket,"map","<a href='#' onclick='UIAction(\"map\");'>Map</a>");
	//solar system
	CreateButtonNavMenu(socket,"solarsystem","<a href='#' onclick='UIAction(\"solarsystem\");'>solar system</a>");
	//galaxy
	CreateButtonNavMenu(socket,"galaxy","<a href='#' onclick='UIAction(\"galaxy\");'>Galaxy</a>");
	
	//fleet
	CreateButtonNavMenu(socket,"fleet","<a href='#' onclick='UIAction(\"fleet\");'>Fleet</a>");
	SetDialogConfig(socket, "dialogfleet", "fleet", '{"resizable": "false", "width":"320"}', "");
	
	//shipyard
	CreateButtonNavMenu(socket,"shipyard","<a href='#' onclick='UIAction(\"shipyard\");'>Shipyard</a>");
	SetDialogConfig(socket, "dialogshipyard", "shipyard", '{"resizable": "false", "width":"320"}', "");
	
	//constructs
	CreateButtonNavMenu(socket,"constructs","<a href='#' onclick='UIAction(\"constructs\");'>Constructs</a>");
	SetDialogConfig(socket, "dialogconstructs", "constructs", '{"resizable": "false", "width":"320"}', "");
	
	//techtree
	CreateButtonNavMenu(socket,"techtree","<a href='#' onclick='UIAction(\"techtree\");'>techtree</a>");
	SetDialogConfig(socket, "dialogtechtree", "techtree", '{"resizable": "false", "width":"320"}', "");
}

function setnet(io,socket, db) {

	socket.on('UI', function (data) {
        console.log("UI...");
		if(data['ui'] != null) {
		
			if(data['ui'] == "unitinfo") {
				ShowDialog(socket,'dialogunitinfo');
            }
			
			if(data['ui'] == "research") {
				ShowDialog(socket,'dialogresearch');
            }
			
			if(data['ui'] == "fleet") {
				ShowDialog(socket,'dialogfleet');
            }
			
			if(data['ui'] == "shipyard") {
				ShowDialog(socket,'dialogshipyard');
            }
			
			if(data['ui'] == "constructs") {
				ShowDialog(socket,'dialogconstructs');
            }
			
			if(data['ui'] == "techtree") {
				ShowDialog(socket,'dialogtechtree');
            }
		}
	});

	//manual event trigger for broswer to load right and other things...
	socket.on('manual', function (data) {
		if(data['action'] !=null){
			if(data['action'] == 'loadnavmenu'){
				LoadNavMenu(socket);
			}
		}
	});
	
	
}

exports.setnet = setnet;