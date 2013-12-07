// Copyright (c) 2010-2012 Turbulenz Limited
/// <reference path="../../../jslib-modular/turbulenz.d.ts" />
/// <reference path="../../../jslib-modular/servicedatatypes.d.ts" />
/// <reference path="../../../jslib-modular/services.d.ts" />
/// <reference path="../../../jslib-modular/aabbtree.d.ts" />
/// <reference path="../../../jslib-modular/jsengine_base.d.ts" />
/// <reference path="../../../jslib-modular/jsengine_base.d.ts" />
/// <reference path="../../../jslib-modular/jsengine.d.ts" />
/// <reference path="../../../jslib-modular/utilities.d.ts" />
/*global TurbulenzEngine: false*/
/*exported appCreate*/
var appDestroyCallback;
function appCreate() {
    //window.alert("appCreate tzjs app");
    var versionElem = document.getElementById("engine_version");
    if(versionElem) {
        versionElem.innerHTML = TurbulenzEngine.version;
    }
    var intervalID;
    var gd = TurbulenzEngine.createGraphicsDevice({
    });
    var md = TurbulenzEngine.createMathDevice({
    });
    var camera = Camera.create(md);
    camera.lookAt(md.v3BuildZero(), md.v3Build(0, 1, 0), md.v3Build(0, 20, 100));
    var floor = Floor.create(gd, md);
    var mainLoop = function mainLoopFn() {
        if(gd.beginFrame()) {
			/*
            gd.clear([
                1.0, 
                1.0, 
                1.0, 
                1.0
            ], 1.0, 0.0);
			
            camera.updateViewMatrix();
            camera.updateViewProjectionMatrix();
			*/
            floor.render(gd, camera);
            gd.endFrame();
        }
    };
    intervalID = TurbulenzEngine.setInterval(mainLoop, 1000 / 60);
    appDestroyCallback = function appDestroyCallbackFn() {
        TurbulenzEngine.clearInterval(intervalID);
        //window.alert("appDestroy");
        TurbulenzEngine.flush();
    };
    TurbulenzEngine.onunload = appDestroyCallback;
}
