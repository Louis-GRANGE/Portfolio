class Explosion extends Pixel {
    constructor(pos) {
        super(pos);
        this.colorPalette = ['#FF0000', '#FF4500', '#FF6347', '#FF7F50']; // Palette de couleurs pour la classe Feu
        this.colorstyle = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
        this.color = { r: 255, g: 0, b: 0 }; // Initialisez la couleur à rouge

        this.maxGravitySpeed = 1;
        this.maxHorizontalDistance = 2;
        this.MaxLifetime = RandInt(100, 200);
        this.lifetime = 0;
        this.rangeReaction = 5;
        // ... le reste du code spécifique à Feu
    }

    newPos() {
        var randomOffset = new vector2D(
            RandInt(-3, 3),
            RandInt(-1, 1)
        );
        var newPosGrav = this.pos.add(this.gravityDir.mul(this.gravitySpeed * -this.weight)).add(randomOffset);
    
        if (IsValidPos(newPosGrav)) {
            var UnderPixel = WorldPixel[newPosGrav.x][newPosGrav.y];
            var UnderPixelNext = WorldPixelNext[newPosGrav.x][newPosGrav.y];
    
            if (UnderPixelNext == null && UnderPixel == null) {
                // Comportement du feu
                if (this.gravitySpeed < this.maxGravitySpeed) {
                    this.gravitySpeed += 1;
                }
                this.setPos(newPosGrav);
                this.CostMovement = 1;
            } else if (UnderPixelNext) {
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
    }

    nearbyReaction()
	{
        if(this.lifetime < this.MaxLifetime / 2)
            return;

        var NearbyPixels = this.getNearbyPixels(this.rangeReaction);
        for(var i = 0; i < NearbyPixels.length; i++)
        {
            if(NearbyPixels[i].usePhysics)
            {
                NearbyPixels[i].externalForceDir = NearbyPixels[i].pos.sub(this.pos).normalize();
                NearbyPixels[i].externalForceStrength = NearbyPixels[i].pos.dist(this.pos);
                WorldPixel[NearbyPixels[i].pos.x][NearbyPixels[i].pos.y] = null;
            }
        }
	}

    update()
    {
        super.update();
        this.lifetime += FrameRate;

        // Calculez le pourcentage de la durée de vie par rapport à la durée de vie maximale
        const percentage = this.lifetime / this.MaxLifetime;

        // Mettez à jour les composants de la couleur en fonction du pourcentage
        this.color.g = Math.round(200 * percentage);

        // Utilisez la couleur mise à jour
        this.colorstyle = `rgb(${this.color.r},${this.color.g},${this.color.b})`;

        if(this.lifetime > this.MaxLifetime)
        {
            this.destroy();
        }

    }

    // Vous pouvez également ajouter des fonctions spécifiques à Feu
}
