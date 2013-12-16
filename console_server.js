var serverconfig = function (){
	var self = this;
	self.state = ko.observable("Status [offline]");
	self.usersonline = ko.observable("Users [0]");
	
	var oncheck = self.oncheck= function (){
		if(IsServerUp !=null){
			
			if(IsServerUp == "true"){
				self.state("Status [online]");
				console.log(self.state);
			}else{
				self.state("Status [offline]");
				console.log(self.state);
			}
			console.log("found!");
		}	
	}
	oncheck();
};

window.onload=function(){
	ko.applyBindings(new serverconfig(),document.getElementById("serverstate"));
};

var helptext = "";
helptext += "[[gib;#FFFFFF;#000]say], ";
helptext += "[[gib;#993399;#000]pm], ";
helptext += "[[gib;#FFFFFF;#000]local], ";
helptext += "[[gib;#FF7700;#000]world], ";
helptext += "[[gib;#FF6600;#000]shout], ";

helptext += "[[gib;#99FF66;#000]clan], ";
helptext += "[[gib;#00CCFF;#000]team], ";
helptext += "[[gib;#00CCFF;#000]squard], ";

helptext += "[[gib;#00CCFF;#000]party], ";

helptext += "[[gib;#FF0000;#000]admin], ";
helptext += "[[gib;#FF9999;#000]gm], ";
helptext += "[[gib;#FF9999;#000]map], ";
helptext += "[[gib;#FF9999;#000]item], ";
helptext += "[[gib;#FF9999;#000]spawn], ";

helptext += "[[gib;#FF9999;#000]listobjects], ";
helptext += "[[gib;#FF9999;#000]reset], ";
helptext += "[[gib;#FF9999;#000]protolib], ";
helptext += "[[gib;#FF9999;#000]fullscreen | fs], ";
helptext += "[[gib;#FF9999;#000]hideconsole | hc], ";

$(function() {
	$('#term_serverconsole').terminal(
		function(command, term) {
			console.log(command);
			console.log(term);
			console.log(term.get_prompt());
			if(command == 'help'){
				
				var textinfp = "";
				textinfp += helptext;
				
				/*
				textinfp += "[[gib;#FFFFFF;#000]say] ";
				textinfp += "[[gib;#FFFFFF;#000]local], ";
				textinfp += "[[gib;#FF6600;#000]shout], ";
				textinfp += "[[gib;#FF7700;#000]world], ";
				
				textinfp += "[[gib;#99FF66;#000]clan], ";
				textinfp += "[[gib;#00CCFF;#000]team], ";
				textinfp += "[[gib;#993399;#000]pm], ";
				textinfp += "[[gib;#00CCFF;#000]party], ";
				
				textinfp += "[[gib;#FF0000;#000]admin], ";
				textinfp += "[[gib;#FF9999;#000]gm], ";
				
				textinfp += "test ";
				*/
				//helptext = textinfp;
				term.echo(textinfp);
			}
			if(command == 'team'){
				term.set_prompt('[[gib;#00CCFF;#000]team] > '); //blue
			}
			if(command == 'local'){
				term.set_prompt('[[gib;#FFFFFF;#000]local] > '); //white
			}
			if(command == 'shout'){
				term.set_prompt('[[gib;#FF6600;#000]shout] > '); //orange
			}
			if(command == 'admin'){
				term.set_prompt('[[gib;#FF0000;#000]admin] > '); //red
			}
			if(command == 'pm'){
				term.set_prompt('[[gib;#993399;#000]pm] > '); //purple
			}
			if(command == 'gm'){
				term.set_prompt('[[gib;#FF9999;#000]gm] > '); //light pink
			}
			if(command == 'clan'){
				term.set_prompt('[[gib;#99FF66;#000]clan] > '); //light pink
			}
			if(command == 'protolib'){
				console.log(protolib);
				term.echo(protolib);
			}
			
			if(command == 'psl'){
				//console.log(protolib.globals.scene.rootNodes.length);
				//console.log(protolib.globals.scene.rootNodes);
				
				console.log(protolib.globals.scene);
				
				//var clone = protolib.globals.scene.rootNodes[1].clone();
				//console.log(clone);
				//clone.position.set(0,0,1);
				//clone.setLocation(0,0,0);
				//console.log(clone.position);
				//protolib.globals.scene.rootNodes.push(clone);
				
				term.echo(protolib.globals.scene.rootNodes);
			}
			
			if((command == 'hideconsole')||(command == 'hc')){
				$('#term_console').hide();
				$('#term_console').terminal().focus(false);
			}
			
			if((command == 'fullscreen')||(command == 'fs')){
				ToggleFullScreen_mode();
				console.log(Window.isFullscreen);
				console.log(gui);
			}
			
			if((command == 'mesh')){
				if(turbulenz_app !=null){
					turbulenz_app.HideMeshTest();
				}
			}
			
			if((command == 'sf')){
				if(turbulenz_app !=null){
					turbulenz_app.Start_Frame();
				}
			}
			
			if((command == 'ef')){
				if(turbulenz_app !=null){
					turbulenz_app.End_Frame();
				}
			}
			
			
			if (command !== '') {
				//var result = window.eval(command);
				//if (result != undefined) {
					//term.echo(String(result));
				//}
			}
		},
		{
			greetings: '[[[gib;#00FFFF;#000]Welcome to Console]] [[[gib;#00FFFF;#000]type help for commands]]',
			//prompt: '[[gib;#00ee11;#000]command] > ',
			prompt: '>',
			height: "150px",
			width: "600px"
		}
	);
	
	//$('#term_serverconsole').terminal().echo(helptext);
	/*
	//$('#term_console').terminal().echo("ldkfjsldkjfl");
	$('#term_console').hide();
	Mousetrap.bind('`', function() { 
		//console.log('`'); 		
		if($('#term_console').is(":visible")){
			$('#term_console').terminal().focus(false);
			$('#term_console').hide();
		}else{
			$('#term_console').terminal().focus(true);
			$('#term_console').show();
		}
	});
	*/
});