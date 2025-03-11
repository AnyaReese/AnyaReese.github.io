document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.querySelector('.theme-switch');
    const themeSwitchIcon = document.querySelector('.theme-switch i');
    
    // 检查用户之前选择的主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeSwitchIcon.classList.remove('fa-moon');
        themeSwitchIcon.classList.add('fa-sun');
    }
    
    // 主题切换功能
    themeSwitch.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeSwitchIcon.classList.remove('fa-sun');
            themeSwitchIcon.classList.add('fa-moon');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeSwitchIcon.classList.remove('fa-moon');
            themeSwitchIcon.classList.add('fa-sun');
        }
    });
    
    // 根据系统偏好设置初始主题（如果没有用户设置的主题）
    if (!savedTheme) {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeSwitchIcon.classList.remove('fa-moon');
            themeSwitchIcon.classList.add('fa-sun');
        }
    }
}); 