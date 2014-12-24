function wrapText(context, text, maxWidth) {
	var words = text.split(' ');
	var line = '';
	var lines = [];
	
	
	for(var n = 0; n < words.length; n++) { //taken from http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
	  if(words[n] !== "/n"){
	  var testLine = line + words[n] + ' ';
	  var metrics = context.measureText(testLine);
	  var testWidth = metrics.width;
	  if (testWidth > maxWidth && n > 0) {
		lines.push(line);
		line = words[n] + ' ';
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
	
	return lines;
}

var displayText = function(x, y, context, lines, lineHeight) {
	var height = (lines.length - 0.5) * (lineHeight + 0.5);
	var currY = y - height/2;
	lines.forEach(function(currLine, i) {
		context.fillText(currLine, x + 1, i * (lineHeight + 0.5) + currY + lineHeight/2);
	});
}


var Button = function(context, x, y, width, height, text, onClick, fontSize, isDisplayed) {
	this.position = new Vector2(x, y);
	this.width = width;
	this.height = height;
	this.onClick = onClick;
	this.fontSize = fontSize === undefined ? 10: fontSize;
	this.isDisplayed = isDisplayed === undefined ? true : isDisplayed;
	this.context = context;
	this.buttonsIndex = buttons.nullPush(this);
	
	context.font = "" + this.fontSize + "pt Arial";
	this.text = wrapText(this.context, text, this.width);
}

Button.prototype.draw = function(ctx){
	ctx.textAlign = "center";
	ctx.fillStyle = "white";
	ctx.strokeStyle = "black";
	ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
	ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);	
	

	ctx.fillStyle = "black";
	ctx.font = "" + this.fontSize + "pt Arial";
	
	displayText(this.position.x + this.width/2, this.position.y + this.height/2, ctx, this.text, this.fontSize + 3);
}

Button.prototype.checkMouseOver = function (){
	if(mouseX > this.position.x &&
		mouseY > this.position.y &&
		mouseX < this.position.x + this.width &&
		mouseY < this.position.y + this.height) return true;
	return false;
}

