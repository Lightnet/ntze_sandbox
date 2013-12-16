
var turbulenz_app;


var canvasSupported = true;
// Engine startup
window.onload = function ()
{
	var appEntry = TurbulenzEngine.onload;
	var appShutdown = TurbulenzEngine.onunload;
	if (!appEntry) {
		window.alert("TurbulenzEngine.onload has not been set");
		return;
	}

	var canvas = document.getElementById('canvas');

	var startCanvas = function startCanvasFn()
	{
		if (canvas.getContext && canvasSupported)
		{
			TurbulenzEngine = WebGLTurbulenzEngine.create({
				canvas: canvas
				//fillParent: true
			});

			if (!TurbulenzEngine) {
				window.alert("Failed to init TurbulenzEngine (canvas)");
				return;
			}

			TurbulenzEngine.onload = appEntry;
			TurbulenzEngine.onunload = appShutdown;
			
			turbulenz_app = appEntry();
			//console.log("appload...?");
		}
	}

	var previousOnBeforeUnload = window.onbeforeunload;
	window.onbeforeunload = function ()
	{
		if (TurbulenzEngine.onunload) {
			TurbulenzEngine.onunload.call(this);
		}
	};  // window.beforeunload

	startCanvas();
};  // window.onload()
