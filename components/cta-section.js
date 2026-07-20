// CTA Section Web Component
class CtaSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.setupThemeListener();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@700&family=Nunito:wght@400;600;700&display=swap');
                @import url('../css/variables.css');

                :host {
                    display: block;
                    width: 100%;
                }

                .cta-section {
                    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
                    color: white;
                    text-align: center;
                    padding: 100px 0 80px 0;
                    margin-bottom: 0;
                    position: relative;
                    overflow: hidden;
                }

                .cta-section::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('../Multimedia/Images/Languages/Azul.png') center/cover;
                    opacity: 0.1;
                    z-index: 1;
                }

                .cta-section::after {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
                    animation: cta-glow 8s ease-in-out infinite;
                    z-index: 1;
                }

                @keyframes cta-glow {
                    0%, 100% { transform: rotate(0deg) scale(1); }
                    50% { transform: rotate(180deg) scale(1.1); }
                }

                .cta-container {
                    position: relative;
                    z-index: 2;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                }

                .cta-content {
                    margin-bottom: 3rem;
                }

                .cta-title {
                    font-family: 'Fredoka', sans-serif;
                    font-size: 3.5rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                    color: white;
                    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    line-height: 1.2;
                }

                .cta-subtitle {
                    font-size: 1.3rem;
                    margin-bottom: 2.5rem;
                    opacity: 0.95;
                    line-height: 1.6;
                    max-width: 800px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .cta-buttons {
                    display: flex;
                    gap: 1.5rem;
                    justify-content: center;
                    flex-wrap: wrap;
                    margin-top: 2rem;
                }

                .cta-btn {
                    padding: 1.3rem 2.8rem;
                    font-size: 1.1rem;
                    font-weight: 600;
                    border-radius: 15px;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.8rem;
                    min-width: 220px;
                    justify-content: center;
                    text-decoration: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    border: 2px solid transparent;
                }

                .cta-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s;
                }

                .cta-btn:hover::before {
                    left: 100%;
                }

                .cta-btn-primary {
                    background: white;
                    color: var(--primary-color);
                    border-color: white;
                    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
                }

                .cta-btn-primary:hover {
                    background: var(--bg-secondary);
                    color: var(--primary-color);
                    transform: translateY(-3px);
                    box-shadow: 0 12px 35px rgba(255, 255, 255, 0.4);
                }

                .cta-btn-secondary {
                    background: transparent;
                    color: white;
                    border-color: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(10px);
                }

                .cta-btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: white;
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
                }

                .cta-btn i {
                    font-size: 1.2rem;
                    transition: transform 0.3s ease;
                }

                .cta-btn:hover i {
                    transform: translateX(3px);
                }

                .cta-features {
                    display: flex;
                    justify-content: center;
                    gap: 3rem;
                    margin-top: 3rem;
                    flex-wrap: wrap;
                }

                .cta-feature {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 1rem;
                    font-weight: 500;
                }

                .cta-feature i {
                    font-size: 1.3rem;
                    color: var(--accent-color);
                }

                /* Floating decorative elements */
                .cta-decoration {
                    position: absolute;
                    border-radius: 50%;
                    opacity: 0.1;
                    animation: float 6s ease-in-out infinite;
                }

                .cta-decoration:nth-child(1) {
                    width: 80px;
                    height: 80px;
                    background: var(--accent-color);
                    top: 20%;
                    left: 10%;
                    animation-delay: 0s;
                }

                .cta-decoration:nth-child(2) {
                    width: 120px;
                    height: 120px;
                    background: var(--secondary-color);
                    top: 60%;
                    right: 15%;
                    animation-delay: 2s;
                }

                .cta-decoration:nth-child(3) {
                    width: 60px;
                    height: 60px;
                    background: var(--success-color);
                    bottom: 30%;
                    left: 20%;
                    animation-delay: 4s;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }

                /* Responsive Design */
                @media (max-width: 991px) {
                    .cta-section {
                        padding: 80px 0 60px 0;
                    }

                    .cta-title {
                        font-size: 3rem;
                    }

                    .cta-subtitle {
                        font-size: 1.2rem;
                    }

                    .cta-buttons {
                        gap: 1rem;
                    }

                    .cta-btn {
                        padding: 1.2rem 2.4rem;
                        font-size: 1rem;
                        min-width: 200px;
                    }

                    .cta-features {
                        gap: 2rem;
                    }
                }

                @media (max-width: 768px) {
                    .cta-section {
                        padding: 60px 0 40px 0;
                    }

                    .cta-title {
                        font-size: 2.5rem;
                    }

                    .cta-subtitle {
                        font-size: 1.1rem;
                    }

                    .cta-buttons {
                        flex-direction: column;
                        align-items: center;
                    }

                    .cta-btn {
                        width: 100%;
                        max-width: 300px;
                    }

                    .cta-features {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .cta-decoration {
                        display: none;
                    }
                }

                @media (max-width: 576px) {
                    .cta-section {
                        padding: 50px 0 30px 0;
                    }

                    .cta-title {
                        font-size: 2rem;
                    }

                    .cta-subtitle {
                        font-size: 1rem;
                    }

                    .cta-btn {
                        padding: 1rem 2rem;
                        font-size: 0.95rem;
                        min-width: 180px;
                    }

                    .cta-container {
                        padding: 0 1rem;
                    }
                }

                /* Dark mode support - using CSS variables that respond to theme changes */
                :host-context([data-theme="dark"]) .cta-btn-primary:hover {
                    background: var(--bg-secondary);
                    color: var(--primary-color);
                }

                /* Alternative approach for browsers that don't support :host-context */
                :host([data-theme="dark"]) .cta-btn-primary:hover {
                    background: var(--bg-secondary);
                    color: var(--primary-color);
                }
            </style>

            <section class="cta-section">
                <div class="cta-decoration"></div>
                <div class="cta-decoration"></div>
                <div class="cta-decoration"></div>
                
                <div class="cta-container">
                    <div class="cta-content">
                        <h2 class="cta-title">
                            <slot name="title">Ready to Start Your Language Journey?</slot>
                        </h2>
                        <p class="cta-subtitle">
                            <slot name="subtitle">Join thousands of learners discovering the rich indigenous languages of Panama. Start your free trial today!</slot>
                        </p>
                    </div>

                    <div class="cta-buttons">
                        <a href="#" class="cta-btn cta-btn-primary">
                            <i class="fas fa-play"></i>
                            <slot name="primary-button">Start Free Trial</slot>
                        </a>
                        <a href="#" class="cta-btn cta-btn-secondary">
                            <i class="fas fa-info-circle"></i>
                            <slot name="secondary-button">Learn More</slot>
                        </a>
                    </div>

                    <div class="cta-features text-center">
                        <div class="cta-feature">
                            <i class="fas fa-check-circle"></i>
                            <span class="text-center">Free 7-day trial</span>
                        </div>
                        <div class="cta-feature">
                            <i class="fas fa-users"></i>
                            <span>Native speakers</span>
                        </div>
                        <div class="cta-feature">
                            <i class="fas fa-mobile-alt"></i>
                            <span>Mobile friendly</span>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    setupEventListeners() {
        const buttons = this.shadowRoot.querySelectorAll('.cta-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const href = button.getAttribute('href');
                if (href && href !== '#') {
                    window.location.href = href;
                }
            });
        });
    }

    setupThemeListener() {
        // Listen for theme changes from the main document
        document.addEventListener('themeChanged', () => {
            this.updateTheme();
        });

        // Also listen for changes to the data-theme attribute
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    this.updateTheme();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        // Initial theme check
        this.updateTheme();
    }

    updateTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        this.setAttribute('data-theme', currentTheme);
        
        // Update CSS variables in the shadow DOM to match the current theme
        const root = this.shadowRoot;
        const computedStyle = getComputedStyle(document.documentElement);
        
        // Get all CSS variables from the main document
        const cssVars = [
            '--primary-color', '--primary-hover', '--secondary-color', '--accent-color',
            '--success-color', '--bg-primary', '--bg-secondary', '--bg-tertiary',
            '--text-primary', '--text-secondary', '--border-color', '--shadow-color'
        ];
        
        cssVars.forEach(varName => {
            const value = computedStyle.getPropertyValue(varName);
            if (value) {
                root.style.setProperty(varName, value);
            }
        });
    }

    // Method to update content dynamically
    updateContent(data) {
        if (data.title) {
            const titleSlot = this.shadowRoot.querySelector('[name="title"]');
            if (titleSlot) titleSlot.textContent = data.title;
        }
        
        if (data.subtitle) {
            const subtitleSlot = this.shadowRoot.querySelector('[name="subtitle"]');
            if (subtitleSlot) subtitleSlot.textContent = data.subtitle;
        }
        
        if (data.primaryButton) {
            const primaryBtnSlot = this.shadowRoot.querySelector('[name="primary-button"]');
            if (primaryBtnSlot) primaryBtnSlot.textContent = data.primaryButton;
        }
        
        if (data.secondaryButton) {
            const secondaryBtnSlot = this.shadowRoot.querySelector('[name="secondary-button"]');
            if (secondaryBtnSlot) secondaryBtnSlot.textContent = data.secondaryButton;
        }
    }

    // Method to set button URLs
    setButtonUrls(primaryUrl, secondaryUrl) {
        const primaryBtn = this.shadowRoot.querySelector('.cta-btn-primary');
        const secondaryBtn = this.shadowRoot.querySelector('.cta-btn-secondary');
        
        if (primaryBtn && primaryUrl) {
            primaryBtn.href = primaryUrl;
        }
        
        if (secondaryBtn && secondaryUrl) {
            secondaryBtn.href = secondaryUrl;
        }
    }
}

customElements.define('cta-section', CtaSection); 