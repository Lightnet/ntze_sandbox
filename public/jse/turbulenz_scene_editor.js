

//console.log("init...");

TurbulenzEngine.onload = function onloadFn()
{
	console.log("TurbulenzEngine version: "+TurbulenzEngine.version);
	if (!TurbulenzEngine.version)
    {
		console.log(TurbulenzEngine.version);	
	}
    var errorCallback = function errorCallback(msg) {
		console.log(msg);
        //window.alert(msg);
    };
    TurbulenzEngine.onerror = errorCallback;
    var warningCallback = function warningCallback(msg) {
        window.alert(msg);
    };
    TurbulenzEngine.onwarning = warningCallback;
    var mathDeviceParameters = {
    };
    var mathDevice = TurbulenzEngine.createMathDevice(mathDeviceParameters);
    var graphicsDeviceParameters = {
    };
    var graphicsDevice = TurbulenzEngine.createGraphicsDevice(graphicsDeviceParameters);
    var physicsDeviceParameters = {
    };
    var physicsDevice = TurbulenzEngine.createPhysicsDevice(physicsDeviceParameters);
    var dynamicsWorldParameters = {
    };
    var dynamicsWorld = physicsDevice.createDynamicsWorld(dynamicsWorldParameters);
    var inputDeviceParameters = {
    };
    var inputDevice = TurbulenzEngine.createInputDevice(inputDeviceParameters);
    var requestHandlerParameters = {
    };
    var requestHandler = RequestHandler.create(requestHandlerParameters);
    var textureManager = TextureManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var shaderManager = ShaderManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var effectManager = EffectManager.create();
    var physicsManager = PhysicsManager.create(mathDevice, physicsDevice, dynamicsWorld);
	
	var fontManager = FontManager.create(graphicsDevice, requestHandler);
	var fontTechnique, fontTechniqueParameters;
	var font, shader;
    var mappingTable;
    var debugMode = true;
    // Renderer and assets for the scene.
    var renderer;
    var otherscene = Scene.create(mathDevice);
    var scene = Scene.create(mathDevice);
    var sceneLoader = SceneLoader.create();
	var othersceneLoader = SceneLoader.create();
    var duckMesh;
    // Setup world space
    var clearColor = mathDevice.v4Build(0.95, 0.95, 1.0, 1.0);
    var loadingClearColor = mathDevice.v4Build(0.8, 0.8, 0.8, 1.0);
    var worldUp = mathDevice.v3BuildYAxis();
    // Setup a camera to view a close-up object
    var camera = Camera.create(mathDevice);
    camera.nearPlane = 0.05;
    var cameraDefaultPos = mathDevice.v3Build(14.5, 8.0, 18.1);
    var cameraDefaultLook = mathDevice.v3Build(14.5, -(camera.farPlane / 2), -camera.farPlane);
    // The objects needed to draw the crosshair
    var technique2d;
    var shader2d;
    var techniqueParameters2d;
    var chSemantics = graphicsDevice.createSemantics([
        'POSITION'
    ]);
    var chFormats = [
        graphicsDevice.VERTEXFORMAT_FLOAT3
    ];
    // The objects needed to draw the contact callbacks
    var contactsTechnique;
    var contactsShader;
    var contactsTechniqueParameters;
    var contactsSemantics = graphicsDevice.createSemantics([
        'POSITION'
    ]);
    var contactsFormats = [
        graphicsDevice.VERTEXFORMAT_FLOAT3
    ];
	
    var contactWorldTransform = mathDevice.m43BuildIdentity();
    var contactWorldPoint = mathDevice.v3BuildZero();
    var contacts = [];
    var numContacts = 0;
    // Setup world floor
    var floor = Floor.create(graphicsDevice, mathDevice);
    var cameraController = CameraController.create(graphicsDevice, inputDevice, camera);
    // Mouse forces
    var dragMin = mathDevice.v3Build(-50, -50, -50);
    var dragMax = mathDevice.v3Build(50, 50, 50);
    var mouseForces = MouseForces.create(graphicsDevice, inputDevice, mathDevice, physicsDevice, dragMin, dragMax);
    mouseForces.clamp = 400;
    // Control codes
    var keyCodes = inputDevice.keyCodes;
    var mouseCodes = inputDevice.mouseCodes;
    // Setup the box firing objects, including the inertia
    var boxes = [];
    var numBoxes = 12;
    var fireCount = 0;
    var cubeExtents = mathDevice.v3Build(0.5, 0.5, 0.5);
    var boxShape = physicsDevice.createBoxShape({
        halfExtents: cubeExtents,
        margin: 0.001
    });
    var inertia = mathDevice.v3Copy(boxShape.inertia);
    inertia = mathDevice.v3ScalarMul(inertia, 1.0);
	
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
            reset();
        }
        if(keynum === keyCodes.SPACE)// Spacebar
        {
            //fireBox();
        } else {
            cameraController.onkeyup(keynum);
        }
    };
    // Add event listeners
    inputDevice.addEventListener("keyup", onKeyUp);
    inputDevice.addEventListener("mousedown", onMouseDown);
    inputDevice.addEventListener("mouseup", onMouseUp);
	
	var draw2D = Draw2D.create({
        graphicsDevice: graphicsDevice
    });
	
	var x1 = 50;
	var y1 = 50;
	var x2 = graphicsDevice.width - 50;
	var y2 = graphicsDevice.height - 50;

	var rectangle = [x1, y1, x2, y2];

	var drawObject = {
		color: [1.0, 0.0, 0.0, 1.0],
		destinationRectangle: rectangle
	};
	//console.log(fontManager);

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
	
    function drawContacts() {
        if(numContacts) {
            graphicsDevice.setTechnique(contactsTechnique);
            contactsTechniqueParameters.worldViewProjection = camera.viewProjectionMatrix;
            graphicsDevice.setTechniqueParameters(contactsTechniqueParameters);
            var writer = graphicsDevice.beginDraw(graphicsDevice.PRIMITIVE_LINES, numContacts * 2, contactsFormats, contactsSemantics);
            if(writer) {
                var n;
                for(n = 0; n < numContacts; n += 1) {
                    var contact = contacts[n];
                    writer(contact[0], contact[1], contact[2]);
                    writer(contact[3], contact[4], contact[5]);
                }
                graphicsDevice.endDraw(writer);
            }
        }
    }

	//console.log(draw2D);
    var renderFrame = function renderFrameFn() {
        var currentTime = TurbulenzEngine.time;
        // Update input and camera
        inputDevice.update();
		
        if(mouseForces.pickedBody) {
            // If we're dragging a body don't apply the movement to the camera
            cameraController.pitch = 0;
            cameraController.turn = 0;
            cameraController.step = 0;
        }
		
        cameraController.update();
		//graphicsDevice.width = 800;
		//graphicsDevice.height = 600;
        var deviceWidth = graphicsDevice.width;
        var deviceHeight = graphicsDevice.height;
        //var aspectRatio = (deviceWidth / deviceHeight);
        var aspectRatio = (16 / 9);
        if(aspectRatio !== camera.aspectRatio) {
            camera.aspectRatio = aspectRatio;
            camera.updateProjectionMatrix();
        }
        camera.updateViewProjectionMatrix();
        numContacts = 0;
        // Update the physics
        mouseForces.update(dynamicsWorld, camera, 0.1);
        dynamicsWorld.update();
        physicsManager.update();
        scene.update();
        renderer.update(graphicsDevice, camera, scene, currentTime);
        if(graphicsDevice.beginFrame()) {
            if(renderer.updateBuffers(graphicsDevice, deviceWidth, deviceHeight)) {
                renderer.draw(graphicsDevice, clearColor);
                floor.render(graphicsDevice, camera);
                if(debugMode) {
                    scene.drawPhysicsNodes(graphicsDevice, shaderManager, camera, physicsManager);
                    scene.drawPhysicsGeometry(graphicsDevice, shaderManager, camera, physicsManager);
                    drawContacts();
                }
				
				
				draw2D.begin();
				//console.log(draw2D);
				//draw2D.draw(drawObject);
				draw2D.end();
				//console.log(draw2D);
				
				if(font !=null){
					graphicsDevice.setTechnique(fontTechnique);
					fontTechniqueParameters.clipSpace = mathDevice.v4Build(2 / graphicsDevice.width, -2 / graphicsDevice.height, -1, 1, fontTechniqueParameters.clipSpace);
					graphicsDevice.setTechniqueParameters(fontTechniqueParameters);
					
					function segmentFont(x, y, text, height) {
						var topLeft = draw2D.viewportUnmap(x, y);
						var bottomRight = draw2D.viewportUnmap(x + 10, y + height);
						font.drawTextRect(text, {
							rect: [topLeft[0], topLeft[1], bottomRight[0] - topLeft[0], bottomRight[1] - topLeft[1]],
							scale: 1.0,
							spacing: 0,
							color:[1,1,1],
							alignment: 0 //0=left,1=center, 2=right
						});
					}
					var titleHeight = 0.75;
					//segmentFont(55, 50, "Point", titleHeight);
					segmentFont(55, 10, "Hello World", titleHeight);
					
					segmentFont(55, 20, "Screen:"+deviceWidth+":"+deviceHeight, titleHeight);
				}
            }
            drawCrosshair();
            graphicsDevice.endFrame();
        }
    };
	
    var intervalID;
	
    var loadingLoop = function loadingLoopFn() {
		//console.log(font);//console.log(shader);
		if (font && shader) {
			fontTechnique = shader.getTechnique('font');
			fontTechniqueParameters = graphicsDevice.createTechniqueParameters({
				clipSpace: mathDevice.v4BuildZero(),
				alphaRef: 0.01,
				//color: mathDevice.v4BuildOne()
				color: [0,0,0,1]//rbga
			});
		}
		
		if(graphicsDevice.beginFrame()) {
			graphicsDevice.clear(loadingClearColor);			
			//draw2D.begin();
			//draw2D.draw(drawObject);
			//draw2D.end();
			if((fontTechnique != null)&&(fontTechniqueParameters !=null)){
				graphicsDevice.setTechnique(fontTechnique);
				fontTechniqueParameters.clipSpace = mathDevice.v4Build(2 / graphicsDevice.width, -2 / graphicsDevice.height, -1, 1, fontTechniqueParameters.clipSpace);
				graphicsDevice.setTechniqueParameters(fontTechniqueParameters);
				function segmentFont(x, y, text, height) {
					var topLeft = draw2D.viewportUnmap(x, y);
					var bottomRight = draw2D.viewportUnmap(x + 10, y + height);
					font.drawTextRect(text, {
						rect: [topLeft[0], topLeft[1], bottomRight[0] - topLeft[0], bottomRight[1] - topLeft[1]],
						scale: 1.0,
						spacing: 0,
						color:[1,1,1],
						alignment: 0 //0=left,1=center, 2=right
					});
				}
				var titleHeight = 0.75;
				segmentFont(55, 50, "Loading...", titleHeight);
			}
			graphicsDevice.endFrame();
		}
		
		if(sceneLoader.complete()) {
			console.log("Starting scene...");
			TurbulenzEngine.clearInterval(intervalID);
			camera.lookAt(cameraDefaultLook, worldUp, cameraDefaultPos);
			camera.updateViewMatrix();
			renderer.updateShader(shaderManager);
			shader2d = shaderManager.get("shaders/generic2D.cgfx");
			technique2d = shader2d.getTechnique("constantColor2D");
			techniqueParameters2d = graphicsDevice.createTechniqueParameters({
				clipSpace: null,
				constantColor: mathDevice.v4Build(0, 0, 0, 1)
			});
			contactsShader = shaderManager.get("shaders/debug.cgfx");
			contactsTechnique = contactsShader.getTechnique("debug_lines_constant");
			contactsTechniqueParameters = graphicsDevice.createTechniqueParameters({
				worldViewProjection: null,
				constantColor: mathDevice.v4Build(1, 0, 0, 1)
			});
			// Floor physics
			if(physicsManager.physicsNodes.length >= 0) {
				// Floor is represented by a plane shape
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
			}
			loadAssets01();
			intervalID = TurbulenzEngine.setInterval(renderFrame, 1000 / 60);
		}
    };
	
    intervalID = TurbulenzEngine.setInterval(loadingLoop, 1000 / 10);
    // Change the clear color before we start loading assets
    loadingLoop();
    var postLoad = function postLoadFn() {
		console.log("postLoad");
        var mass = 10.0;
        var margin = 0.001;
        duckMesh = scene.findNode("DuckMesh");
		//console.log(duckMesh);
        var halfExtents = duckMesh.localHalfExtents;
		//console.log(halfExtents);
		
        var xhalfExtent = halfExtents[0];
        var yhalfExtent = halfExtents[1];
        var halfPI = Math.PI / 2;
        var xAxis = mathDevice.v3BuildXAxis();
        var zAxis = mathDevice.v3BuildZAxis();
        function newPhysicsNode(name, shape, offsetTransform, pos) {
            var duckGeom = duckMesh.clone(name + "Geom");
            physicsManager.deletePhysicsNode(duckGeom.physicsNodes[0]);
            duckGeom.physicsNodes = [];
            duckGeom.setLocalTransform(offsetTransform);
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
            duckPhys.addChild(duckGeom);
            duckPhys.physicsNodes = [
                physicsNode
            ];
            duckPhys.setDynamic();
            physicsManager.physicsNodes.push(physicsNode);
            physicsManager.dynamicPhysicsNodes.push(physicsNode);
            physicsManager.enableHierarchy(duckPhys, true);
        }
		
        // Build a box duck
        var shape = physicsDevice.createBoxShape({
            halfExtents: halfExtents,
            margin: margin
        });
        var position = mathDevice.m43BuildTranslation(5, yhalfExtent, 0);
        newPhysicsNode("DuckBox", shape, mathDevice.m43BuildIdentity(), position);
		/*
        // Build a cone duck
        shape = physicsDevice.createConeShape({
            height: yhalfExtent * 2,
            radius: xhalfExtent,
            margin: margin
        });
        mathDevice.m43BuildTranslation(10, yhalfExtent, 0, position);
        newPhysicsNode("DuckCone", shape, mathDevice.m43BuildIdentity(), position);
        // Build a cylinder duck
		
        shape = physicsDevice.createCylinderShape({
            halfExtents: [
                xhalfExtent, 
                yhalfExtent, 
                xhalfExtent
            ],
            margin: margin
        });
        mathDevice.m43BuildTranslation(15, yhalfExtent, 0, position);
        newPhysicsNode("DuckCylinder", shape, mathDevice.m43BuildIdentity(), position);
        // Build a sphere duck
        shape = physicsDevice.createSphereShape({
            radius: xhalfExtent,
            margin: margin
        });
        mathDevice.m43BuildTranslation(20, yhalfExtent, 0, position);
        newPhysicsNode("DuckSphere", shape, mathDevice.m43BuildIdentity(), position);
        // Build a capsule duck
        shape = physicsDevice.createCapsuleShape({
            radius: xhalfExtent,
            height: yhalfExtent * 2,
            margin: margin
        });
        // Capsules always take their height in the Y-axis
        // Rotate the capsule so it is flat against the floor
        // Rotate the duck so it is facing the correct direction
        mathDevice.m43BuildTranslation(25, yhalfExtent, 0, position);
        mathDevice.m43SetAxisRotation(position, xAxis, halfPI);
        mathDevice.m43SetAxisRotation(position, zAxis, halfPI);
        newPhysicsNode("DuckCapsule", shape, mathDevice.m43FromAxisRotation(zAxis, -halfPI), position);
        // Build a convex hull duck
        shape = physicsDevice.createConvexHullShape({
            points: duckMesh.physicsNodes[0].triangleArray.vertices,
            margin: margin
        });
        mathDevice.m43BuildTranslation(30, yhalfExtent, 0, position);
        newPhysicsNode("DuckConvexHull", shape, mathDevice.m43BuildIdentity(), position);
        // Set DuckMesh to disabled when debug rendering is enabled
        // This is to prevent Z-fighting between the geometry of the triangle mesh and asset
        duckMesh.setDisabled(true);
		*/
        // Create a pool of boxes
        var identity = mathDevice.m43BuildIdentity();
        for(var i = 0; i < numBoxes; i += 1) {
            var box = physicsDevice.createRigidBody({
                shape: boxShape,
                mass: 1.0,
                inertia: boxShape.inertia,
                transform: identity,
                friction: 0.9,
                restitution: 0.1
            });
            var newBox = SceneNode.create({
                name: "box" + i,
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
            scene.addRootNode(newBox);
            boxes[i] = physicsNode;
        }
		
		//loadAssets01();
	};
	
	var postload_mesh = function postLoadFn() {
		console.log("postload_mesh");
		var mass = 10.0;
        var margin = 0.001;
        //duckMesh = scene.findNode("DuckMesh");
		//console.log("postload_mesh");
		//console.log(scene);
	};
	
	var loadAssets01 = function loadAssetsFn01() {
		sceneLoader.load({
			//scene: otherscene,
			scene: scene,
			assetPath: "models/spaceship_outpostAAA01.dae",
			assetPath: "models/spaceship_customframe_colony.dae",
			assetPath: "models/station_outpostAP.dae",
			graphicsDevice: graphicsDevice,
            textureManager: textureManager,
            effectManager: effectManager,
            shaderManager: shaderManager,
            physicsManager: physicsManager,
            requestHandler: requestHandler,
			baseMatrix: mathDevice.m43BuildTranslation(0, 0, 0),
			append: true,			
            postSceneLoadFn: postload_mesh,
            dynamic: false
        });
	}
	
    var loadAssets = function loadAssetsFn() {
        // Renderer for the scene.
        renderer = DefaultRendering.create(graphicsDevice, mathDevice, shaderManager, effectManager);
        renderer.setGlobalLightPosition(mathDevice.v3Build(0.5, 100.0, 0.5));
        renderer.setAmbientColor(mathDevice.v3Build(0.3, 0.3, 0.4));
        shaderManager.load("shaders/generic2D.cgfx");
		
        // Load mesh duck
        sceneLoader.load({
            scene: scene,
			//assetPath: "models/",
            assetPath: "models/duck_trianglemesh.dae",
            //assetPath: "models/stationoutpostAA.dae",
            graphicsDevice: graphicsDevice,
            textureManager: textureManager,
            effectManager: effectManager,
            shaderManager: shaderManager,
            physicsManager: physicsManager,
            requestHandler: requestHandler,
            baseMatrix: mathDevice.m43BuildTranslation(0, 0.77, 0),
            append: true,
            postSceneLoadFn: postLoad,
            dynamic: false
        });
		
		//loadAssets01();
    };
	
    var mappingTableReceived = function mappingTableReceivedFn(mappingTable) {
		var urlMapping = mappingTable.urlMapping;
		var assetPrefix = mappingTable.assetPrefix;
        textureManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        shaderManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        sceneLoader.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
		othersceneLoader.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
		
		fontManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
		//load font
		//fontManager.load('fonts/hero.fnt', function (fontObject) {
		//fontManager.load('fonts/opensans-8.fnt', function (fontObject) {
		//fontManager.load('fonts/opensans-16.fnt', function (fontObject) {
		fontManager.load('fonts/opensans-32.fnt', function (fontObject) {
			font = fontObject;
			//console.log(font);
		});
		
		shaderManager.load('shaders/font.cgfx', function (shaderObject) {
			shader = shaderObject;
			//console.log(shader);
		});		
		
        loadAssets();
    };
	
	this.displaysceneobject = function (){
		console.log(scene);
	}
	
	this.findsceneobject = function (_name){
		var sobj =  scene.findNode(_name);
		console.log(sobj);
		
	}
	
    var gameSessionCreated = function gameSessionCreatedFn(gameSession) {
        mappingTable = TurbulenzServices.createMappingTable(requestHandler, gameSession, mappingTableReceived);		
    };
	
    var gameSession = TurbulenzServices.createGameSession(requestHandler, gameSessionCreated);
    // Create a scene destroy callback to run when the window is closed
    function destroyScene() {
        gameSession.destroy();
        TurbulenzEngine.clearInterval(intervalID);
        clearColor = null;
        if(scene) {
            scene.destroy();
            scene = null;
        }
        requestHandler = null;
        if(renderer) {
            renderer.destroy();
            renderer = null;
        }
        camera = null;
        if(textureManager) {
            textureManager.destroy();
            textureManager = null;
        }
        if(shaderManager) {
            shaderManager.destroy();
            shaderManager = null;
        }
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
        floor = null;
    }
    TurbulenzEngine.onunload = destroyScene;
	
	return this;
};

/*
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
				//canvas: document.getElementById("canvas"),
				canvas: canvas,
				fillParent: true
			});

			if (!TurbulenzEngine) {
				window.alert("Failed to init TurbulenzEngine (canvas)");
				return;
			}

			TurbulenzEngine.onload = appEntry;
			TurbulenzEngine.onunload = appShutdown;
			appEntry()
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
*/