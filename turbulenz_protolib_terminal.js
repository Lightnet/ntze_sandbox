var helptext = "";

//helptext += "[[gib;#FFFFFF;#000]say], ";
//helptext += "[[gib;#993399;#000]pm], ";
//helptext += "[[gib;#FFFFFF;#000]local], ";
//helptext += "[[gib;#FF7700;#000]world], ";
//helptext += "[[gib;#FF6600;#000]shout], ";

//helptext += "[[gib;#99FF66;#000]clan], ";
//helptext += "[[gib;#00CCFF;#000]team], ";
//helptext += "[[gib;#00CCFF;#000]squard], ";

//helptext += "[[gib;#00CCFF;#000]party], ";

//helptext += "[[gib;#FF0000;#000]admin], ";
//helptext += "[[gib;#FF9999;#000]gm], ";
//helptext += "[[gib;#FF9999;#000]map], ";
//helptext += "[[gib;#FF9999;#000]item], ";
//helptext += "[[gib;#FF9999;#000]spawn], ";

helptext += "[[gib;#FF9999;#000]listobjects], ";
helptext += "[[gib;#FF9999;#000]reset], ";
helptext += "[[gib;#FF9999;#000]protolib], ";
helptext += "[[gib;#FF9999;#000]fullscreen | fs], ";
helptext += "[[gib;#FF9999;#000]hideconsole | hc], ";
helptext += "[[gib;#FF9999;#000]debug], ";
helptext += "[[gib;#FF9999;#000]spawn [cube,mesh]], ";



$(function() {
	$('#term_console').terminal(
		function(command, term) {
			//console.log(command);
			//console.log(term);
			//console.log(term.get_prompt());
			if(command == 'help'){
				
				var textinfp = "";
				textinfp += helptext;
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
				console.log(protolib.globals.scene);
				term.echo(protolib.globals.scene.rootNodes);
			}
			
			if((command == 'hideconsole')||(command == 'hc')){
				$('#term_console').hide();
				$('#term_console').terminal().focus(false);
			}
			
			if((command == 'fullscreen')||(command == 'fs')){
				ToggleFullScreen_mode();
				console.log(Window.isFullscreen);
				//console.log(gui);
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
			
			if((command == 'debug')){
				if(turbulenz_app !=null){
					//turbulenz_app.End_Frame();
					//if(turbulenz_app.DebugToggle !=null){
						turbulenz_app.DebugToggle();
					//}
				}
			}
			
			if((command == 'scene')){
				if(turbulenz_app !=null){
						turbulenz_app.ShowSceneFuns();
				}
			}
			
			if((command == 'shader')){
				if(turbulenz_app !=null){
						turbulenz_app.Showshader();
				}
			}
			
			if((command == 'shader2d')){
				if(turbulenz_app !=null){
						turbulenz_app.Showshader2d();
				}
			}
			
			if((command == 'animations')){
				if(turbulenz_app !=null){
						turbulenz_app.GetAnimations();
				}
			}
			
			if (command !== '') {
				//var result = window.eval(command);
				//if (result != undefined) {
					//term.echo(String(result));
				//}
			}
			
			var args = command.split(" ");
			//console.log(args);
			//console.log(args.join(" "));
			//console.log(command);
			//console.log("args[0]: " + args[0]);
			if(args[0] == "spawn"){
				console.log(args[1]);
				if(args[1] == "cube"){
					if(turbulenz_app !=null){
						turbulenz_app.CreatePhysicsCube();
					}
				}
				
				if(args[1] == "mesh"){
					if(turbulenz_app !=null){
						turbulenz_app.SpawnMesh();
					}
				}
				
				if(args[1] == "duck"){
					if(turbulenz_app !=null){
						turbulenz_app.CloneMeshDuck();
					}
				}
			}
			
		},
		{
			greetings: '[[[gib;#00FFFF;#000]Welcome to Console]] [[[gib;#00FFFF;#000]type help for commands]]',
			prompt: '[[gib;#00ee11;#000]command] > ',
			height: 150,
			width: 780
		}
	);
	
	$('#term_console').terminal().echo(helptext);
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
});

$(document.body).on('keydown', function(e) {
	//console.log(e.which);
	if(e.which == 192){
		if($('#term_console').is(":visible")){
			$('#term_console').terminal().focus(false);
			$('#term_console').hide();
		}else{
			$('#term_console').terminal().focus(true);
			$('#term_console').show();
		}
		console.log("toggle show?"+$('#term_console').is(":visible"));
	}
});