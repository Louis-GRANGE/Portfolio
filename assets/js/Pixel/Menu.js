var DraggingImage = false;
const menu = document.querySelector('.menu');

document.addEventListener('DOMContentLoaded', function () {
    const burgerIcon = document.getElementById('burger-icon');

    burgerIcon.addEventListener('mouseover', function () {
        menu.classList.add('active');
    });

    menu.addEventListener('mouseover', function () {
        menu.classList.add('active');
    });

    menu.addEventListener('mouseleave', function () {
        if (!draggingOverPage) {
            menu.classList.remove('active');
        }
    });
});

let draggingOverPage = false; // Variable pour suivre si le glisser est au-dessus de la page

// Gérer le glisser-déposer
document.addEventListener('dragenter', handleDragEnter, false);
document.addEventListener('dragleave', handleDragLeave, false);
document.addEventListener('dragover', handleDragOver, false);
document.addEventListener('drop', handleDrop, false);

// Fonction appelée lorsque le glisser entre dans la zone cible
function handleDragEnter(event) {
    console.log('DragEnter');
    event.preventDefault(); // Empêcher le comportement par défaut
    if (!draggingOverPage) {
        ShowMenu();
    }
    draggingOverPage = true;
}

// Fonction appelée lorsque le glisser quitte la zone cible
function handleDragLeave(event) {
    event.preventDefault(); // Empêcher le comportement par défaut
    if (!event.relatedTarget || event.relatedTarget === document.documentElement) {
        draggingOverPage = false;
        HideMenu();
    }
}

// Fonction appelée lorsque le glisser se déplace au-dessus de la zone cible
function handleDragOver(event) {
    event.preventDefault(); // Empêcher le comportement par défaut
}

// Fonction appelée lorsque l'image est déposée dans la zone cible
function handleDrop(event) {
    event.preventDefault(); // Empêcher le comportement par défaut
    draggingOverPage = false;
    HideMenu();
    // Traiter l'image déposée ici
}

function ShowMenu() {
    console.log("ShowMenu");
    DraggingImage = true;
    menu.classList.add('active');
}

function HideMenu() {
    console.log("HideMenu");
    DraggingImage = false;
    menu.classList.remove('active'); // Cache le menu après avoir glissé
}
