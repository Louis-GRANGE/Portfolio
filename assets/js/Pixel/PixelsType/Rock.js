class Rock extends Pixel {
    constructor(pos) {
        super(pos); // Couleur gris, poids de 2
        this.colorPalette = ['#696969', '#808080', '#A9A9A9']; // Palette de couleurs pour la classe Rock
        this.colorstyle = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
        
        this.maxHorizontalDistance = 0;
        // ... le reste du code spécifique à Rock
    }

    // Vous pouvez également ajouter des fonctions spécifiques à Rock
}