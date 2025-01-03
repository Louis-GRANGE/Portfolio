var isRightButtonDown = false;
var isLeftButtonDown = false;
var mousePos = new vector2D(0,0);

document.addEventListener('click', function(event) {
	// Obtenez les coordonnées du clic par rapport au coin supérieur gauche du canvas
	//const mouseX = event.clientX;
	//const mouseY = event.clientY;

    if(FireLoadingInterval) // Stop fire circle animation when click
        clearInterval(FireLoadingInterval);
        
    if(ImagePreview)
    {
        drawPixelImage(ImagePreviewData, mousePos);
        ImagePreviewData = null;
        ImagePreview = null;
        // Prévisualisation dans la zone de dépôt
       const dropZone = document.getElementById('drop-zone');
       dropZone.innerHTML = 'Drop an image here'; // Supprime le contenu précédent
    }
});

// Ajoutez un gestionnaire d'événements pour le clic droit
document.addEventListener('contextmenu', function(event) {
	// Empêchez le menu contextuel par défaut de s'afficher
	event.preventDefault();
});

document.addEventListener('mousemove', function(event) {
	// Obtenez les coordonnées du curseur de la souris
	mousePos = new vector2D(event.clientX, event.clientY);
});

document.addEventListener('mousedown', function(event) {
    const menu = document.querySelector('.menu');
    if(menu.classList.contains('active')) return; // Si le menu est actif on ne pose pas de pixel.

	// Vérifiez si le bouton enfoncé est le bouton droit de la souris
	if (event.button === 0) {
        isLeftButtonDown = true;
    } else if (event.button === 2) {
    	isRightButtonDown = true;
    }
});

  // Ajoutez un gestionnaire d'événements pour le relâchement du clic droit
document.addEventListener('mouseup', function(event) {
	// Vérifiez si le bouton relâché est le bouton droit de la souris
	if (event.button === 0) {
        isLeftButtonDown = false;
    } else if (event.button === 2) {
    	isRightButtonDown = false;
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp') {
        changeGravityDir(GravityDirection.UP);
    } else if (e.key === 'ArrowDown') {
        changeGravityDir(GravityDirection.DOWN);
    } else if (e.key === 'ArrowLeft') {
        changeGravityDir(GravityDirection.LEFT);
    } else if (e.key === 'ArrowRight') {
        changeGravityDir(GravityDirection.RIGHT);
    }
    else if (e.key == '+') {
		addPixelAtCenter();
	}
    if (e.key === ' ') { // Vérifie si la touche pressée est "espace"
        e.preventDefault(); // Empêche le comportement par défaut de la touche "espace" (défilement de la page)
    }
});