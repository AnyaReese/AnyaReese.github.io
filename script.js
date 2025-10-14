document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.querySelector('.theme-switch');
    const body = document.body;

    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.dataset.theme = savedTheme;
        updateIcon(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = prefersDark ? 'dark' : 'light';
        body.dataset.theme = initialTheme;
        updateIcon(initialTheme);
    }

    themeSwitch.addEventListener('click', () => {
        let newTheme = body.dataset.theme === 'light' ? 'dark' : 'light';
        body.dataset.theme = newTheme;
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });

    function updateIcon(theme) {
        const icon = themeSwitch.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    const socialLinks = document.querySelectorAll('.social-link-item');
    const linkPreview = document.getElementById('link-preview');

    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const url = link.getAttribute('href');
            linkPreview.textContent = url;
            linkPreview.style.opacity = '1';
        });

        link.addEventListener('mouseleave', () => {
            linkPreview.style.opacity = '0';
        });
    });
}); 