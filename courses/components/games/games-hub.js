/**
 * Games Hub — unified entry for Memory Match, Mola Puzzle, Word Search
 */
class GamesHub extends HTMLElement {
    connectedCallback() {
        this.activeGame = this.getAttribute('game') || this.parseGameFromHash() || null;
        this.render();
    }

    parseGameFromHash() {
        const hash = window.location.hash.replace('#', '');
        const match = hash.match(/^games\/(\w+)/);
        return match ? match[1] : null;
    }

    static get observedAttributes() {
        return ['game'];
    }

    attributeChangedCallback(name, _old, value) {
        if (name === 'game' && this.isConnected) {
            this.activeGame = value || null;
            this.render();
        }
    }

    getGames() {
        const t = (k) => typeof GunaI18n !== 'undefined' ? GunaI18n.t(k) : k;
        return [
            { id: 'memory', title: t('memoryMatch'), icon: '🧠', desc: t('memoryDesc'), tag: 'memory-match-game' },
            { id: 'puzzle', title: t('molaPuzzle'), icon: '🧩', desc: t('puzzleDesc'), tag: 'mola-puzzle-game' },
            { id: 'wordsearch', title: t('wordSearch'), icon: '🔤', desc: t('wordsearchDesc'), tag: 'word-search-game' }
        ];
    }

    render() {
        if (this.activeGame) {
            const game = this.getGames().find(g => g.id === this.activeGame);
            this.innerHTML = `
                <div class="hub-module games-hub-active">
                    <button class="hub-btn hub-btn-secondary" id="backToGamesHub" style="margin-bottom:1.5rem;">
                        <i class="fas fa-arrow-left"></i> ${typeof GunaI18n !== 'undefined' ? GunaI18n.t('backToGames') : 'Back to Games'}
                    </button>
                    <${game.tag}></${game.tag}>
                </div>
            `;
            this.querySelector('#backToGamesHub')?.addEventListener('click', () => {
                this.activeGame = null;
                if (window.learningHub) {
                    window.learningHub.navigateToSection('games');
                } else {
                    window.location.hash = 'games';
                }
                HubFlow.handleNext();
                this.render();
            });
            return;
        }

        this.innerHTML = `
            <div class="hub-module games-hub">
                <header>
                    <h1 class="hub-section-title">${typeof GunaI18n !== 'undefined' ? GunaI18n.t('gamesHub') : 'Games Hub'}</h1>
                    <p class="hub-section-subtitle">${typeof GunaI18n !== 'undefined' ? GunaI18n.t('gamesHubSub') : 'Play minigames to practice Guna vocabulary and culture. Win Oggob, but lose 1 Burba on failure.'}</p>
                </header>
                <div class="games-hub-grid">
                    ${this.getGames().map(g => `
                        <div class="hub-card game-hub-card" data-game="${g.id}">
                            <div class="game-icon">${g.icon}</div>
                            <h3>${g.title}</h3>
                            <p style="opacity:0.75;font-size:0.9rem;">${g.desc}</p>
                            <button class="hub-btn hub-btn-primary" style="margin-top:1rem;">${typeof GunaI18n !== 'undefined' ? GunaI18n.t('play') : 'Play'}</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        this.querySelectorAll('.game-hub-card').forEach(card => {
            card.addEventListener('click', () => {
                if (!GameRewards.canPlay()) {
                    GameRewards.showNoLivesMessage(this);
                    return;
                }
                this.activeGame = card.dataset.game;
                HubFlow.trackActivity('game', card.dataset.game);
                HubFlow.handleNext();
                this.render();
            });
        });
    }
}

customElements.define('games-hub', GamesHub);
