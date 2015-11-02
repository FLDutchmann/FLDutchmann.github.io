var XMIN = -2;
var XMAX = 2;
var YMIN = -2;
var YMAX = 2;
MAX_ITARATIONS = 1000;
var XZoom = 0.3;
var YZoom = 0;
var ctx;
var mouseX = 0;
var mouseY = 0;

function getPosition(event) {
  var x = event.x;
  var y = event.y;

  var canvas = document.getElementById("canvas");

  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;

  mouseX = x;
  mouseY = y;
}


var calculteValue = function(a, b){
	var x = a;
	var y = b;

	for(var i = 0; i < MAX_ITARATIONS; i++){
		temp = x*x - y*y + a;
		y = 2*x*y + b;
		x = temp;
		if(x*x + y*y >= 4){
			return i;
		}
	}
	return -1;

}

var getScreenValues = function(){
	var test = [];
	for(var i = 0; i < SCRHEIGHT; i++){
		var row = [];
		for(var j = 0; j < SCRHEIGHT; j++){
			row.push(calculteValue((XMAX-XMIN)/ SCRWIDTH * j + XMIN, (YMIN-YMAX)/SCRHEIGHT * i + YMAX))
		}
		test.push(row);
	}
	return test;
}

var drawMandelbrot = function(screenValues){
	ctx.fillStyle = "#FF0000";
	for(var i = 0; i < screenValues.length; i++){
		for(var j = 0; j < screenValues[i].length; j++){
			if(screenValues[i][j] === -1){
				ctx.fillStyle = "hsl(360,100%,0%)";
			} else {
				ctx.fillStyle = "hsl("+(Math.log(screenValues[i][j])/Math.log(MAX_ITARATIONS)*180)+",100%,50%)";
			}

			ctx.fillRect(j, i, 1, 1);
		}
	}
}

var zoomScreen = function(){
	XZoom = (XMAX-XMIN)/ SCRWIDTH  * mouseX + XMIN
	YZoom = (YMIN-YMAX)/ SCRHEIGHT * mouseY + YMAX;
	var size = XMAX - XMIN;
	XMIN = (XMIN - XZoom)/1.5 + XZoom;
	XMAX = (XMAX - XZoom)/1.5 + XZoom;
	YMIN = (YMIN - YZoom)/1.5 + YZoom;
	YMAX = (YMAX - YZoom)/1.5 + YZoom;
	drawMandelbrot(getScreenValues())
}

$(document).ready(function() {
	var canvas = $("#canvas")[0];
	ctx = canvas.getContext("2d");
	SCRWIDTH = canvas.width;
	SCRHEIGHT = canvas.height;

	canvas.addEventListener("mousedown", getPosition, false);

	canvas.addEventListener("mouseup", zoomScreen, false);

	drawMandelbrot(getScreenValues())


});
