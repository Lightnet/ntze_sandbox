/*
 * Work in progress prototype.
*/

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
/*global HTMLControls: false */

TurbulenzEngine.onload = function onloadFn() {
	console.log(TurbulenzEngine);
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
	var dscene;
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
	
	var gameWidth = 1920;
	var gameHeight = 1080;
	
	var clearColor = [0.95, 0.95, 1.0, 1.0];
	var floor;
	var mesh = null;
	
	var previousFrameTime = TurbulenzEngine.time;
	var mouseForces;
	var keyCodes;
	var mouseCodes;
	
	var technique2d;
	var shader2d;
	var techniqueParameters2d;
	
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
	
	//}
	
	function onIntializedFn(protolib){
		//var version = protolib.version;
		//console.log(version);
		//console.log(protolib);
		mathDevice = protolib.getMathDevice();
		cubeExtents = mathDevice.v3Build(0.5, 0.5, 0.5);
		m43MulM44 = mathDevice.m43MulM44;
		isVisibleBoxOrigin = mathDevice.isVisibleBoxOrigin;
		graphicsDevice = protolib.getGraphicsDevice();		
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
			graphicsDevice = null;
			return;
		}
		
		// Clear the background color of the engine window
		//var clearColor = [0.95, 0.95, 1.0, 1.0];
		if (graphicsDevice.beginFrame()) {
			graphicsDevice.clear(clearColor);
			graphicsDevice.endFrame();
		}
		console.log("Manager");
		inputDevice = protolib.getInputDevice();
		textureManager = protolib.globals.textureManager;
		shaderManager = protolib.globals.shaderManager;
		//console.log(protolib.globals);
		console.log(protolib);
		
		shader2d = shaderManager.get("shaders/generic2D.cgfx");
		technique2d = shader2d.getTechnique("constantColor2D");
		//effectManager = EffectManager.create();
		effectManager = protolib.globals.EffectManager;
		//sceneLoader = SceneLoader.create();
		sceneLoader = protolib.globals.simplesceneloader;//SceneLoader.create();
		//console.log(sceneLoader);
		
		physicsDevice = TurbulenzEngine.createPhysicsDevice(physicsDeviceParameters);
		dynamicsWorld = physicsDevice.createDynamicsWorld(dynamicsWorldParameters);
		physicsManager = PhysicsManager.create(mathDevice, physicsDevice, dynamicsWorld);
		renderer = protolib.globals.renderer;
		
		dscene = Scene.create(mathDevice);
		
		draw2D = Draw2D.create({
			graphicsDevice : graphicsDevice,
			initialGpuMemory : 1024,
			maxGpuMemory : (1024 * 1024)
		});
		
		draw2D.configure({
			scaleMode: 'scale',
			viewportRectangle: [0, 0, graphicsDevice.width, graphicsDevice.height]
			//viewportRectangle: [0, 0, 800, 600]
		});
		
		primitive = graphicsDevice.PRIMITIVE_TRIANGLES;
		linePrim = graphicsDevice.PRIMITIVE_LINES;
		cursorFormat = [graphicsDevice.VERTEXFORMAT_FLOAT3];
		cursorSemantic = graphicsDevice.createSemantics([graphicsDevice.SEMANTIC_POSITION]);
		
		var dragMin = mathDevice.v3Build(-50, -50, -50);
		var dragMax = mathDevice.v3Build(50, 50, 50);
		mouseForces = MouseForces.create(graphicsDevice, inputDevice, mathDevice, physicsDevice, dragMin, dragMax);
		var worldUp = mathDevice.v3BuildYAxis();
		mouseForces.clamp = 400;
		
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
			
		camera = protolib.globals.camera;
		scene = protolib.globals.scene;
		var parm = {
			name: "worldscene"
			//local: startPoint,
			//dynamic: true,
			//disabled: false
		};
		//nodeRoot = SceneNode.create(parm);
		//scene.addRootNode(nodeRoot);
		
		cameraController = CameraController.create(graphicsDevice, inputDevice, camera);
		
		// Function for aspect ratio
		updateAspectRatio = function() {
			var aspectRatio = (graphicsDevice.width / graphicsDevice.height);
			if(aspectRatio !== camera.aspectRatio) {
				camera.aspectRatio = 16/9;	// Keep mine 16/9 ratio (1920/1080 that is)
				camera.updateProjectionMatrix();
			}
			camera.updateViewProjectionMatrix();	
		};
		
		// Set the aspect-ratio of the camera to 16/9
		updateAspectRatio();
		
		rotationMatrix = mathDevice.m43BuildIdentity();
		rotationAngleMatrix = mathDevice.m43BuildIdentity();
		mathDevice.m43SetAxisRotation(rotationAngleMatrix,
									  mathDevice.v3Build(0, 1, 0),
									  (Math.PI * 2) / 360);
		
		//===========================================================
		// Input functions
		//===========================================================
		//console.log(inputDevice);
		//var keyCodes = inputDevice.keyCodes;
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
			if(mouseCodes.BUTTON_0 === button || mouseCodes.BUTTON_1 === button) {
				mouseForces.onmousedown();
			}
		};
		
		var onMouseUp = function (button) {
			if(mouseCodes.BUTTON_0 === button || mouseCodes.BUTTON_1 === button) {
				mouseForces.onmouseup();
			}
			if(mouseCodes.BUTTON_2 === button) {
				mouseForces.onmouseup();
				//fireBox();
			}
		};
		
		var onKeyUp = function physicsOnkeyupFn(keynum) {
			if(keynum === keyCodes.R)// 'r' key
			 {
				//reset();
			}
			if(keynum === keyCodes.SPACE)// Spacebar
			 {
				//fireBox();
				console.log("FIRE!");
			} else {
				cameraController.onkeyup(keynum);
			}
		};
		// Add event listeners
		inputDevice.addEventListener("keyup", onKeyUp);
		inputDevice.addEventListener("mousedown", onMouseDown);
		inputDevice.addEventListener("mouseup", onMouseUp);
		//===========================================================
		//
		//===========================================================
		
		//init frame render 
		intervalID = TurbulenzEngine.setInterval(update, 1000 / 60);
		//console.log(intervalID);

		floor = Floor.create(graphicsDevice, mathDevice);
		floor.numLines = 400;
		
		//===========================================================
		// set Pre Draw
		//===========================================================
		//console.log("====");
		//console.log(dscene);
		//console.log("====");
		protolib.setPreDraw(function floorRenderFn() {
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
		
		var translateVec = mathDevice.v3Build(0, 0, -1);
		protolib.moveCamera(translateVec);
		
		//console.log(protolib);
		//console.log("finish var setup...");
		
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
		CreateObjects();
		CreateBoxShape();
	};
	
	var idxobj = 0;
	
	SpawnMesh = function(){
		var spawnmesh =  protolib.loadMesh({mesh: "models/duck.dae"});
		spawnmesh.setPosition(mathDevice.v3Build(Math.floor((Math.random()*10)+1), Math.floor((Math.random()*10)+1), Math.floor((Math.random()*10)+1)));
		console.log(spawnmesh);
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
		mesh = protolib.loadMesh({mesh: "models/duck.dae"});
		mesh.setPosition(mathDevice.v3Build(0, -.5, 0));
		
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
			console.log(scene);
			var duckMesh0 = scene.findNode("models/duck.dae0");
			console.log(duckMesh0);
			//duckMesh0.setPosition(mathDevice.v3Build(0, 4, 0));
			
			
			var clonemesh = duckMesh0.clone("models/duck.dae1");
			console.log(clonemesh);
			protolib.globals.scene.addRootNode(clonemesh);
			clonemesh.update();
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
		
	};
	
	function CreateBoxShape(){
		var floorShape = physicsDevice.createPlaneShape({
			normal: mathDevice.v3Build(0, 1, 0),
			distance: 0,
			margin: 0.001
		});
		var floorObject = physicsDevice.createCollisionObject({
			shape: floorShape,
			transform: mathDevice.m43BuildIdentity(),
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
		//cube
		//=================================================
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
                transform: identity,
                friction: 0.9,
                restitution: 0.1
            });
            var newBox = SceneNode.create({
                name: "box" + "1",
                local: identity,
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
		//=================================================
		
	}
	
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
			
			//console.log(technique2d);
			if(technique2d !=null){
				//console.log("draw 2d");
				graphicsDevice.setTechnique(technique2d);
				techniqueParameters2d.clipSpace = mathDevice.v4Build(2.0 / screenWidth, -2.0 / screenHeight, -1.0, 1.0);
				graphicsDevice.setTechniqueParameters(techniqueParameters2d);
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
	
	protolib = Protolib.create({
		onInitialized:onIntializedFn,
		enableDynamicUI: false
		//enableDynamicUI: true
	});
	
	function drawContacts() {
		if (numContacts) {
			
			if(contactsTechnique !=null){
				graphicsDevice.setTechnique(contactsTechnique);
				contactsTechniqueParameters.worldViewProjection = camera.viewProjectionMatrix;
				graphicsDevice.setTechniqueParameters(contactsTechniqueParameters);
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
	
	function DrawText(_text,x,y){
		protolib.drawText({
			text: _text,
			position: [x, y],
			v3Color: [0,0,0],
			scale: 1,
			horizontalAlign: protolib.textHorizontalAlign.LEFT
		});
	
	}

	function update() {
		var currentTime = TurbulenzEngine.time;
        var deltaTime = (currentTime - previousFrameTime);
        if (deltaTime > 0.1)
        {
            deltaTime = 0.1;
        }
		
		inputDevice.update();
		
		if(mouseForces.pickedBody) {
            // If we're dragging a body don't apply the movement to the camera
            cameraController.pitch = 0;
            cameraController.turn = 0;
            cameraController.step = 0;
        }
		
		cameraController.update();
        var deviceWidth = graphicsDevice.width;
        var deviceHeight = graphicsDevice.height;
        var aspectRatio = (deviceWidth / deviceHeight);
        if(aspectRatio !== camera.aspectRatio) {
            camera.aspectRatio = aspectRatio;
            camera.updateProjectionMatrix();
        }
        camera.updateViewProjectionMatrix();
		numContacts = 0;
		mouseForces.update(dynamicsWorld, camera, 0.1);
		dynamicsWorld.update();
        physicsManager.update();
		DrawText("scene rootNodes: "+scene.rootNodes.length,50,10);
		DrawText("physics Nodes: "+physicsManager.physicsNodes.length,50,30);
		//drawContacts();
		//scene.update();
		//renderer.update(graphicsDevice, camera, dscene, currentTime);
		if (protolib.beginFrame()){
			//renderer.update(graphicsDevice, camera, dscene, currentTime);
			protolib.endFrame();
			draw2D.begin();
			draw2D.draw(drawObject);
			//draw2D.drawSprite(sprite);
			drawCrosshair();
			//drawContacts();
			draw2D.end();
		}
		
		/*
		if (mesh){
			mesh.getRotationMatrix(rotationMatrix);
			mathDevice.m43Mul(rotationMatrix, rotationAngleMatrix, rotationMatrix);
			mesh.setRotationMatrix(rotationMatrix);
		}
		*/
			
		//console.log("loops?");
	};
	
	//===========================================
	// Public Access Start
	//===========================================
	// For map editing	
	
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
	
	DFunScene = function(){
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
		}
	};
	
	Start_Frame = function (){
		intervalID = TurbulenzEngine.setInterval(update, 1000 / 60);	
	};
	
	/*
	End_Frame = function (){
		TurbulenzEngine.clearInterval(intervalID);
		console.log("end frame");
	};
	*/
	
	//===========================================
	// Public Access End
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
