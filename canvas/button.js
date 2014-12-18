function wrapText(context, text, x, constY, maxWidth, lineHeight) {
	var words = text.split(' ');
	var line = '';
	var lines = [];
	
	var y = constY;
	
	for(var n = 0; n < words.length; n++) { //taken from http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
	  if(words[n] !== "/n"){
	  var testLine = line + words[n] + ' ';
	  var metrics = context.measureText(testLine);
	  var testWidth = metrics.width;
	  if (testWidth > maxWidth && n > 0) {
		lines.push(line);
		line = words[n] + ' ';
		y += lineHeight;
	  }
	  else {
		line = testLine;
	  }
	  } else {
		lines.push(line);
		
		line = '';
	  }
	}
	
	lines.push(line);
	var height = (lines.length - 1) * lineHeight;
	var currY = constY - height/2;
	lines.forEach(function(currLine, i) {
		context.fillText(currLine, x, (i + 0.5) * lineHeight + currY);
	});
}

var Button = function(x, y, width, height, text, onClick, fontSize) {
	this.position = new Vector2(x, y);
	this.width = width;
	this.height = height;
	this.text = text;
	this.onClick = onClick;
	this.fontSize = fontSize === undefined ? 10: fontSize;
	this.exists = true;
	
	buttons.push(this);
}

Button.prototype.draw = function(ctx){
	ctx.textAlign = "center";
	ctx.fillStyle = "white";
	ctx.strokeStyle = "black";
	ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
	ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);	
	

	ctx.fillStyle = "black";
	ctx.font = "" + this.fontSize + "pt Arial";
	//ctx.fillText(this.text, this.position.x + this.width/2, this.position.y + this.height/2 + this.fontSize/2);

	wrapText(ctx, this.text, this.position.x + this.width/2, this.position.y + this.height/2, this.width, this.fontSize + 3);
}

Button.prototype.checkMouseOver = function (){
	if(mouseX > this.position.x &&
		mouseY > this.position.y &&
		mouseX < this.position.x + this.width &&
		mouseY < this.position.y + this.height) return true;
	return false;
}