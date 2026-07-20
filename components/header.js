// Web Component para el Header
class SogedHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        // Determinar la ruta base según la ubicación de la página
        const currentPath = window.location.pathname;
        let basePath = '';
        
        if (currentPath.includes('/pages/')) {
            basePath = '../';
        } else if (currentPath.includes('/auth/')) {
            basePath = '../';
        } else if (currentPath.includes('/dashboard/')) {
            basePath = '../';
        } else if (currentPath.includes('/courses/')) {
            basePath = '../';
        } else {
            basePath = './';
        }

        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Fredoka+One&display=swap');
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
                @import url('${basePath}css/header.css');
                @import url('${basePath}css/variables.css');

                :host {
                    display: block;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1030;
                }

                /* CSS Variables are now imported from css/variables.css */

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .navbar {
                    background-color: var(--navbar-bg) !important;
                    box-shadow: 0 2px 10px var(--shadow-color);
                    padding: 1.2rem 0;
                    transition: var(--transition);
                    height: 90px;
                    border-bottom: 1px solid var(--border-color);
                }

                .container {
                    margin: 0 auto;
                    padding: 0 5rem;
                }

                .navbar .container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    padding: 0 5rem;
                    height: 100%;
                }

                .header-left {
                    display: flex;
                    align-items: center;
                    flex: 0 0 auto;
                    padding-right: 1.5rem;
                    min-width: 0;
                    height: 100%;
                }

                @media (min-width: 992px) {
                    .header-left {
                        max-width: min(300px, 36vw);
                    }
                }

                .header-center {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                }

                .header-right {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    flex: 0 0 auto;
                    padding-left: 1.5rem;
                    min-width: 180px;
                    height: 100%;
                }

                .navbar-collapse {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                }

                .logo-container {
                    display: flex;
                    align-items: center;
                    gap: 0;
                    padding: 0.35rem 0.5rem;
                    border-radius: 12px;
                    transition: var(--transition);
                }

                .logo-wordmark {
                    display: block;
                    width: auto;
                    height: 48px;
                    max-height: 56px;
                    max-width: min(280px, 58vw);
                    object-fit: contain;
                    object-position: left center;
                    transition: transform 0.3s ease;
                }

                .logo-container:hover .logo-wordmark {
                    transform: scale(1.02);
                }

                .logo-container:hover {
                    background: transparent !important;
                    transform: translateY(-2px);
                }

                .navbar-brand {
                    color: var(--primary-color) !important;
                    font-family: 'Fredoka', sans-serif;
                    font-size: 1.8rem;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    position: relative;
                    overflow: hidden;
                    text-decoration: none;
                }

                .navbar-brand::before {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: linear-gradient(90deg, #007bff, #28a745);
                    transform: scaleX(0);
                    transition: transform 0.3s ease;
                }

                .navbar-brand:hover::before {
                    transform: scaleX(1);
                }

                .navbar-brand i {
                    font-size: 1.8rem;
                    color: var(--primary-color);
                    transition: var(--transition);
                }

                .navbar-brand:hover i {
                    transform: rotate(360deg);
                }

                .navbar-toggler {
                    display: none;
                    background: none;
                    border: none;
                    padding: 0.5rem;
                    cursor: pointer;
                }

                .navbar-toggler-icon {
                    display: block;
                    width: 24px;
                    height: 2px;
                    background-color: var(--text-primary);
                    position: relative;
                    transition: var(--transition);
                }

                .navbar-toggler-icon::before,
                .navbar-toggler-icon::after {
                    content: '';
                    position: absolute;
                    width: 24px;
                    height: 2px;
                    background-color: var(--text-primary);
                    transition: var(--transition);
                }

                .navbar-toggler-icon::before {
                    top: -6px;
                }

                .navbar-toggler-icon::after {
                    bottom: -6px;
                }

                .navbar-nav {
                    display: flex;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }

                .navbar-nav.mx-auto {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.2rem;
                    height: 100%;
                }

                .navbar-nav.mx-auto .nav-item {
                    margin: 0 0.1rem;
                    height: 100%;
                    display: flex;
                    align-items: center;
                }

                .nav-item {
                    position: relative;
                    height: 100%;
                }

                .nav-link {
                    color: var(--text-primary) !important;
                    font-weight: 600;
                    padding: 0.8rem 1.2rem;
                    position: relative;
                    transition: all 0.3s ease;
                    font-size: 1.1rem;
                    text-align: center;
                    margin: 0 0.1rem;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    height: 100%;
                    border-bottom: 3px solid transparent;
                }

                .nav-link:hover {
                    color: var(--primary-color) !important;
                    transform: translateY(-2px);
                }

                .nav-link::after {
                    content: '';
                    position: absolute;
                    bottom: -1.5rem;
                    left: 50%;
                    width: 0;
                    height: 3px;
                    background: var(--gradient-primary);
                    transition: all 0.3s ease;
                    transform: translateX(-50%);
                    border-radius: 2px;
                }

                .nav-link:hover::after {
                    width: 80%;
                }

                .nav-link:hover {
                    color: var(--primary-color) !important;
                }

                /* Active state with permanent underline */
                .nav-link.active {
                    color: var(--primary-color) !important;
                }

                .nav-link.active::after {
                    width: 80%;
                    background: var(--primary-color);
                }

                .theme-toggle {
                    position: relative;
                    margin-right: 1rem;
                }

                .theme-switch {
                    position: relative;
                    display: inline-block;
                    width: 60px;
                    height: 30px;
                    background: var(--bg-tertiary);
                    border-radius: 30px;
                    cursor: pointer;
                    transition: var(--transition);
                    border: 2px solid var(--border-color);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .theme-switch::before {
                    content: '';
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    width: 22px;
                    height: 22px;
                    background: var(--primary-color);
                    border-radius: 50%;
                    transition: var(--transition);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                }

                #theme-switch:checked + .theme-switch::before {
                    transform: translateX(30px);
                }

                #theme-switch {
                    display: none;
                }

                .theme-switch i {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 12px;
                    transition: var(--transition);
                }

                .theme-switch .fa-sun {
                    left: 8px;
                    color: #FFD23F;
                }

                .theme-switch .fa-moon {
                    right: 8px;
                    color: var(--text-secondary);
                }

                #theme-switch:checked + .theme-switch .fa-sun {
                    opacity: 0.3;
                }

                #theme-switch:checked + .theme-switch .fa-moon {
                    opacity: 1;
                    color: #F1F5F9;
                }

                .nav-buttons {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                }

                .btn {
                    padding: 0.7rem 1.3rem;
                    border-radius: 12px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: var(--transition);
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    border: 2px solid transparent;
                    cursor: pointer;
                }

                .btn-primary {
                    background: var(--gradient-primary);
                    color: white;
                    border-color: var(--primary-color);
                }

                .btn-primary:hover {
                    background: var(--primary-hover);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 163, 224, 0.3);
                }

                .btn-outline-primary {
                    background: transparent;
                    color: var(--secondary-color);
                    border-color: var(--secondary-color);
                    font-weight: 600;
                }

                .btn-outline-primary:hover {
                    background: var(--secondary-color);
                    color: #333;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(255, 179, 0, 0.3);
                }

                /* Responsive */
                @media (max-width: 991px) {
                    .navbar .container {
                        padding: 0 1rem;
                    }
                    .header-center {
                        flex: 1;
                        justify-content: flex-start;
                    }

                    .navbar-toggler {
                        display: block;
                    }

                    .navbar-collapse {
                        background: var(--card-bg);
                        padding: 1.5rem;
                        border-radius: 16px;
                        margin-top: 1rem;
                        box-shadow: 0 8px 32px var(--shadow-color);
                        backdrop-filter: blur(10px);
                        -webkit-backdrop-filter: blur(10px);
                        border: 1px solid var(--border-color);
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        display: none;
                    }

                    .navbar-collapse.show {
                        display: block;
                    }

                    .navbar-nav.mx-auto {
                        flex-direction: column;
                        width: 100%;
                        gap: 0.3rem;
                    }

                    .navbar-nav.mx-auto .nav-item {
                        width: 100%;
                        margin: 0.1rem 0;
                    }

                    .nav-link {
                        padding: 0.8rem 1rem;
                        margin: 0.1rem 0;
                        transition: var(--transition);
                        text-align: center;
                        width: 100%;
                        border-radius: 12px;
                    }

                    .nav-link:hover {
                        color: var(--primary-color) !important;
                    }

                    .nav-link::after {
                        bottom: 0;
                        height: 2px;
                    }

                    .theme-toggle {
                        margin: 1rem 0;
                        display: flex;
                        justify-content: center;
                    }

                    .nav-buttons {
                        flex-direction: column;
                        width: 100%;
                        gap: 1rem;
                        margin-top: 1rem;
                    }

                    .nav-buttons .btn {
                        width: 100%;
                        justify-content: center;
                        padding: 1rem 1.5rem;
                    }
                }

                @media (max-width: 576px) {
                    .logo-wordmark {
                        height: 40px;
                        max-height: 48px;
                        max-width: min(220px, 62vw);
                    }

                    .navbar-brand i {
                        font-size: 1.6rem;
                    }

                    .nav-buttons .btn {
                        font-size: 0.9rem;
                        padding: 0.8rem 1.2rem;
                    }

                    .theme-switch {
                        width: 60px;
                        height: 32px;
                    }

                    .theme-switch::before {
                        width: 24px;
                        height: 24px;
                    }
                }
                /* Mobile Menu Toggle */
                .mobile-menu-toggle {
                    display: none;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    width: 40px;
                    height: 40px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                    margin-left: 1rem;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .mobile-menu-toggle:hover {
                    background: rgba(40, 167, 69, 0.1);
                }

                .hamburger-line {
                    width: 25px;
                    height: 3px;
                    background: var(--primary-color);
                    margin: 3px 0;
                    transition: all 0.3s ease;
                    border-radius: 2px;
                }

                /* Hamburger Animation */
                .mobile-menu-toggle.active .hamburger-line:nth-child(1) {
                    transform: rotate(45deg) translate(6px, 6px);
                }

                .mobile-menu-toggle.active .hamburger-line:nth-child(2) {
                    opacity: 0;
                }

                .mobile-menu-toggle.active .hamburger-line:nth-child(3) {
                    transform: rotate(-45deg) translate(6px, -6px);
                }

                /* Mobile Menu Overlay */
                .mobile-menu-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    background: linear-gradient(135deg, 
                        rgba(40, 167, 69, 0.95) 0%, 
                        rgba(32, 201, 151, 0.95) 50%, 
                        rgba(255, 179, 0, 0.95) 100%
                    );
                    backdrop-filter: blur(10px);
                    z-index: 9999;
                    display: none;
                    opacity: 0;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .mobile-menu-overlay.active {
                    display: flex;
                    opacity: 1;
                }

                .mobile-menu-content {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                    padding: 2rem;
                    position: relative;
                }

                .mobile-menu-close {
                    position: absolute;
                    top: 2rem;
                    right: 2rem;
                    width: 50px;
                    height: 50px;
                    background: rgba(255, 255, 255, 0.2);
                    border: 2px solid white;
                    border-radius: 50%;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(10px);
                }

                .mobile-menu-close:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: rotate(90deg) scale(1.1);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                }

                .mobile-nav-items {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    text-align: center;
                }

                .mobile-nav-item {
                    margin: 1.5rem 0;
                    transform: translateY(30px);
                    opacity: 0;
                }

                .mobile-menu-overlay.active .mobile-nav-item {
                    animation: slideInUp 0.6s ease forwards;
                }

                .mobile-menu-overlay.active .mobile-nav-item:nth-child(1) { animation-delay: 0.1s; }
                .mobile-menu-overlay.active .mobile-nav-item:nth-child(2) { animation-delay: 0.2s; }
                .mobile-menu-overlay.active .mobile-nav-item:nth-child(3) { animation-delay: 0.3s; }
                .mobile-menu-overlay.active .mobile-nav-item:nth-child(4) { animation-delay: 0.4s; }

                .mobile-nav-link {
                    color: white;
                    text-decoration: none;
                    font-size: 2rem;
                    font-weight: 600;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                    transition: all 0.3s ease;
                    display: block;
                    padding: 1rem;
                    border-radius: 12px;
                    position: relative;
                    overflow: hidden;
                }

                .mobile-nav-link::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.2);
                    transition: left 0.3s ease;
                }

                .mobile-nav-link:hover::before {
                    left: 0;
                }

                .mobile-nav-link:hover {
                    transform: translateY(-5px);
                    text-shadow: 3px 3px 6px rgba(0,0,0,0.4);
                }

                .mobile-nav-buttons {
                    margin-top: 3rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    width: 100%;
                    max-width: 300px;
                }

                .mobile-nav-btn {
                    padding: 1rem 2rem;
                    border: none;
                    border-radius: 12px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    text-align: center;
                    display: block;
                }

                .mobile-nav-btn.login {
                    background: transparent;
                    color: white;
                    border: 2px solid white;
                }

                .mobile-nav-btn.register {
                    background: white;
                    color: var(--primary-color);
                }

                .mobile-nav-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
                }

                @keyframes slideInUp {
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                /* Responsive breakpoints */
                @media (max-width: 991px) {
                    .mobile-menu-toggle {
                        display: flex;
                    }
                    
                    .header-center,
                    .header-right {
                        display: none;
                    }
                    
                    .header-left {
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                }

                @media (max-width: 768px) {
                    .navbar .container {
                        padding: 0 1rem;
                    }

                    .logo-wordmark {
                        height: 44px;
                        max-width: min(260px, 56vw);
                    }
                    
                    .mobile-nav-link {
                        font-size: 1.8rem;
                    }
                }

                @media (max-width: 480px) {
                    .logo-wordmark {
                        height: 36px;
                        max-width: min(200px, 65vw);
                    }
                    
                    .mobile-nav-link {
                        font-size: 1.6rem;
                    }
                    
                    .mobile-menu-content {
                        padding: 1rem;
                    }
                }

            </style>

            <nav class="navbar navbar-expand-lg fixed-top">
                <div class="container">
                    <div class="header-left">
                        <a href="${basePath}index.html" class="navbar-brand">
                            <div class="logo-container">
                                <img src="${basePath}Multimedia/Images/Soged/LOGO%20SOGED.png" alt="SOGED" class="logo-wordmark" width="280" height="56" decoding="async">
                            </div>
                        </a>
                        <!-- Mobile Menu Toggle -->
                        <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle navigation">
                            <span class="hamburger-line"></span>
                            <span class="hamburger-line"></span>
                            <span class="hamburger-line"></span>
                        </button>
                    </div>
                    <div class="header-center">
                        <div class="navbar-collapse" id="navbarNav">
                            <ul class="navbar-nav mx-auto">
                                <!-- Home -->
                                <li class="nav-item">
                                    <a href="${basePath}index.html" class="nav-link">
                                        <span>Home</span>
                                    </a>
                                </li>
                                <!-- Learn -->
                                <li class="nav-item">
                                    <a href="${basePath}languages.html" class="nav-link">
                                        <span>Learn</span>
                                    </a>
                                </li>
                                <!-- Resources -->
                                <li class="nav-item">
                                    <a href="${basePath}pages/resources.html" class="nav-link">
                                        <span>Resources</span>
                                    </a>
                                </li>
                                <!-- About Us -->
                                <li class="nav-item">
                                    <a href="${basePath}pages/about.html" class="nav-link">
                                        <span>About Us</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="header-right">
                        <!-- Theme Switch, Login, Register, etc. -->
                        <label class="theme-toggle me-2">
                            <input type="checkbox" id="theme-switch" />
                            <span class="theme-switch">
                                <i class="fas fa-sun"></i>
                                <i class="fas fa-moon"></i>
                            </span>
                        </label>
                        <div class="nav-buttons">
                            <button class="btn btn-outline-primary nav-login-btn">Login</button>
                            <button class="btn btn-primary nav-register-btn">Register</button>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- Mobile Menu Overlay -->
            <div class="mobile-menu-overlay" id="mobileMenuOverlay">
                <div class="mobile-menu-content">
                    <!-- Close Button -->
                    <button class="mobile-menu-close" id="mobileMenuClose" aria-label="Close menu">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <ul class="mobile-nav-items">
                        <li class="mobile-nav-item">
                            <a href="${basePath}index.html" class="mobile-nav-link">Home</a>
                        </li>
                        <li class="mobile-nav-item">
                            <a href="${basePath}languages.html" class="mobile-nav-link">Learn</a>
                        </li>
                        <li class="mobile-nav-item">
                            <a href="${basePath}pages/resources.html" class="mobile-nav-link">Resources</a>
                        </li>
                        <li class="mobile-nav-item">
                            <a href="${basePath}pages/about.html" class="mobile-nav-link">About Us</a>
                        </li>
                    </ul>
                    <div class="mobile-nav-buttons">
                        <a href="${basePath}auth/login.html" class="mobile-nav-btn login">Login</a>
                        <a href="${basePath}auth/register.html" class="mobile-nav-btn register">Register</a>
                    </div>
                </div>
            </div>

            <!-- Spacer for fixed navbar -->
            <div style="height: 90px;"></div>
        `;
    }

    setupEventListeners() {
        const shadow = this.shadowRoot;
        
        // Mobile menu toggle
        const mobileToggle = shadow.querySelector('#mobileMenuToggle');
        const mobileOverlay = shadow.querySelector('#mobileMenuOverlay');
        const mobileClose = shadow.querySelector('#mobileMenuClose');
        
        const closeMobileMenu = () => {
            mobileToggle.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        if (mobileToggle && mobileOverlay) {
            // Open menu
            mobileToggle.addEventListener('click', () => {
                mobileToggle.classList.toggle('active');
                mobileOverlay.classList.toggle('active');
                
                // Prevent body scroll when menu is open
                if (mobileOverlay.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });
            
            // Close button
            if (mobileClose) {
                mobileClose.addEventListener('click', closeMobileMenu);
            }
            
            // Close menu when clicking on overlay
            mobileOverlay.addEventListener('click', (e) => {
                if (e.target === mobileOverlay) {
                    closeMobileMenu();
                }
            });
            
            // Close menu when clicking on nav links
            const mobileNavLinks = shadow.querySelectorAll('.mobile-nav-link, .mobile-nav-btn');
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });
        }

        // Theme toggle
        const themeSwitch = shadow.querySelector('#theme-switch');
        if (themeSwitch) {
            // Set initial state based on current theme
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            themeSwitch.checked = currentTheme === 'dark';
            
            themeSwitch.addEventListener('change', () => {
                const newTheme = themeSwitch.checked ? 'dark' : 'light';
                // Dispatch event to global theme manager
                window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
            });
        }

        // Login and Register buttons
        const loginBtn = shadow.querySelector('.nav-login-btn');
        const registerBtn = shadow.querySelector('.nav-register-btn');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Redirect to login page
                const currentPath = window.location.pathname;
                let loginUrl = '';
                
                if (currentPath.includes('/pages/')) {
                    loginUrl = '../auth/login.html';
                } else if (currentPath.includes('/auth/')) {
                    loginUrl = 'login.html';
                } else if (currentPath.includes('/dashboard/')) {
                    loginUrl = '../auth/login.html';
                } else if (currentPath.includes('/courses/')) {
                    loginUrl = '../auth/login.html';
                } else {
                    loginUrl = 'auth/login.html';
                }
                
                window.location.href = loginUrl;
            });
        }
        
        if (registerBtn) {
            registerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Redirect to register page
                const currentPath = window.location.pathname;
                let registerUrl = '';
                
                if (currentPath.includes('/pages/')) {
                    registerUrl = '../auth/register.html';
                } else if (currentPath.includes('/auth/')) {
                    registerUrl = 'register.html';
                } else if (currentPath.includes('/dashboard/')) {
                    registerUrl = '../auth/register.html';
                } else if (currentPath.includes('/courses/')) {
                    registerUrl = '../auth/register.html';
                } else {
                    registerUrl = 'auth/register.html';
                }
                
                window.location.href = registerUrl;
            });
        }

        // Set active nav link based on current page
        this.setActiveNavLink();
    }

    setActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = this.shadowRoot.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && currentPath.includes(href.replace('.html', ''))) {
                link.classList.add('active');
            }
        });
    }

    // Method to show/hide user menu
    toggleUserMenu(show) {
        const userMenu = this.shadowRoot.querySelector('#user-menu');
        const authButtons = this.shadowRoot.querySelector('#auth-buttons');
        
        if (show) {
            userMenu.classList.remove('d-none');
            authButtons.classList.add('d-none');
        } else {
            userMenu.classList.add('d-none');
            authButtons.classList.remove('d-none');
        }
    }

    // Method to set user name
    setUserName(name) {
        const userNameElement = this.shadowRoot.querySelector('#user-name');
        if (userNameElement) {
            userNameElement.textContent = name;
        }
    }
}

// Register the custom element
customElements.define('soged-header', SogedHeader); 