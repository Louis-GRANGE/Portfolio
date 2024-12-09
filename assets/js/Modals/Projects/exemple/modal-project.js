// modal.js
// Get the modal element
var modal = document.getElementById("projectModal");
// Get the <span> element that closes the modal
var closeBtn = document.querySelector(".close");

// When the user clicks on <span> (close), close the modal
closeBtn.onclick = function() {
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
};

// When the user clicks anywhere outside the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        document.body.classList.remove("modal-open");
    }
};
