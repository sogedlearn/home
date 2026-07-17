// Resources Page JavaScript - Dynamic Rendering

class ResourcesManager {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.categoryButtons = document.querySelectorAll('.category-btn');
        this.resourcesGrid = document.getElementById('resourcesGrid');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');

        this.currentCategory = 'all';
        this.currentSearch = '';
        this.showAllResources = false;
        this.resources = RESOURCES_DATA || [];

        this.init();
    }

    init() {
        this.renderResources();
        this.setupEventListeners();
        this.setupSearch();
        this.filterResources();
    }

    renderResources() {
        if (!this.resourcesGrid) return;

        this.resourcesGrid.innerHTML = this.resources.map(resource => 
            this.renderResourceCard(resource)
        ).join('');

        this.resourceCards = document.querySelectorAll('.resource-card');
    }

    renderResourceCard(resource) {
        const statusClass = resource.active ? 'resource-card--active' : 'resource-card--coming-soon';
        const featuredAttr = resource.featured ? 'data-featured="true"' : 'data-featured="false"';
        const categoryAttr = `data-category="${resource.category}"`;
        const searchAttr = `data-search="${resource.search}"`;
        const resourceAttr = resource.resourceKey ? `data-resource="${resource.resourceKey}"` : '';
        const comingSoonBadge = !resource.active ? '<span class="coming-soon-badge">Coming Soon</span>' : '';
        const disabledAttr = !resource.active ? 'disabled' : '';

        const actionsHtml = resource.actions.map(action => {
            const btnClass = action.primary ? 'btn-primary' : 'btn-outline-primary';
            const icon = action.icon;
            const label = action.label;
            const dataResourceAttr = action.resourceKey ? `data-resource="${action.resourceKey}"` : '';

            if (action.href && resource.active) {
                return `<a href="${action.href}" class="btn ${btnClass} btn-sm resource-practice-link">
                    <i class="fas ${icon}"></i>
                    ${label}
                </a>`;
            }

            return `<button class="btn ${btnClass} btn-sm" ${disabledAttr} ${dataResourceAttr}>
                <i class="fas ${icon}"></i>
                ${label}
            </button>`;
        }).join('');

        return `
            <div class="resource-card ${statusClass} ${resource.theme}" ${featuredAttr} ${resourceAttr} ${categoryAttr} ${searchAttr}>
                ${comingSoonBadge}
                <div class="resource-image">
                    <i class="fas ${resource.icon.startsWith('fa-') ? resource.icon : 'fa-' + resource.icon}"></i>
                </div>
                <div class="resource-content">
                    <div class="resource-category">${this.capitalizeFirst(resource.category)}</div>
                    <h3 class="resource-title">${resource.title}</h3>
                    <p class="resource-description">${resource.description}</p>
                    <div class="resource-meta">
                        <span class="resource-level">${resource.level}</span>
                        <span class="resource-time">${resource.time}</span>
                    </div>
                    <div class="resource-actions">
                        ${actionsHtml}
                    </div>
                </div>
            </div>
        `;
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
        }

        this.categoryButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setActiveCategory(e.target.closest('.category-btn'));
            });
        });

        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => {
                this.loadMoreResources();
            });
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

    setupSearch() {
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch();
            });
        }

        if (this.searchInput) {
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }
    }

    setActiveCategory(button) {
        this.categoryButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        button.classList.add('active');
        this.currentCategory = button.getAttribute('data-category');
        this.filterResources();
    }

    isFeatured(card) {
        return card.getAttribute('data-featured') === 'true';
    }

    cardMatchesFilter(card) {
        const category = card.getAttribute('data-category');
        const searchText = card.getAttribute('data-search') || '';
        const matchesCategory = this.currentCategory === 'all' || category === this.currentCategory;
        const matchesSearch = !this.currentSearch || searchText.includes(this.currentSearch);
        return matchesCategory && matchesSearch;
    }

    filterResources() {
        let visibleCount = 0;

        this.resourceCards.forEach(card => {
            const featured = this.isFeatured(card);
            const matches = this.cardMatchesFilter(card);

            card.classList.remove('hidden', 'filtered');

            if (!matches) {
                card.classList.add('hidden');
                card.style.display = 'none';
                return;
            }

            if (featured || this.showAllResources) {
                card.classList.add('filtered');
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });

        this.updateLoadMoreButton();
        this.showNoResultsMessage(visibleCount);
    }

    updateLoadMoreButton() {
        if (!this.loadMoreBtn) return;

        const hiddenComingSoon = Array.from(this.resourceCards).some(card => {
            return !this.isFeatured(card) && this.cardMatchesFilter(card);
        });

        if (this.showAllResources || !hiddenComingSoon) {
            this.loadMoreBtn.style.display = 'none';
        } else {
            this.loadMoreBtn.style.display = 'inline-flex';
        }
    }

    showNoResultsMessage(visibleCount) {
        const existingMessage = document.querySelector('.no-results-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        if (visibleCount === 0) {
            const message = document.createElement('div');
            message.className = 'no-results-message text-center py-5';
            message.innerHTML = `
                <i class="fas fa-search" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--text-secondary); margin-bottom: 0.5rem;">No resources found</h3>
                <p style="color: var(--text-secondary);">Try adjusting your search or filter criteria</p>
            `;

            if (this.resourcesGrid) {
                this.resourcesGrid.appendChild(message);
            }
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

        if (this.loadMoreBtn) {
            this.loadMoreBtn.style.display = 'none';
        }
    }

    addCardAnimations() {
        this.resourceCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    setupCardInteractions() {
        this.resourceCards.forEach(card => {
            if (!card.classList.contains('resource-card--coming-soon')) {
                return;
            }

            const actionBtn = card.querySelector('.btn-outline-primary:not([href])');
            if (actionBtn && actionBtn.disabled) {
                return;
            }

            if (actionBtn) {
                actionBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleAction(card);
                });
            }
        });
    }

    handleDownload(card) {
        const title = card.querySelector('.resource-title').textContent;
        this.showNotification(`Downloading ${title}...`, 'success');

        setTimeout(() => {
            this.showNotification(`${title} downloaded successfully!`, 'success');
        }, 2000);
    }

    handleAction(card) {
        const title = card.querySelector('.resource-title').textContent;
        const actionBtn = card.querySelector('.btn-outline-primary');
        const actionText = actionBtn ? actionBtn.textContent.trim() : '';

        if (actionText.includes('Practice')) {
            this.showNotification(`Starting practice for ${title}...`, 'info');
        } else if (actionText.includes('Listen')) {
            this.showNotification(`Playing audio for ${title}...`, 'info');
        } else if (actionText.includes('Watch')) {
            this.showNotification(`Opening video for ${title}...`, 'info');
        } else if (actionText.includes('Preview')) {
            this.showNotification(`Opening preview for ${title}...`, 'info');
        } else if (actionText.includes('Explore')) {
            this.showNotification(`Exploring ${title}...`, 'info');
        } else if (actionText.includes('Save')) {
            this.showNotification(`${title} saved to favorites!`, 'success');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--card-bg);
            border: 2px solid var(--border-color);
            border-radius: 12px;
            padding: 1rem 1.5rem;
            box-shadow: 0 8px 32px var(--shadow-color);
            z-index: 1050;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const resourcesManager = new ResourcesManager();
    resourcesManager.addCardAnimations();
    resourcesManager.setupCardInteractions();
    window.resourcesManager = resourcesManager;
});
