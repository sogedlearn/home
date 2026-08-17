/**
 * Reusable Guna geometric pattern (mola-inspired, not a copy of a specific piece).
 * Usage:
 *   <guna-pattern variant="sidebar"></guna-pattern>
 *   <guna-pattern variant="hero"></guna-pattern>
 *   <guna-pattern variant="divider"></guna-pattern>
 *   GunaPattern.html('hero')
 */
(function () {
    const SVG_NS = 'http://www.w3.org/2000/svg';

    let patternSeq = 0;

    function motif(svg) {
        const id = `gunaMolaTile-${++patternSeq}`;
        const defs = document.createElementNS(SVG_NS, 'defs');
        defs.innerHTML = `
            <pattern id="${id}" width="48" height="48" patternUnits="userSpaceOnUse">
                <rect width="48" height="48" fill="none"/>
                <rect x="2" y="2" width="44" height="44" fill="none" stroke="#5A301A" stroke-width="1.5"/>
                <rect x="8" y="8" width="32" height="32" fill="none" stroke="#F5B51B" stroke-width="2"/>
                <rect x="14" y="14" width="20" height="20" fill="none" stroke="#C83A32" stroke-width="1.5"/>
                <polygon points="24,18 30,24 24,30 18,24" fill="#087EA4"/>
                <polygon points="24,4 28,8 24,12 20,8" fill="#16834A"/>
                <polygon points="24,36 28,40 24,44 20,40" fill="#16834A"/>
            </pattern>
        `;
        svg.appendChild(defs);

        const bg = document.createElementNS(SVG_NS, 'rect');
        bg.setAttribute('width', '100%');
        bg.setAttribute('height', '100%');
        bg.setAttribute('fill', `url(#${id})`);
        svg.appendChild(bg);
    }

    function heroMotif(svg) {
        svg.innerHTML = `
            <g opacity="0.9">
                <rect x="8" y="18" width="88" height="88" fill="none" stroke="#5A301A" stroke-width="5"/>
                <rect x="20" y="30" width="64" height="64" fill="none" stroke="#C83A32" stroke-width="4"/>
                <rect x="32" y="42" width="40" height="40" fill="none" stroke="#087EA4" stroke-width="4"/>
                <polygon points="52,50 70,68 52,86 34,68" fill="#16834A"/>
                <polygon points="52,58 62,68 52,78 42,68" fill="#F5B51B"/>
            </g>
            <g opacity="0.85" transform="translate(110,8)">
                <rect x="10" y="10" width="70" height="70" fill="none" stroke="#C83A32" stroke-width="4"/>
                <rect x="22" y="22" width="46" height="46" fill="none" stroke="#5A301A" stroke-width="3"/>
                <circle cx="45" cy="45" r="10" fill="#087EA4"/>
                <circle cx="45" cy="45" r="4" fill="#F5B51B"/>
            </g>
            <g opacity="0.7" transform="translate(20,120)">
                <path d="M0 16 L16 0 L32 16 L48 0 L64 16 L80 0 L96 16 L112 0 L128 16"
                      fill="none" stroke="#5A301A" stroke-width="4"/>
                <path d="M0 28 L16 12 L32 28 L48 12 L64 28 L80 12 L96 28 L112 12 L128 28"
                      fill="none" stroke="#C83A32" stroke-width="3"/>
                <path d="M0 40 L16 24 L32 40 L48 24 L64 40 L80 24 L96 40 L112 24 L128 40"
                      fill="none" stroke="#16834A" stroke-width="3"/>
            </g>
        `;
    }

    function dividerMotif(svg) {
        svg.innerHTML = `
            <rect width="100%" height="100%" fill="none"/>
            <path d="M0 10 H1000" stroke="#C83A32" stroke-width="4"/>
            <path d="M0 18 H1000" stroke="#F5B51B" stroke-width="4"/>
            <path d="M0 26 H1000" stroke="#087EA4" stroke-width="4"/>
            <path d="M0 34 H1000" stroke="#16834A" stroke-width="4"/>
            <path d="M0 42 H1000" stroke="#5A301A" stroke-width="4"/>
        `;
    }

    class GunaPatternEl extends HTMLElement {
        static get observedAttributes() {
            return ['variant', 'opacity'];
        }

        connectedCallback() {
            this.render();
        }

        attributeChangedCallback() {
            this.render();
        }

        render() {
            const variant = this.getAttribute('variant') || 'default';
            const opacity = this.getAttribute('opacity');
            this.setAttribute('aria-hidden', 'true');
            this.classList.add('guna-pattern');
            this.classList.add(`guna-pattern--${variant}`);

            const svg = document.createElementNS(SVG_NS, 'svg');
            svg.setAttribute('class', `guna-pattern-svg guna-pattern-svg--${variant}`);
            svg.setAttribute('aria-hidden', 'true');
            svg.setAttribute('focusable', 'false');

            if (variant === 'hero') {
                svg.setAttribute('viewBox', '0 0 220 180');
                svg.setAttribute('preserveAspectRatio', 'xMaxYMid meet');
                heroMotif(svg);
            } else if (variant === 'divider') {
                svg.setAttribute('viewBox', '0 0 400 52');
                svg.setAttribute('preserveAspectRatio', 'none');
                dividerMotif(svg);
            } else {
                svg.setAttribute('viewBox', '0 0 48 48');
                svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
                motif(svg);
            }

            if (opacity) this.style.opacity = opacity;
            this.replaceChildren(svg);
        }
    }

    if (!customElements.get('guna-pattern')) {
        customElements.define('guna-pattern', GunaPatternEl);
    }

    window.GunaPattern = {
        html(variant = 'default', attrs = {}) {
            const extra = Object.entries(attrs)
                .map(([k, v]) => `${k}="${String(v).replace(/"/g, '&quot;')}"`)
                .join(' ');
            return `<guna-pattern variant="${variant}"${extra ? ` ${extra}` : ''}></guna-pattern>`;
        }
    };

    window.GunaIcon = {
        html(iconClass, color = 'gold', extraClass = '') {
            return `<span class="guna-icon guna-icon--${color} ${extraClass}" aria-hidden="true"><i class="${iconClass}"></i></span>`;
        }
    };
})();
