var ColorPalette = ["#35b88f", "#152E33", "#23233a", "#9099cd", "#4d529a", "#dddddd"]
var PixelColor = "#23233a";
var AllPixelTypeCanSpawn = [Sand, Rock, Water, Wood, Fire];
var PixelTypeToSpawn = Pixel;
var RangePixelToSpawn = 10;
var FrameRate = 10;

//ImageUpload
var ImagePreview;
var ImagePreviewData;
var usePhysicsOnUploadImg = false;

const GravityDirection = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
};

let currentGravity = GravityDirection.DOWN;

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

var CellSize = 3; //3 Si la valeur est un float (ex: 0.5) il y a une grille qui apparait
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
        this.interval = setInterval(updatePixelArea, FrameRate);
        this.intervalColor = setInterval(updatePixelColor, 1000);
        //this.intervalPixelType = setInterval(updatePixelTypeToSpawn, 1000);

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
		removePixelsInCircle(new vector2D(Math.floor(mousePos.x/CellSize), Math.floor(mousePos.y/CellSize)), RangePixelToSpawn);
	}
	if(isLeftButtonDown)
	{ 
		if(!ImagePreview)
		{
			addPixelsInCircle(PixelTypeToSpawn, new vector2D(Math.floor(mousePos.x/CellSize), Math.floor(mousePos.y/CellSize)), RangePixelToSpawn);
		}
	}

	WorldPixel = WorldPixelNext;
	
	//Reset WorldPixelNext
	resetPixelWorld();

    UpdatePixelAreaByCurrentGravity();

	
	if(mousePos)
		drawOutline(mousePos.x, mousePos.y, RangePixelToSpawn); // Draw Range

	if(ImagePreview)
		PixelArea.canvas.getContext('2d').drawImage(ImagePreview, mousePos.x - ImagePreview.width/2, mousePos.y - ImagePreview.height/2, ImagePreview.width, ImagePreview.height);

	
	/*
	var NbPixels = GetNbPixels();
	console.log(NbPixels);
	if(NbPixels > BiggestNbPixel) BiggestNbPixel = NbPixels;
	console.log("Max Pixels: " + BiggestNbPixel);*/
}

function updatePixelColor()
{
	PixelColor = ColorPalette[Math.floor(Math.random() * ColorPalette.length)];
}

function updatePixelTypeToSpawn()
{
	PixelTypeToSpawn = AllPixelTypeCanSpawn[Math.floor(Math.random() * AllPixelTypeCanSpawn.length)];
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
    console.log("StartPixel");
    addPixelAtCenter(Sand);
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

function addPixel(PixelClass, v)
{
	var NewPixel;
	if(IsValidPos(v) && !WorldPixel[v.x][v.y])
	{
		NewPixel = new PixelClass(v);
	}
	return NewPixel;
}
function addPixelAtCenter(PixelClass)
{
	addPixel(PixelClass, new vector2D(Math.floor(window.innerWidth/(2*CellSize)), Math.floor(window.innerHeight/(2*CellSize))));
}

function addPixels(n)
{
	for(var i = 0; i < n; i++)
	{
		new Pixel("#07B5A7", new vector2D(Math.floor(window.innerWidth/(2*CellSize)), Math.floor(window.innerHeight/(2*CellSize))));
	}
}

function addPixelsInCircle(PixelClass, pos, range)
{
	for(var i = pos.x - range; i < pos.x + range; i++)
	{
		for(var j = pos.y - range; j < pos.y + range; j++)
		{
			var SpawnPos = new vector2D(i,j);
			if(SpawnPos.dist(pos) < range && IsValidPos(SpawnPos))
			{
				addPixel(PixelClass, SpawnPos);
			}
		}
	}
}

function removePixelsInCircle(pos, range)
{
	for(var i = pos.x - range; i < pos.x + range; i++)
	{
		for(var j = pos.y - range; j < pos.y + range; j++)
		{
			var RemovePix = new vector2D(i,j);
			if(RemovePix.dist(pos) < range && IsValidPos(RemovePix))
			{
                WorldPixelNext[i][j] = null;
			}
		}
	}
}

function changePixelType(type) {
    // Implémentez la logique pour changer le type de pixel ici
    console.log("Changer le type de pixel à:", type);
	PixelTypeToSpawn = type;
}

function changeRadius(value) {
    // Implémentez la logique pour changer la taille du rayon de spawn ici
    console.log("Changer la taille du rayon à:", value);
	document.getElementById('radiusValue').textContent = value;
	RangePixelToSpawn = Math.floor(value);
	document.getElementById("radiusSlider").value = RangePixelToSpawn;
}
changeRadius(RangePixelToSpawn);

// Fonction pour dessiner le contour
function drawOutline(centerX, centerY, range) {

	var mouseX = centerX - PixelArea.canvas.getBoundingClientRect().left;
	var mouseY = centerY - PixelArea.canvas.getBoundingClientRect().top;

	// Convertissez les coordonnées de la souris en indices de grille
	var gridCenterX = Math.floor(mouseX / CellSize);
	var gridCenterY = Math.floor(mouseY / CellSize);

    // Effacez le canevas (ou effacez simplement la zone du contour)
	var ctx = PixelArea.canvas.getContext("2d")

    // Dessinez le contour en utilisant une couleur différente (par exemple, rouge)
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc((gridCenterX + 0.5) * CellSize, (gridCenterY + 0.5) * CellSize, range * CellSize, 0, 2 * Math.PI);
    ctx.stroke();
}

var iteration = 0;
function StartAnim()
{
	if(iteration > WorldPixel.length)
	{
		clearInterval(StartAnimInterval);
		FireLoadingInterval = setInterval(FireLoadingAnim, 0);
	}
	else
	{
		iteration += 1;
		addPixelsInCircle(Pixel, new vector2D(iteration, 100 + RandInt(0, 50)), RandInt(1,2));
	}
	
}


//var sizeCircle = Math.min(WorldPixel.length/3, WorldPixel[0].length/3);
//var ElipsePoints = generateChaoticLine(new vector2D(WorldPixel.length/2, WorldPixel[0].length/2), 1000, 10);

function FireLoadingAnim()
{
	var sizeCircle = Math.min(WorldPixel.length/3, WorldPixel[0].length/3);
	var ElipsePoints = getEllipseContour(new vector2D(WorldPixel.length/2, WorldPixel[0].length/2), sizeCircle, sizeCircle);

	var point = ElipsePoints[iteration%ElipsePoints.length]
	addPixelsInCircle(Fire, point, 5);
	iteration += 3;
}

startPixelWorld();

var StartAnimInterval = setInterval(StartAnim, 0);
var FireLoadingInterval;