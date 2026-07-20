/**
 * Partners section — static linked logos.
 */
const PARTNERS = [
    {
        name: 'Museo de la Mola',
        logo: 'Multimedia/Images/partner/Museo de la Mola.png',
        url: 'https://museodelamola.org/',
    },
    {
        name: 'Congreso Guna',
        logo: 'Multimedia/Images/partner/congresogeneral.png',
        url: 'https://gunayala.org.pa/',
    },
    {
        name: 'Fundación Alberto Motta',
        logo: 'Multimedia/Images/partner/Fundacion Alberto Motta.png',
        url: 'https://fundacionalbertomotta.org/',
    },
    {
        name: 'CIEPI',
        logo: 'Multimedia/Images/partner/CIEPI.png',
        url: 'https://www.udelas.ac.pa/servicio/ciepi/',
    },
];

class PartnersMarquee extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupThemeListener();
    }

    renderPartnerItem(partner) {
        return `
            <li class="partner-item">
                <a
                    class="partner-link"
                    href="${partner.url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit ${partner.name} website"
                >
                    <div class="partner-logo-wrap">
                        <img
                            src="${partner.logo}"
                            alt="${partner.name}"
                            class="partner-logo"
                            loading="lazy"
                            decoding="async"
                            draggable="false"
                        >
                    </div>
                    <span class="partner-name">${partner.name}</span>
                </a>
            </li>
        `;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                @import url('../css/variables.css');

                :host {
                    display: block;
                    width: 100%;
                }

                .partners-section {
                    background: var(--bg-primary);
                    padding: 100px 0;
                }

                .section-header {
                    max-width: 1200px;
                    margin: 0 auto 3rem;
                    padding: 0 2rem;
                    text-align: center;
                }

                .section-title {
                    font-size: clamp(2rem, 4vw, 2.75rem);
                    font-weight: 700;
                    color: var(--text-primary);
                    margin: 0 0 1rem;
                }

                .section-subtitle {
                    font-size: 1.1rem;
                    color: var(--text-secondary);
                    margin: 0;
                    line-height: 1.6;
                }

                .partners-grid {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: stretch;
                    justify-content: center;
                    gap: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                    list-style: none;
                }

                .partner-item {
                    flex: 1 1 220px;
                    max-width: 280px;
                }

                .partner-link {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 0.8rem;
                    height: 100%;
                    padding: 1.5rem 2rem;
                    border-radius: 16px;
                    text-decoration: none;
                    transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
                }

                .partner-link:hover {
                    transform: translateY(-5px);
                    background: rgba(0, 0, 0, 0.03);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
                }

                .partner-link:focus-visible {
                    outline: 2px solid var(--primary-color);
                    outline-offset: 4px;
                }

                .partner-logo-wrap {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    min-height: 100px;
                    padding: 0.5rem;
                }

                .partner-logo {
                    width: auto;
                    height: auto;
                    max-width: 180px;
                    max-height: 100px;
                    object-fit: contain;
                    border-radius: 0;
                    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
                    transition: transform 0.3s ease, filter 0.3s ease;
                    user-select: none;
                }

                .partner-link:hover .partner-logo {
                    transform: scale(1.1);
                    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
                }

                .partner-name {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    text-align: center;
                    line-height: 1.3;
                    opacity: 0.85;
                    transition: opacity 0.3s ease, color 0.3s ease;
                }

                .partner-link:hover .partner-name {
                    opacity: 1;
                    color: var(--primary-color);
                }

                @media (max-width: 768px) {
                    .partners-section {
                        padding: 70px 0;
                    }

                    .section-header {
                        margin-bottom: 2rem;
                        padding: 0 1rem;
                    }

                    .partners-grid {
                        gap: 1.25rem;
                        padding: 0 1rem;
                    }

                    .partner-item {
                        flex: 1 1 160px;
                        max-width: none;
                    }

                    .partner-link {
                        padding: 1rem 1.25rem;
                    }

                    .partner-logo-wrap {
                        min-height: 80px;
                    }

                    .partner-logo {
                        max-width: 150px;
                        max-height: 80px;
                    }
                }
            </style>

            <section class="partners-section" aria-label="Our Partners">
                <div class="section-header">
                    <h2 class="section-title">Our Partners</h2>
                    <p class="section-subtitle">
                        Working together to preserve indigenous languages and cultures.
                    </p>
                </div>

                <ul class="partners-grid">
                    ${PARTNERS.map((partner) => this.renderPartnerItem(partner)).join('')}
                </ul>
            </section>
        `;
    }

    setupThemeListener() {
        const syncTheme = () => this.updateTheme();

        document.addEventListener('themeChanged', syncTheme);

        this._themeObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    syncTheme();
                }
            });
        });

        this._themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });

        syncTheme();
    }

    updateTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        this.setAttribute('data-theme', currentTheme);

        const computedStyle = getComputedStyle(document.documentElement);
        const cssVars = [
            '--primary-color',
            '--primary-hover',
            '--secondary-color',
            '--bg-primary',
            '--text-primary',
            '--text-secondary',
        ];

        cssVars.forEach((varName) => {
            const value = computedStyle.getPropertyValue(varName);
            if (value) {
                this.shadowRoot.style.setProperty(varName, value);
            }
        });
    }

    disconnectedCallback() {
        if (this._themeObserver) {
            this._themeObserver.disconnect();
        }
    }
}

customElements.define('partners-marquee', PartnersMarquee);
