var Ship = function() { // The spaceship object
	this.position = new Vector2(200, 200);
	this.class = "ship";
	this.velocity = new Vector2(0, 0);
	this.acceleration = new Vector2(0, 0);//the acceleration is rotated by the rotation of the ship at every update
	this.spAcceleration = new Vector2(0, 0);// special acceleration is not affected by the rotation of the ship, used for calculating drag
	
	this.angle = 0;
	this.aVelocity = 0;
	this.aAcceleration = 0;
	
	this.cooldown = 0;
	this.maxCooldown = 1;
	
	this.maxHealth = 100;
	this.health = 100;
	this.isAlive = true;
	
	this.boundingBox = new BoundingBox(-8, -8, 8, 8);
	this.collidersIndex = colliders.nullPush(this);
	
	this.multiShotLevel = 0;
	this.lazerLevel = 0;
	this.explosiveLevel = 0;
	
	this.shotSpeed = 5;
};

Ship.prototype.draw = function(ctx) { //draws the ship
	ctx.fillStyle = 'rgb(128, 23, 23)';
	ctx.save();
	ctx.translate(this.position.x, this.position.y);
	ctx.rotate(this.angle);
	ctx.beginPath();
	ctx.fillStyle = 'rgb(128, 23, 23)';
	ctx.moveTo(0, 8);
	ctx.lineTo(-5, -4);
	ctx.lineTo(5, -4);
	ctx.lineTo(0, 8);
	
	ctx.fill();
	ctx.fillStroke = 'black';
	ctx.stroke();
	ctx.fillRect(-4, -6, 2, 1);
	ctx.fillRect(1, -6, 2, 1);
	ctx.strokeRect(-4, -6, 2, 1);
	ctx.strokeRect(1, -6, 2, 1);
	ctx.closePath();
	ctx.restore();
};

Ship.prototype.update = function() {
	this.cooldown -= 1/30;
	
	//his.aVelocity += this.aAcceleration;
	//this.aVelocity = constrain(this.aVelocity, -0.07, 0.07);
	//this.angle += this.aVelocity;
	//this.aAcceleration = 0;
	this.angle += this.aVelocity;	
	this.aVelocity = 0;
	
	this.acceleration.rotate(this.angle);//rotates the acceleration to the right direction
	
	this.velocity.add(this.spAcceleration);//special acceleration has not been affected by the rotation of the ship
	this.velocity.add(this.acceleration);
	
	this.position.add(this.velocity);
	this.acceleration.mult(0);//resets the accelerations
	this.spAcceleration.mult(0);
	
	if(this.health <= 0) {
		this.delete();
		this.isAlive = false;
	}
};

Ship.prototype.addForce = function(f) {
	this.acceleration.add(f);
};

Ship.prototype.addAForce = function(af) {
	this.aAcceleration += af;
};


Ship.prototype.doUserInput = function() {
	
	
	// the inputs allow you to press multipe keys at the same time, for further explaination see top of code
	if (keyIsPressed && keys[RIGHT]) {
		this.aVelocity += 0.10;
	}
	
	if (keyIsPressed && keys[LEFT]) {
		this.aVelocity += -0.10;
	}
	
	if (keyIsPressed && keys[UP]) {
		
		var force = new Vector2 (0, 0.02);// the force gets rotated appropriately
		this.addForce(force);
	}
	
	if (keyIsPressed && keys[DOWN]) {
		
		var force = new Vector2 (0, -0.01);
		this.addForce(force);
	}
	
	
	if(keys[88]) { //x
		this.fireBullet();
	}
};

Ship.prototype.applyDrag = function() {// calculates the drag
	var speed = this.velocity.mag();
	var dragMagnitude = 0.003 * speed; //* speed;
	
	// Direction is inverse of velocity
	var dragForce = this.velocity.get();
	dragForce.mult(-1);
	
	// Scale according to magnitude
	dragForce.normalize();
	dragForce.mult(dragMagnitude);
	this.spAcceleration.add(dragForce);
};

Ship.prototype.calculateAngularDrag = function() {//stops rotation
	var f = this.aVelocity;
	f *= -0.02;
	this.aAcceleration += f;
};

Ship.prototype.doBorders = function() {//wraps the ship around the borders
	if (this.position.x > width) {
		this.position.x = 0;
	}
	
	if (this.position.x < 0) {
		this.position.x = width;
	}
	
	if (this.position.y > height) {
		this.position.y = 0;
	}
	
	if (this.position.y < 0) {
		this.position.y = height;
	}
};

Ship.prototype.fireBullet = function() {
	if(this.cooldown <= 0) {
		var vel = new Vector2(0, this.shotSpeed);
		vel.rotate(this.angle);
		vel.add(this.velocity);
		new Bullet(this.position.get(), vel);
		this.cooldown = this.maxCooldown;
		multiShotFunctions[this.multiShotLevel](this);
	}
}

Ship.prototype.onCollide = function(col) {
	if(col.class == 'enemy'){
		this.health -= col.damage;
	}
}

Ship.prototype.collisionCondition = function(col) {
	if(col.class === "enemy") {
		return true;
	}
	return false;
}

Ship.prototype.delete = function() {
	colliders[this.collidersIndex] = null;
}

Ship.prototype.displayHealth = function(ctx) {
	ctx.fillStyle = "red";
	ctx.fillRect(10, 10, this.health, 20);
}