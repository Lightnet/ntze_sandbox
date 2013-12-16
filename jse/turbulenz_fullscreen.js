//var canvas_engine = document.getElementById("mainbody");
//var gamewidth =  canvas.width;
//var gameheight =  canvas.height;

function requestFullScreen(element) {
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
	//console.log("fullscreen");
}

//var elem = document.body; // Make the body go full screen.
//requestFullScreen(elem);


document.addEventListener("webkitfullscreenchange", function () {
	var fullscreen = (document.webkitIsFullScreen)? "on" : "off";
	console.log("fullscreen:"+fullscreen);
	if(fullscreen == "off"){
		//ToggleScreen();
	}
 }, false);

function ToggleFullScreen_mode(){	
	 if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}
/*
function ToggleScreenoff(){
	document.webkitCancelFullScreen();
	canvas.width  = gamewidth;
	canvas.height = gameheight;
	console.log("fullscreen off");
}
*/