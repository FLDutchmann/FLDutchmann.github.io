var Vector2 = function(x, y){
	this.x = x;
	this.y = y;
}

Vector2.prototype.add = function(v){
	return new Vector2(this.x + v.x, this.y + v.y);
}

Vector2.prototype.sub = function(v){
	return new Vector2(this.x - v.x, this.y - v.y);
}

Vector2.prototype.mult = function(c){
	return new Vector2(this.x * c, this.y * c);
}

Vector2.prototype.div = function(c){
	return this.mult(1/c);
}

Vector2.prototype.dot = function(v){
	return this.x * v.x + this.y * v.y;
}

Vector2.prototype.cross = function(v){
	return this.x * v.y - this.y * v.x;
}

Vector2.prototype.mag = function(){
	return Math.sqrt(this.x * this.x + this.y * this.y);
}

Vector2.prototype.normalize = function(){
	return this.div(this.mag());
}

Vector2.prototype.draw = function(ctx, pos){
	ctx.beginPath();
	ctx.moveTo(pos.x, pos.y);
	var p2 = pos.add(this);
	ctx.lineTo(p2.x, p2.y);
	ctx.arc(p2.x, p2.y, 4, 0, 2*Math.PI);
	ctx.stroke();
}