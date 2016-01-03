var Polygon = function(points, lines){
	this.points = points;
}

Polygon.prototype.draw = function(ctx){
		console.log(this.points);
	var p0 = this.points[0];
	ctx.moveTo(p0.x, p0.y);
	
	for (var i = 0; i < this.points.length; i++){
		var p = this.points[i];
		console.log(p);
		ctx.lineTo(p.x, p.y);
	}
	
	ctx.lineTo(p0.x, p0.y);
	ctx.stroke();
	ctx.fill();
	
}