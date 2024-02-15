class Character
{
    constructor(character, pos, fontSize)
    {
        if(character == " " || !pixelFonts.glyphs[character])
            this.IsEmptyChar = true;
        else
            this.IsEmptyChar = false;

        this.pos = pos;
        this.character = this.IsEmptyChar ? "" : character;
        this.Pixels = [];
        this.fontSize = fontSize;

        this.drawCharacterPixels();

        if(this.IsEmptyChar)
        {
            this.Pixels.forEach(pixel => {
                pixel.colorstyle = "#000000";
            });
        }
        
        setTimeout(() => {this.activePhysics(); }, 2000);
    }

    drawCharacterPixels()
    {
        const pixelRepresentation = pixelFonts.glyphs[this.character]; // Représentation en pixels du caractère
        if (!pixelRepresentation) return;
    
        // Déterminez la taille de chaque carré de pixels en fonction de la taille de la police
        const pixelSize = this.fontSize;
    
        // Calculez le décalage sur l'axe y
        const offsetY = pixelRepresentation.offset * pixelSize;

        cursorIndexPos += 1;
    
        // Dessinez chaque ligne de pixels à la position du curseur avec le décalage approprié
        for (let i = 0; i < pixelRepresentation.pixels.length; i++) {
            const row = pixelRepresentation.pixels[i];
            for (let j = 0; j < row.length; j++) {
                const pixel = row[j];
                // Calculez la position du coin supérieur gauche du carré de pixels avec le décalage y
                const startX = this.pos.x + j * pixelSize;
                const startY = this.pos.y + i * pixelSize + offsetY;
    
                // Dessinez un carré de pixels de la taille appropriée
                for (let x = startX; x < startX + pixelSize; x++) {
                    for (let y = startY; y < startY + pixelSize; y++) {
                        const pixelPosition = new vector2D(Math.floor(x), Math.floor(y));
                        if(IsValidPos(pixelPosition))
                        {
                            if (pixel === 1) {
                                var _pixel = new CharacterPixel(pixelPosition);
                                _pixel.relativePos = pixelPosition.sub(this.pos);
                                this.Pixels.push(_pixel);
                            } else {
                                WorldPixelNext[pixelPosition.x][pixelPosition.y] = null;
                            }
                        }
                    }
                }
            }
        }
    }

    CheckIsAlive() {
        if(this.IsEmptyChar)
        {
            var index = CharacterLine.indexOf(this);
            if (index >= 0) {
                if (index <= 0) {
                    return false;
                }
            }
            return true;
        }
        for (var i = 0; i < this.Pixels.length; i++) {
            const pixel = this.Pixels[i];
            if (pixel.isAlive)
            {
                return true;
            }
        }
        return false;
    }
    
    destroy()
    {
        for (var i = 0; i < this.Pixels.length; i++) {
            const pixel = this.Pixels[i];
            if (pixel)
            {
                pixel.destroy();
            }
        }
    }

    moveCharacterAt(pos)
    {
        //var offset = this.pos.sub(pos);
        for(var i = 0; i < this.Pixels.length; i++)
        {
            const pixel = this.Pixels[i];
            if (pixel.isAlive)
            {
                var newPos = pixel.relativePos.add(this.pos);
                pixel.setPos(newPos);
            }
        }
        this.pos = pos;
        /*this.destroy();
        this.drawCharacterPixels();*/
    }

    activePhysics()
    {
        for(var i = 0; i < this.Pixels.length; i++)
        {
            const pixel = this.Pixels[i];
            pixel.usePhysics = true;
        }
        var index = CharacterLine.indexOf(this);
        CharacterLine.splice(index, 1);
    }
}