var BoundingBox = function(x, y, X, Y) {
	this.topLeft = new Vector2(x, y);
	this.bottomRight = new Vector2(X, Y);
}

BoundingBox.prototype.getExactPos = function(pos) {
	var xy = Vector2.add(this.topLeft, pos);
	var XY = Vector2.add(this.bottomRight, pos);
	return new BoundingBox(xy.x, xy.y, XY.x, XY.y);
}