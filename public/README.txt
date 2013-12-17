 # Project Name: Node Turbulenz Engine

   Created By: Lightnet
   
  #License: 
   -Code Languages: cc
   -Contents: cc
   
   Note there are multple Licenses to run and build api and editor codes.
   
  # Information: Work in progress.
  This is early build of the alpha build.
  This is to create a map editor sandbox to build upon options to make game easy to build.
  
  There are two type of build that used low level of coding and other is to make easy to code that is stack in one class.
  
  -Default scene low level.  
  -Protolib scene is easy but less freedom.
  
  It can be mixed if skill knowledge of how it works.
  
  note the naming have prefix tag.
  
  # Run Editor Game:
  -turbulenz_protolib_scene_editor.html
   - By using the protolib run some basic editor map to run some simple.
   - Current working on protolib to make some simple.
  -turbulenz_scene_editor.html
   - This is low end api to bare code block end.
 
 
	# turbulenz_protolib_scene_editor.html
	- B key is to build pyhsic block ground/floor
	- A,S,D,W = camera movements
	- Mouse wheel = zoom
 
  # Export Command lines:

   maketzjs --mode plugin -t . -o app.tzjs templates/app.js
   
   