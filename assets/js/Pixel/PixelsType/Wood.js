class Wood extends Pixel {
    constructor(pos) {
        super(pos);
        this.colorPalette = ['#8B4513', '#A0522D', '#CD853F'];
        this.colorstyle = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
    }

    newPos()
    {
        this.setPos(this.pos);
        // Ne faites rien, le pixel Wood ne bouge pas
    }
}