// 1. Function to open the modal and update the URL
function openProject(projectUrl, projectId) {
    const modal = document.getElementById('projectModal');
    const iframe = document.getElementById('modalIframe');

    if (modal && iframe) {
        iframe.src = projectUrl; // Set the iframe source
        modal.style.display = 'block'; // Show the modal
        document.body.classList.add("modal-open");

        // Update the URL hash (e.g., #color-picker)
        if (projectId) {
            window.location.hash = projectId;
        }
    }
}

// 2. Attach click events to all cards
document.querySelectorAll('.card').forEach(card => {
    card.onclick = function() {
        const url = this.getAttribute('data-project');
        const id = this.id;
        openProject(url, id);
    };
});

// 3. Handle closing the modal
document.querySelector('.close').onclick = function() {
    document.getElementById('projectModal').style.display = 'none';
    document.body.classList.remove("modal-open");
    document.getElementById('modalIframe').src = ""; // Clear iframe
    
    // Clear the hash from the URL
    history.replaceState(null, null, window.location.pathname);
};

// 4. Handle Direct Links (when page loads with a hash)
window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash) {
        const targetCard = document.querySelector(hash);
        if (targetCard) {
            const url = targetCard.getAttribute('data-project');
            const id = targetCard.id;
            openProject(url, id);
            targetCard.scrollIntoView({ behavior: 'smooth' });
        }
    }
});