// 1. Core function to open project
function openProject(projectUrl, projectId) {
    const modal = document.getElementById('projectModal');
    const iframe = document.getElementById('modalIframe');

    if (modal && iframe) {
        iframe.src = projectUrl;
        modal.style.display = 'block';
        document.body.classList.add("modal-open");

        // Force the hash into the URL so it updates in the address bar
        if (projectId) {
            window.location.hash = projectId;
        }
    }
}

// 2. Core function to close project
function closeProject() {
    const modal = document.getElementById('projectModal');
    const iframe = document.getElementById('modalIframe');
    
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove("modal-open");
        if (iframe) iframe.src = ""; // Stop the project content
        
        // Clean the URL hash
        history.replaceState(null, null, window.location.pathname);
    }
}

// 3. Initialize everything when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {

    // Attach clicks to all cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            const url = this.getAttribute('data-project');
            const id = this.id;
            openProject(url, id);
        });
    });

    // Attach click to close button
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeProject);
    }

    // Handle clicking outside the modal to close it (Optional but good UX)
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('projectModal');
        if (event.target == modal) {
            closeProject();
        }
    });
});

// 4. Handle Direct Links / Refresh (Wait for full load)
window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash && hash !== '#') {
        // querySelector needs the '#' which is already in the hash variable
        const targetCard = document.querySelector(hash);
        if (targetCard) {
            const url = targetCard.getAttribute('data-project');
            const id = targetCard.id;
            
            // Small delay to let the theme animations finish
            setTimeout(() => {
                targetCard.scrollIntoView({ behavior: 'smooth' });
                openProject(url, id);
            }, 300);
        }
    }
});