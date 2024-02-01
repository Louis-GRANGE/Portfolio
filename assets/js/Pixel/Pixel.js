class Pixel
{
	constructor(color, pos)
	{
		this.width = CellSize;
		this.height = CellSize;
		this.pos = pos;
		this.colorstyle = PixelColor;/*ColorPalette[Math.floor(Math.random() * ColorPalette.length)];getRandomColor();//color;*/
		this.gravityDir = getCurrentGravityDir();
		this.gravitySpeed = 1;
		this.maxGravitySpeed = 5;
		this.speedX = 0;
		this.speedY = 0;
		this.CostMovement = 0;
		this.prevPos =  new vector2D(0,0);
		this.weight = 1;//RandInt(1, 2);
		this.maxHorizontalDistance = RandInt(2, 8);

		WorldPixelNext[this.pos.x][this.pos.y] = this;
	}

	newPos() {
		var newPosGrav = this.pos.add(this.gravityDir.mul(this.gravitySpeed * this.weight));

		if (IsValidPos(newPosGrav)) {
			var UnderPixel = WorldPixel[newPosGrav.x][newPosGrav.y];
			var UnderPixelNext = WorldPixelNext[newPosGrav.x][newPosGrav.y];
	
			var possiblePositions = [];
	
			for (var i = -this.maxHorizontalDistance; i <= this.maxHorizontalDistance; i++) {
				var potentialPos = newPosGrav.add(this.gravityDir.right().mul(i));
				if (
					IsValidPos(potentialPos) &&
					WorldPixel[potentialPos.x][potentialPos.y] == null &&
					WorldPixelNext[potentialPos.x][potentialPos.y] == null
				) {
					possiblePositions.push(potentialPos);
				}
			}
	
			if (UnderPixelNext == null) {
				if (this.gravitySpeed < this.maxGravitySpeed)
					this.gravitySpeed += 1;
				this.setPos(newPosGrav);
				this.CostMovement = 1;
			} else if (UnderPixelNext) {
				this.gravitySpeed = 1;
				this.CostMovement = 1;
				if (UnderPixelNext.CostMovement > this.CostMovement) {
					UnderPixelNext.setPrevPos();
					this.setPos(newPosGrav);
				} else {
					if (possiblePositions.length > 0) {
						// Choisir la position horizontalement la plus proche
						possiblePositions.sort((a, b) => Math.abs(a.x - newPosGrav.x) - Math.abs(b.x - newPosGrav.x));
						this.CostMovement = 2;
						this.setPos(possiblePositions[0]); // Choisissez la position la plus proche
					} else {
						this.CostMovement = 0;
						this.setPos(this.pos);
					}
				}
			} else {
				this.gravitySpeed = 0;
				this.CostMovement = 0;
				this.setPos(this.pos);
			}
		} else {
			this.gravitySpeed = 0;
			this.CostMovement = 0;
			this.setPos(this.pos);
		}
		/*OLD
		var newPosGrav = this.pos.add(this.gravityDir.mul(this.gravitySpeed * this.weight));

		if(IsValidPos(newPosGrav))//WorldPixel[newPosGrav.x][newPosGrav.y]
		{
			var UnderPixel = WorldPixel[newPosGrav.x][newPosGrav.y];
			var UnderPixelNext = WorldPixelNext[newPosGrav.x][newPosGrav.y];

			var PosR = newPosGrav.add(this.gravityDir.right());
			var PosL = newPosGrav.add(this.gravityDir.left());

			var dir = Math.random() < 0.5;
			var PosA = dir ? PosR : PosL;
			var PosB = dir ? PosL : PosR;

			var PixelA = IsValidPos(PosA) ? WorldPixel[PosA.x][PosA.y] : null;
			var PixelANext = IsValidPos(PosA) ? WorldPixelNext[PosA.x][PosA.y] : null;
			var PixelB = IsValidPos(PosB) ? WorldPixel[PosB.x][PosB.y] : null;
			var PixelBNext = IsValidPos(PosB) ? WorldPixelNext[PosB.x][PosB.y] : null;
			
			if(UnderPixelNext == null)
			{
				if(this.gravitySpeed < this.maxGravitySpeed)
					this.gravitySpeed += 1;
				this.setPos(newPosGrav);
				this.CostMovement = 1;
			}
			else if(UnderPixelNext) // A SUPP?
			{
				this.gravitySpeed = 1;
				this.CostMovement = 1;
				if(UnderPixelNext.CostMovement > this.CostMovement)
				{
					UnderPixelNext.setPrevPos();
					this.setPos(newPosGrav);
				}
				else
				{
					if(PixelA == null && IsValidPos(PosA) && PixelANext == null) // RENDU EXEPTIONNEL EN ENLEVANT LE "ELSE"
					{
						this.CostMovement = 2;
						this.setPos(PosA);
					}
					else if(PixelB  == null && IsValidPos(PosB) && PixelBNext == null)
					{
						this.CostMovement = 2;
						this.setPos(PosB);
					}
					else
					{
						this.CostMovement = 0;
						this.setPos(this.pos)
					}
				}
			}
			else
			{
				this.gravitySpeed = 0;
				this.CostMovement = 0;
				this.setPos(this.pos);
			}
		}
		else
		{
			this.gravitySpeed = 0;
			this.CostMovement = 0;
			this.setPos(this.pos);
		}
		*/
    	/*this.x += this.speedX;
        this.gravitySpeed += this.gravity;
    	if (this.gravity != 0)
        {
        	this.y += this.speedY + this.gravitySpeed;
        }*/
    }

	setPos(v)
	{
		var validatedPos = ValidPos(v);

		WorldPixelNext[validatedPos.x][validatedPos.y] = this;
		if(!this.prevPos.equal(this.pos))
			this.prevPos = this.pos;
		this.pos = validatedPos;
	}

	setPrevPos()
	{
		var PixelAtPrevPos = WorldPixelNext[this.prevPos.x][this.prevPos.y];
		if(PixelAtPrevPos)
		{
			PixelAtPrevPos.setPrevPos();
		}
		this.CostMovement = 0;
		this.setPos(this.prevPos);
	}

	

	update() {
		this.newPos();
        //this.ctx.fillStyle = this.colorstyle;
        PixelArea.context.fillStyle = this.colorstyle;
        PixelArea.context.fillRect(this.pos.x*CellSize, this.pos.y*CellSize, this.width, this.height);
        //this.ctx.fillRect(this.x*CellSize, this.y*CellSize, this.width, this.height);
    }
}

function addPixel(v)
{
	if(IsValidPos(v) && !WorldPixel[v.x][v.y])
		var NewPixel = new Pixel("#07B5A7", v);
}
function addPixelAtCenter()
{
	var NewPixel = new Pixel("#07B5A7", new vector2D(Math.floor(window.innerWidth/(2*CellSize)), Math.floor(window.innerHeight/(2*CellSize))));
}

function addPixels(n)
{
	for(var i = 0; i < n; i++)
	{
		new Pixel("#07B5A7", new vector2D(Math.floor(window.innerWidth/(2*CellSize)), Math.floor(window.innerHeight/(2*CellSize))));
	}
}

function addPixelsInCircle(pos, range)
{
	for(var i = pos.x - range; i < pos.x + range; i++)
	{
		for(var j = pos.y - range; j < pos.y + range; j++)
		{
			var SpawnPos = new vector2D(i,j);
			if(SpawnPos.dist(pos) < range && IsValidPos(SpawnPos))
			{
				addPixel(SpawnPos);
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