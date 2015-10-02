var EPSILON = 0.0001;
var TWOPI = 2*Math.PI;


var FourierProduct = function(f, period, term, trig){
	this.func = f;
	this.period = period;
	this.term = term;
	this.trigTerm = trig;
};



FourierProduct.prototype.evaluate = function(t){
	if(this.trigTerm === "sin"){
		return this.func(t)*Math.sin(this.term*t*TWOPI/this.period);
	} else if (this.trigTerm === "cos"){
		return this.func(t)*Math.cos(this.term*t*TWOPI/this.period);
	}
}


var integral = function(f, min, max) {
	if(min > max){
		return -integral(f, max, min);
	}
	if(min === max){
		return 0;
	}
	
	var sum = 0;
	
	for(var i = min; i < max; i += EPSILON){
		sum += f.evaluate(i)*EPSILON;
	}
	
	return sum;
};
var test;

var getFourierFactors = function(f, numTerms, period){
	period = period === undefined ? Math.PI*2 : period;
	
	var cosTerms = [];
	var sinTerms = [];
	
	
	for(var i = 0; i < numTerms; i++){
		var cosProd = new FourierProduct(f, period, i, "cos");
		cosTerms[i] = integral(cosProd, -period/2, period/2)*2/period;
		var sinProd = new FourierProduct(f, period, i, "sin");
		sinTerms[i] = integral(sinProd, -period/2, period/2)*2/period;
	}
	
	return {
		cosTerms: cosTerms,
		sinTerms: sinTerms
	}
};

var FourierSeries = function(cosTerms, sinTerms, period){
	this.cosTerms = cosTerms;
	this.sinTerms = sinTerms;
	this.period = period;
}

FourierSeries.prototype.evaluate = function(x){
	var sum = this.cosTerms[0]/2;
	for(var i = 1; i < this.cosTerms.length; i++){
		sum += this.cosTerms[i]*Math.cos(TWOPI*i*x/this.period);
		sum += this.sinTerms[i]*Math.sin(TWOPI*i*x/this.period)
	}
	return sum;
}

/*

var FunctionGraph = function(ctx, xMin, xMax, yMin, yMax){
	this.xMin = xMin;
	this.xMax = xMax;
	this.yMin = yMin;
	this.yMax = yMax;
	this.ctx = ctx;
	ctx.scale(400/(xMax-xMin), -400/(yMax-yMin))
	ctx.translate(xMin, -yMax);
	ctx.lineWidth = (xMax-xMin)/400;
	//ctx.fillRect(2, 0, 200, 200);
	console.log("test");
}


FunctionGraph.prototype.plot = function(f){
	var points = 1000;
	var dx = (this.xMax - this.xMin)/points;
	ctx.beginPath();
	
	for(var i = this.xMin; i < this.xMax; i += dx){
		
		ctx.moveTo(i, f(i));
		ctx.lineTo(i+dx, f(i+dx));
	}
	ctx.closePath();
	ctx.stroke();
	
}*/

function fun1(x) {return Math.sin(x);  }
function fun2(x) {return Math.cos(3*x);}
var funcs = [];

function draw() {
	var canvas = document.getElementById("canvas");
	if (null==canvas || !canvas.getContext) return;

	var axes={}, ctx=canvas.getContext("2d");
	axes.x0 = .5 + .5*canvas.width;  // x0 pixels from left to x=0
	axes.y0 = .5 + .5*canvas.height; // y0 pixels from top to y=0
	axes.scale = 40;                 // 40 pixels from x=0 to x=1
	axes.doNegativeX = true;

	showAxes(ctx,axes);
	for(var i = 0; i < funcs.length; i++){
		funGraph(ctx,axes,funcs[i],"rgb(11,153,11)",1); 
	}
	
	//funGraph(ctx,axes,fun2,"rgb(66,44,255)",2);
}

function funGraph (ctx,axes,func,color,thick) {
	var xx, yy, dx=.1, x0=axes.x0, y0=axes.y0, scale=axes.scale;
	var iMax = Math.round((ctx.canvas.width-x0)/dx);
	var iMin = axes.doNegativeX ? Math.round(-x0/dx) : 0;
	ctx.beginPath();
	ctx.lineWidth = thick;
	ctx.strokeStyle = color;

	for (var i=iMin;i<=iMax;i++) {
		xx = dx*i; yy = scale*func.evaluate(xx/scale);
		if (i==iMin) ctx.moveTo(x0+xx,y0-yy);
		else         ctx.lineTo(x0+xx,y0-yy);
	}
	ctx.stroke();
}

function showAxes(ctx,axes) {
	var x0=axes.x0, w=ctx.canvas.width;
	var y0=axes.y0, h=ctx.canvas.height;
	var xmin = axes.doNegativeX ? 0 : x0;
	ctx.beginPath();
	ctx.strokeStyle = "rgb(128,128,128)"; 
	ctx.moveTo(xmin,y0); ctx.lineTo(w,y0);  // X axis
	ctx.moveTo(x0,0);    ctx.lineTo(x0,h);  // Y axis
	ctx.stroke();
}

function clearPlots(){
	var canvas = document.getElementById("canvas");
	if (null==canvas || !canvas.getContext) return;
	var axes={}, ctx=canvas.getContext("2d");
	axes.x0 = .5 + .5*canvas.width;  // x0 pixels from left to x=0
	axes.y0 = .5 + .5*canvas.height; // y0 pixels from top to y=0
	axes.scale = 40;                 // 40 pixels from x=0 to x=1
	axes.doNegativeX = true;
	ctx.fillStyle = "#FFFFFF";
	
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	showAxes(ctx, axes);
}

