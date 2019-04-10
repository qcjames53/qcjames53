// This script uses help from lodev.org's raycasting engine tutorial
//
// https://lodev.org/cgtutor/raycasting.html

var r = {
	map: new Array(),
	px: 20,
	py: 20,
	rot: 0,
	planeX: 0,
	planeY: 0.66
}

function loadMap() {
	r.map = new Array();
	for(var row = 0; row < o.outputHeight; o++) {
		r.map.push(new Array());
		for(var col = 0; col < o.outputWidth; col++) {
			if(isLetterOrDigit(o.contents[row][col])) r.map[row][col] = o.contents[row][col];
			else r.map[row][col] = " ";
		}
	}
}

function movePlayerTo (x,y,rot) {
	r.px = x;
	r.py = y;
	r.rot = rot;
}

function rayCast() {
	//clears the screen / draws on background
	for(var row = 0; row < o.outputHeight; row++) {
		for(var col = 0; col < o.outputWidth; col++) {
			o.contents[row][col] = " ";
		}
	}
		
	for(var i = 0; i < o.outputWidth; i++) {
		//raycasting code here
		var screenXPercent = (2 * i) / o.outputWidth - 1;
		var currentRayX = r.px;
		var currentRayY = r.py;		
	}
}