class Pixel
{
	constructor(pos)
	{
		this.width = CellSize;
		this.height = CellSize;
		this.pos = pos;
		this.colorPalette = ColorPalette;//['#FF0000', '#00FF00', '#0000FF', '#FFFF00']; // Ajoutez d'autres couleurs selon vos besoins
        this.colorstyle = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
        
		this.forceDir =  getCurrentGravityDir();
		this.forceStrength = 1;
		this.weight = RandInt(1, 3);

		this.usePhysics = true;

		this.speedX = 0;
		this.speedY = 0;
		this.CostMovement = 0;
		this.prevPos =  new vector2D(0,0);
		this.maxHorizontalDistance = RandInt(2, 8);
		this.rangeReaction = 0;

		// Vérifie si l'indice this.pos.x existe dans WorldPixelNext
		if (!WorldPixelNext[this.pos.x]) {
			WorldPixelNext[this.pos.x] = [];
		}
		WorldPixelNext[this.pos.x][this.pos.y] = this;
	}

	newPos() {
		if(!this.usePhysics)
		{
			this.setPos(this.pos);
			return;
		}

		var updateNb = Math.floor(this.forceStrength * this.weight);

		/*for(var i = 0; i < updateNb; i++)
		{

		}*/

		var newPosGrav = this.pos.add(this.forceDir.mul(updateNb)); //this.calculateTargetPosition();

		if (IsValidPos(newPosGrav))
		{
			var UnderPixel = WorldPixel[newPosGrav.x][newPosGrav.y];
			var UnderPixelNext = WorldPixelNext[newPosGrav.x][newPosGrav.y];
	
			if (UnderPixelNext == null || !(this instanceof Water) && UnderPixel instanceof Water) // A REVOIR
			{
				//if (this.forceStrength < this.maxGravitySpeed)
				//	this.forceStrength += 1;
				this.setPos(newPosGrav);
				this.CostMovement = 1;
			}
			else if (UnderPixelNext)
			{
				this.forceStrength = 1;
				this.CostMovement = 1;

				var possiblePositions = [];
	
				for (var i = -this.maxHorizontalDistance; i <= this.maxHorizontalDistance; i++) {
					var potentialPos = newPosGrav.add(this.forceDir.right().mul(i));
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
				this.forceStrength = 0;
				this.CostMovement = 0;
				this.setPos(this.pos);
			}
		}
		else
		{
			this.forceStrength = 0;
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

	resetExternalForce() {
		this.externalforceDir = new vector2D(0, 0);
		this.externalforceStrength = 0;
	}

	calculateTargetPosition() {
		var TargetPosition = this.pos.add(this.forceDir.mul(Math.floor(this.forceStrength * this.weight)));
		var HaveFoundFreePlace = false;

	
		// Vérifier s'il y a des obstacles entre la position actuelle et la position cible
		while (IsValidPos(TargetPosition) && WorldPixel[TargetPosition.x][TargetPosition.y]) {
			var offsetPositions = [
				this.forceDir.right(),
				this.forceDir.left(),
				this.forceDir,
				this.forceDir.inv()
			];
	
			for (var offset of offsetPositions) {
				var potentialPos = TargetPosition.add(offset);
				if (
					IsValidPos(potentialPos) &&
					!WorldPixel[potentialPos.x][potentialPos.y] &&
					!WorldPixelNext[potentialPos.x][potentialPos.y]
				) {
					TargetPosition = potentialPos;
					HaveFoundFreePlace = true;
					break;
				}
			}
	
			if (HaveFoundFreePlace) {
				break;
			}
	
			TargetPosition = TargetPosition.add(this.forceDir);
		}
	
		// Ajouter la gravité au départ
		TargetPosition = TargetPosition.add(this.forceDir);
	
		if (HaveFoundFreePlace) {
			return TargetPosition;
		}
	
		return this.pos.add(this.forceDir.mul(Math.floor(this.forceStrength * this.weight)));
	}

	applyExternalForce(force) {
        this.force = this.force.add(force);
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
		this.resetExternalForce();
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