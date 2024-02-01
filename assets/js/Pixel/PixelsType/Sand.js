class Sand extends Pixel {
    constructor(pos) {
        super(pos); // Couleur jaune, poids de 1
        this.colorPalette = ['#F5F087', '#FFEC8B', '#FFF4B5']; 
        this.colorstyle = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];

        this.maxHorizontalDistance = 1;
        // ... le reste du code spécifique à Sand
    }
}