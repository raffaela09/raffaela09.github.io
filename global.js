document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && (e.key === 'a' || e.key === 'A')) {
        // Pega a URL raiz do site e joga pro admin
        window.location.href = window.location.origin + '/admin/';
    }
});