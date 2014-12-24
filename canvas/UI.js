var UIElement = function(x, y, width, height, drawFunc, buttons, isDisplayed) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.drawFunc = drawFunc;
	this.buttons = buttons;
	this.isDisplayed = isDisplayed === undefined ? false : isDisplayed;
}

UIElement.prototype.close = function () {
	this.isDisplayed = false;
	this.buttons.forEach(function (button) {
		button.isDisplayed = false;
	});
}

UIElement.prototype.open = function() {
	this.isDisplayed = true;
	this.buttons.forEach(function(btn){
		btn.isDisplayed = true;
	});
}