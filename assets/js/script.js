// Get the modal element
const modal = document.getElementById("projectModal");
// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];
// Get the iframe element inside the modal
const modalIframe = document.getElementById("modalIframe");

// Function to show modal and load external HTML
function showModal(projectUrl) {
    // Set the iframe src to the external HTML file
    modalIframe.src = projectUrl;
    // Show the modal
    modal.style.display = "block";
}

// Function to close modal
function closeModal() {
    modal.style.display = "none";
    modalIframe.src = ""; // Reset the iframe src to avoid loading the page in the background
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    closeModal();
}

// When the user clicks outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
}

// Add event listeners to cards to open the modal when clicked
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function() {
        const projectUrl = this.getAttribute('data-project');
        showModal(projectUrl);
    });
});

document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('click', function() {
        const url = this.getAttribute('data-link');
        if (url) {
            window.open(url, '_blank');
        }
    });
});
