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
        // Detect base path depending on page location
        const path = window.location.pathname;
        const isSubfolder = path.includes('/pages/') || path.includes('/auth/') || path.includes('/courses/') || path.includes('/dashboard/');
        const base = isSubfolder ? '../' : '';

        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Montserrat:wght@400;500;600;700&display=swap');
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');

                :host {
                    display: block;
                    width: 100%;
                }

                .cta-section {
                    position: relative;
                    padding: 72px 0;
                    background: #0a0a0a;
                    text-align: center;
                    overflow: hidden;
                }

                .cta-bg {
                    position: absolute;
                    inset: 0;
                    background-color: #0a0a0a;
                    background-image: url('${base}Multimedia/Images/guna-hero-mola-banner.png');
                    background-size: cover;
                    background-position: center center;
                    background-repeat: no-repeat;
                }

                .cta-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        180deg,
                        rgba(8, 6, 4, 0.88) 0%,
                        rgba(17, 128, 43, 0.55) 50%,
                        rgba(8, 6, 4, 0.88) 100%
                    );
                }

                .cta-container {
                    position: relative;
                    z-index: 2;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                }

                .cta-title {
                    font-family: 'Baloo 2', sans-serif;
                    font-size: clamp(1.7rem, 3.2vw, 2.4rem);
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 14px;
                    line-height: 1.2;
                }

                .cta-subtitle {
                    color: rgba(255, 255, 255, 0.9);
                    font-size: clamp(0.95rem, 1.5vw, 1.1rem);
                    margin-bottom: 32px;
                    max-width: 560px;
                    margin-left: auto;
                    margin-right: auto;
                    line-height: 1.6;
                }

                .cta-btn {
                    display: inline-block;
                    background: linear-gradient(135deg, #e8b923 0%, #d4a017 100%);
                    color: #3d1f0a;
                    font-weight: 600;
                    padding: 14px 38px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-size: 1rem;
                    letter-spacing: 0.04em;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    border: none;
                    cursor: pointer;
                }

                .cta-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 28px rgba(232, 185, 35, 0.45);
                    color: #3d1f0a;
                }

                @media (max-width: 768px) {
                    .cta-section {
                        padding: 56px 0;
                    }
                }

                @media (max-width: 576px) {
                    .cta-section {
                        padding: 44px 0;
                    }
                    .cta-container {
                        padding: 0 1.25rem;
                    }
                }
            </style>

            <section class="cta-section">
                <div class="cta-bg"></div>
                <div class="cta-overlay"></div>
                <div class="cta-container">
                    <h2 class="cta-title">
                        <slot name="title">Ready to Learn Dulegaya?</slot>
                    </h2>
                    <p class="cta-subtitle">
                        <slot name="subtitle">Start with your first words in the Guna language. It's free and connects you with one of the most vibrant cultures in the Americas.</slot>
                    </p>
                    <a href="#" class="cta-btn">
                        <slot name="primary-button">Start Lesson →</slot>
                    </a>
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
        const primaryBtn = this.shadowRoot.querySelector('.cta-btn');
        if (primaryBtn && primaryUrl) {
            primaryBtn.href = primaryUrl;
        }
    }
}

customElements.define('cta-section', CtaSection); 