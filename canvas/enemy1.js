var Enemy1 = function(x, y) {
	this.position = new Vector2(x, y);
	this.velocity = new Vector2(0, 0);
	this.boundingBox = new BoundingBox(-5, -5, 5, 5);
	
	this.collidersIndex = colliders.nullPush(this);
	this.enemiesIndex = enemies.nullPush(this);
	this.class = 'enemy';
	
	this.damage = 1;
}

Enemy1.prototype.draw = function(ctx) {
	ctx.beginPath();
	
	ctx.fillStyle = 'green';
	ctx.fillRect(this.position.x - 5, this.position.y - 5, 10, 10);
	
	ctx.closePath();
}

Enemy1.prototype.update = function() {
	this.position.add(this.velocity);
}

Enemy1.prototype.pathFinding = function(ship) {
	var diff = ship.position.get();
	diff.sub(this.position);
	diff.normalize();
	diff.mult(1);
	this.velocity = diff;
}

Enemy1.prototype.onCollide = function(obj) {
	if(obj.class === "bullet"){
		colliders[this.collidersIndex] = null;
		enemies[this.enemiesIndex] = null;
		incrementScore(1);
	}
}

Enemy1.prototype.collisionCondition = function(col) {
	if(col.class === "bullet") {
		return true;
	}
	return false;
}