/**
 * Tienda Guna — Economía de Cocos
 */
const GUNA_STORE_ASSETS = {
    mola: '../Images/Molas - Guna',
    oggob: '../Images/Soged/oggob.png',
    molaIcon: '../Images/Soged/mola-icon.png'
};

class GunaStore extends HTMLElement {
    constructor() {
        super();
        this.activeCategory = 'burba';
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
        const O = GUNA_STORE_ASSETS.oggob;
        const I = GUNA_STORE_ASSETS.molaIcon;

        const burbaItems = [
            { id: 'burba-1', name: '❤️ 1 Burba', price: 175, image: O, story: 'Recover a burba to keep practicing.', rarity: 'common', burba: 1 },
            { id: 'burba-2', name: '❤️❤️ 2 Burba', price: 250, image: O, story: 'Pack of 2 burba for your learning path.', rarity: 'common', burba: 2 },
            { id: 'burba-3', name: '❤️❤️❤️ 3 Burba', price: 350, image: O, story: 'Three burba to keep learning without stopping.', rarity: 'rare', burba: 3 },
            { id: 'burba-4', name: '❤️❤️❤️❤️ 4 Burba', price: 450, image: O, story: 'Four burba — almost a full refill.', rarity: 'rare', burba: 4 },
            { id: 'burba-5', name: '❤️❤️❤️❤️❤️ Full Refill', price: 500, image: O, story: 'Full refill of 5 burba.', rarity: 'epic', burba: 5 }
        ];

        if (typeof GunaLives !== 'undefined' && !GunaLives.isSpecialOfferUsed()) {
            burbaItems.unshift({
                id: 'burba-special',
                name: '🔥 Offer: ❤️ 1 Burba',
                price: 50,
                image: O,
                story: 'Unique offer! One burba for only 50 Oggob — only once per account.',
                rarity: 'legendary',
                burba: 1,
                special: true
            });
        }

        return {
            burba: {
                title: 'Burba',
                icon: '❤️',
                items: burbaItems
            }
        };
    }

    rarityLabel(rarity) {
        const labels = { common: 'Common', rare: 'Rare', epic: 'Epic', legendary: 'Legendary' };
        return labels[rarity] || rarity;
    }

    renderItemCard(item) {
        const isBurba = !!item.burba;
        const purchased = !isBurba && CocosEconomy.isPurchased(item.id);
        const balance = CocosEconomy.getBalance();
        const canAfford = balance >= item.price;
        const currentBurba = typeof GunaLives !== 'undefined' ? GunaLives.getLives() : 5;
        const burbaFull = isBurba && currentBurba >= 5;

        return `
            <article class="store-item-card ${purchased ? 'purchased' : ''} ${item.special ? 'store-special-offer' : ''} rarity-${item.rarity}" data-item-id="${item.id}">
                <div class="store-item-image-wrap">
                    ${typeof MolaAttribution !== 'undefined' && MolaAttribution.isMolaImage(item.image)
                        ? MolaAttribution.wrapHtml(item.image, item.name, 'store-item-image')
                        : `<img src="${item.image}" alt="${item.name}" class="store-item-image" loading="lazy" onerror="this.src='${GUNA_STORE_ASSETS.oggob}'">`
                    }
                    <span class="store-rarity-badge rarity-${item.rarity}">${this.rarityLabel(item.rarity)}</span>
                    ${item.special ? '<span class="store-special-badge">Unique Offer</span>' : ''}
                    ${purchased ? '<span class="store-owned-badge"><i class="fas fa-check"></i> Unlocked</span>' : ''}
                </div>
                <div class="store-item-body">
                    <h4 class="store-item-name">${item.name}</h4>
                    <p class="store-item-story">${item.story}</p>
                    <div class="store-item-footer">
                        <span class="store-item-price">
                            <img src="${GUNA_STORE_ASSETS.oggob}" alt="" class="store-oggob-icon" aria-hidden="true">
                            <span>${CocosEconomy.formatCocos(item.price)} Oggob</span>
                        </span>
                        ${isBurba
                            ? (burbaFull
                                ? '<button class="store-buy-btn owned" disabled><i class="fas fa-heart"></i> Burba Full</button>'
                                : `<button class="store-buy-btn ${canAfford ? '' : 'insufficient'}" data-buy="${item.id}" data-price="${item.price}" data-burba="${item.burba}" ${item.special ? 'data-special="1"' : ''} ${canAfford ? '' : 'disabled'}>
                                    <i class="fas fa-heart"></i> Buy
                                   </button>`)
                            : (purchased
                                ? '<button class="store-buy-btn owned" disabled><i class="fas fa-lock-open"></i> In Your Collection</button>'
                                : `<button class="store-buy-btn ${canAfford ? '' : 'insufficient'}" data-buy="${item.id}" data-price="${item.price}" ${canAfford ? '' : 'disabled'}>
                                    <i class="fas fa-shopping-cart"></i> Buy
                                   </button>`)
                        }
                    </div>
                </div>
            </article>
        `;
    }

    render() {
        const catalog = this.getCatalog();
        const active = catalog[this.activeCategory];
        const balance = CocosEconomy.getBalance();

        this.innerHTML = `
            <div class="guna-store-modern" role="region" aria-label="Guna Store">
                <header class="store-hero-modern" data-aos="fade-up">
                    <div class="store-hero-content-modern">
                        <h1 class="store-title-modern">🛒 Soged Market</h1>
                        <p class="store-subtitle-modern">Exchange your Oggob for exclusive rewards</p>
                    </div>
                    <div class="oggob-wallet-modern oggob-balance-display" title="Oggob earned during your learning">
                        <div class="wallet-icon-wrapper">
                            <img src="${GUNA_STORE_ASSETS.oggob}" alt="Oggob" class="wallet-oggob-icon">
                            <div class="wallet-sparkle"></div>
                        </div>
                        <div class="wallet-info">
                            <span class="wallet-label">My Wallet</span>
                            <span class="wallet-balance" data-oggob-balance>${CocosEconomy.formatCocos(balance)}</span>
                            <span class="wallet-currency">🥥 Oggob</span>
                        </div>
                    </div>
                </header>



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

        if (item.burba) {
            if (typeof GunaLives === 'undefined') return;
            if (GunaLives.getLives() >= GunaLives.MAX_LIVES) {
                this.showToast('You already have the maximum burba.', 'error');
                return;
            }
            if (item.special && GunaLives.isSpecialOfferUsed()) {
                this.showToast('This offer has already been used.', 'error');
                this.render();
                this.bindEvents();
                return;
            }
            if (!CocosEconomy.spendOggob(price)) {
                this.showToast(typeof GunaI18n !== 'undefined' ? GunaI18n.t('notEnoughOggob') : 'You do not have enough Oggob.', 'error');
                return;
            }
            GunaLives.addLives(item.burba);
            if (item.special) GunaLives.markSpecialOfferUsed();
            CocosEconomy.recordPurchase(`purchase-${itemId}-${Date.now()}`);
            CocosEconomy.triggerConfetti();
            this.showToast(`+${item.burba} burba added! ❤️`, 'success');
            this.render();
            this.bindEvents();
            return;
        }

        if (CocosEconomy.isPurchased(itemId)) return;

        if (!CocosEconomy.spendOggob(price)) {
            this.showToast('You do not have enough Oggob. Complete more lessons!', 'error');
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
        this.showToast(`${item.name} unlocked! 🎉`, 'success');
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
