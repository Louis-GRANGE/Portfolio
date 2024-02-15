class CharacterPixel extends Pixel {
    constructor(pos) {
        super(pos);
        this.colorPalette = ['#DFFFFF', '#EFFFFF', '#FFFFFF'];
        this.colorstyle = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
        this.usePhysics = false;
        this.relativePos = new vector2D(0,0);
    }
}