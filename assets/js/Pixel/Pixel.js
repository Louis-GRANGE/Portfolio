class Pixel
{
	constructor(pos)
	{
		this.width = CellSize;
		this.height = CellSize;
		this.pos = pos;
		this.colorPalette = ColorPalette;//['#FF0000', '#00FF00', '#0000FF', '#FFFF00']; // Ajoutez d'autres couleurs selon vos besoins
        this.colorstyle = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
        
		this.gravityDir = getCurrentGravityDir();
		this.gravitySpeed = 1;
		this.maxGravitySpeed = 5;
		this.speedX = 0;
		this.speedY = 0;
		this.CostMovement = 0;
		this.prevPos =  new vector2D(0,0);
		this.weight = RandInt(1, 2);
		this.maxHorizontalDistance = RandInt(2, 8);
		this.rangeReaction = 0;

		// Vérifie si l'indice this.pos.x existe dans WorldPixelNext
		if (!WorldPixelNext[this.pos.x]) {
			WorldPixelNext[this.pos.x] = [];
		}
		WorldPixelNext[this.pos.x][this.pos.y] = this;
	}

	newPos() {
		var newPosGrav = this.pos.add(this.gravityDir.mul(this.gravitySpeed * this.weight));

		if (IsValidPos(newPosGrav))
		{
			var UnderPixel = WorldPixel[newPosGrav.x][newPosGrav.y];
			var UnderPixelNext = WorldPixelNext[newPosGrav.x][newPosGrav.y];
	
			if (UnderPixelNext == null || !(this instanceof Water) && UnderPixel instanceof Water) // A REVOIR
			{
				if (this.gravitySpeed < this.maxGravitySpeed)
					this.gravitySpeed += 1;
				this.setPos(newPosGrav);
				this.CostMovement = 1;
			}
			else if (UnderPixelNext)
			{
				this.gravitySpeed = 1;
				this.CostMovement = 1;

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

	nearbyReaction()
	{

	}

	getNearbyPixels(range)
	{
		var NearbyPixels = [];
		for(var x = this.pos.x - range; x < this.pos.x + range; x++)
		{
			for(var y = this.pos.y - range; y < this.pos.y + range; y++)
			{
				var PixelPos = new vector2D(x,y);
				if(IsValidPos(PixelPos))
				{
					if(WorldPixel[x][y])
						NearbyPixels.push(WorldPixel[x][y]);
					else if(WorldPixelNext[x][y])
						NearbyPixels.push(WorldPixelNext[x][y]);
				}
			}
		}
		return NearbyPixels;
	}

	update() {
		this.nearbyReaction();
		this.newPos();
        //this.ctx.fillStyle = this.colorstyle;
        PixelArea.context.fillStyle = this.colorstyle;
        PixelArea.context.fillRect(this.pos.x*CellSize, this.pos.y*CellSize, this.width, this.height);
        //this.ctx.fillRect(this.x*CellSize, this.y*CellSize, this.width, this.height);
    }

	destroy()
	{
		WorldPixelNext[this.pos.x][this.pos.y] = null; // Supprimez la référence dans WorldPixelNext
		WorldPixel[this.pos.x][this.pos.y] = null; // Supprimez la référence dans WorldPixelNext
	}
}