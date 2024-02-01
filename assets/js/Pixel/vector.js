class vector2D
{
	constructor(x,y)
	{
		this.x = x;
		this.y = y;
	}

	add(v) { return new vector2D(this.x + v.x, this.y + v.y); }
	sub(v) { return new vector2D(this.x - v.x, this.y - v.y); }
	mul(f) { return new vector2D(this.x * f, this.y * f); }
	inv() { return new vector2D(-this.x, -this.y); }
	left() { return new vector2D(this.y, -this.x) }
	right() { return new vector2D(-this.y, this.x) }
	len() { return Math.sqrt(this.x ** 2 + this.y ** 2); }
	max() { return Math.max(this.x, this.y); }
	dist(v)
	{ 
		const deltaX = this.x - v.x;
		const deltaY = this.y - v.y;
		const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
		return distance;
	}
	equal(v) { return (this.x == v.x && this.y == v.y); }
}