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

function generateChaoticLine(startAt, steps, stepSize) {
    const points = [];
    let currentX = startAt.x;
    let currentY = startAt.y;

    for (let i = 0; i < steps; i++) {
        const randomAngle = Math.random() * 2 * Math.PI;
        const deltaX = stepSize * Math.cos(randomAngle);
        const deltaY = stepSize * Math.sin(randomAngle);

        currentX += deltaX;
        currentY += deltaY;

        points.push(new vector2D(Math.round(currentX), Math.round(currentY)));
    }

    return points;
}