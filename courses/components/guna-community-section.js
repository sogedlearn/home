/**
 * Guna Community Section — cultural center
 */
class GunaCommunitySection extends HTMLElement {
    connectedCallback() {
        this.activeTab = 'history';
        this.render();
        this.bindEvents();
    }

    getTabs() {
        return [
            { id: 'history', label: 'History', icon: '📜' },
            { id: 'bookshelf', label: 'My Bookshelf', icon: '📚' },
            { id: 'culture', label: 'Culture', icon: '🧵' },
            { id: 'spirituality', label: 'Spirituality', icon: '🌟' },
            { id: 'nature', label: 'Nature', icon: '🌊' }
        ];
    }

    getTerritoryData() {
        return {
            'guna-yala': {
                name: 'Guna Yala (Comarca)',
                location: 'Archipiélago de San Blas, costa caribeña de Panamá — más de 360 islas.',
                history: 'Antiguo San Blas. Tras la Revolución Tule de 1925, los Guna obtuvieron autonomía y reconocimiento territorial.',
                culture: 'Congresos comunitarios, molas, pesca artesanal y lengua Dulegaya como pilar identitario.',
                population: '~34,000 habitantes',
                traditions: 'Elaboración de molas, cantos ceremoniales, cayuco colectivo y gobierno por saglas.',
                facts: 'Es una de las comarcas indígenas más conocidas de Panamá y un destino cultural único.',
                image: '../Multimedia/Images/panama-guna-map.png'
            },
            'madugandi': {
                name: 'Madugandí',
                location: 'Provincia de Panamá y Darién, bosques del lado continental.',
                history: 'Comarca creada en 1996 para comunidades Guna del interior que migraron desde el archipiélago.',
                culture: 'Mezcla de tradiciones insulares con vida en el bosque tropical; artesanía y agricultura.',
                population: '~1,800 habitantes',
                traditions: 'Chácaras, congresos locales y transmisión oral de historias de migración.',
                facts: 'Madugandí significa "donde hay Madre Tierra" en la cosmovisión Guna.',
                image: '../Multimedia/Images/Molas - Guna/Mola 4.jpg'
            },
            'wargandi': {
                name: 'Wargandí',
                location: 'Provincia de Darién, frontera con Colombia, selva tropical.',
                history: 'Comarca establecida en 2000 para proteger territorios Guna en la frontera.',
                culture: 'Vida ligada al río y la selva; conservación forestal y conocimiento medicinal.',
                population: '~1,700 habitantes',
                traditions: 'Medicina tradicional, pesca fluvial y asambleas del congreso general.',
                facts: 'Wargandí es la comarca Guna más joven y una de las más remotas de Panamá.',
                image: '../Multimedia/Images/Molas - Guna/Mola 6.webp'
            },
            'ailigandi': {
                name: 'Isla Ailigandí',
                location: 'Guna Yala — isla histórica del archipiélago.',
                history: 'Centro simbólico de la Revolución Tule de 1925.',
                culture: 'Sede de congresos históricos y referencia de resistencia cultural.',
                population: 'Comunidad insular tradicional',
                traditions: 'Celebraciones del 25 de febrero y reuniones del congreso.',
                facts: 'Considerada cuna del movimiento que defendió la autonomía Guna.',
                image: '../Multimedia/Images/Molas - Guna/Mola 1.jpg'
            },
            'nargana': {
                name: 'Narganá',
                location: 'Isla conectada por puente en Guna Yala.',
                history: 'Una de las islas más visitadas; punto de encuentro entre turismo y cultura.',
                culture: 'Mercados locales, artesanía y hospitalidad comunitaria.',
                population: '~3,000 habitantes',
                traditions: 'Venta de molas, danzas y gastronomía de coco y pescado.',
                facts: 'Es accesible por carretera desde el continente vía puente.',
                image: '../Multimedia/Images/Molas - Guna/Mola 3.jpg'
            },
            'carti': {
                name: 'Cartí Sugdup',
                location: 'Islas de Cartí, entrada al archipiélago desde Panamá.',
                history: 'Puerta de entrada histórica al territorio insular Guna.',
                culture: 'Punto de partida de lanchas hacia las islas; comercio y turismo comunitario.',
                population: 'Varias comunidades insulares',
                traditions: 'Embarque en cayucos, venta de artesanías y recepción de visitantes.',
                facts: 'Desde aquí parten las embarcaciones hacia las islas del archipiélago.',
                image: '../Multimedia/Images/Molas - Guna/Mola 5.jpg'
            }
        };
    }

    renderTerritoryMap() {
        const regions = this.getTerritoryData();
        return `
            <div class="community-article territory-article">
                <h2>🗺️ Territorio y Regiones Guna</h2>
                <p class="territory-intro">Explora el mapa interactivo de Panamá. Haz clic en las regiones e islas Guna para conocer su historia, cultura y tradiciones.</p>
                <div class="guna-map-container">
                    <div class="guna-map-controls">
                        <button type="button" class="map-zoom-btn" data-zoom="in" title="Acercar"><i class="fas fa-plus"></i></button>
                        <button type="button" class="map-zoom-btn" data-zoom="out" title="Alejar"><i class="fas fa-minus"></i></button>
                        <button type="button" class="map-zoom-btn" data-zoom="reset" title="Restablecer"><i class="fas fa-compress"></i></button>
                    </div>
                    <div class="guna-map-viewport" id="gunaMapViewport">
                        <svg class="guna-map-svg" viewBox="0 0 400 600" id="gunaMapSvg">
                            <rect width="400" height="600" fill="#b8e0f0" rx="8"/>
                            <path d="M80,120 L200,80 L320,140 L300,280 L180,320 L60,240 Z" fill="#7cb87c" stroke="#4a7c4a" stroke-width="2"/>
                            <text x="200" y="200" text-anchor="middle" fill="#333" font-size="12">Panamá</text>
                            <g class="map-region" data-region="madugandi" transform="translate(140,220)">
                                <ellipse cx="0" cy="0" rx="45" ry="35" fill="#f59e0b" opacity="0.85" stroke="#d97706" stroke-width="2"/>
                                <text x="0" y="4" text-anchor="middle" fill="#fff" font-size="9" font-weight="bold">Madugandí</text>
                            </g>
                            <g class="map-region" data-region="wargandi" transform="translate(250,350)">
                                <ellipse cx="0" cy="0" rx="50" ry="40" fill="#8b5cf6" opacity="0.85" stroke="#6d28d9" stroke-width="2"/>
                                <text x="0" y="4" text-anchor="middle" fill="#fff" font-size="9" font-weight="bold">Wargandí</text>
                            </g>
                            <g class="map-region" data-region="guna-yala" transform="translate(300,100)">
                                <ellipse cx="0" cy="0" rx="55" ry="45" fill="#00A3E0" opacity="0.9" stroke="#0077a8" stroke-width="2"/>
                                <text x="0" y="4" text-anchor="middle" fill="#fff" font-size="9" font-weight="bold">Guna Yala</text>
                            </g>
                            <g class="map-island" data-region="ailigandi" transform="translate(320,70)">
                                <circle r="8" fill="#ff6b6b" stroke="#fff" stroke-width="2"/>
                                <title>Ailigandí</title>
                            </g>
                            <g class="map-island" data-region="nargana" transform="translate(340,95)">
                                <circle r="7" fill="#ff6b6b" stroke="#fff" stroke-width="2"/>
                            </g>
                            <g class="map-island" data-region="carti" transform="translate(305,130)">
                                <circle r="7" fill="#ff6b6b" stroke="#fff" stroke-width="2"/>
                            </g>
                            <text x="330" y="55" text-anchor="middle" fill="#c0392b" font-size="8">Islas Guna Yala</text>
                        </svg>
                    </div>
                    <aside class="guna-map-info" id="gunaMapInfo">
                        <div class="map-info-placeholder">
                            <i class="fas fa-hand-pointer"></i>
                            <p>Selecciona una región o isla en el mapa</p>
                        </div>
                    </aside>
                </div>
                <div class="territory-legend">
                    <span><i class="legend-dot guna-yala"></i> Guna Yala</span>
                    <span><i class="legend-dot madugandi"></i> Madugandí</span>
                    <span><i class="legend-dot wargandi"></i> Wargandí</span>
                    <span><i class="legend-dot island"></i> Islas principales</span>
                </div>
            </div>
        `;
    }

    getTabContent() {
        if (this.activeTab === 'bookshelf') {
            return '<my-bookshelf context="history"></my-bookshelf>';
        }

        const content = {
            history: `
                <div class="community-article">
                    <h2>📜 History of the Guna People</h2>
                    <div class="community-cards">
                        <article class="community-card">
                            <h3>Origins & Migrations</h3>
                            <p>The Guna people have inhabited the Caribbean coast and archipelago of Panama for centuries. Their history is marked by migrations from the mainland to the San Blas Islands (Guna Yala), seeking autonomy and preservation of their way of life.</p>
                        </article>
                        <article class="community-card">
                            <h3>1925 Tule Revolution</h3>
                            <p>In February 1925, the Guna people rose up in the <strong>Tule Revolution</strong> to defend their customs, traditional dress, language and political autonomy against external control. This historic event is central to Guna identity.</p>
                        </article>
                        <article class="community-card">
                            <h3>Creation of Guna Yala</h3>
                            <p>Following the revolution, the Guna secured recognition of their territory. <strong>Comarca Guna Yala</strong> became an autonomous indigenous region where the community governs through traditional congresses.</p>
                        </article>
                        <article class="community-card">
                            <h3>Political Organization</h3>
                            <p>Communities are organized through local <strong>congresses</strong> led by <strong>Saglas</strong> (traditional leaders). Decisions are made collectively, reflecting the Guna value of community consensus.</p>
                        </article>
                    </div>
                </div>
            `,
            culture: `
                <div class="community-article">
                    <h2>🧵 Guna Culture</h2>
                    <div class="community-cards">
                        <article class="community-card">
                            <h3>Molas</h3>
                            <p>Molas are reverse-appliqué textiles created by Guna women. Each design tells stories of nature, spirituality and daily life. They are recognized worldwide as masterpieces of indigenous art.</p>
                        </article>
                        <article class="community-card">
                            <h3>Traditional Dress</h3>
                            <p>Guna women wear colorful molas, beaded leg wraps (wini) and gold nose rings. Men traditionally wear simple shirts and pants. Dress is a symbol of cultural pride.</p>
                        </article>
                        <article class="community-card">
                            <h3>Music & Ceremonies</h3>
                            <p>Ceremonial songs preserve ancestral knowledge. Music accompanies rituals, community gatherings and celebrations that strengthen bonds between generations.</p>
                        </article>
                        <article class="community-card">
                            <h3>Customs & Daily Life</h3>
                            <p>Fishing, coconut harvesting, canoe building and collective work (cayuco) shape island life. Sharing and reciprocity are fundamental community values.</p>
                        </article>
                    </div>
                </div>
            `,
            spirituality: `
                <div class="community-article">
                    <h2>🌟 Spirituality & Cosmovision</h2>
                    <div class="community-cards">
                        <article class="community-card">
                            <h3>Ibeorgun — The Creator</h3>
                            <p><strong>Ibeorgun</strong> is the creator who established harmony between humans and nature. Guna spirituality emphasizes balance and respect for all living beings.</p>
                        </article>
                        <article class="community-card">
                            <h3>Kantule — Ancestral Sage</h3>
                            <p><strong>Kantule</strong> is remembered as the ancestral sage who taught medicine, community values and respect for elders through oral tradition.</p>
                        </article>
                        <article class="community-card">
                            <h3>Cosmovision</h3>
                            <p>The Guna worldview sees the natural and spiritual worlds as interconnected. Every animal, plant and element of the sea has meaning in stories and ceremonies.</p>
                        </article>
                        <article class="community-card">
                            <h3>The Four Worlds</h3>
                            <p>Traditional belief describes multiple worlds or realms. Humans have responsibility as caretakers of the Earth — the "fourth world" — for future generations.</p>
                        </article>
                    </div>
                </div>
            `,
            nature: `
                <div class="community-article">
                    <h2>🌊 Nature & Conservation</h2>
                    <div class="community-cards">
                        <article class="community-card">
                            <h3>Relationship with the Sea</h3>
                            <p>The Caribbean Sea is the heart of Guna life — for fishing, transport, and spiritual connection. Turtles, sharks, crabs and dolphins appear in legends and mola designs.</p>
                        </article>
                        <article class="community-card">
                            <h3>Environmental Conservation</h3>
                            <p>Guna communities practice sustainable fishing and forest use. Traditional knowledge guides when and how to harvest coconuts, fish and plants without depleting resources.</p>
                        </article>
                        <article class="community-card">
                            <h3>Sustainable Resources</h3>
                            <p>Coconut, wood, clay and medicinal plants are used with respect. The congress system regulates resource use to protect the islands and mainland forests.</p>
                        </article>
                    </div>
                </div>
            `
        };
        return content[this.activeTab] || content.history;
    }

    render() {
        this.innerHTML = `
            <div class="community-section">
                <header class="community-hero" data-aos="fade-up">
                    <h1>🏝️ Guna Community</h1>
                    <p>Cultural center — history, traditions and wisdom of the Guna people</p>
                </header>

                <nav class="community-tabs" role="tablist">
                    ${this.getTabs().map(t => `
                        <button type="button" class="community-tab ${t.id === this.activeTab ? 'active' : ''}"
                                data-tab="${t.id}" role="tab">
                            ${t.icon} ${t.label}
                        </button>
                    `).join('')}
                </nav>

                <div class="community-content" role="tabpanel">
                    ${this.getTabContent()}
                </div>

                <div class="community-resources">
                    <h3>📚 Explore More</h3>
                    <div class="community-resource-links">
                        <button type="button" class="resource-link-btn" data-go="stories">
                            <i class="fas fa-book-open"></i> Read Stories & PDFs
                        </button>
                        <button type="button" class="resource-link-btn" data-go="vocabulary">
                            <i class="fas fa-book"></i> Browse Vocabulary
                        </button>
                        <button type="button" class="resource-link-btn" data-go="learn">
                            <i class="fas fa-map"></i> Learning Path
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        this.querySelectorAll('.community-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.activeTab = tab.dataset.tab;
                if (tab.dataset.tab === 'history') localStorage.setItem('guna_history_visited', '1');
                if (tab.dataset.tab === 'culture') localStorage.setItem('guna_culture_visited', '1');
                if (typeof GunaGamification !== 'undefined') GunaGamification.checkAllBadges();
                this.render();
                this.bindEvents();
            });
        });

        this.querySelectorAll('.resource-link-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                window.learningHub?.navigateToSection(btn.dataset.go);
            });
        });

        this.setupMapInteractions();
    }

    setupMapInteractions() {
        const regions = this.getTerritoryData();
        const infoPanel = this.querySelector('#gunaMapInfo');
        const viewport = this.querySelector('#gunaMapViewport');
        const svg = this.querySelector('#gunaMapSvg');
        if (!infoPanel || !svg) return;

        let scale = 1;
        const updateTransform = () => {
            svg.style.transform = `scale(${scale})`;
        };

        this.querySelectorAll('.map-zoom-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.dataset.zoom === 'in') scale = Math.min(2, scale + 0.2);
                else if (btn.dataset.zoom === 'out') scale = Math.max(0.6, scale - 0.2);
                else scale = 1;
                updateTransform();
            });
        });

        const showRegion = (key) => {
            const r = regions[key];
            if (!r) return;
            infoPanel.innerHTML = `
                <img src="${r.image}" alt="${r.name}" class="map-info-image" onerror="this.style.display='none'">
                <h3>${r.name}</h3>
                <dl class="map-info-list">
                    <dt><i class="fas fa-map-marker-alt"></i> Ubicación</dt><dd>${r.location}</dd>
                    <dt><i class="fas fa-landmark"></i> Historia</dt><dd>${r.history}</dd>
                    <dt><i class="fas fa-users"></i> Cultura</dt><dd>${r.culture}</dd>
                    <dt><i class="fas fa-chart-pie"></i> Población</dt><dd>${r.population}</dd>
                    <dt><i class="fas fa-star"></i> Tradiciones</dt><dd>${r.traditions}</dd>
                    <dt><i class="fas fa-lightbulb"></i> Dato curioso</dt><dd>${r.facts}</dd>
                </dl>
            `;
            this.querySelectorAll('.map-region, .map-island').forEach(el => el.classList.remove('active'));
            this.querySelector(`[data-region="${key}"]`)?.classList.add('active');
        };

        this.querySelectorAll('.map-region, .map-island').forEach(el => {
            el.style.cursor = 'pointer';
            el.addEventListener('click', () => showRegion(el.dataset.region));
        });

        if (viewport) {
            let isPanning = false;
            let startX, startY, scrollL, scrollT;
            viewport.addEventListener('mousedown', (e) => {
                isPanning = true;
                startX = e.pageX;
                startY = e.pageY;
                scrollL = viewport.scrollLeft;
                scrollT = viewport.scrollTop;
            });
            viewport.addEventListener('mousemove', (e) => {
                if (!isPanning) return;
                viewport.scrollLeft = scrollL - (e.pageX - startX);
                viewport.scrollTop = scrollT - (e.pageY - startY);
            });
            viewport.addEventListener('mouseup', () => { isPanning = false; });
            viewport.addEventListener('mouseleave', () => { isPanning = false; });
        }
    }
}

customElements.define('guna-community-section', GunaCommunitySection);
