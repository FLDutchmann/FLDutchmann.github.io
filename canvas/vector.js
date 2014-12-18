var Vector2 = function(x, y){
	if(isNaN(x)){
		x = 0;
	}
	if(isNaN(y)){
		y = 0;
	}
	
	this.x = x;
	this.y = y;
}

Vector2.prototype.add = function(v) {
	
	if(isNaN(v.x)){
		v.x = 0;
	}
	if(isNaN(v.y)){
		v.y = 0;
	}
	
	this.x += v.x;
	this.y += v.y;
}

Vector2.add = function(v1, v2) {
	return new Vector2(v1.x + v2.x, v1.y + v2.y);
}

Vector2.prototype.sub = function(vector) {
	this.x -= vector.x;
	this.y -= vector.y;
}

Vector2.sub = function(v1, v2) {
	return v1.sub(v2);
}

Vector2.prototype.get = function() {
	return new Vector2(this.x, this.y);
}

Vector2.prototype.set = function(x, y) {
	this.x = x;
	this.y = y;
}

Vector2.prototype.mag = function() {
	var m = Math.sqrt(this.x*this.x + this.y*this.y);
	return m;
}

Vector2.prototype.mult = function(s) {
	this.x *= s;
	this.y *= s;
}

Vector2.mult = function(v, s) {
	return v.mult(s);
}

Vector2.prototype.div = function(s) {
	this.x /= s;
	this.y /= s;
}

Vector2.div = function(v, s) {
	return v.div(s);
}

Vector2.dist = function(v1, v2) {
	v1.sub(v2);
	return v1.mag();
}

Vector2.prototype.normalize = function() {
	var m = this.mag();
	this.div(m);
}

Vector2.prototype.rotate = function(theta) {
	sinTheta = Math.sin(theta);
	cosTheta = Math.cos(theta);
	var x = this.x,
		y = this.y;
	this.x = x*cosTheta - y*sinTheta;
	this.y = y*cosTheta + x*sinTheta;
}

constrain = function(num, min, max) {
	
	if(num < min) {
		num = min;
	} else if(num > max) {
		num = max;
	}
	
	return num;
}