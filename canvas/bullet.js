var Bullet = function(pos, vel) {
	this.position = pos;
	this.velocity = vel;
	this.class = "bullet";
	this.radius = 2;
	this.boundingBox = new BoundingBox(-this.radius/2, -this.radius/2, this.radius/2, this.radius/2);
	this.collidersIndex = colliders.nullPush(this);
	this.bulletsIndex = bullets.nullPush(this);
	
	this.lifeSpan = 10;
}

Bullet.prototype.update = function() {
	this.lifeSpan -= 1/fps;
	if(this.lifeSpan <= 0) {
		this.delete();
	}
	this.position.add(this.velocity);
}

Bullet.prototype.draw = function(ctx) {
	
	ctx.fillStyle = 'black';
	ctx.beginPath();
	ctx.arc(this.position.x, this.position.y, this.radius, 0, TWO_PI);
	ctx.fill();
	ctx.closePath();
}

Bullet.prototype.onCollide = function(col) {
	console.log(col);
	if(col.class !== "ship")this.delete();
}

Bullet.prototype.delete = function() {
	colliders[this.collidersIndex] = null;
	bullets[this.bulletsIndex] = null;
}