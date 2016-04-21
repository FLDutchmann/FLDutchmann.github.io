var XMIN = -2;
var XMAX = 2;
var YMIN = -2;
var YMAX = 2;
var MAX_ITARATIONS = 10;
var XZoom = 0.3;
var YZoom = 0;
var ctx;
var mouseX = 0;
var mouseY = 0;
var pol = [-1, 0, 0, 1];
var dpol = [];
var EPS = 1e-10;

for (var i = 1; i < pol.length; i++){
	dpol[i-1] = pol[i]*i;
}

var cx = function(a, b){
	this.real = a;
	this.imag = b;
}

cx.prototype.get = function(){
	return new cx(this.real, this.imag);
}

cx.prototype.add = function(c){
	return new cx(this.real + c.real, this.imag + c.imag);
}

cx.prototype.mult = function(c){
	real = c.real*this.real - c.imag*this.imag;
	imag = this.imag*c.real + this.real*c.imag;
	return new cx(real, imag);
}

cx.prototype.normsq = function(){
	return this.real*this.real + this.imag*this.imag;
}

cx.prototype.square = function(){
	var real = this.real*this.real - this.imag * this.imag;
	var imag = 2*this.real*this.imag;
	return new cx(real, imag);
}

cx.prototype.recPow = function(n){
	
	if(n === 0){
		return new cx(1, 0);
	}
	
	if(n < -1){
		var c = this.get();
		c = c.pow(-n);
		c = c.pow(-1);
		return c;
	}
	
	if(n === -1){
		var c = new cx(this.real, -this.imag);
		c = c.mult(new cx(1/this.normsq(), 0));
		return c
	}
	
	if(n%2 === 0){
		var c = this.get();
		c = c.recPow(n/2);
		c = c.square();
		return c;
	}
	if(n%2 === 1){
		var c = this.get();
		var z = this.get();
		z = z.recPow(n-1);
		z = z.mult(c);
		return z;
	}
	
	
}

cx.prototype.pow = function(n){
	return this.recPow(n);
}

cx.prototype.log = function(n){
	return new cx(Math.log(this.normsq())/2, Math.atan2(this.imag, this.real));
	
}

cx.prototype.cos = function(){
	return new cx(Math.cos(this.real)*Math.cosh(this.imag), Math.sin(this.real)*Math.sinh(this.imag)*-1);
}

cx.prototype.sin = function(){
	return new cx(this.real - pi/2, this.imag).cos();
}

cx.prototype.exp = function(){
	exp = Math.exp(this.real);
	return new cx(Math.cos(this.imag)*exp, Math.sin(this.imag)*exp);
}




function getPosition(event) {
  var x = event.x;
  var y = event.y;

  var canvas = document.getElementById("canvas");

  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;

  mouseX = x;
  mouseY = y;
}

var calcPol = function(z, pol){
	var sum = new cx(0, 0);
	for (var i = 0; i < pol.length; i++){
		sum = sum.add(z.pow(i).mult(new cx(pol[i], 0)));
	}
	return sum;
}


var calculteValue = function(a, b){
	var roots = [new cx(1, 0), new cx(-0.5, -0.86602540378443864676372317075293618), new cx(-0.5, 0.86602540378443864676372317075293618)]
	
	var approx = new cx(a, b);
	for(var i = 0; i < MAX_ITARATIONS; i++){
		var n = calcPol(approx, pol);
		var dn = calcPol(approx, dpol);
		
		var frac = n.mult(dn.pow(-1)).mult(new cx(-1, 0));
		approx = approx.add(frac);
	}
	
	var min = Infinity;
	var guess;
	for(var i = 0; i < roots.length; i++){
		if( approx.add(roots[i].mult(new cx(-1, 0))).normsq() < min){
			guess = i;
			min = approx.add(roots[i].mult(new cx(-1, 0))).normsq();
		}
	}
	
	return guess;
	
	
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
				ctx.fillStyle = "hsl("+screenValues[i][j]/3*360+",100%,50%)";
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
