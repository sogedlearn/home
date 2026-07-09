/**
 * Tienda Guna — Economía de Cocos
 */
const GUNA_STORE_ASSETS = {
    mola: '../Images/Molas - Guna',
    coco: '../Images/Soged/oggob.png',
    molaIcon: '../Images/Soged/mola-icon.png'
};

class GunaStore extends HTMLElement {
    constructor() {
        super();
        this.activeCategory = 'vidas';
        this.weeklyCountdown = this.getWeeklyCountdown();
    }

    connectedCallback() {
        this.render();
        this.bindEvents();
        CocosEconomy.updateAllDisplays();
    }

    getWeeklyCountdown() {
        const now = new Date();
        const end = new Date(now);
        end.setDate(end.getDate() + ((7 - end.getDay()) % 7 || 7));
        end.setHours(23, 59, 59, 999);
        const diff = end - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        return { days, hours };
    }

    getCatalog() {
        const M = GUNA_STORE_ASSETS.mola;
        const C = GUNA_STORE_ASSETS.coco;
        const I = GUNA_STORE_ASSETS.molaIcon;

        const livesItems = [
            { id: 'lives-1', name: '❤️ 1 Vida', price: 175, image: C, story: 'Recupera una vida para seguir practicando.', rarity: 'comun', lives: 1 },
            { id: 'lives-2', name: '❤️❤️ 2 Vidas', price: 250, image: C, story: 'Paquete de 2 vidas para tu ruta de aprendizaje.', rarity: 'comun', lives: 2 },
            { id: 'lives-3', name: '❤️❤️❤️ 3 Vidas', price: 350, image: C, story: 'Tres vidas para seguir aprendiendo sin parar.', rarity: 'raro', lives: 3 },
            { id: 'lives-4', name: '❤️❤️❤️❤️ 4 Vidas', price: 450, image: C, story: 'Cuatro vidas — casi una recarga completa.', rarity: 'raro', lives: 4 },
            { id: 'lives-5', name: '❤️❤️❤️❤️❤️ Recarga Completa', price: 500, image: C, story: 'Recarga completa de 5 vidas.', rarity: 'epico', lives: 5 }
        ];

        if (typeof GunaLives !== 'undefined' && !GunaLives.isSpecialOfferUsed()) {
            livesItems.unshift({
                id: 'lives-special',
                name: '🔥 Oferta: ❤️ 1 Vida',
                price: 50,
                image: C,
                story: '¡Oferta única! Una vida por solo 50 cocos — solo una vez por cuenta.',
                rarity: 'legendario',
                lives: 1,
                special: true
            });
        }

        return {
            vidas: {
                title: 'Vidas',
                icon: '❤️',
                items: livesItems
            },
            molas: {
                title: 'Molas Guna',
                icon: '🧵',
                items: [
                    { id: 'mola-colibri', name: 'Mola del Colibrí', price: 650, image: `${M}/Mola 1.jpg`, story: 'El colibrí representa la agilidad y la conexión entre el mundo terrenal y espiritual en la tradición Guna.', rarity: 'comun' },
                    { id: 'mola-coco', name: 'Mola del Coco', price: 585, image: `${M}/Mola 2.jpg`, story: 'El coco es símbolo de sustento y prosperidad en las islas Guna.', rarity: 'comun' },
                    { id: 'mola-tortuga', name: 'Mola de la Tortuga', price: 780, image: `${M}/Mola 3.jpg`, story: 'La tortuga encarna la longevidad y la sabiduría ancestral del mar.', rarity: 'raro' },
                    { id: 'mola-sol', name: 'Mola del Sol', price: 715, image: `${M}/Mola 4.jpg`, story: 'El sol guía a los pescadores y marca los ciclos de la vida comunitaria.', rarity: 'raro' },
                    { id: 'mola-mar', name: 'Mola del Mar', price: 910, image: `${M}/Mola 5.jpg`, story: 'El mar es el hogar espiritual del pueblo Guna y fuente de identidad cultural.', rarity: 'epico' }
                ]
            },
            galeria: {
                title: 'Galería Cultural',
                icon: '🎨',
                items: [
                    { id: 'arte-guna', name: 'Arte Guna', price: 390, image: `${M}/Mola 6.webp`, story: 'Colección de arte tradicional Guna con explicaciones culturales.', rarity: 'comun' },
                    { id: 'patrones', name: 'Patrones Tradicionales', price: 455, image: `${M}/Mola 7.jpg`, story: 'Descubre los significados detrás de cada patrón sagrado.', rarity: 'comun' },
                    { id: 'ilustraciones', name: 'Ilustraciones Históricas', price: 520, image: `${M}/Comarca-Guna-Yala.jpg`, story: 'Imágenes que narran la historia del pueblo Guna.', rarity: 'raro' },
                    { id: 'disenos', name: 'Diseños Exclusivos', price: 845, image: I, story: 'Diseños únicos creados por artesanas certificadas.', rarity: 'epico' }
                ]
            },
            perfil: {
                title: 'Personalización del Perfil',
                icon: '👤',
                items: [
                    { id: 'marco-islas', name: 'Marco Guardián de las Islas', price: 1040, image: `${M}/Mola 1.jpg`, story: 'Marco exclusivo inspirado en las islas del archipiélago.', rarity: 'raro' },
                    { id: 'titulo-guardian', name: 'Guardián de las Islas', price: 1040, image: C, story: 'Título honorífico que muestra tu compromiso con la cultura Guna.', rarity: 'raro' },
                    { id: 'fondo-perfil', name: 'Fondo de Perfil Ceremonial', price: 780, image: `${M}/Mola 5.jpg`, story: 'Fondo inspirado en ceremonias tradicionales.', rarity: 'raro' },
                    { id: 'titulo-protector', name: 'Protector de la Tradición', price: 1560, image: '../Images/Soged/Newturttle.png', story: 'Título épico para estudiantes dedicados a preservar la lengua.', rarity: 'epico' },
                    { id: 'insignia-especial', name: 'Insignia Especial Guna', price: 650, image: '../Images/Soged/LOGO SOGED.png', story: 'Insignia que destaca tu progreso en el Learning Hub.', rarity: 'comun' }
                ]
            },
            especiales: {
                title: 'Recompensas Especiales',
                icon: '🏆',
                items: [
                    { id: 'mola-legendaria', name: 'Mola Legendaria', price: 2600, image: I, story: 'La mola más codiciada, tejida con técnicas ancestrales.', rarity: 'legendario' },
                    { id: 'fondo-ceremonial', name: 'Fondo Ceremonial', price: 1950, image: `${M}/Mola 3.jpg`, story: 'Fondo raro usado en celebraciones comunitarias.', rarity: 'epico' },
                    { id: 'avatar-ancestral', name: 'Avatar Ancestral', price: 2340, image: '../Images/Soged/Newturttle.png', story: 'Avatar inspirado en los sabios ancestrales Guna.', rarity: 'legendario' },
                    { id: 'trofeo-cultural', name: 'Trofeo Cultural', price: 3250, image: C, story: 'Trofeo máximo por dominar la cultura y lengua Guna.', rarity: 'legendario' }
                ]
            },
            educativo: {
                title: 'Contenido Educativo',
                icon: '📚',
                items: [
                    { id: 'historias-guna', name: 'Historias Guna', price: 325, image: `${M}/Mola 2.jpg`, story: 'Relatos tradicionales narrados por ancianos de la comunidad.', rarity: 'comun' },
                    { id: 'leyendas', name: 'Leyendas Tradicionales', price: 390, image: `${M}/Mola 4.jpg`, story: 'Leyendas que transmiten valores y conocimiento ancestral.', rarity: 'comun' },
                    { id: 'videos-culturales', name: 'Videos Culturales', price: 520, image: `${M}/Mola 6.webp`, story: 'Documentales sobre la vida en las comarcas Guna.', rarity: 'raro' },
                    { id: 'curiosidades', name: 'Curiosidades Históricas', price: 260, image: `${M}/Mola 7.jpg`, story: 'Datos fascinantes sobre la historia del pueblo Guna.', rarity: 'comun' }
                ]
            },
            semanal: {
                title: 'Tienda Semanal',
                icon: '🎁',
                items: [
                    { id: 'semanal-mola', name: 'Mola Semanal Exclusiva', price: 455, image: I, story: 'Oferta rotativa — disponible solo esta semana.', rarity: 'raro', weekly: true },
                    { id: 'semanal-avatar', name: 'Avatar de la Semana', price: 585, image: '../Images/Soged/Newturttle.png', story: 'Avatar limitado que cambia cada semana.', rarity: 'epico', weekly: true },
                    { id: 'semanal-pack', name: 'Pack Cultural Semanal', price: 780, image: `${M}/Mola 5.jpg`, story: 'Paquete con contenido educativo y decoración.', rarity: 'epico', weekly: true }
                ]
            }
        };
    }

    rarityLabel(rarity) {
        const labels = { comun: 'Común', raro: 'Raro', epico: 'Épico', legendario: 'Legendario' };
        return labels[rarity] || rarity;
    }

    renderItemCard(item) {
        const isLives = !!item.lives;
        const purchased = !isLives && CocosEconomy.isPurchased(item.id);
        const balance = CocosEconomy.getBalance();
        const canAfford = balance >= item.price;
        const currentLives = typeof GunaLives !== 'undefined' ? GunaLives.getLives() : 5;
        const livesFull = isLives && currentLives >= 5;

        return `
            <article class="store-item-card ${purchased ? 'purchased' : ''} ${item.special ? 'store-special-offer' : ''} rarity-${item.rarity}" data-item-id="${item.id}">
                <div class="store-item-image-wrap">
                    ${typeof MolaAttribution !== 'undefined' && MolaAttribution.isMolaImage(item.image)
                        ? MolaAttribution.wrapHtml(item.image, item.name, 'store-item-image')
                        : `<img src="${item.image}" alt="${item.name}" class="store-item-image" loading="lazy" onerror="this.src='${GUNA_STORE_ASSETS.coco}'">`
                    }
                    <span class="store-rarity-badge rarity-${item.rarity}">${this.rarityLabel(item.rarity)}</span>
                    ${item.special ? '<span class="store-special-badge">Oferta única</span>' : ''}
                    ${purchased ? '<span class="store-owned-badge"><i class="fas fa-check"></i> Desbloqueado</span>' : ''}
                </div>
                <div class="store-item-body">
                    <h4 class="store-item-name">${item.name}</h4>
                    <p class="store-item-story">${item.story}</p>
                    <div class="store-item-footer">
                        <span class="store-item-price">
                            <img src="${GUNA_STORE_ASSETS.coco}" alt="" class="store-coco-icon" aria-hidden="true">
                            <span>${CocosEconomy.formatCocos(item.price)} cocos</span>
                        </span>
                        ${isLives
                            ? (livesFull
                                ? '<button class="store-buy-btn owned" disabled><i class="fas fa-heart"></i> Vidas llenas</button>'
                                : `<button class="store-buy-btn ${canAfford ? '' : 'insufficient'}" data-buy="${item.id}" data-price="${item.price}" data-lives="${item.lives}" ${item.special ? 'data-special="1"' : ''} ${canAfford ? '' : 'disabled'}>
                                    <i class="fas fa-heart"></i> Comprar
                                   </button>`)
                            : (purchased
                                ? '<button class="store-buy-btn owned" disabled><i class="fas fa-lock-open"></i> En tu colección</button>'
                                : `<button class="store-buy-btn ${canAfford ? '' : 'insufficient'}" data-buy="${item.id}" data-price="${item.price}" ${canAfford ? '' : 'disabled'}>
                                    <i class="fas fa-shopping-cart"></i> Comprar
                                   </button>`)
                        }
                    </div>
                </div>
            </article>
        `;
    }

    render() {
        const catalog = this.getCatalog();
        const categories = Object.entries(catalog);
        const active = catalog[this.activeCategory];
        const { days, hours } = this.weeklyCountdown;
        const balance = CocosEconomy.getBalance();

        this.innerHTML = `
            <div class="guna-store-modern" role="region" aria-label="Tienda Guna">
                <header class="store-hero-modern" data-aos="fade-up">
                    <div class="store-hero-content-modern">
                        <h1 class="store-title-modern">🛒 Soged Market</h1>
                        <p class="store-subtitle-modern">Canjea tus cocos por recompensas exclusivas</p>
                    </div>
                    <div class="cocos-wallet-modern cocos-balance-display" title="Cocos ganados durante tu aprendizaje">
                        <div class="wallet-icon-wrapper">
                            <img src="${GUNA_STORE_ASSETS.coco}" alt="Coco" class="wallet-coco-icon">
                            <div class="wallet-sparkle"></div>
                        </div>
                        <div class="wallet-info">
                            <span class="wallet-label">Mi Monedero</span>
                            <span class="wallet-balance" data-cocos-balance>${CocosEconomy.formatCocos(balance)}</span>
                            <span class="wallet-currency">🥥 Cocos</span>
                        </div>
                    </div>
                </header>

                <nav class="store-categories-modern" role="tablist" aria-label="Categorías de la tienda">
                    ${categories.map(([key, cat]) => `
                        <button class="store-category-tab ${key === this.activeCategory ? 'active' : ''}"
                                role="tab" aria-selected="${key === this.activeCategory}"
                                data-category="${key}">
                            <span class="tab-icon">${cat.icon}</span>
                            <span class="tab-name">${cat.title}</span>
                        </button>
                    `).join('')}
                </nav>

                ${this.activeCategory === 'semanal' ? `
                    <div class="weekly-timer-modern" data-aos="fade-up">
                        <div class="timer-icon">
                            <i class="fas fa-hourglass-half"></i>
                        </div>
                        <div class="timer-content">
                            <span class="timer-label">Disponible por:</span>
                            <span class="timer-value">${days} días ${hours} horas</span>
                        </div>
                    </div>
                ` : ''}

                <div class="store-items-grid-modern" role="tabpanel" data-aos="fade-up" data-aos-delay="100">
                    ${active.items.map(item => this.renderItemCard(item)).join('')}
                </div>
            </div>
        `;
    }

    bindEvents() {
        this.querySelectorAll('.store-category-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                this.activeCategory = btn.dataset.category;
                this.render();
                this.bindEvents();
            });
        });

        this.querySelectorAll('[data-buy]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.dataset.buy;
                const price = parseInt(btn.dataset.price, 10);
                this.handlePurchase(id, price);
            });
        });
    }

    handlePurchase(itemId, price, btn) {
        const catalog = this.getCatalog();
        let item = null;
        for (const cat of Object.values(catalog)) {
            item = cat.items.find(i => i.id === itemId);
            if (item) break;
        }
        if (!item) return;

        if (item.lives) {
            if (typeof GunaLives === 'undefined') return;
            if (GunaLives.getLives() >= GunaLives.MAX_LIVES) {
                this.showToast('Ya tienes el máximo de vidas.', 'error');
                return;
            }
            if (item.special && GunaLives.isSpecialOfferUsed()) {
                this.showToast('Esta oferta ya fue utilizada.', 'error');
                this.render();
                this.bindEvents();
                return;
            }
            if (!CocosEconomy.spendOggob(price)) {
                this.showToast(typeof GunaI18n !== 'undefined' ? GunaI18n.t('notEnoughCocos') : 'No tienes suficientes cocos.', 'error');
                return;
            }
            GunaLives.addLives(item.lives);
            if (item.special) GunaLives.markSpecialOfferUsed();
            CocosEconomy.recordPurchase(`purchase-${itemId}-${Date.now()}`);
            CocosEconomy.triggerConfetti();
            this.showToast(`¡+${item.lives} vida(s) añadida(s)! ❤️`, 'success');
            this.render();
            this.bindEvents();
            return;
        }

        if (CocosEconomy.isPurchased(itemId)) return;

        if (!CocosEconomy.spendOggob(price)) {
            this.showToast('No tienes suficientes cocos. ¡Completa más lecciones!', 'error');
            return;
        }

        CocosEconomy.recordPurchase(itemId);
        if (item.id === 'avatar-ancestral' || item.id === 'semanal-avatar') {
            const profile = GunaUserData?.getProfile();
            if (profile) GunaUserData.saveProfile({ ...profile, avatar: item.image });
            GunaUserData?.applyProfileToUI();
        }
        if (item.id === 'titulo-guardian' || item.id === 'titulo-protector') {
            const profile = GunaUserData?.getProfile();
            if (profile) GunaUserData.saveProfile({ ...profile, title: item.name });
            GunaUserData?.applyProfileToUI();
        }
        CocosEconomy.triggerConfetti();
        this.showToast(`¡${item.name} desbloqueado! 🎉`, 'success');
        this.render();
        this.bindEvents();
    }

    showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `store-toast store-toast--${type}`;
        toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i><span>${message}</span>`;
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }
}

customElements.define('guna-store', GunaStore);
