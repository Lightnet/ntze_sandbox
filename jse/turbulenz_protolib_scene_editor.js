/*
 * Work in progress prototype.
*/

/*

mesh = protolib.loadMesh({mesh: "models/duck.dae"});
var clonemesh =  mesh.node.clone("clonemesh");
//will not work right after cloning. It has to wait until it fully loaded.

*/
var __extends = this.__extends || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      __.prototype = b.prototype;
      d.prototype = new __();
  };

/*{{ javascript("jslib/aabbtree.js") }}*/
/*{{ javascript("jslib/camera.js") }}*/
/*{{ javascript("jslib/floor.js") }}*/
/*{{ javascript("jslib/geometry.js") }}*/
/*{{ javascript("jslib/material.js") }}*/
/*{{ javascript("jslib/light.js") }}*/
/*{{ javascript("jslib/scenenode.js") }}*/
/*{{ javascript("jslib/scene.js") }}*/
/*{{ javascript("jslib/vmath.js") }}*/
/*{{ javascript("jslib/effectmanager.js") }}*/
/*{{ javascript("jslib/shadermanager.js") }}*/
/*{{ javascript("jslib/texturemanager.js") }}*/
/*{{ javascript("jslib/renderingcommon.js") }}*/
/*{{ javascript("jslib/defaultrendering.js") }}*/
/*{{ javascript("jslib/resourceloader.js") }}*/
/*{{ javascript("jslib/scenedebugging.js") }}*/
/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/physicsmanager.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/vertexbuffermanager.js") }}*/
/*{{ javascript("jslib/indexbuffermanager.js") }}*/
/*{{ javascript("jslib/mouseforces.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("jslib/services/gamesession.js") }}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/
/*{{ javascript("scripts/htmlcontrols.js") }}*/
/*{{ javascript("scripts/sceneloader.js") }}*/

/*global TurbulenzEngine: true */
/*global DefaultRendering: false */
/*global RequestHandler: false */
/*global SceneLoader: false */
/*global SceneNode: false */
/*global TurbulenzServices: false */
/*global TextureManager: false */
/*global ShaderManager: false */
/*global EffectManager: false */
/*global Scene: false */
/*global Camera: false */
/*global CameraController: false */
/*global Floor: false */
/*global MouseForces: false */
/*global PhysicsManager: false */
/*global InterpolatorController: false */
/*global HTMLControls: false */

var scenelistmodel;
var objectmodel;
var _mathDevice;
var protolibmeshmodel;
var turbulenzmodel;


var TurbulenzModel = function(){
	var self = this;
	self.name = ko.observable('none');
	self.text_snapgrid = ko.observable('Snap Grid[on]');
	self.text_snappos = ko.observable('Snap Pos[on]');
	self.text_snaprot = ko.observable('Snap Rotate[off] ');
	self.text_snapscale = ko.observable('Snap Scale[off]');
	self.text_physics = ko.observable('Physics Manager[on]');
	self.text_world = ko.observable('Dynamics World[on]');
	self.text_input = ko.observable('Input[on]');
	self.text_cameraController = ko.observable('Camera Controller[on]');
	self.text_debug = ko.observable('Debug[on]');
	
	self.funinput = function (){	
		if(turbulenz_app.fninput() == true){
			self.text_input('Input[on]');
		}else{
			self.text_input('Input[off]');
		}		
	}
	
	self.funcameraController = function (){
		console.log("toggle fndebugMode");		
		if(turbulenz_app.fncameraController() == true){
			self.text_cameraController('Camera Controller[on]');
		}else{
			self.text_cameraController('Camera Controller[off]');
		}	
	}
	
	self.fundebug = function (){
		if(turbulenz_app.fndebugMode() == true){
			self.text_debug('Debug Mode[on]');
		}else{
			self.text_debug('Debug Mode[off]');
		}		
	}
	
	self.fungridsnap = function (){	
		if(turbulenz_app.fnGridSnap() == true){
			self.text_snapgrid('Snap Grid[on]');
		}else{
			self.text_snapgrid('Snap Grid[off]');
		}		
	}
	
	self.funsnaprot = function (){
		console.log("toggle fndebugMode");		
		if(turbulenz_app.fnsnaprot() == true){
			self.text_snaprot('Snap Rotate[on]');
		}else{
			self.text_snaprot('Snap Rotate[off]');
		}		
	}
	
	self.funsnapscale = function (){
		console.log("toggle fndebugMode");		
		if(turbulenz_app.fnsnapscale() == true){
			self.text_snapscale('Snap Scale[on]');
		}else{
			self.text_snapscale('Snap Scale[off]');
		}		
	}
	
	self.funphysics = function (){	
		if(turbulenz_app.fnphysics() == true){
			self.text_physics('Physics Manager[on]');
		}else{
			self.text_physics('DPhysics Manager[off]');
		}		
	}
	self.funworld = function (){
		if(turbulenz_app.fnworld() == true){
			self.text_world('Dynamics World[on]');
		}else{
			self.text_world('Dynamics World[off]');
		}		
	}
};

var _blockdata = function(){
	this.name = "";
	this.pos = null;
	this.btype = "blocks";
};

var _object = function(){
	var self = this;
}

var ProtolibMeshModel = function(){
	var self = this;
	self.name = ko.observable('none');
	self.object = null;
	self.text_select = ko.observable('Select');
	self.text_delete = ko.observable('Delete');
	self.text_visible = ko.observable('Visible[on]');
	self.text_benable = ko.observable('Enable[on]');
	self.text_physics = ko.observable('phy');
	
	self.process = function (){};
	self.fnvisible = function (){
		if(self.object.getEnabled() == true){
			self.object.setEnabled(false);
			self.text_visible('Visible[off]');
		}else{
			self.object.setEnabled(true);
			self.text_visible('Visible[on]');
		}
	};
	
	self.fnenable = function (){
		//if(self.object.getEnabled() == true){
			//self.object.setEnabled(false);
			//self.text_benable('visible[off]');
		// }else{
			//self.object.setEnabled(true);
			//self.text_benable('visible[on]');
		// }
	};
	
	self.fnselect = function (){
		console.log(self.object);
		console.log(self.object.getEnabled());
	};	
};

var ProtolibMeshModelView = function(){
	var self = this;
	self.objectlist = ko.observableArray([]);
	
	self.addobj = function() {
		var _object  = new _sceneobject();
        self.objectlist.push(_object);
		console.log("clear...");
    }
	
	self.clear = function() {
		//self.objectlist = ko.observableArray([]);
		self.objectlist([]);
		console.log("clear...");
	}
	
	self.refresh = function() {
		//console.log("test?");
		self.objectlist([]);
		if(turbulenz_app.fnMeshes !=null){
			console.log("found scene!");
			var lsceneobj = turbulenz_app.fnMeshes();
			for (var i = 0; i < lsceneobj.length;i++ ){
				var _sobject  = new ProtolibMeshModel();
				console.log(lsceneobj[i]);
				_sobject.name = lsceneobj[i].node.name;
				_sobject.object = lsceneobj[i];
				self.objectlist.push(_sobject);
			}
		}
    }	
};


var _objectmodel = function (){

	var self = this;
	self.name = ko.observable('none');
	
	
	self.px = ko.observable('0');
	self.py = ko.observable('0');
	self.pz = ko.observable('0');
	
	self.r0 = ko.observable('0');
	self.r1 = ko.observable('0');
	self.r2 = ko.observable('0');
	self.r3 = ko.observable('0');
	
	self.sx = ko.observable('1');
	self.sy = ko.observable('1');
	self.sz = ko.observable('1');
	//self.name = 'none';
	
	self.setobject = function(_obj){
		console.log(_obj);
		console.log(_mathDevice);
		//console.log(_obj.getLocalTransform());	
		var _matrix = _obj.getLocalTransform();
		console.log(_matrix);
		var _pos3 = _mathDevice.m43Pos(_matrix);
		//var vecScale = _mathDevice.v3ScalarBuild(1);
		//var _scale3 = _mathDevice.m43Scale(_matrix);
		var	_rot = _mathDevice.quatFromM43(_matrix);		
		//console.log(_pos3);
		console.log(_rot);
		//console.log(_scale3);
		self.px(_pos3[0]);
		self.py(_pos3[1]);
		self.pz(_pos3[2]);
		
		self.r0(_rot[0]);
		self.r1(_rot[1]);
		self.r2(_rot[2]);
		self.r3(_rot[3]);
		/*
		//example usage:
		var rotation = mathDevice.quatBuild(0, 0, 0, 1);
		var translation = mathDevice.v3Build(10, 10, 10);
		var scale = mathDevice.v3Build(2, 1, 1);
		var transform = mathDevice.m43FromRTS(rotation, translation, scale);
		*/
		
	}
	
	self.update = function(){
	
	
	}
}

var _sceneobject = function(){
	var self = this;
	self.name = ko.observable('none');
	self.object = null;
	self.text_select = ko.observable('Select');
	self.text_delete = ko.observable('Delete');
	self.text_benable = ko.observable('Enable[on]');
	self.text_visible = ko.observable('Visible[on]');
	self.text_physics = ko.observable('Physics');
	
	self.process = function (){}
	
	self.fnenable = function (){
	
	
		//if(self.object.getEnabled() == true){
			//self.object.setEnabled(false);
			//self.text_benable('visible[off]');
		// }else{
			//self.object.setEnabled(true);
			//self.text_benable('visible[on]');
		// }
	};
	
	self.fnvisible = function (){
		console.log(self.object);
		self.object.setDynamic();
		if(self.object.getDisabled() == true){
			self.object.setDisabled(false);
			//self.object.getEnabled();
			self.text_visible('Visible[off]');
		}else{
			self.object.setDisabled(true);
			self.text_visible('Visible[on]');
		}
	};
	
	self.fnselect = function (){
		if(objectmodel !=null){
			console.log(self.name);
			objectmodel.name(self.name);
			objectmodel.setobject(self.object);
		}
	}	
};

var _scenelistmodel = function(){
	var self = this;
	self.objectlist = ko.observableArray([]);
	
	self.addobj = function() {
		var _object  = new _sceneobject();
        self.objectlist.push(_object);
		console.log("clear...");
    }
	
	self.clear = function() {
		//self.objectlist = ko.observableArray([]);
		self.objectlist([]);
		console.log("clear...");
	}
	
	self.refresh = function() {
		//console.log("test?");
		self.objectlist([]);
		if(turbulenz_app.FnSceneNodes !=null){
			console.log("found scene!");
			var lsceneobj = turbulenz_app.FnSceneNodes().rootNodes;
			for (var i = 0; i < lsceneobj.length;i++ ){
				var _sobject  = new _sceneobject();
				_sobject.name = lsceneobj[i].name;
				_sobject.object = lsceneobj[i];
				self.objectlist.push(_sobject);
			}
		}
    }	
};
//create model for the knockout.js
scenelistmodel = new _scenelistmodel();
objectmodel = new _objectmodel();
turbulenzmodel = new TurbulenzModel();
protolibmeshmodel = new ProtolibMeshModelView();

TurbulenzEngine.onload = function onloadFn() {

	//key bind when load into the window else it give error for some reason
	ko.applyBindings(scenelistmodel,document.getElementById('panel_sceneobjects'));
	ko.applyBindings(objectmodel,document.getElementById('panel_object'));
	ko.applyBindings(turbulenzmodel,document.getElementById('panel_tool_object'));
	ko.applyBindings(protolibmeshmodel,document.getElementById('panel_protolibomeshes'));
	
	
	//console.log(TurbulenzEngine);
	console.log("TurbulenzEngine version: "+TurbulenzEngine.version);
	//{
	var intervalID;
	//intervalID = TurbulenzEngine.setInterval(update, 1000 / 60);
	//TurbulenzEngine.clearInterval(intervalID);
	
	var rotationMatrix = null;
	var rotationAngleMatrix = null;
	
	var updateAspectRatio;
	var camera;
	var cameraController;
	var renderer;
	var scene;
	var nodeRoot;
	var draw2D;
	
	var mathDevice = null;
	var graphicsDevice;
	var inputDevice;
	var physicsDevice;
	var dynamicsWorld;
	var textureManager;
	var shaderManager;
	var effectManager;
	var sceneLoader;
	var physicsManager;
	var animationManager;
	
	var inputDeviceParameters = {};
	var physicsDeviceParameters = {};
	var dynamicsWorldParameters = {};
	var requestHandlerParameters = {};
	var requestHandler = RequestHandler.create(requestHandlerParameters);
	var errorCallback = function errorCallback(msg) {
		//window.alert(msg);
		console.log("ERROR MSG!");
		console.log(msg);
	};
	function yieldFn(callback){
		TurbulenzEngine.setTimeout(callback, 0);
	};
	
	var levelLoaded = false;
	function levelLoadedFn(){levelLoaded = true;};
	var protolib;
	var clearColor = [0.95, 0.95, 1.0, 1.0];
	var floor;
	var mesh = null;
	var meshes = [];
	
	var previousFrameTime = TurbulenzEngine.time;
	var mouseForces;
	var handleForces;
	
	var keyCodes;
	var mouseCodes;
	
	var techniqueParameters2d;
	var technique2d;
	
	var debugMode = true;
	
	var x1;
	var y1;
	var x2;
	var y2;
	var drawObject;
	var sprite;

	var linePrim;
	var cursorFormat;
	var cursorSemantic;
	
	var collisionMargin = 0.005;
    var mass = 20.0;
    var numCubes = 200;
    var cubeExtents;
	
	var m43MulM44;
	var isVisibleBoxOrigin;
	var shader3d = null;
	var technique3d = null;
	var primitive;
	var numIndices = 36;
	var chFormats;
	var chSemantics;
	
	var boxBodies = [];
	var contactWorldTransform;
	var contactWorldPoint;
    var contacts = [];
	
	// The objects needed to draw the contact callbacks
    var contactsTechnique;
    var contactsShader;
    var contactsTechniqueParameters;
    var contactsSemantics;
    var contactsFormats;
	var shader;
	var shader2d;
	var face_normal_set;
	var rayhit_set;
	var character;
	var characterController;
	var CharacterShape;
	var resourceLoader;
	var mappingTable;
	
	// Settings for the animation
	var settings = {
		animScale: 1,
		defaultRate: 1,
		drawDebug: false,
		drawInterpolators: false,
		drawWireframe: false,
		loopAnimation: true,
		blendAnimation: false,
		transitionLength: 1
	};
	// The default animation to start with
    var defaultAnimIndex = 0;
	// The current playing animation
    var curAnimIndex = 0;
	// The controller references by index
    var controllerMap = [];
	var addAnimations = ["models/anime_low_poly_gender_20131128.dae"];
	var removeAnimations = [];
	// The controller to blend the transisitions between animations, that don't have a matching key frame
	var transitionController = null;
	var transitionStartColor = [0, 0, 0];
	var transitionEndColor = [0, 0, 0];

	// Reference controller for the whole animation
	var currentReferenceController = null;
	var currentNodeController = null;
	var animationsLoaded;
	var soundDeviceParameters = {
		linearDistance: false
	};
	var soundDevice;
	var soundManager;
	//===========================================
	// EDITOR
	//===========================================
	var selectcube;
	var bselectobject = false;
	var singleselectobject;
	var selectsinglecollisionobject;
	
	var bgridsnap = true;
	var bsnaprot = true;
	var bsnapscale = true;
	var bphysics = true;
	var bworld = true;
	var bcameraController = true;
	var binput = true;
	
	var blocks = [];
	var loadobjects = [];
	
	//}
	
	function onIntializedFn(protolib){
		//var version = protolib.version;
		//console.log(version);
		console.log(protolib);
		mathDevice = protolib.getMathDevice();
		_mathDevice = mathDevice;
		graphicsDevice = protolib.getGraphicsDevice();
		inputDevice = protolib.getInputDevice();
		textureManager = protolib.globals.textureManager;
		shaderManager = protolib.globals.shaderManager;
		//console.log(protolib);
		effectManager = protolib.globals.EffectManager;
		//sceneLoader = SceneLoader.create();
		sceneLoader = protolib.globals.simplesceneloader;//SceneLoader.create();
		//console.log(sceneLoader);
		physicsDevice = TurbulenzEngine.createPhysicsDevice(physicsDeviceParameters);
		dynamicsWorld = physicsDevice.createDynamicsWorld(dynamicsWorldParameters);
		//console.log(dynamicsWorld);
		physicsManager = PhysicsManager.create(mathDevice, physicsDevice, dynamicsWorld);
		resourceLoader = ResourceLoader.create();
		animationManager = AnimationManager.create(errorCallback);
		soundDevice = protolib.getSoundDevice();
		//soundManager = SoundManager.create(soundDevice, requestHandler, defaultSound, errorCallback);
		soundManager = SoundManager.create(soundDevice, requestHandler);
		console.log(soundManager);
		renderer = protolib.globals.renderer;		
		camera = protolib.globals.camera;
		scene = protolib.globals.scene;
		
		// example usage:
		var mappingTableReceived = function tableReceivedFn(mappingTable){
			// load assets here
			animationManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
			textureManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
			shaderManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
			soundManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
			sceneLoader.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
			
			init_assest();
		};
		
		var gameSessionCreated = function gameSessionCreatedFn(gameSession) {
			mappingTable = TurbulenzServices.createMappingTable(requestHandler, gameSession, mappingTableReceived);
			//console.log(mappingTable);
		};
		
		var gameSession = TurbulenzServices.createGameSession(requestHandler, gameSessionCreated);
		//console.log(gameSession);
		
		cubeExtents = mathDevice.v3Build(0.5, 0.5, 0.5);
		m43MulM44 = mathDevice.m43MulM44;
		isVisibleBoxOrigin = mathDevice.isVisibleBoxOrigin;
		
		primitive = graphicsDevice.PRIMITIVE_TRIANGLES;
		linePrim = graphicsDevice.PRIMITIVE_LINES;
		cursorFormat = [graphicsDevice.VERTEXFORMAT_FLOAT3];
		cursorSemantic = graphicsDevice.createSemantics([graphicsDevice.SEMANTIC_POSITION]);
		
		chSemantics = graphicsDevice.createSemantics(['POSITION']);
		chFormats = [graphicsDevice.VERTEXFORMAT_FLOAT3];
		contactWorldTransform = mathDevice.m43BuildIdentity();
		contactWorldPoint = mathDevice.v3BuildZero();
		contactsSemantics = graphicsDevice.createSemantics([
			'POSITION'
		]);
		contactsFormats = [
			graphicsDevice.VERTEXFORMAT_FLOAT3
		];
		
		if (!graphicsDevice.shadingLanguageVersion) {
			//errorCallback("No shading language support detected.\nPlease check your graphics drivers are up to date.");
			console.log("No shading language support detected.\nPlease check your graphics drivers are up to date.");
			//graphicsDevice = null;
			//return;
		}else{
			console.log("shading Language Version: "+graphicsDevice.shadingLanguageVersion);
		}
		
		//=====================================================================
		//loading shaders START
		//=====================================================================
		shaderManager.load("shaders/generic2D.cgfx", function (shaderObject) {
			shader2d = shaderObject;
			technique2d = shader2d.getTechnique("constantColor2D");
			techniqueParameters2d = graphicsDevice.createTechniqueParameters({
				clipSpace: null,
				constantColor: mathDevice.v4Build(0, 0, 0, 1)
			});
			//console.log(technique2d);
			//console.log(techniqueParameters2d);
			//console.log(shader2d);
		});
		
		shaderManager.load('shaders/font.cgfx', function (shaderObject) {
			shader = shaderObject;
			//console.log(shader);
		});	
		
		shaderManager.load("shaders/debug.cgfx", function (shaderObject) {
			contactsShader = shaderObject;
			contactsTechnique = contactsShader.getTechnique("debug_lines_constant");
			contactsTechniqueParameters = graphicsDevice.createTechniqueParameters({
				worldViewProjection: null,
				constantColor: mathDevice.v4Build(1, 0, 0, 1)
			});
			//console.log(contactsShader);
			//console.log(contactsTechnique);
			//console.log(contactsTechniqueParameters);
		});
		//=====================================================================
		//loading shaders END
		//=====================================================================
		
		draw2D = Draw2D.create({
			graphicsDevice : graphicsDevice
			//initialGpuMemory : 1024,
			//maxGpuMemory : (1024 * 1024)
		});
		
		draw2D.configure({
			scaleMode: 'scale',
			viewportRectangle: [0, 0, graphicsDevice.width, graphicsDevice.height]
			//viewportRectangle: [0, 0, 800, 600]
		});

		var dragMin = mathDevice.v3Build(-50, -50, -50);
		var dragMax = mathDevice.v3Build(50, 50, 50);
		mouseForces = MouseForces.create(graphicsDevice, inputDevice, mathDevice, physicsDevice, dragMin, dragMax);
		handleForces = HandleForces.create(graphicsDevice, inputDevice, mathDevice, physicsDevice, dragMin, dragMax);
		var worldUp = mathDevice.v3BuildYAxis();
		mouseForces.clamp = 400;
		handleForces.clamp = 400;
		
		// Control codes
		keyCodes = inputDevice.keyCodes;
		mouseCodes = inputDevice.mouseCodes;
		
		//===========================================================
		// protolib Camera
		//===========================================================
		protolib.setCameraPosition(mathDevice.v3Build(0, 1, -2));
		protolib.setCameraDirection(mathDevice.v3Build(0, 0, 1));
		protolib.setAmbientLightColor(mathDevice.v3Build(1, 1, 1));
		protolib.addPointLight({
			v3Position: mathDevice.v3Build(-1, 1, -1),
			v3Color: mathDevice.v3Build(1, 1, 1),
			radius: 10
		});
		
		cameraController = CameraController.create(graphicsDevice, inputDevice, camera);
		
		//===========================================================
		// Input functions
		//===========================================================
		/*
		var keyUp = function keyUpFn(key) {
			console.log("key press");
			if (key === keyCodes.T) {
				//cameraIndex = (cameraIndex + 1) % cameraFixedPositions.length;
				//switchToTargetCam(cameraIndex);
			}

			if (key === keyCodes.O) {
				//switchToOrbitCam();
			}

			if (key === keyCodes.C) {
				//switchToChaseCam();
			}

			if (key === keyCodes.RETURN) {
				//graphicsDevice.fullscreen = !graphicsDevice.fullscreen;
				//console.log("Fullscreen toggle?");
			}
		};
		
		inputDevice.addEventListener("keyup", keyUp);
		*/
		
		var onMouseDown = function (button) {
			//console.log(button);
			//if(mouseCodes.BUTTON_0 === button || mouseCodes.BUTTON_1 === button) {
			if(mouseCodes.BUTTON_0 === button) {
				mouseForces.onmousedown();
				//console.log(mouseForces);
				//console.log(camera);
				//console.log(pickedBody);
				//console.log(handleForces);
				//console.log(handleForces.pickedBody);
				singleselectobject = handleForces.pickedBody;
				
				//console.log(dynamicsWorld);
				//console.log(physicsManager);
			}
		};
		
		var onMouseUp = function (button) {
			//if(mouseCodes.BUTTON_0 === button || mouseCodes.BUTTON_1 === button) {
			if(mouseCodes.BUTTON_0 === button) {
				mouseForces.onmouseup();
				//console.log(mouseForces.pickedBody);
				//console.log(pickedBody);
				//console.log(handleForces.pickedBody);
				//console.log(dynamicsWorld);
				singleselectobject = handleForces.pickedBody;
			}
			if(mouseCodes.BUTTON_2 === button) {
				//mouseForces.onmouseup();
				//console.log(mouseForces.pickedBody);
				//fireBox();
			}
		};
		
		var onKeyUp = function physicsOnkeyupFn(keynum) {
			//console.log(keynum);
			if(keynum === keyCodes.B)// 'b' key
			{
				//reset();
				BuildBlockFloor();
			}
			
			if(keynum === keyCodes.V) //
			{
				DestoryBlock();
				
			}
			
			if(keynum === keyCodes.R)// 'r' key
			 {
				//reset();
			}
			if(keynum === keyCodes.SPACE)// Spacebar
			 {
				//fireBox();
				console.log("FIRE!");
				if(CharacterShape !=null){
					CharacterShape.jump();
				}
			} else {
				cameraController.onkeyup(keynum);
			}
		};
				
		var onKeyDown = function physicsOnkeyupFn(keynum) {		
			if(keynum === keyCodes.F){
				if(CharacterShape !=null){
					//CharacterShape.position(mathDevice.v3Build(-1, 0, 0));
					console.log(CharacterShape.position);
					//var pos = CharacterShape.position;
					//pos[0] += 0.1;
					//CharacterShape.position = pos;
					var pos = CharacterShape.linearVelocity
					pos[0] = 1;
					CharacterShape.linearVelocity = pos;
				}
			}
			if(keynum === keyCodes.H){
				if(CharacterShape !=null){
					CharacterShape.position(mathDevice.v3Build(1, 0, 0));
					
				}
			}
			if(keynum === keyCodes.B)// 'b' key
			{
				//reset();
				BuildFloor();
			}
		
			if(keynum === keyCodes.R)// 'r' key
			{
				//reset();
			}
			if(keynum === keyCodes.SPACE)// Spacebar
			 {
				//fireBox();
				console.log("FIRE!");
				if(CharacterShape !=null){
					CharacterShape.jump();
				}
			} else {
				cameraController.onkeyup(keynum);
			}
		};
		
		// Add event listeners
		inputDevice.addEventListener("keyup", onKeyUp);
		//inputDevice.addEventListener("keydown", onKeyDown);
		inputDevice.addEventListener("mousedown", onMouseDown);
		inputDevice.addEventListener("mouseup", onMouseUp);
		
		//===========================================================
		//
		//===========================================================
		
		//init frame render 
		intervalID = TurbulenzEngine.setInterval(update, 1000 / 60);
		//console.log(intervalID);
		floor = Floor.create(graphicsDevice, mathDevice);
		//floor.numLines = 400;
		floor.numLines = 500;
		var translateVec = mathDevice.v3Build(0, 0, -1);
		protolib.moveCamera(translateVec);
		
		x1 = 5 ;
        y1 = 5;
        x2 = 10; //graphicsDevice.width - 550;
        y2 = 10;//graphicsDevice.height - 550;
		
		var rectangle = [x1, y1, x2, y2];
		
		drawObject = {
            color: [1.0, 0.0, 0.0, 1.0],
            destinationRectangle: rectangle
        };
		
		sprite = Draw2DSprite.create({
            width: 1,
            height: 1,
            x: graphicsDevice.width / 2 + 1,
            y: graphicsDevice.height / 2 + 1,            
            rotation: Math.PI / 4,
			color: [1.0, 1.0, 0.5, 1.0]
        });
		//===========================================================
		//
		//===========================================================
		
		init_funs();
	};
	
	// Function for aspect ratio
	updateAspectRatio = function() {
		var aspectRatio = (graphicsDevice.width / graphicsDevice.height);
		if(aspectRatio !== camera.aspectRatio) {
			camera.aspectRatio = 16/9;	// Keep mine 16/9 ratio (1920/1080 that is)
			camera.updateProjectionMatrix();
		}
		camera.updateViewProjectionMatrix();	
	};
	
	//exeute from init
	function init_funs(){
		CreateFloorShape();
		PreLoadObjects();
		//CreateObjects();
		//CreateBoxShape();
		//BuildFloor();
		//createcube_solid();
		//CreateCapsuleShape();
		//var testve = mathDevice.v3Build(0, 0, 0);
		//console.log(testve);
	}
	
	//exeute from mappingTable
	function init_assest(){
		init_animation_load();
	}
	
	var animationsLoadedCallback = function animationsLoadedCallbackFn(jsonData) {
		//var addAnimNum = (addAnimations.length - animationsLoaded);
		//animationManager.loadData(jsonData, "AnimExtra" + addAnimNum + "-");
		//animationsLoaded -= 1;
		animationManager.loadData(jsonData, "AnimExtra" + 1 + "-");
	};
	
	function init_animation_load(){
		//console.log(TurbulenzServices);		
		var path = addAnimations[0];
		resourceLoader.load(mappingTable.getURL(path), {
			append: true,
			onload: animationsLoadedCallback,
			requestHandler: requestHandler
		});	
	}
		
	var idxobj = 0;
	var cubeidx = 0;
	var _physicsNode;
	
	//=====================================================
	// Objects START
	//=====================================================
	function PreLoadObjects(){
		//var animationsets = animationManager.loadFile("models/anime_low_poly_gender_20131128.dae");
		//console.log(animationsets);
		//var animations = animationManager.getAll();
		//console.log(animations);
		mesh = protolib.loadMesh({mesh: "models/duck.dae"});
		meshes.push(mesh);
		console.log(mesh);
		//mesh.setSize([5,10,15]);
		//mesh.setPosition([20,25,30]);
		selectcube = protolib.loadMesh({mesh: "models/basecube.dae"});
		selectcube.setSize(mathDevice.v3Build(0.5, 0.5, 0.5));
		//character = protolib.loadMesh({mesh: "models/anime_low_poly_gender_20131128.dae"});	
		//console.log(scene);
		//console.log(selectcube);
	}
	
	function BuildBlockFloor(){
		cubeidx += 1;
		//var position = mathDevice.m43BuildTranslation(0, 3, 0);
		//var position = rayhit_set;
		//var setx = Math.floor(rayhit_set[0]+face_normal_set[0]);
		//var sety = Math.floor(rayhit_set[1]+face_normal_set[1]);
		//var setz = Math.floor(rayhit_set[2]+face_normal_set[2]);
		
		var setx = rayhit_set[0];
		var sety = rayhit_set[1];
		var setz = rayhit_set[2];
		
		var bfound = false;
		console.log(blocks);
		for (var i = 0; i < blocks.length;i++){
			//console.log(blocks[i].pos);
			//console.log(rayhit_set);
			if((blocks[i].pos[0] == rayhit_set[0])&&(blocks[i].pos[1] == rayhit_set[1])&&(blocks[i].pos[2] == rayhit_set[2])){
				bfound = true;
				//console.log("found block");
				break;
			}
		}
		
		if(bfound == false){		
			//console.log(rayhit_set);
			var position = mathDevice.m43BuildTranslation(setx, sety, setz);
			
			var cubeExtents = mathDevice.v3Build(0.5, 0.5, 0.5);
			var boxShape = physicsDevice.createBoxShape({
				halfExtents: cubeExtents,
				margin: 0.001
			});
			var inertia = mathDevice.v3Copy(boxShape.inertia);
			inertia = mathDevice.v3ScalarMul(inertia, 0.5);
			var identity = mathDevice.m43BuildIdentity();
			
			var box = physicsDevice.createCollisionObject({
				shape: boxShape,
				mass: 1.0,
				transform: position,
				friction: 0.8,
				restitution: 0.1,
				group: physicsDevice.FILTER_STATIC,
				mask: physicsDevice.FILTER_ALL
			});
			var newBox = SceneNode.create({
				name: "cube" + cubeidx,
				local: position,
				dynamic: true,
				disabled: false
			});
			var physicsNode = _physicsNode = {
				body: box,
				target: newBox,
				dynamic: true
			};
			newBox.physicsNodes = [
				physicsNode
			];
			
			newBox.setDynamic();
			physicsManager.physicsNodes.push(physicsNode);
			physicsManager.dynamicPhysicsNodes.push(physicsNode);
			physicsManager.enableHierarchy(newBox, true);
			scene.addRootNode(newBox);
			console.log(newBox);
			console.log(physicsNode);
			//console.log(physicsManager);
			
			var bloc = new _blockdata();
			//console.log(bloc);
			bloc.pos = mathDevice.v3Build(setx, sety, setz)
			blocks.push(bloc);
		}
	}
	
	function DestoryBlock(){
		console.log("DestoryBlock");
		
		var sceneobject;
		var physicsobject;
		
		var bfound = false;;
		for (var i = 0; i < scene.rootNodes.length; i++){
			//console.log(scene.rootNodes[i].name);
			if(scene.rootNodes[i].physicsNodes !=null){
				//console.log(scene.rootNodes[i].physicsNodes[0]);
				sceneobject = scene.rootNodes[i];
				if(scene.rootNodes[i].physicsNodes[0].body == selectsinglecollisionobject){
					physicsobject = scene.rootNodes[i].physicsNodes[0];
					//console.log("found collision in the scene");
					bfound = true;
					break;
				}
			}
		}
		
		if(bfound == true){
			//remove collisoin from the physicsManager
			physicsManager.deletePhysicsNode(physicsobject);
			//remove scene object
			scene.removeRootNode(sceneobject);
		}
		
		
		
		//console.log("singleselectobject");
		//console.log(selectsinglecollisionobject);
		//console.log("_physicsNode");
		//console.log(_physicsNode);
		//console.log(singleselectobject.transform);
		
		/*
		if(_physicsNode.body == selectsinglecollisionobject){
			console.log("found collision");
		
		}else{
			console.log("no found collision");
		}
		*/
		
		/*
		console.log("_physicsNode");
		console.log(_physicsNode);
		if(_physicsNode.body == singleselectobject){
		
			console.log("found!");
		}else{
			console.log("not found!");
		}
		*/
		
		//physicsManager.deletePhysicsNode(_physicsNode);
	}
	
	CreatePhysicsCube = function(){
		idxobj += 1;
		var margin = 0.001;
		
		var lodmesh = protolib.loadMesh({mesh: "models/duck.dae"});
		lodmesh.setPosition(mathDevice.v3Build(0, -.5, 0));//off set
		
		var halfExtents = mathDevice.v3Build(0.5, 0.5, 0.5);
		var position = mathDevice.m43BuildTranslation(0, 5, 0);//starting position
	
		var shape = physicsDevice.createBoxShape({
            halfExtents: halfExtents,
            margin: margin
        });
	
		function newPhysicsNode(name, _shape, offsetTransform, pos) {
            var duckPhys = SceneNode.create({
                name: name + "Phys" + idxobj,
                local: pos,
                dynamic: true,
                disabled: false
            });
            var rigidBody = physicsDevice.createRigidBody({
                shape: _shape,
                mass: mass,
                inertia: mathDevice.v3ScalarMul(_shape.inertia, mass),
                transform: pos,
                friction: 0.7,
                restitution: 0.2,
                angularDamping: 0.4
            });
            var physicsNode = {
                body: rigidBody,
                target: duckPhys,
                dynamic: true
            };
            scene.addRootNode(duckPhys);
            duckPhys.addChild(lodmesh.node);
            duckPhys.physicsNodes = [
                physicsNode
            ];
            duckPhys.setDynamic();
            physicsManager.physicsNodes.push(physicsNode);
            physicsManager.dynamicPhysicsNodes.push(physicsNode);
            physicsManager.enableHierarchy(duckPhys, true);
        }
		newPhysicsNode("DuckBox", shape, mathDevice.m43BuildIdentity(), position);
	};
	
	function CreateObjects(){
		var margin = 0.001;
		//===========================================================
		//
		//===========================================================
		//mesh = protolib.loadMesh({mesh: "models/duck.dae"});
		//mesh.setPosition(mathDevice.v3Build(0, -.5, 0));
		
		
		
		
		//console.log(mesh);
		
		//var clonemesh =  mesh.node.clone("clonemesh");
		//var clonemesh =  mesh.node.clone();
		//console.log(clonemesh.isInScene());
		//console.log(clonemesh);
		//clonemesh.update(protolib.globals.scene);
		//protolib.globals.scene.addRootNode(clonemesh);
		
		/*
		var halfExtents = mathDevice.v3Build(0.5, 0.5, 0.5);
		var position = mathDevice.m43BuildTranslation(0, 5, 0);
		//var position = mesh.localTransform;
		var shape = physicsDevice.createBoxShape({
            halfExtents: halfExtents,
            margin: margin
        });
		
		function newPhysicsNode(name, shape, offsetTransform, pos) {
            //var duckGeom = duckMesh.clone(name + "Geom");
			//console.log(duckGeom);
            //physicsManager.deletePhysicsNode(duckGeom.physicsNodes[0]);
            //duckGeom.physicsNodes = [];
            //mesh.setLocalTransform(offsetTransform);
			//console.log(scene);
			//var duckMesh0 = scene.findNode("models/duck.dae0");
			//console.log(duckMesh0);
			//duckMesh0
			//duckMesh0.setPosition(mathDevice.v3Build(0, 4, 0));
			//var clonemesh = duckMesh0.clone("models/duck.dae1");
			//console.log(clonemesh);
			//protolib.globals.scene.addRootNode(clonemesh);
			//clonemesh.update();
			//scene.findNode
			
			mesh.node.physicsNodes = [];
			
            var duckPhys = SceneNode.create({
                name: name + "Phys",
                local: pos,
                dynamic: true,
                disabled: false
            });
            var rigidBody = physicsDevice.createRigidBody({
                shape: shape,
                mass: mass,
                inertia: mathDevice.v3ScalarMul(shape.inertia, mass),
                transform: pos,
                friction: 0.7,
                restitution: 0.2,
                angularDamping: 0.4
            });
            var physicsNode = {
                body: rigidBody,
                target: duckPhys,
                dynamic: true
            };
            scene.addRootNode(duckPhys);
            //duckPhys.addChild(duckGeom);
            duckPhys.addChild(mesh.node);
            duckPhys.physicsNodes = [
                physicsNode
            ];
            duckPhys.setDynamic();
            physicsManager.physicsNodes.push(physicsNode);
            physicsManager.dynamicPhysicsNodes.push(physicsNode);
            physicsManager.enableHierarchy(duckPhys, true);
        }
		newPhysicsNode("DuckBox", shape, mathDevice.m43BuildIdentity(), position);
		*/
	};
	
	function CreateFloorShape(){
		var floorShape = physicsDevice.createPlaneShape({
			normal: mathDevice.v3Build(0, 1, 0),
			distance: 0,
			margin: 0.001
		});
		var floorObject = physicsDevice.createCollisionObject({
			shape: floorShape,
			//transform: mathDevice.m43BuildIdentity(0,-0.5,0),
			transform: mathDevice.m43BuildTranslation(0, -0.5, 0),
			friction: 0.8,
			restitution: 0.1,
			group: physicsDevice.FILTER_STATIC,
			mask: physicsDevice.FILTER_ALL,
			onProcessedContacts: addContacts //onPreSolveContact : addContact,
			//onAddedContacts : addContacts
		});
		//onRemovedContacts : addContacts
		// Adds the floor collision object to the world
		dynamicsWorld.addCollisionObject(floorObject);
		
		//=================================================
		//cube START
		//=================================================
		//var position = mathDevice.m43BuildTranslation(0.5, 0.5, 0.5);
		var position = mathDevice.m43BuildTranslation(0, 0, 0);
		var cubeExtents = mathDevice.v3Build(0.5, 0.5, 0.5);
		var boxShape = physicsDevice.createBoxShape({
			halfExtents: cubeExtents,
			margin: 0.001
		});
		var inertia = mathDevice.v3Copy(boxShape.inertia);
		inertia = mathDevice.v3ScalarMul(inertia, 1.0);
		var identity = mathDevice.m43BuildIdentity();
		
		var box = physicsDevice.createRigidBody({
                shape: boxShape,
                mass: 1.0,
                inertia: boxShape.inertia,
                transform: position,
                friction: 0.9,
                restitution: 0.1
            });
            var newBox = SceneNode.create({
                name: "box" + "1",
                local: position,
                dynamic: true,
                disabled: false
            });
            var physicsNode = {
                body: box,
                target: newBox,
                dynamic: true
            };
            newBox.physicsNodes = [
                physicsNode
            ];
		
		newBox.setDynamic();
		physicsManager.physicsNodes.push(physicsNode);
        physicsManager.dynamicPhysicsNodes.push(physicsNode);
		physicsManager.enableHierarchy(newBox, true);
		scene.addRootNode(newBox);
		//=================================================
		// cube END
		//=================================================

		createcube_solid();
	}
	
	function createcube_solid(){
		cubeidx += 1;
		var position = mathDevice.m43BuildTranslation(0, 3, 0);
		var cubeExtents = mathDevice.v3Build(0.5, 0.5, 0.5);
		var boxShape = physicsDevice.createBoxShape({
			halfExtents: cubeExtents,
			margin: 0.001
		});
		var inertia = mathDevice.v3Copy(boxShape.inertia);
		inertia = mathDevice.v3ScalarMul(inertia, 0.5);
		var identity = mathDevice.m43BuildIdentity();
		
		var box = physicsDevice.createCollisionObject({
                shape: boxShape,
                mass: 1.0,
                transform: position,
                friction: 0.8,
				restitution: 0.1,
				group: physicsDevice.FILTER_STATIC,
				mask: physicsDevice.FILTER_ALL
            });
            var newBox = SceneNode.create({
                name: "cube" + cubeidx,
                local: position,
                dynamic: true,
                disabled: false
            });
            var physicsNode = {
                body: box,
                target: newBox,
                dynamic: true
            };
            newBox.physicsNodes = [
                physicsNode
            ];
		
		newBox.setDynamic();
		physicsManager.physicsNodes.push(physicsNode);
        physicsManager.dynamicPhysicsNodes.push(physicsNode);
		physicsManager.enableHierarchy(newBox, true);
		scene.addRootNode(newBox);
	}
	
	var parameters = {
        radius: 0.25,
        halfHeight: 1,
        crouchHalfHeight: 0.5,
        rotateSpeed: 2,
        mouseRotateFactor: 2,
        collisionMargin: 1,
        maxSpeed: 12,
        maxStepHeight: 1,
        maxJumpHeight: 2
    };
	
	function CreateCapsuleShape(){
		cubeidx += 1;
		
		var position = mathDevice.m43BuildTranslation(0, 5, 0);
		/*
		characterController = CharacterController.create(graphicsDevice,
                                                     inputDevice,
                                                     physicsDevice,
                                                     dynamicsWorld,
                                                     position,
                                                     parameters);
		
		console.log(characterController);
		*/
		//physicsManager.addNode(character.node, characterController.character._private.rigidBody);
		
		
		
		//var position = mathDevice.m43BuildTranslation(0, 3, 0);
		//var cubeExtents = mathDevice.v3Build(0.5, 0.5, 0.5);
		//var margin = 0.001;
		//var cubeExtents02 = mathDevice.v3Build(0.5, 0.5, 0.5);
		//var identity = mathDevice.m43BuildIdentity();
		//var characterRadius = 0.25;
		//var characterHeight = 1.0;
		//physicsManager.addNode(character.node, characterController.character._private.rigidBody);
		
		/*
		CharacterShape = physicsDevice.createCharacter({
			//transform : position,
			mass: 100.0,
			restitution: 0.1,
			friction: 0.7,
			radius : characterRadius,
			height : characterHeight,
			crouchHeight: (characterHeight * 0.5),
			stepHeight : (characterHeight * 0.1),
			maxJumpHeight : (characterHeight * 0.4),
			group: physicsDevice.FILTER_CHARACTER,
			mask: physicsDevice.FILTER_ALL
		});
		*/
		
		//console.log(CharacterShape);
		//console.log(CharacterShape._private.rigidBody);
		//console.log(physicsManager);
		//physicsManager.addNode(character.node, CharacterShape._private.rigidBody);
		//physicsManager.addNode(sceneNode, rigidBody)

		/*
		var halfExtents = mathDevice.v3Build(0.5, 0.5, 0.5);
		var boxShape = physicsDevice.createBoxShape({
            halfExtents: halfExtents,
            margin: margin
        });
		
		//console.log(dynamicsWorld);
		//dynamicsWorld.addCharacter(boxShape);
		//dynamicsWorld.addCollisionObject(boxShape);
		//console.log(boxShape);
		//console.log(boxShape.inertia);
		
		var inertia = mathDevice.v3Copy(boxShape.inertia);
		inertia = mathDevice.v3ScalarMul(inertia, 0.5);
		
		var box = physicsDevice.createRigidBody({
			shape: boxShape,
			mass: 1.0,
			inertia: inertia,
			transform: position,
			friction: 0.8,
			restitution: 0.1,
		});
		
		var newBox = SceneNode.create({
			name: "cube" + cubeidx,
			local: position,
			dynamic: true,
			disabled: false
		});
		
		var physicsNode = {
			body: box,
			target: newBox,
			dynamic: true
		};
		newBox.physicsNodes = [
			physicsNode
		];
		
		newBox.setDynamic();
		physicsManager.physicsNodes.push(physicsNode);
        physicsManager.dynamicPhysicsNodes.push(physicsNode);
		physicsManager.enableHierarchy(newBox, true);
		*/
		//scene.addRootNode(newBox);
	}
	
	//=====================================================
	// Objects END
	//=====================================================
	
	//=====================================================
	// DEBUG START
	//=====================================================
	
	function addContacts(objectA, objectB, pairContacts) {
        if(debugMode) {
            var numPairContacts = pairContacts.length;
            var n;
            objectB.calculateTransform(contactWorldTransform);
            for(n = 0; n < numPairContacts; n += 1) {
                var pairContact = pairContacts[n];
                mathDevice.m43TransformPoint(contactWorldTransform, pairContact.localPointOnB, contactWorldPoint);
                var contactNormal = pairContact.worldNormalOnB;
                if(numContacts >= contacts.length) {
                    contacts[contacts.length] = new Float32Array(6);
                }
                var contact = contacts[numContacts];
                contact[0] = contactWorldPoint[0];
                contact[1] = contactWorldPoint[1];
                contact[2] = contactWorldPoint[2];
                contact[3] = contactWorldPoint[0] - contactNormal[0];
                contact[4] = contactWorldPoint[1] - contactNormal[1];
                contact[5] = contactWorldPoint[2] - contactNormal[2];
                numContacts += 1;
            }
        }
    };
	
	function drawCrosshair() {
        if(!mouseForces.pickedBody) {
			var screenWidth = graphicsDevice.width;
            var screenHeight = graphicsDevice.height;
			
			if(technique2d !=null){
				graphicsDevice.setTechnique(technique2d);
				if(techniqueParameters2d !=null){
					techniqueParameters2d.clipSpace = mathDevice.v4Build(2.0 / screenWidth, -2.0 / screenHeight, -1.0, 1.0);
					graphicsDevice.setTechniqueParameters(techniqueParameters2d);
				}
			}
			
            var writer = graphicsDevice.beginDraw(graphicsDevice.PRIMITIVE_LINES, 4, chFormats, chSemantics);
            if(writer) {
                var halfWidth = screenWidth * 0.5;
                var halfHeight = screenHeight * 0.5;
                writer([
                    halfWidth - 10, 
                    halfHeight
                ]);
                writer([
                    halfWidth + 10, 
                    halfHeight
                ]);
                writer([
                    halfWidth, 
                    halfHeight - 10
                ]);
                writer([
                    halfWidth, 
                    halfHeight + 10
                ]);
                graphicsDevice.endDraw(writer);
            }
        }
    }
	
	function drawContacts() {
		if (numContacts) {
			
			if(contactsTechnique !=null){
				graphicsDevice.setTechnique(contactsTechnique);
				contactsTechniqueParameters.worldViewProjection = camera.viewProjectionMatrix;
				graphicsDevice.setTechniqueParameters(contactsTechniqueParameters);
				//console.log("draw contacts");
			}
			
			var writer = graphicsDevice.beginDraw(graphicsDevice.PRIMITIVE_LINES, numContacts * 2, contactsFormats, contactsSemantics);

			if (writer) {
				//consoel.log("draw contact...");
				var n;
				for (n = 0; n < numContacts; n += 1) {
					var contact = contacts[n];
					writer(contact[0], contact[1], contact[2]);
					writer(contact[3], contact[4], contact[5]);
				}
				graphicsDevice.endDraw(writer);
			}
		}
	}
	
	//=====================================================
	// DEBUG END
	//=====================================================
	
	//=====================================================
	// 
	//=====================================================
	
	function DrawText(_text,x,y){
		protolib.drawText({
			text: _text,
			position: [x, y],
			v3Color: [0,0,0],
			scale: 1,
			horizontalAlign: protolib.textHorizontalAlign.LEFT
		});
	
	}

	//=====================================================
	// 
	//=====================================================
	
	//===========================================
	// Public Access Start
	//===========================================
	// For map editing	
	
	SpawnMesh = function(){
		var spawnmesh =  protolib.loadMesh({mesh: "models/duck.dae"});
		spawnmesh.setPosition(mathDevice.v3Build(Math.floor((Math.random()*10)+1), Math.floor((Math.random()*10)+1), Math.floor((Math.random()*10)+1)));
		console.log(spawnmesh);
	}
	
	DebugToggle = function(){
		console.log(debugMode);
		console.log("====");
		console.log(scene);
		console.log("====");
		if (debugMode == true){
			debugMode = false;
		}else{
			debugMode = true;
		}
	};
	
	ShowSceneFuns = function(){
		console.log(scene);
		//console.log("test");
	};
	
	HideMeshTest = function(){
		//mesh.setEnabled(false);	
		//console.log("test onload for mesh");
		console.log(mesh);
		if(mesh !=null){
			if(mesh.getEnabled()){
				mesh.setEnabled(false);
			}else{
				mesh.setEnabled(true);
			}
			console.log(mesh);
		}
	};
	
	var meshclonecount = 0; 
	CloneMeshDuck = function(){
		meshclonecount += 1;
		//mesh.setEnabled(false);	
		//console.log("test onload for mesh");
		console.log(mesh);
		if(mesh !=null){
			var clonemesh = mesh.node.clone("duck"+meshclonecount);
			scene.addRootNode(clonemesh);
		}
	};
	
	Showshader = function(){
		console.log(shader);
	};
	Showshader2d = function(){
		console.log(shader2d);
	};
	
	Start_Frame = function (){
		intervalID = TurbulenzEngine.setInterval(update, 1000 / 60);	
	};
	
	End_Frame = function (){
		TurbulenzEngine.clearInterval(intervalID);
		console.log("end frame");
	};
	
	GetAnimations = function(){
		console.log("===========================");
		var animations = animationManager.getAll();
		console.log(animations);
		var animation = animationManager.get("mesh_gender_male");
		console.log(animation);
		
	}
	
	this.fnMeshes=function(){
		return meshes;
	};
	
	
	var SceneNodes = this.FnSceneNodes = function (){
		return scene;
	};
	
	this.fndebugMode = function (){
		if(debugMode == true){
			debugMode = false;
		}else{
			debugMode = true;
		}
		return debugMode;
	}
	
	this.fninput = function (){
		if(binput == true){
			binput = false;
		}else{
			binput = true;
		}
		return binput;
	}
	
	this.fncameraController = function (){
		if(bcameraController == true){
			bcameraController = false;
		}else{
			bcameraController = true;
		}
		return bcameraController;
	}
	
	this.fnGridSnap = function (){
		if(bgridsnap == true){
			bgridsnap = false;
		}else{
			bgridsnap = true;
		}
		return bgridsnap;
	}
	
	this.fnsnaprot = function (){
		if(bsnaprot == true){
			bsnaprot = false;
		}else{
			bsnaprot = true;
		}
		return bsnaprot;
	}
	
	this.fnsnapscale = function (){
		if(bsnapscale == true){
			bsnapscale = false;
		}else{
			bsnapscale = true;
		}
		return bsnapscale;
	}
	
	this.fnphysics = function (){
		if(bphysics == true){
			bphysics = false;
		}else{
			bphysics = true;
		}
		return bphysics;
	}
	
	this.fnworld = function (){
		if(bworld == true){
			bworld = false;
		}else{
			bworld = true;
		}
		return bworld;
	}
	
	//===========================================
	// Public Access End
	//===========================================
	
	//===========================================
	// Init Protolib START
	//===========================================
	
	// Initialise all animations with InterpolatorControllers set to start time
     var initAnimations = function initAnimationsFn(scene) {
         var a, n, interp, skinnedNode, node;
         var nodeHasSkeleton = animationManager.nodeHasSkeleton;
         var sceneNodes = scene.rootNodes;
         var sceneAnimations = animationManager.getAll();
         var numNodes = sceneNodes.length;
 
         var random = Math.random;
         var floor = Math.floor;
 
         var animations = [];
         var animationsLength = 0;
 
         for (a in sceneAnimations) {
             if (sceneAnimations.hasOwnProperty(a)) {
                 animations.push(sceneAnimations[a]);
             }
         }
         animationsLength = animations.length;
 
         scene.skinnedNodes = [];
 
         var randomIndex = 0;
 
         for (n = 0; n < numNodes; n += 1) {
             node = sceneNodes[n];
             var skeleton = nodeHasSkeleton(node);
             if (skeleton) {
                 // Randomly select an animation
                 randomIndex = (floor(random() * 100) + randomIndex) % animationsLength;
                 var animation = animations[randomIndex];
 
                 // Create an interpolation controller
				 //console.log(animation);
				 if(animation !=null){
					 interp = InterpolatorController.create(animation.hierarchy);
					 interp.setAnimation(animation, settings.loopAnimation);
	 
					 // Set a different start time for each looping animation (for variation)
					 interp.setTime(animation.length * random());
					 interp.setRate(settings.defaultRate);
					 
					 // Create a skinnedNode
					skinnedNode = SkinnedNode.create(graphicsDevice, mathDevice, node, skeleton, interp);
					skinnedNode.active = false;
					scene.skinnedNodes.push(skinnedNode);
					//console.log("run?");
				 }
 
                 
             }
         }
 
         return true;
     };
	
	//console.log(dynamicsWorld);
	
	var update_count = 0;
	
	
	//console.log(testve);
	
	function update() {
		
		var currentTime = TurbulenzEngine.time;
        var deltaTime = (currentTime - previousFrameTime);
        if (deltaTime > 0.1)
        {
            deltaTime = 0.1;
        }
		
		if(characterController !=null){
			characterController.update(deltaTime);
			//console.log("controller update...");
		}
		if(binput == true){
			inputDevice.update();
		}
		if(mouseForces.pickedBody) {
            // If we're dragging a body don't apply the movement to the camera
            cameraController.pitch = 0;
            cameraController.turn = 0;
            cameraController.step = 0;
        }
		if(bcameraController == true){
			cameraController.update();
		}
        var deviceWidth = graphicsDevice.width;
        var deviceHeight = graphicsDevice.height;
		updateAspectRatio();
		
		/*
        var aspectRatio = (deviceWidth / deviceHeight);
        if(aspectRatio !== camera.aspectRatio) {
            camera.aspectRatio = aspectRatio;
            camera.updateProjectionMatrix();
        }
        camera.updateViewProjectionMatrix();
		*/
		numContacts = 0;
		mouseForces.update(dynamicsWorld, camera, 0.1);
		handleForces.update(dynamicsWorld, camera, 0.1);
		if(bworld == true){
			dynamicsWorld.update(deltaTime);
		}
		if(bphysics == true){
			physicsManager.update(deltaTime);
		}
		
		
		DrawText("scene rootNodes: "+scene.rootNodes.length,50,10);
		DrawText("physics Nodes: "+physicsManager.physicsNodes.length,50,30);
		
		//var mousePos = protolib.getMousePosition();
		var pos = mathDevice.v3Build(0, 0, 0);
		var dir = mathDevice.v3Build(0, 0, 0);
		update_count += 1;
		if(update_count >= 32){
			update_count = 0;
		}
		
		// Init the animations from the scene
        initAnimations(scene);
		
		pos = handleForces.pickRayFrom;
		dir = handleForces.pickRayTo;
		
		var rayHit = dynamicsWorld.rayTest({
			from: pos,
			to: dir,
			maxFactor: 2,
			group: physicsDevice.FILTER_PROJECTILE
			//exclude: ownerPhysicsObject
		});
		
		var b;
		var ray;
		if(rayHit !=null){
			DrawText("hit found",50,40);
			b = rayHit.body;
			ray = rayHit;
			if(rayHit.body !=null){
				var id = rayHit.body._private._public.id;
				DrawText("id:"+id,50,50);
			}
			if(rayHit.collisionObject !=null){
				selectsinglecollisionobject = rayHit.collisionObject;
			}
			
			if(rayHit.hitPoint != null){
				//console.log(rayHit);
                var pickPos = rayHit.hitPoint;
                var norPos = rayHit.hitNormal;
				//console.log(norPos);
				norPos[0] = Math.floor(norPos[0].toFixed(1));
				norPos[1] = Math.floor(norPos[1].toFixed(1));
				norPos[2] = Math.floor(norPos[2].toFixed(1));
				
				var hpos = mathDevice.v3Build(0, 0, 0);
				hpos[0] = (pickPos[0]);
				hpos[1] = (pickPos[1]);
				hpos[2] = (pickPos[2]);
				
				DrawText("hpos x:"+hpos[0],50,130);
				DrawText("hpos y:"+hpos[1],50,150);
				DrawText("hpos z:"+hpos[2],50,170);
				
				hpos[0] = parseInt(hpos[0]);
				
				if(norPos[0] == -1){
					hpos[0] += ( norPos[0]);
				}
				if(norPos[0] == 1){
					hpos[0] += (1);
				}
				
				
				hpos[1] = parseInt(hpos[1]);
				if(norPos[1] != -1){
					hpos[1] += ( norPos[1]);
				}
				
				hpos[2] = parseInt(hpos[2]);
				if(norPos[2] == -1){
					hpos[2] += ( norPos[2]);
				}
				if(norPos[2] == 1){
					//console.log(norPos[2]);
					hpos[2] += ( 1);
				}
				
				//DrawText("norPos x:"+norPos[0],50,190);
				//DrawText("norPos y:"+norPos[1],50,210);
				//DrawText("norPos z:"+norPos[2],50,220);
				if(mesh !=null){
					//mesh.setPosition(hpos);			
				}
				
				
				if(bgridsnap == true){
					rayhit_set = hpos;
				}else{
					rayhit_set = pickPos;
				}
				
				if (selectcube !=null){
					selectcube.setPosition(rayhit_set);	
				}
				
				face_normal_set = norPos;
			}
		}
		if(update_count >= 31){		
			//console.log(b);
			//console.log(rayHit);
		}
		
		
		if (protolib.beginFrame()){
		
			protolib.endFrame();
			draw2D.begin();
			draw2D.draw(drawObject);
			//draw2D.drawSprite(sprite);
			drawCrosshair();
			//drawContacts();
			draw2D.end();
		}
		
	};
	
	protolib = Protolib.create({
		onInitialized:onIntializedFn,
		enableDynamicUI: false
		//enableDynamicUI: true
	});
	
	//protolib.setPostDraw(function() {
		//floor.render(graphicsDevice, camera);
		//DrawText("setPostDraw" , 10,70);
		//console.log("setPostDraw");
		//graphicsDevice.clear(clearColor);
		//draw2D.begin();
			//draw2D.draw(drawObject);
			//draw2D.drawSprite(sprite);
			//drawCrosshair();
			//drawContacts();
			//draw2D.end();
	// });
	
	//protolib.setPostRendererDraw(function() {
		//DrawText("setPostRendererDraw" , 10,90);
		//console.log("setPostRendererDraw");
		//graphicsDevice.clear(clearColor);
		//floor.render(graphicsDevice, camera);
	// });
	 
	
	protolib.setPreDraw(function floorRenderFn() {
		//graphicsDevice.clear(clearColor);
		//console.log("setPreDraw");
		var currentTime = TurbulenzEngine.time;
		var deviceWidth = graphicsDevice.width;
		var deviceHeight = graphicsDevice.height;
		//renderer.update(graphicsDevice, camera, dscene, currentTime);
		if(renderer.updateBuffers(graphicsDevice, deviceWidth, deviceHeight)) {
			floor.render(graphicsDevice, camera);
			if(debugMode) {
				scene.drawPhysicsNodes(graphicsDevice, shaderManager, camera, physicsManager);
				scene.drawPhysicsGeometry(graphicsDevice, shaderManager, camera, physicsManager);
				//console.log("setPreDraw");
				drawContacts();
			}
		}
	});
	
	console.log(protolib);
	//===========================================
	// Init Protolib END
	//===========================================
	
	function destroyScene() {
		//stop engine update?
		TurbulenzEngine.clearInterval(intervalID);
		
		effectManager = null;
        TurbulenzEngine.flush();
        graphicsDevice = null;
        mathDevice = null;
        physicsDevice = null;
        physicsManager = null;
        dynamicsWorld = null;
        mouseCodes = null;
        keyCodes = null;
        inputDevice = null;
        cameraController = null;
	}
    TurbulenzEngine.onunload = destroyScene;
	
	return this;
};
