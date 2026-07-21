// Resources Page — Boutique grid rendering & filters

class ResourcesManager {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.levelFilter = document.getElementById('levelFilter');
        this.resourcesGrid = document.getElementById('resourcesGrid');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');

        this.currentCategory = 'all';
        this.currentLevel = 'all';
        this.currentSearch = '';
        this.showAllResources = false;
        this.resources = RESOURCES_DATA || [];

        this.init();
    }

    init() {
        this.renderResources();
        this.setupEventListeners();
        this.filterResources();
    }

    renderResources() {
        if (!this.resourcesGrid) return;

        this.resourcesGrid.innerHTML = this.resources.map((resource, index) =>
            this.renderResourceCard(resource, index)
        ).join('');

        this.resourceCards = document.querySelectorAll('.resource-card');
    }

    getCoverClass(theme) {
        const map = {
            'soged-earth': 'resource-cover--earth',
            'soged-gold': 'resource-cover--gold',
            'soged-green': 'resource-cover--green',
            'soged-blue': 'resource-cover--blue',
            'soged-red': 'resource-cover--red',
            'soged-purple': 'resource-cover--purple',
            'soged-orange': 'resource-cover--orange',
            'soged-teal': 'resource-cover--teal',
            'soged-indigo': 'resource-cover--indigo',
            'soged-pink': 'resource-cover--pink',
            'soged-cyan': 'resource-cover--cyan',
            'soged-lime': 'resource-cover--lime',
            'soged-rose': 'resource-cover--rose',
        };
        return map[theme] || 'resource-cover--earth';
    }

    getStarRating(resource) {
        const levelMap = {
            'beginner': 3,
            'intermediate': 4,
            'advanced': 5,
            'all levels': 5,
        };
        const count = resource.active ? (levelMap[resource.level.toLowerCase()] || 4) : 0;
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += i <= count
                ? '<i class="fas fa-star text-boutique-coral text-xs" aria-hidden="true"></i>'
                : '<i class="far fa-star text-absolute-black/20 text-xs" aria-hidden="true"></i>';
        }
        return stars;
    }

    getPrimaryAction(resource) {
        return resource.actions.find(a => a.primary) || resource.actions[0];
    }

    getSecondaryAction(resource) {
        return resource.actions.find(a => !a.primary);
    }

    renderResourceCard(resource, index) {
        const statusClass = resource.active ? 'resource-card--active' : 'resource-card--coming-soon';
        const featuredAttr = resource.featured ? 'data-featured="true"' : 'data-featured="false"';
        const categoryAttr = `data-category="${resource.category}"`;
        const levelAttr = `data-level="${resource.level.toLowerCase()}"`;
        const searchAttr = `data-search="${resource.search}"`;
        const resourceAttr = resource.resourceKey ? `data-resource="${resource.resourceKey}"` : '';
        const comingSoonBadge = !resource.active
            ? `<span class="absolute top-2 right-2 z-10 bg-absolute-black/75 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Soon</span>`
            : '';
        const coverClass = this.getCoverClass(resource.theme);
        const icon = resource.icon.startsWith('fa-') ? resource.icon : 'fa-' + resource.icon;
        const categoryLabel = this.capitalizeFirst(resource.category === 'docs' ? 'Documents' : resource.category);
        const primary = this.getPrimaryAction(resource);
        const secondary = this.getSecondaryAction(resource);
        const animationDelay = `style="animation-delay: ${(index % 6) * 0.08}s"`;

        const coverContent = resource.coverImage
            ? `<img src="${resource.coverImage}" alt="${resource.title}" class="w-full h-full object-cover">`
            : `<div class="flex items-center justify-center h-full"><i class="fas ${icon} text-white text-3xl opacity-90"></i></div>`;

        const primaryHtml = this.renderActionButton(primary, resource, true);
        const secondaryHtml = secondary ? this.renderActionButton(secondary, resource, false) : '';

        return `
            <article class="resource-card group flex flex-col ${statusClass}" ${featuredAttr} ${resourceAttr} ${categoryAttr} ${levelAttr} ${searchAttr} ${animationDelay}>
                <div class="resource-card-inner">
                    <div class="resource-cover-wrap ${coverClass}">
                        ${comingSoonBadge}
                        ${coverContent}
                    </div>
                    <div class="flex flex-col flex-1 px-3 pt-3 pb-4 text-center">
                        <h3 class="font-display text-sm font-bold text-absolute-black leading-snug mb-1 capitalize line-clamp-2 min-h-[2.5rem]">${resource.title}</h3>
                        <p class="text-[10px] text-absolute-black/50 font-semibold uppercase tracking-wide mb-1">${categoryLabel}</p>
                        <p class="text-[10px] text-absolute-black/40 mb-1.5">${resource.level}</p>
                        <div class="resource-stars flex justify-center gap-0.5 mb-2" aria-label="Level indicator">${this.getStarRating(resource)}</div>
                        <p class="text-[10px] text-absolute-black/35 font-medium mb-3">${resource.time}</p>
                        <div class="mt-auto space-y-1.5">
                            ${primaryHtml}
                            ${secondaryHtml}
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    renderActionButton(action, resource, isPrimary) {
        const disabled = !resource.active;
        const icon = action.icon;
        const label = action.label;

        if (isPrimary) {
            if (action.resourceKey && resource.active) {
                return `<button type="button" class="resource-card-btn-primary w-full mt-2 py-2 bg-boutique-coral hover:bg-boutique-coral-hover text-white text-xs font-bold rounded-md transition-all duration-300 flex items-center justify-center gap-1.5" data-resource="${action.resourceKey}">
                    <i class="fas ${icon} text-[10px]" aria-hidden="true"></i>${label}
                </button>`;
            }
            if (action.href && resource.active) {
                return `<a href="${action.href}" class="resource-card-btn-primary w-full mt-2 py-2 bg-boutique-coral hover:bg-boutique-coral-hover text-white text-xs font-bold rounded-md transition-all duration-300 flex items-center justify-center gap-1.5">
                    <i class="fas ${icon} text-[10px]" aria-hidden="true"></i>${label}
                </a>`;
            }
            return `<button type="button" class="resource-card-btn-primary w-full mt-2 py-2 bg-boutique-coral text-white text-xs font-bold rounded-md flex items-center justify-center gap-1.5 opacity-60 cursor-not-allowed" disabled>
                <i class="fas ${icon} text-[10px]" aria-hidden="true"></i>${label}
            </button>`;
        }

        if (action.href && resource.active) {
            return `<a href="${action.href}" class="resource-card-btn-secondary w-full mt-1 inline-flex items-center justify-center gap-1 py-1.5 text-[11px] font-semibold text-absolute-black/50 hover:text-boutique-coral transition-colors duration-300">
                <i class="fas ${icon} text-[10px]" aria-hidden="true"></i>${label}
            </a>`;
        }
        return `<button type="button" class="resource-card-btn-secondary w-full mt-1 inline-flex items-center justify-center gap-1 py-1.5 text-[11px] font-semibold text-absolute-black/40" disabled>
            <i class="fas ${icon} text-[10px]" aria-hidden="true"></i>${label}
        </button>`;
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    setupEventListeners() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.currentSearch = e.target.value.toLowerCase();
                this.filterResources();
            });
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.performSearch();
            });
        }

        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => this.performSearch());
        }

        if (this.categoryFilter) {
            this.categoryFilter.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.filterResources();
            });
        }

        if (this.levelFilter) {
            this.levelFilter.addEventListener('change', (e) => {
                this.currentLevel = e.target.value;
                this.filterResources();
            });
        }

        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => this.loadMoreResources());
        }

        if (this.resourcesGrid) {
            this.resourcesGrid.addEventListener('click', (e) => {
                const moreBtn = e.target.closest('button[data-resource]');
                if (!moreBtn || moreBtn.disabled) return;
                e.preventDefault();
                const resourceKey = moreBtn.getAttribute('data-resource');
                if (resourceKey && typeof openResourceModal === 'function') {
                    openResourceModal(resourceKey);
                }
            });
        }
    }

    cardMatchesFilter(card) {
        const category = card.getAttribute('data-category');
        const level = card.getAttribute('data-level') || '';
        const searchText = card.getAttribute('data-search') || '';
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';

        const matchesCategory = this.currentCategory === 'all' || category === this.currentCategory;
        const matchesLevel = this.currentLevel === 'all' || level === this.currentLevel;
        const matchesSearch = !this.currentSearch ||
            searchText.includes(this.currentSearch) ||
            title.includes(this.currentSearch);

        return matchesCategory && matchesLevel && matchesSearch;
    }

    isFeatured(card) {
        return card.getAttribute('data-featured') === 'true';
    }

    filterResources() {
        let visibleCount = 0;

        this.resourceCards.forEach(card => {
            const featured = this.isFeatured(card);
            const matches = this.cardMatchesFilter(card);

            card.classList.remove('hidden', 'filtered');

            if (!matches) {
                card.classList.add('hidden');
                return;
            }

            if (featured || this.showAllResources) {
                card.classList.add('filtered');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        this.updateLoadMoreButton();
        this.showNoResultsMessage(visibleCount);
    }

    updateLoadMoreButton() {
        if (!this.loadMoreBtn) return;

        const hiddenComingSoon = Array.from(this.resourceCards).some(card =>
            !this.isFeatured(card) && this.cardMatchesFilter(card)
        );

        if (this.showAllResources || !hiddenComingSoon) {
            this.loadMoreBtn.style.display = 'none';
        } else {
            this.loadMoreBtn.style.display = 'inline-flex';
        }
    }

    showNoResultsMessage(visibleCount) {
        const existingMessage = document.querySelector('.no-results-message');
        if (existingMessage) existingMessage.remove();

        if (visibleCount === 0 && this.resourcesGrid) {
            const message = document.createElement('div');
            message.className = 'no-results-message col-span-full text-center py-16';
            message.innerHTML = `
                <i class="fas fa-search text-4xl text-absolute-black/20 mb-4"></i>
                <h3 class="font-display text-xl font-bold text-absolute-black/60 mb-2">No resources found</h3>
                <p class="text-absolute-black/40 text-sm">Try adjusting your search or filter criteria</p>
            `;
            this.resourcesGrid.appendChild(message);
        }
    }

    performSearch() {
        if (this.searchInput) {
            this.currentSearch = this.searchInput.value.toLowerCase();
            this.filterResources();
        }
    }

    loadMoreResources() {
        this.showAllResources = true;
        this.filterResources();
        if (this.loadMoreBtn) this.loadMoreBtn.style.display = 'none';
    }

    addCardAnimations() {
        this.resourceCards.forEach((card, index) => {
            card.style.animationDelay = `${(index % 6) * 0.08}s`;
        });
    }

    setupCardInteractions() {
        /* Coming soon cards are non-interactive via CSS */
    }

    showNotification(message, type = 'info') {
        const icons = { success: 'check-circle', error: 'exclamation-circle', warning: 'exclamation-triangle', info: 'info-circle' };
        const notification = document.createElement('div');
        notification.className = 'resources-notification';
        notification.innerHTML = `
            <div class="flex items-center gap-3 text-sm text-absolute-black">
                <i class="fas fa-${icons[type] || 'info-circle'} text-boutique-coral"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notification);
        requestAnimationFrame(() => notification.classList.add('is-visible'));
        setTimeout(() => {
            notification.classList.remove('is-visible');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const resourcesManager = new ResourcesManager();
    resourcesManager.addCardAnimations();
    resourcesManager.setupCardInteractions();
    window.resourcesManager = resourcesManager;
});
