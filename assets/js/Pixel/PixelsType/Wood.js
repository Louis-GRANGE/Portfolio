class Wood extends Pixel {
    constructor(pos) {
        super(pos);
        this.colorPalette = ['#8B4513', '#A0522D', '#CD853F'];
        this.colorstyle = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
        this.usePhysics = false;
    }
}