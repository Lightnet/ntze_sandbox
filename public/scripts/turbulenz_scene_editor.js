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
/*{{ javascript("jslib/FontManager.js") }}*/

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
//TurbulenzEngine.onload = function onloadFn() {
console.log("testsetsetse");
function appCreate() {
	
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
	function levelLoadedFn(){
		levelLoaded = true;
	};
	
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
	
	var floor;
	
	var debugMode = true;
	
	var x1;
	var y1;
	var x2;
	var y2;
	var drawObject;
	var sprite;

	function onIntializedFn(protolib){
		//var version = protolib.version;
		//console.log(version);
		//console.log(protolib);
		mathDevice = protolib.getMathDevice();
		graphicsDevice = protolib.getGraphicsDevice();		
		// Clear the background color of the engine window
		//var clearColor = [0.95, 0.95, 1.0, 1.0];
		if (graphicsDevice.beginFrame()) {
			graphicsDevice.clear(clearColor);
			graphicsDevice.endFrame();
		}
		
		inputDevice = protolib.getInputDevice();
		textureManager = TextureManager.create(graphicsDevice, requestHandler, null, errorCallback);
		shaderManager = ShaderManager.create(graphicsDevice, requestHandler, null, errorCallback);
		effectManager = EffectManager.create();
		sceneLoader = SceneLoader.create();
		physicsDevice = TurbulenzEngine.createPhysicsDevice(physicsDeviceParameters);
		dynamicsWorld = physicsDevice.createDynamicsWorld(dynamicsWorldParameters);
		physicsManager = PhysicsManager.create(mathDevice, physicsDevice, dynamicsWorld);
		
		draw2D = Draw2D.create({
			graphicsDevice : graphicsDevice,
			initialGpuMemory : 1024,
			maxGpuMemory : (1024 * 1024)
		});
		
		draw2D.configure({
			scaleMode: 'scale',
			viewportRectangle: [0, 0, gameWidth, gameHeight]
		});
		console.log("tests");
		//renderer = DefaultRendering.create(graphicsDevice, mathDevice, shaderManager, effectManager);
		//shader2d = shaderManager.get("shaders/generic2D.cgfx");
		//technique2d = shader2d.getTechnique("constantColor2D");
		//techniqueParameters2d = graphicsDevice.createTechniqueParameters({
			//clipSpace: null,
			//constantColor: mathDevice.v4Build(0, 0, 0, 1)
		// });
		
		var dragMin = mathDevice.v3Build(-50, -50, -50);
		var dragMax = mathDevice.v3Build(50, 50, 50);
		mouseForces = MouseForces.create(graphicsDevice, inputDevice, mathDevice, physicsDevice, dragMin, dragMax);
		var worldUp = mathDevice.v3BuildYAxis();
		mouseForces.clamp = 400;
		
		// Control codes
		keyCodes = inputDevice.keyCodes;
		mouseCodes = inputDevice.mouseCodes;
		
		//var vp = camera.viewProjectionMatrix;
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
		
		//camera = Camera.create(mathDevice);
		//camera.lookAt(mathDevice.v3Build(0, 100, 0), worldUp, mathDevice.v3Build(0, 0, 10));
		//camera.updateViewMatrix();
		//camera.updateProjectionMatrix();
		
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
		
		//mesh = protolib.loadMesh({mesh: "models/spaceshipAA_04.dae"});
		mesh = protolib.loadMesh({mesh: "models/duck.dae"});
		console.log(mesh);
		
		//var mesh01 = protolib.loadMesh({mesh: "models/spaceship_outpostAAA01.dae"});
		
		//var mesh02 = protolib.loadMesh({mesh: "models/spaceship_shipyard_bay.dae"});
		//var mesh02 = protolib.loadMesh({mesh: "models/spaceship_shipyard_bay.dae"});
		var mesh02 = protolib.loadMesh({mesh: "models/spaceship_githerAA.dae"});
		
		rotationMatrix = mathDevice.m43BuildIdentity();
		rotationAngleMatrix = mathDevice.m43BuildIdentity();
		mathDevice.m43SetAxisRotation(rotationAngleMatrix,
									  mathDevice.v3Build(0, 1, 0),
									  (Math.PI * 2) / 360);
		
		// Input functions
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
		//init frame render 
		intervalID = TurbulenzEngine.setInterval(update, 1000 / 60);
		//console.log(intervalID);

		
		floor = Floor.create(graphicsDevice, mathDevice);
		floor.numLines = 400;
		
		var psecene = protolib.globals.scene;
		console.log(psecene);
		var duck = psecene.findNode("models/duck.dae0");
		//duck.setEnabled(false);
		console.log(duck);
		
		//var translateVec = mathDevice.v3Build(5, 7, 5);
		var translateVec = mathDevice.v3Build(0, 0, -1);
		protolib.moveCamera(translateVec);
		//protolib.getCamera();
		
		CreateBoxShape();
		console.log(protolib);
		console.log("finish var setup...");
		
		
		x1 = 50;
        y1 = 50;
        x2 = graphicsDevice.width - 50;
        y2 = graphicsDevice.height - 50;
		
		var rectangle = [x1, y1, x2, y2];
		
		drawObject = {
            color: [1.0, 0.0, 0.0, 1.0],
            destinationRectangle: rectangle
        };
		
		sprite = Draw2DSprite.create({
            width: 50,
            height: 50,
            //x: graphicsDevice.width / 2 + 200,
            //y: graphicsDevice.height / 2 + 200,
			//x: graphicsDevice.width+graphicsDevice.width,
			//y: graphicsDevice.height+graphicsDevice.height,
			x: 1000,
			y: 500,
            
            //rotation: Math.PI / 4,
			color: [1.0, 1.0, 0.5, 1.0]
        });
	}
	
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
						onProcessedContacts: //onPreSolveContact : addContact,
						//onAddedContacts : addContacts
						addContacts
					});
					//onRemovedContacts : addContacts
					// Adds the floor collision object to the world
					dynamicsWorld.addCollisionObject(floorObject);
	
	
	
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
            //scene.addRootNode(newBox);
			protolib.globals.scene.addRootNode(newBox);
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
    }
	/*
	function drawCrosshair() {
        if(!mouseForces.pickedBody) {
            graphicsDevice.setTechnique(technique2d);
            var screenWidth = graphicsDevice.width;
            var screenHeight = graphicsDevice.height;
            techniqueParameters2d.clipSpace = mathDevice.v4Build(2.0 / screenWidth, -2.0 / screenHeight, -1.0, 1.0);
            graphicsDevice.setTechniqueParameters(techniqueParameters2d);
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
	*/
	protolib = Protolib.create({
		onInitialized:onIntializedFn,
		enableDynamicUI: false
		//enableDynamicUI: true
	});
	
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
		//console.log(graphicsDevice);
		
		
		
		//renderer.update(graphicsDevice, camera, protolib.globals.scene, currentTime);
		if (protolib.beginFrame()){
			//if(renderer.updateBuffers(graphicsDevice, deviceWidth, deviceHeight)) {
			//camera.updateViewMatrix();
			//camera.updateViewProjectionMatrix();
		//floor.render(gd, camera);
				floor.render(graphicsDevice, camera);
			// }
			protolib.globals.scene.drawPhysicsNodes(graphicsDevice, shaderManager, camera, physicsManager);
			protolib.globals.scene.drawPhysicsGeometry(graphicsDevice, shaderManager, camera, physicsManager);
			protolib.endFrame();
			
			draw2D.begin();
			//draw2D.draw(drawObject);
			draw2D.drawSprite(sprite);
			draw2D.end();
		}
		
		/*
		renderer.update(graphicsDevice, camera, protolib.globals.scene, currentTime);
		//if (protolib.beginFrame()){
		if(graphicsDevice.beginFrame()) {
			if(renderer.updateBuffers(graphicsDevice, deviceWidth, deviceHeight)) {
			//renderer.draw(graphicsDevice, clearColor);
		
			floor.render(graphicsDevice, camera);
			protolib.endFrame();
			}
		}
		*/
		// }
		
		
		
		/*
			//renderer.update(graphicsDevice, camera, protolib.globals.scene, currentTime);
			if(graphicsDevice.beginFrame()) {
				
				//if(renderer.updateBuffers(graphicsDevice, 200, 200)) {
					
				//if (protolib.beginFrame()){
					
			
					if(renderer.updateBuffers(graphicsDevice, deviceWidth, deviceHeight)) {
				
					//renderer.draw(graphicsDevice, clearColor);
					floor.render(graphicsDevice, camera);
				//}
				graphicsDevice.endFrame();
			}
			if (protolib.beginFrame()){
			//protolib.endFrame();
			
			}
		}
		
		*/
		
		
		/*
		renderer.update(graphicsDevice, camera, protolib.globals.scene, currentTime);
		if(graphicsDevice.beginFrame()) {
			if(renderer.updateBuffers(graphicsDevice, deviceWidth, deviceHeight)) {
				renderer.draw(graphicsDevice, clearColor);
				floor.render(graphicsDevice, camera);
			}
			graphicsDevice.endFrame();
		}
		*/
		
		
		
		/*
			if (mesh){
				mesh.getRotationMatrix(rotationMatrix);
				mathDevice.m43Mul(rotationMatrix, rotationAngleMatrix, rotationMatrix);
				mesh.setRotationMatrix(rotationMatrix);
			}
			*/
		//console.log("loops?");
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
	
	
	Start_Frame =function (){
		intervalID = TurbulenzEngine.setInterval(update, 1000 / 60);	
	};
	
	End_Frame = function (){
		TurbulenzEngine.clearInterval(intervalID);
		console.log("end frame");
	};
	
	
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
