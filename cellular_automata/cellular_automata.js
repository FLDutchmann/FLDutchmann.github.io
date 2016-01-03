var scrWidth;
var scrHeight;

Number.prototype.mod = function(n) {		// fixes %: -1 % 10 = -1 --> -1 % 10 = 9
    return ((this%n)+n)%n;
};


var getNewValue = function(x, y, map){
	var newVal = map[y][x];
	
	var numNeighbours = 0;
	for(var i = x-1; i <= x+1; i++){
		for(var j = y-1; j <= y+1; j++){
			if(map[j.mod(map.length)][i.mod(map[0].length)]){
				numNeighbours++;
			}
		}
	}
	
	
	if(map[y][x]){
		numNeighbours--;
		if(numNeighbours < 2 || numNeighbours > 3){
			newVal = false;
		}
		
		
	} else {
		newVal = numNeighbours === 3
	}
	
	return newVal;
	
}


var getNextStep = function(field){
	var newField = [];
	for(var i = 0; i < 40; i++){
		var row = [];
		for(var j = 0; j < 40; j++){
			row.push(getNewValue(j, i, field));
		}
		newField.push(row);
	}
	return newField;
}


var field = [];

for(var i = 0; i < 40; i++){
	var row = [];
	for(var j = 0; j < 40; j++){
		row.push(false);
	}
	field.push(row);
}



field[4][2] =
field[3][3] =
field[3][4] = 
field[2][2] = true;

var drawField = function(ctx, field){
	
	
	
	
	ctx.beginPath();
	ctx.fillStyle = "#FFFFFF";
	ctx.rect(0, 0, scrWidth, scrHeight);
	ctx.fill();
	
	ctx.beginPath();
	ctx.fillStyle = "#000000";
	
	var fieldHeight = field.length;
	var fieldWidth = field[0].length;
	width = scrWidth / fieldWidth;
	height = scrHeight / fieldHeight;
	for (var i = 0; i < fieldHeight; i++){
		for(var j = 0; j < fieldWidth; j++){
			
			if(field[i][j]){
				ctx.rect(j*width, i*height, width, height);
			}
		}
	}
	
	ctx.fill();
}

$(document).ready(function() {
	var canvas = $("#canvas")[0];
	ctx = canvas.getContext("2d");
	scrWidth = canvas.width;
	scrHeight = canvas.height;

	field = getNextStep(field);
	drawField(ctx, field);
	
	setInterval(function(){ 
		field = getNextStep(field);
		
		
		
		drawField(ctx, field);
	}, 1000);
	
	
	
});