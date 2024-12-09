// Function to load modal HTML content
function loadModal() {
    fetch('modal-project.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('modal-container').innerHTML = data;
            document.getElementById('projectModal').style.display = 'block';
            document.body.classList.add("modal-open");
            // Attach event listeners for closing the modal after loading
            var closeBtn = document.querySelector(".close");
            closeBtn.onclick = function() {
                document.getElementById('projectModal').style.display = 'none';
                document.body.classList.remove("modal-open");
            };
        });
}

// Get the project item element and attach an event listener for click
document.querySelector('.project-item').onclick = function() {
    loadModal(); // Load the modal dynamically when the project item is clicked
};
