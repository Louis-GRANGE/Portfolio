var ColorPalette = ["#35b88f", "#152E33", "#23233a", "#9099cd", "#4d529a", "#dddddd"]
var PixelColor = "#23233a";

const GravityDirection = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
};

let currentGravity = GravityDirection.UP;

function getRandomColor() {
	const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
	return randomColor;
}

function ValidPos(v)
{
	const constrainedPos = new vector2D(v.x, v.y);
	if (constrainedPos.x < 0) constrainedPos.x = 0;
	else if (constrainedPos.x > WorldPixel.length - 1) constrainedPos.x = WorldPixel.length - 1;
	if (constrainedPos.y < 0) constrainedPos.y = 0;
	else if (constrainedPos.y > WorldPixel[0].length - 1) constrainedPos.y = WorldPixel[0].length - 1;
	return constrainedPos;
}

function IsValidPos(v)
{
	var validatedPos = this.ValidPos(v);
	return validatedPos.x == v.x && validatedPos.y == v.y;
}

var CellSize = 3; //3
var WorldPixelNext = new Array(Math.floor(window.innerWidth/CellSize));
for (var x = 0; x < WorldPixelNext.length; x++) {
	WorldPixelNext[x] = new Array(Math.floor(window.innerHeight / CellSize));
}

var WorldPixel = new Array(Math.floor(window.innerWidth/CellSize));
for (var x = 0; x < WorldPixel.length; x++) {
	WorldPixel[x] = new Array(Math.floor(window.innerHeight / CellSize));
}

var PixelArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = document.body.scrollHeight + window.screen.height / 4;//window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updatePixelArea, 10);
        this.interval = setInterval(updatePixelColor, 1000);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //if (this.canvas.width != window.innerWidth) {this.canvas.width = window.innerWidth - 20;}
        //if (this.canvas.height != window.innerHeight) {this.canvas.height = document.body.scrollHeight + window.innerHeight / 4;}//window.innerHeight;}
    }
}


function GetNbPixels()
{
	var nbPixels = 0;
	for (var x = 0; x < WorldPixel.length; x += 1) {
    	for (var y = 0; y <= WorldPixel[x].length - 1; y++) {
			if(WorldPixel[x][y])
				nbPixels++;
	    }
	}
	return nbPixels;
}

var BiggestNbPixel = 0;
function updatePixelArea() {
    PixelArea.clear();
    if(isRightButtonDown)
	{
		removePixelsInCircle(new vector2D(Math.floor(mousePos.x/CellSize), Math.floor(mousePos.y/CellSize)), 2);
	}
	if(isLeftButtonDown)
	{
		addPixelsInCircle(new vector2D(Math.floor(mousePos.x/CellSize), Math.floor(mousePos.y/CellSize)), 2);
	}

	WorldPixel = WorldPixelNext;
	
	//Reset WorldPixelNext
	resetPixelWorld();

    UpdatePixelAreaByCurrentGravity();
	
	var NbPixels = GetNbPixels();
	console.log(NbPixels);
	if(NbPixels > BiggestNbPixel) BiggestNbPixel = NbPixels;
	console.log("Max Pixels: " + BiggestNbPixel /*+ "Max x:" + WorldPixel.length + " y:" + WorldPixel[0].length*/);
}

function updatePixelColor()
{
	PixelColor = ColorPalette[Math.floor(Math.random() * ColorPalette.length)];
}

function UpdatePixelAreaByCurrentGravity()
{
	if (currentGravity === GravityDirection.DOWN)
	{
		for (var x = 0; x < WorldPixel.length; x++) {
			for (var y = WorldPixel[x].length - 1; y >= 0; y--) {
				if (WorldPixel[x][y]) {
					WorldPixel[x][y].update();
				}
			}
		}		
	}
	else if (currentGravity === GravityDirection.LEFT)
	{
		for (var y = 0; y < WorldPixel[0].length; y++) {
			for (var x = 0; x < WorldPixel.length; x++) {
				if (WorldPixel[x][y]) {
					WorldPixel[x][y].update();
				}
			}
		}		
	}
	else if (currentGravity === GravityDirection.RIGHT)
	{
		for (var y = 0; y < WorldPixel[0].length; y++) {
			for (var x = WorldPixel.length - 1; x >= 0; x--) {
				if (WorldPixel[x][y]) {
					WorldPixel[x][y].update();
				}
			}
		}		
	}
	else
	{
		for (var x = 0; x < WorldPixel.length; x += 1) {
			for (var y = 0; y <= WorldPixel[x].length - 1; y++) {
				if(WorldPixel[x][y])
					WorldPixel[x][y].update();
			}
		}
	}
}

function changeGravityDir(newGrav)
{
	currentGravity = newGrav;

	var gravityDir = getCurrentGravityDir();
    for (var x = 0; x < WorldPixel.length; x += 1) {
    	for (var y = 0; y <= WorldPixel[x].length - 1; y++) {
			if(WorldPixel[x][y])
				WorldPixel[x][y].gravityDir = gravityDir;
	    }
	}
}

function getCurrentGravityDir()
{
	var gravityDir;
	if (currentGravity === GravityDirection.DOWN) {
		gravityDir = new vector2D(0,1);
	} else if (currentGravity === GravityDirection.LEFT) {
		gravityDir = new vector2D(-1,0);
	} else if (currentGravity === GravityDirection.RIGHT) {
		gravityDir = new vector2D(1,0);
	} else {
		gravityDir = new vector2D(0,-1);
	}
	return gravityDir;
}

function startPixelWorld() {
    //myGamePiece = new component(30, 30, "red", 10, 120);
    //myGamePiece.gravity = 0.05;
    console.log("StartPixel");
    addPixelAtCenter();
    PixelArea.start();
}

function resetPixelWorld()
{
	//Reset WorldPixelNext
	WorldPixelNext = new Array(Math.floor(window.innerWidth/CellSize));
	for (var x = 0; x < WorldPixelNext.length; x++) {
		WorldPixelNext[x] = new Array(Math.floor(window.innerHeight / CellSize));
	}
}

startPixelWorld();