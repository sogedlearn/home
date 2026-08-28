// Auth Management for Soged Language Learning Platform
class AuthManager {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupEventListeners();
        this.updateUI();
    }

    async checkAuthStatus() {
        if (typeof SogedSession !== 'undefined') {
            const session = await SogedSession.hydrate();
            if (session) {
                this.currentUser = SogedSession.getUser();
                this.isAuthenticated = true;
                this.updateUI();
                return;
            }
        }

        const token = localStorage.getItem('soged_token');
        const userData = localStorage.getItem('soged_user');
        if (token && userData && token !== 'guest_token' && !token.startsWith('dummy_token_')) {
            try {
                this.currentUser = JSON.parse(userData);
                this.isAuthenticated = true;
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.logout();
            }
        }
    }

    setupEventListeners() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        const themeSwitch = document.getElementById('theme-switch');
        if (themeSwitch) {
            themeSwitch.addEventListener('change', () => {
                this.toggleTheme();
            });
        }

        const loginForm = document.querySelector('.auth-login-form form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        const registerForm = document.querySelector('.auth-register-form form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        const forgotForm = document.querySelector('.auth-forgot-form form');
        if (forgotForm) {
            forgotForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }

        document.querySelectorAll('.switch-to-forgot').forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof window.showAuthModal === 'function') window.showAuthModal('forgot');
                else window.location.href = this.authPath('forgot-password.html');
            });
        });
        document.querySelectorAll('.switch-to-register').forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof window.showAuthModal === 'function') window.showAuthModal('register');
                else window.location.href = this.authPath('register.html');
            });
        });
        document.querySelectorAll('.switch-to-login, .back-to-login').forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof window.showAuthModal === 'function') window.showAuthModal('login');
                else window.location.href = this.authPath('login.html');
            });
        });
    }

    authPath(file) {
        const inSubfolder = window.location.pathname.includes('/pages/') ||
            window.location.pathname.includes('/auth/') ||
            window.location.pathname.includes('/courses/');
        return (inSubfolder ? '../' : './') + 'auth/' + file;
    }

    dashboardUrl() {
        const inSubfolder = window.location.pathname.includes('/pages/') ||
            window.location.pathname.includes('/auth/') ||
            window.location.pathname.includes('/courses/');
        return (inSubfolder ? '../' : './') + 'courses/learning-hub.html';
    }

    updateUI() {
        const userMenu = document.getElementById('user-menu');
        const authButtons = document.getElementById('auth-buttons');
        const userName = document.getElementById('user-name');

        if (this.isAuthenticated && this.currentUser) {
            if (userMenu) userMenu.classList.remove('d-none');
            if (authButtons) authButtons.classList.add('d-none');
            if (userName) userName.textContent = this.currentUser.name || 'Usuario';
        } else {
            if (userMenu) userMenu.classList.add('d-none');
            if (authButtons) authButtons.classList.remove('d-none');
        }
    }

    persistAndEnter(session, userData) {
        if (session && typeof SogedSession !== 'undefined') {
            userData = SogedSession.persistSession(session) || userData;
        } else if (session?.access_token) {
            localStorage.setItem('soged_token', session.access_token);
            localStorage.setItem('soged_user', JSON.stringify(userData));
        }
        this.currentUser = userData;
        this.isAuthenticated = true;
        this.updateUI();
        window.location.href = this.dashboardUrl();
    }

    async logout() {
        if (typeof supabaseClient !== 'undefined') {
            try { await supabaseClient.auth.signOut(); } catch (e) { console.warn(e); }
        }
        this.currentUser = null;
        this.isAuthenticated = false;
        if (typeof SogedSession !== 'undefined') SogedSession.clearAllUserState();
        else {
            localStorage.removeItem('soged_token');
            localStorage.removeItem('soged_user');
        }
        this.updateUI();
        this.showNotification('Sesión cerrada exitosamente', 'info');
        if (window.location.pathname !== '/index.html' && window.location.pathname !== '/' && window.location.pathname !== '/home') {
            window.location.href = this.authPath('login.html').replace('auth/login.html', 'index.html');
        }
    }

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('soged_theme', newTheme);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentNode) notification.remove();
        }, 5000);
    }

    hasAccess(feature) {
        if (!this.isAuthenticated) return false;
        const accessLevels = {
            basic: true,
            premium: this.currentUser?.subscription === 'premium',
            admin: this.currentUser?.role === 'admin'
        };
        return accessLevels[feature] || false;
    }

    validatePassword(password) {
        if (typeof password !== 'string' || password.length < 8) {
            return 'La contraseña debe tener al menos 8 caracteres.';
        }
        if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
            return 'La contraseña debe incluir al menos una letra y un número.';
        }
        return null;
    }

    async handleLogin() {
        const email = document.getElementById('login-email')?.value ||
            document.getElementById('login-username')?.value || '';
        const password = document.getElementById('login-password')?.value || '';

        if (!email || !password) {
            this.showNotification('Por favor completa todos los campos', 'warning');
            return;
        }
        if (typeof supabaseClient === 'undefined') {
            this.showNotification('Servicio de autenticación no disponible.', 'error');
            return;
        }

        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) {
            let message = 'Correo o contraseña incorrectos.';
            if (/email not confirmed/i.test(error.message)) {
                message = 'Confirma tu correo electrónico antes de iniciar sesión.';
            } else if (/invalid login/i.test(error.message)) {
                message = 'Correo o contraseña incorrectos.';
            }
            this.showNotification(message, 'error');
            return;
        }

        this.persistAndEnter(data.session, {
            name: email.split('@')[0],
            email,
            role: 'user',
            subscription: 'basic'
        });
    }

    async handleRegister() {
        const firstName = document.getElementById('register-firstname')?.value || '';
        const lastName = document.getElementById('register-lastname')?.value || '';
        const username = document.getElementById('register-username')?.value || '';
        const email = document.getElementById('register-email')?.value || '';
        const password = document.getElementById('register-password')?.value || '';
        const confirmPassword = document.getElementById('register-confirm-password')?.value || '';

        if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
            this.showNotification('Por favor completa todos los campos', 'warning');
            return;
        }
        if (password !== confirmPassword) {
            this.showNotification('Las contraseñas no coinciden', 'warning');
            return;
        }
        const passwordError = this.validatePassword(password);
        if (passwordError) {
            this.showNotification(passwordError, 'warning');
            return;
        }
        if (typeof supabaseClient === 'undefined') {
            this.showNotification('Servicio de autenticación no disponible.', 'error');
            return;
        }

        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: { first_name: firstName, last_name: lastName, username },
                emailRedirectTo: `${window.location.origin}/auth/reset-password.html?type=signup`
            }
        });

        if (error) {
            const already = /already registered/i.test(error.message);
            this.showNotification(already ? 'Este correo ya está registrado.' : error.message, 'error');
            return;
        }

        if (!data.session) {
            this.showNotification('Cuenta creada. Revisa tu correo para verificar la cuenta antes de iniciar sesión.', 'success');
            return;
        }

        this.persistAndEnter(data.session, {
            name: `${firstName} ${lastName}`,
            email,
            username,
            role: 'user',
            subscription: 'basic'
        });
    }

    async handleForgotPassword() {
        const email = document.getElementById('forgot-email')?.value || '';
        if (!email) {
            this.showNotification('Ingresa tu correo electrónico.', 'warning');
            return;
        }
        if (typeof supabaseClient === 'undefined') {
            this.showNotification('Servicio de autenticación no disponible.', 'error');
            return;
        }
        const redirectTo = `${window.location.origin}/auth/reset-password.html`;
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, { redirectTo });
        if (error) {
            this.showNotification(error.message || 'No se pudo enviar el enlace.', 'error');
            return;
        }
        this.showNotification('Si el correo existe, recibirás un enlace para restablecer tu contraseña.', 'success');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
    const savedTheme = localStorage.getItem('soged_theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        const themeSwitch = document.getElementById('theme-switch');
        if (themeSwitch) themeSwitch.checked = savedTheme === 'dark';
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
