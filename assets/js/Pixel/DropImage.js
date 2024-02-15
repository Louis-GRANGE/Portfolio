var dropZone = document.getElementById('drop-zone');
var canvas = PixelArea.canvas;

// Éviter le comportement par défaut du glisser-déposer
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

// Gérer le glisser-déposer
['dragenter', 'dragover'].forEach(eventName => {
  dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight() {
  dropZone.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
}

function unhighlight() {
  dropZone.style.backgroundColor = 'rgba(255, 255, 255, 0)';
}

dropZone.addEventListener('drop', handleDrop, false);


function handleFiles(files) {
  // Code pour traiter les fichiers ici
  // Vous pouvez récupérer l'image et l'afficher sur le canevas
  var reader = new FileReader();

  reader.onload = function(e) {
    var img = new Image();
    img.src = e.target.result;

    img.onload = function() {
      // Dessinez l'image sur le canevas ou effectuez d'autres opérations
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  };

  reader.readAsDataURL(files[0]);
}

function handleDrop(event) {
  event.preventDefault(); // Empêche le comportement par défaut du drop

  if (event.dataTransfer.files && event.dataTransfer.files.length > 0)
  {
    const reader = new FileReader();

    reader.onload = function (e) {
      const imgPreview = new Image();
      const img = new Image();
      
      ImagePreview = img;

       // Prévisualisation dans la zone de dépôt
       const dropZone = document.getElementById('drop-zone');
       dropZone.innerHTML = ''; // Supprime le contenu précédent
       dropZone.appendChild(imgPreview);

      img.onload = function () {
        // Créez un nouveau canvas temporaire
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        document.body.appendChild(tempCanvas); // Ajoutez le canvas au DOM (pour le rendre visible)

        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
                
        // Dessinez l'image sur le canvas temporaire
        tempCtx.drawImage(ImagePreview, 0, 0, img.width, img.height);

        // Obtenez les données de l'image du canvas temporaire
        ImagePreviewData = tempCtx.getImageData(0, 0, img.width, img.height);

        // Supprimez le canvas temporaire du DOM
        document.body.removeChild(tempCanvas);
      };

      img.src = e.target.result;
      imgPreview.src = e.target.result;
    };

    reader.readAsDataURL(event.dataTransfer.files[0]);
  }
}

function handleDragOver(e) {
  e.preventDefault();
}

// Fonction pour obtenir l'indice dans le tableau data pour un pixel donné
function getIndex(x, y, width) {
  return (y * width + x) * 4; // Chaque pixel a 4 composantes (R, G, B, A)
}


function drawPixelImage(imageData, MousePosition) {

  var data = imageData.data;
  var width = imageData.width; // Largeur de l'image en pixels
  var height = imageData.height; // Hauteur de l'image en pixels

  for (var y = 0; y < width; y++) {
    for (var x = 0; x < height; x++) {
      var index = getIndex(x, y, width);
      var color = {
        r: data[index],
        g: data[index + 1],
        b: data[index + 2],
        a: data[index + 3],
      };

      if(color.a > 0)
      {
        var PixelPos = new vector2D(Math.floor(x/CellSize), Math.floor(y/CellSize)).add(new vector2D(Math.floor((MousePosition.x - width/2)/CellSize), Math.floor((MousePosition.y - height/2)/CellSize)));
        if(IsValidPos(PixelPos))
        {
          // Créer un nouvel objet Pixel avec la position (x, y) et la couleur du pixel
          var newPixel = addPixel(Pixel, PixelPos);
          if(newPixel)
          {
            newPixel.colorstyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 255})`;
            newPixel.usePhysics = usePhysicsOnUploadImg;
            //WorldPixelNext[x][y] = newPixel;
          }
        }
      }
    }
  }
}

function togglePhysics() {
  usePhysicsOnUploadImg = !usePhysicsOnUploadImg;

  var usePhysicsCheckbox = document.getElementById("usePhysicsCheckbox");
  var usePhysicsLabel = document.getElementById("usePhysicsLabel");

  if (usePhysicsCheckbox.checked) {
      usePhysicsLabel.classList.remove("false");
      usePhysicsLabel.classList.add("true");
  } else {
      usePhysicsLabel.classList.remove("true");
      usePhysicsLabel.classList.add("false");
  }
}