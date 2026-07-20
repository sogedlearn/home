/**
 * Guna Territory Map — Panama map with interactive hotspots in Guna Yala
 */
const MUSEUM_URL = 'https://museodelamola.org/';

class GunaTerritorySection extends HTMLElement {
    connectedCallback() {
        localStorage.setItem('guna_territory_visited', '1');
        if (typeof GunaGamification !== 'undefined') GunaGamification.checkAllBadges();
        this.render();
        this.setupInteractions();
    }

    getMapPoints() {
        return [
            {
                id: 'guna-yala',
                label: 'Guna Yala',
                top: '15%',
                left: '56%',
                name: 'Comarca Guna Yala',
                molaImage: '../Multimedia/Images/Molas - Guna/Mola 1.jpg',
                molaTitle: 'Molas of Guna Yala',
                molaText: 'Molas are reverse-appliqué textiles created by Guna women. Each design tells stories of nature, animals and spiritual beliefs passed through generations.',
                culture: 'Guna Yala is an autonomous indigenous territory with over 360 Caribbean islands. Community congresses led by Saglas govern daily life, fishing, and cultural preservation.',
                history: 'After the 1925 Tule Revolution, the Guna people secured recognition of their territory and the right to maintain their language, dress and traditions.',
                facts: 'Dulegaya (Guna language) and mola art are UNESCO-recognized symbols of living indigenous heritage.'
            },
            {
                id: 'ailigandi',
                label: 'Ailigandí',
                top: '12%',
                left: '78%',
                name: 'Ailigandí Island',
                molaImage: '../Multimedia/Images/Molas - Guna/Mola 2.jpg',
                molaTitle: 'Revolution & Molas',
                molaText: 'Ailigandí is a historic center of the Tule Revolution. Molas from this region often depict symbols of resistance and cultural pride.',
                culture: 'Traditional congresses gather here. Women pass mola techniques from mothers to daughters as sacred cultural knowledge.',
                history: 'In February 1925, Guna leaders rose up on Ailigandí to defend autonomy — a defining moment in Panamanian history.',
                facts: 'February 25 is commemorated as a day of Guna cultural resistance and identity.'
            },
            {
                id: 'carti',
                label: 'Cartí',
                top: '18%',
                left: '54%',
                name: 'Cartí Sugdup',
                molaImage: '../Multimedia/Images/Molas - Guna/Mola 3.jpg',
                molaTitle: 'Gateway Molas',
                molaText: 'Cartí is the gateway to the archipelago. Local artisans sell molas featuring turtles, fish, and geometric patterns inspired by the sea.',
                culture: 'Visitors arrive by road and continue by cayuco (canoe) to the islands. Markets showcase living mola traditions.',
                history: 'For decades, Cartí has been the main entry point connecting mainland Panama with Guna island communities.',
                facts: 'Cayucos remain the traditional transport linking islands and preserving maritime culture.'
            },
            {
                id: 'nargana',
                label: 'Narganá',
                top: '14%',
                left: '86%',
                name: 'Narganá Island',
                molaImage: '../Multimedia/Images/Molas - Guna/Mola 4.jpg',
                molaTitle: 'Island Mola Art',
                molaText: 'Narganá molas blend sea life motifs — sharks, turtles, crabs — with bold geometric designs unique to each artisan.',
                culture: 'A bridge-connected island where Guna families maintain fishing, coconut harvesting and ceremonial life.',
                history: 'One of the most accessible Guna communities, balancing tourism with cultural preservation.',
                facts: 'Mola patterns here often feature marine animals central to island identity.'
            },
            {
                id: 'mola-tradition',
                label: 'Mola Art',
                top: '20%',
                left: '68%',
                name: 'Mola — Sacred Textile',
                molaImage: '../Multimedia/Images/Molas - Guna/Mola 5.jpg',
                molaTitle: 'The Art of the Mola',
                molaText: 'A mola is created by layering colored cloth and cutting reverse-appliqué designs. Each layer reveals patterns of animals, plants and spiritual symbols.',
                culture: 'Molas are worn daily by Guna women as identity and pride. Designs are never copied — each is an original artistic expression.',
                history: 'Molas evolved from body painting traditions into textile art recognized worldwide as a masterpiece of indigenous creativity.',
                facts: 'Learn more at the Museo de la Mola — tap any mola image to visit the museum website.'
            }
        ];
    }

    render() {
        const points = this.getMapPoints();
        this.innerHTML = `
            <div class="territory-section territory-section--map-only">
                <header class="territory-hero" data-aos="fade-up">
                    <h1>🗺️ Guna Territory Map</h1>
                    <p>Tap the points on the red zone (Guna Yala) to explore molas and culture</p>
                </header>

                <div class="panama-map-layout">
                    <div class="panama-map-stage" id="panamaMapStage">
                        <img
                            src="../Multimedia/Images/panama-guna-map.png"
                            alt="Map of Panama highlighting Guna Yala"
                            class="panama-map-img"
                            data-no-mola-attribution="true"
                            onerror="if(!this.dataset.fallback){this.dataset.fallback='1';this.src='../Multimedia/Images/panama-guna-map.svg';}"
                        >
                        ${points.map(p => `
                            <button type="button" class="map-hotspot" data-point="${p.id}"
                                    style="top:${p.top};left:${p.left}"
                                    aria-label="${p.label}">
                                <span class="map-hotspot-pulse"></span>
                                <span class="map-hotspot-dot"></span>
                            </button>
                        `).join('')}
                    </div>

                    <aside class="panama-map-panel" id="panamaMapPanel">
                        <div class="map-panel-placeholder">
                            <i class="fas fa-hand-pointer"></i>
                            <p>Select a point on the <strong>red zone</strong> to learn about molas and Guna culture</p>
                        </div>
                    </aside>
                </div>
            </div>
        `;
    }

    molaLink(imgSrc, alt, title) {
        return `
            <a href="${MUSEUM_URL}" target="_blank" rel="noopener noreferrer" class="map-mola-link" title="Visit Museo de la Mola">
                <img src="${imgSrc}" alt="${alt}" class="map-mola-thumb" data-no-mola-attribution="true" loading="lazy"
                     onerror="this.src='../Multimedia/Images/Soged/mola-icon.png'">
                <span class="map-mola-link-label"><i class="fas fa-external-link-alt"></i> ${title}</span>
            </a>`;
    }

    showPoint(pointId) {
        const point = this.getMapPoints().find(p => p.id === pointId);
        const panel = this.querySelector('#panamaMapPanel');
        if (!point || !panel) return;

        panel.innerHTML = `
            <h3>${point.name}</h3>
            ${this.molaLink(point.molaImage, point.molaTitle, 'View at Museo de la Mola')}
            <div class="map-panel-block map-panel-mola">
                <h4>🧵 ${point.molaTitle}</h4>
                <p>${point.molaText}</p>
            </div>
            <div class="map-panel-block">
                <h4><i class="fas fa-users"></i> Culture</h4>
                <p>${point.culture}</p>
            </div>
            <div class="map-panel-block">
                <h4><i class="fas fa-landmark"></i> History</h4>
                <p>${point.history}</p>
            </div>
            <div class="map-panel-block map-panel-fact">
                <h4><i class="fas fa-lightbulb"></i> Did you know?</h4>
                <p>${point.facts}</p>
            </div>
            <a href="${MUSEUM_URL}" target="_blank" rel="noopener noreferrer" class="map-museum-btn">
                <i class="fas fa-museum"></i> Visit Museo de la Mola
            </a>
        `;

        this.querySelectorAll('.map-hotspot').forEach(el => el.classList.remove('active'));
        this.querySelector(`[data-point="${pointId}"]`)?.classList.add('active');
    }

    setupInteractions() {
        this.querySelectorAll('.map-hotspot').forEach(btn => {
            btn.addEventListener('click', () => this.showPoint(btn.dataset.point));
        });
    }
}

customElements.define('guna-territory-section', GunaTerritorySection);
