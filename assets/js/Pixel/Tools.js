function RandInt(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getEllipseContour(center, radiusX, radiusY) {
    const points = [];
    const step = Math.PI / 180; // Pas de 1 degré

    for (let angle = 0; angle < 2 * Math.PI; angle += step) {
        const x = center.x + radiusX * Math.cos(angle);
        const y = center.y + radiusY * Math.sin(angle);
        points.push(new vector2D(Math.round(x), Math.round(y)));
    }

    return points;
}