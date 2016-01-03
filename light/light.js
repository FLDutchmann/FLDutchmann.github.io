var scrWidth = 0;
var scrHeight = 0;
var canvas;
var simObjects = [];
var EPS = 1e-10;
var lightRay;

var isMouseDown = false;

var selectedObject;

var onMouseDown = function(event){
	console.log(event);
	var mousePos = new Vector2(event.offsetX, event.offsetY);
	var bdist = lightRay.pos.sub(mousePos).mag();
	
	
	console.log(bdist);
}

var onMouseUp = function(){
	
}

var LightRay = function(pos, direction, containingObj){
	this.pos = pos;
	this.dir = direction.normalize();
	this.containingObj = containingObj;
}

LightRay.prototype.getIntersectingLines = function(){
	return getIntersectingLines(this.pos, this.dir);
}

LightRay.prototype.getFirstIntersects = function(){
	var lines = this.getIntersectingLines();
	
	var minDist = Infinity;
	var closestLines = [];
	for(var i = 0; i < lines.length; i++){
		console.log("test:");
		console.log(lines);
		l = lines[i];
		var p1 = l[0];
		var p2 = l[1];
		var v = p1.sub(this.pos);
		var d = p2.sub(p1);
		var dist = v.cross(d)/this.dir.cross(d);
		
		if(dist < EPS){
			dist = Infinity;
		}
		
		if(dist < minDist){
			closestLines = [l];
			minDist = dist;
		} else if(dist === minDist && dist !== Infinity){
			closestLines.push(l);
		}
	}
	
	console.log(minDist);
	
	return closestLines;
}

LightRay.prototype.draw = function(ctx, i){
	var intersect = this.getFirstIntersects();
	console.log("Intersection lines");
	console.log(intersect);
	
	console.log("Current position");
	console.log(this.pos);
	if(intersect.length !== 0){
		var contObj = undefined;
		l = intersect[0];
		var p1 = l[0];
		var p2 = l[1];
		var v = p1.sub(this.pos);
		var d = p2.sub(p1);
		var dist = v.cross(d)/this.dir.cross(d);
		var intPt = this.dir.mult(dist).add(this.pos);
		console.log("Intersection point");
		console.log(intPt);
		
		
		ctx.beginPath();
		ctx.moveTo(this.pos.x, this.pos.y);
		ctx.lineTo(intPt.x, intPt.y);
		ctx.stroke();
		//Calculate new dir:
		var n1 = 1;
		var n2 = 1;
		if(intersect.length === 1){
			if(this.containingObj === intersect[0][2]){
				console.log(2);
				n1 = this.containingObj.refractionIndex;
				n2 = 1;
				contObj = undefined;
			} else if (typeof this.containingObj === "undefined"){
				console.log(3);
				n1 = 1;
				n2 = intersect[0][2].refractionIndex;
				contObj = intersect[0][2];
				
			} else throw "Error: simObjects inside each other"
		}
		
		var a = p1.sub(p2).normalize();
		if(a.dot(this.dir) < 0){
			a = a.mult(-1);
		}
		var b = new Vector2(a.y, -a.x);
		
		if(b.dot(this.dir) < 0){
			b = b.mult(-1);
		}
		
		console.log(a);
		
		console.log(b);
		
		this.dir = this.dir.normalize();
		var sinTheta1 = a.dot(this.dir);
		
		if(n1*sinTheta1 <= n2){
			
			
			
			console.log("Normal Refraction");
			var sinTheta2 = n1/n2*sinTheta1;
			var cosTheta2 = Math.sqrt(1-sinTheta2*sinTheta2);
			var newDir = a.mult(sinTheta2).add(b.mult(cosTheta2));
			var newRay = new LightRay(intPt, newDir, contObj);
			newRay.draw(ctx, ++i);
			return;
			
			
		} else {
			console.log("Total refraction");
			var newDir = this.dir.sub(b.mult(this.dir.dot(b)*2));
			var newRay = new LightRay(intPt, newDir, this.containingObj);
			newRay.draw(ctx, ++i);
			return;
		}
		
		
	} else {
		console.log(4)
		var d = this.dir.normalize().mult(1000).add(this.pos);
		ctx.beginPath();
		ctx.moveTo(this.pos.x, this.pos.y);
		ctx.lineTo(d.x, d.y);
		ctx.stroke();
		return;
	}
	
}

var SimObject = function(polygon, color, refractionIndex){
	this.polygon = polygon;
	this.color = color;
	this.refractionIndex = refractionIndex;
}

SimObject.prototype.draw = function(ctx){
	ctx.fillStyle = this.color;
	ctx.strokeStyle = "black";
	this.polygon.draw(ctx);
}


var getIntersectingLines = function(position, direction){ //returns array of arrays of two points indicating the lines the ray passes through
	var dir = direction.normalize();
	var p = position;
	var lines = [];
	
	for(var i = 0; i < simObjects.length; i++){
		var obj = simObjects[i];
		var pol = obj.polygon;
		var pts = pol.points;
		for(var i = 0; i < pts.length; i++){
			var p1 = pts[i];
			var p2 = pts[(i + 1) % pts.length];
			d1 = p1.sub(p);
			d2 = p2.sub(p);
			
			if(isVectorInMiddle(d1, dir, d2)){
				lines.push([p1, p2, obj]);
			}
		}
	}
	
	return lines;
}

var isVectorInMiddle = function(a, b, c){
	if(a.cross(c) < 0){
		var temp = a;
		a = c;
		c = temp;
	} 
	
	if(a.cross(c) === 0)
		return false;
	
	if(a.cross(b) === 0){
		return true;
	} 
	
	if(a.cross(b) > 0 && b.cross(c) > 0){
		return true;
	} else return false;
	
}

var tempDrawLines = function(ctx, lines){
	for(var i = 0; i < lines.length; i++){
		l = lines[i];
		ctx.beginPath();
		ctx.moveTo(l[0].x, l[0].y);
		ctx.lineTo(l[1].x, l[1].y);
		ctx.stroke();
	}
}

$(document).ready(function() {
	var canvas = $("#canvas")[0];
	ctx = canvas.getContext("2d");
	scrWidth = canvas.width;
	scrHeight = canvas.height;
	
	$("#canvas").mousedown(onMouseDown);
	
	$("#canvas").mouseup(onMouseUp);
	var angle = 0;
	var dir = new Vector2(Math.cos(angle), Math.sin(angle));
	
	var pos = new Vector2(100, 150);
	
	var rays = [];
	
	for(var i = 120; i <= 280; i += 20){
		rays.push(new LightRay(new Vector2(100, i), dir));
	}
	
	var ray = new LightRay(pos, dir);
	//Convex Lens:
	var pts = []
	var pts2 =[]
	var numPoints = 100;
	for(var i = 0; i <= numPoints; i++){
		dy = 200/numPoints;
		
		var y = i*dy + 100;
		pts.push(new Vector2(Math.sqrt(225*225 - (y-200)*(y-200)), y));
		pts2.push(new Vector2(400-Math.sqrt(225*225 - (y-200)*(y-200)), y))
	}
	
	for(var i = pts2.length-1; i >= 0 ; i--){
		pts.push(pts2[i]);
	}
	
	var p = new Polygon(pts);
	var obj = new SimObject(p, "rgba(127, 127, 127, 0.3)", 1.9);
	
	obj.draw(ctx);
	simObjects.push(obj);
	

	ctx.strokeStyle = "#000000"
	
	ctx.strokeStyle = "red";
	
	
	
	for(var i = 0; i < rays.length; i++){
		rays[i].draw(ctx, 0);
	}
	
	
	ctx.strokeStyle = "blue";
	//ray.draw(ctx,  0);
	
	lightRay = ray;
});


