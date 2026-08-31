// Theme Management System - Soged Project
class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.themeSwitch = null;
        this.init();
    }

    init() {
        // Unify keys used across public site + learning hub
        this.currentTheme =
            localStorage.getItem('theme') ||
            localStorage.getItem('gunaTheme') ||
            localStorage.getItem('soged_theme') ||
            'light';
        
        // Apply theme immediately
        this.setTheme(this.currentTheme);
        
        // Initialize theme switch after components are loaded
        this.initializeThemeSwitch();
        
        // Listen for theme changes from other components (header switch, hub, etc.)
        window.addEventListener('themeChanged', (e) => {
            const next = e.detail?.theme === 'dark' ? 'dark' : 'light';
            if (next === this.currentTheme) return;
            this.setTheme(next);
        });
        
        console.log('Theme Manager initialized:', this.currentTheme);
    }

    initializeThemeSwitch() {
        // Wait for the theme switch to be available in the DOM
        const checkThemeSwitch = setInterval(() => {
            // Check for theme switch in main DOM
            this.themeSwitch = document.getElementById('theme-switch');
            
            // If not found in main DOM, check in shadow DOM of header component
            if (!this.themeSwitch) {
                const headerComponent = document.querySelector('soged-header');
                if (headerComponent && headerComponent.shadowRoot) {
                    this.themeSwitch = headerComponent.shadowRoot.getElementById('theme-switch');
                }
            }
            
            if (this.themeSwitch) {
                clearInterval(checkThemeSwitch);
                this.setupThemeSwitch();
            }
        }, 100);
    }

    setupThemeSwitch() {
        // Set initial state - checked = dark mode, unchecked = light mode
        this.themeSwitch.checked = this.currentTheme === 'dark';
        
        console.log('Theme switch initialized. Current theme:', this.currentTheme, 'Switch checked:', this.themeSwitch.checked);

        // Remove any existing event listeners
        this.themeSwitch.removeEventListener('change', this.handleThemeChange);
        
        // Add new event listener
        this.themeSwitch.addEventListener('change', this.handleThemeChange.bind(this));
        
        // Also add click listener to the label for better compatibility
        const themeSwitchLabel = this.themeSwitch.nextElementSibling;
        if (themeSwitchLabel && themeSwitchLabel.classList.contains('theme-switch')) {
            themeSwitchLabel.removeEventListener('click', this.handleLabelClick);
            themeSwitchLabel.addEventListener('click', this.handleLabelClick.bind(this));
        }
    }

    handleLabelClick(e) {
        e.preventDefault();
        this.themeSwitch.checked = !this.themeSwitch.checked;
        this.handleThemeChange({ target: this.themeSwitch });
    }

    handleThemeChange(e) {
        const newTheme = e.target.checked ? 'dark' : 'light';
        console.log('Theme switch toggled. New theme:', newTheme, 'Checked:', e.target.checked);
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        const next = theme === 'dark' ? 'dark' : 'light';
        this.currentTheme = next;

        document.documentElement.setAttribute('data-theme', next);
        document.body.classList.toggle('dark-mode', next === 'dark');
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${next}`);

        localStorage.setItem('theme', next);
        localStorage.setItem('gunaTheme', next);
        localStorage.setItem('soged_theme', next);

        if (this.themeSwitch) {
            this.themeSwitch.checked = next === 'dark';
        }

        document.body.offsetHeight;
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: next } }));
        this.updateThemeElements(next);
    }

    updateThemeElements(theme) {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.style.setProperty('--bg-primary', '#0d1a12');
            root.style.setProperty('--bg-secondary', '#12261a');
            root.style.setProperty('--bg-tertiary', '#163222');
            root.style.setProperty('--card-bg', '#12261a');
            root.style.setProperty('--header-bg', '#0d1a12');
            root.style.setProperty('--footer-bg', '#0d1a12');
            root.style.setProperty('--navbar-bg', '#0d1a12');
            root.style.setProperty('--text-primary', '#F3FBF5');
            root.style.setProperty('--text-secondary', '#B7D0C0');
            root.style.setProperty('--text-color', '#F3FBF5');
            root.style.setProperty('--border-color', '#163222');
            root.style.setProperty('--input-bg', '#12261a');
            root.style.setProperty('--input-border', '#2a4a34');
            root.style.setProperty('--input-text', '#F3FBF5');
            root.style.setProperty('--shadow-color', 'rgba(17, 128, 43, 0.22)');
        } else {
            root.style.setProperty('--bg-primary', '#F8F3EA');
            root.style.setProperty('--bg-secondary', '#ffffff');
            root.style.setProperty('--bg-tertiary', '#F1F5F9');
            root.style.setProperty('--card-bg', '#fff');
            root.style.setProperty('--header-bg', '#fff');
            root.style.setProperty('--footer-bg', '#F8F3EA');
            root.style.setProperty('--navbar-bg', '#fff');
            root.style.setProperty('--text-primary', '#1E293B');
            root.style.setProperty('--text-secondary', '#64748B');
            root.style.setProperty('--text-color', '#1E293B');
            root.style.setProperty('--border-color', '#E2E8F0');
            root.style.setProperty('--input-bg', '#fff');
            root.style.setProperty('--input-border', '#CBD5E1');
            root.style.setProperty('--input-text', '#1E293B');
            root.style.setProperty('--shadow-color', 'rgba(40, 167, 69, 0.08)');
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    // Method to sync theme with header component
    syncWithHeader() {
        const headerComponent = document.querySelector('soged-header');
        if (headerComponent && headerComponent.shadowRoot) {
            const headerThemeSwitch = headerComponent.shadowRoot.getElementById('theme-switch');
            if (headerThemeSwitch) {
                headerThemeSwitch.checked = this.currentTheme === 'dark';
            }
        }
    }
}

// Apply saved theme ASAP (before paint when possible)
(function applyThemeEarly() {
    try {
        const saved =
            localStorage.getItem('theme') ||
            localStorage.getItem('gunaTheme') ||
            localStorage.getItem('soged_theme') ||
            'light';
        const next = saved === 'dark' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        if (document.body) {
            document.body.classList.toggle('dark-mode', next === 'dark');
            document.body.classList.remove('theme-light', 'theme-dark');
            document.body.classList.add(`theme-${next}`);
        }
    } catch (_) { /* ignore */ }
})();

// Initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();

    // Sync theme with header component after it's loaded
    setTimeout(() => {
        window.themeManager.syncWithHeader();
    }, 500);
    setTimeout(() => {
        window.themeManager.syncWithHeader();
    }, 1500);
});

// Make theme manager globally available
window.ThemeManager = ThemeManager; 