class Water extends Pixel {
    constructor(pos) {
        super(pos); // Couleur bleue, poids de 0.5
        this.colorPalette = ['#87CEEB', '#ADD8E6', '#B0E0E6']; // Palette de couleurs pour la classe Water
        this.colorstyle = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
        
        this.maxHorizontalDistance = 100;
        // ... le reste du code spécifique à Water
    }

    // Vous pouvez également ajouter des fonctions spécifiques à Water
}