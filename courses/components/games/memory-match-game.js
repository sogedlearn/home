/**
 * Memory Match Game — 5s preview → flip → match → Ogods reward
 */
class MemoryMatchGame extends HTMLElement {
    connectedCallback() {
        this.difficulty = 'medium';
        this.countdownInterval = null;
        this.render();
        this.startGame();
    }

    getDifficultyConfig() {
        const configs = {
            easy: { pairs: 6, grid: 'grid-3x4', reward: 10 },
            medium: { pairs: 8, grid: 'grid-4x4', reward: 25 },
            hard: { pairs: 12, grid: 'grid-4x6', reward: 50 }
        };
        return configs[this.difficulty] || configs.medium;
    }

    getWords() {
        return [
            { en: 'I', guna: 'Na', image: '../Multimedia/Images/Memory match/Na.png', icon: '👤' },
            { en: 'You', guna: 'Be', image: '../Multimedia/Images/Memory match/Be.jpg', icon: '🫵' },
            { en: 'Yes', guna: 'Eye', image: '../Multimedia/Images/Memory match/Eye.jpg', icon: '✅' },
            { en: 'Hello', guna: 'anna', image: '../Multimedia/Images/Memory match/anna.png', icon: '👋' },
            { en: 'Goodbye', guna: 'degi malo', image: '../Multimedia/Images/Memory match/degi malo.jpg', icon: '🤚' },
            { en: 'Mother', guna: 'Nana', image: '../Multimedia/Images/Memory match/Nana.jpg', icon: '👩' },
            { en: 'Father', guna: 'Tata', image: '../Multimedia/Images/Memory match/Tata.jpg', icon: '👨' },
            { en: 'Brother', guna: 'Dummad', image: '../Multimedia/Images/Memory match/Dummad.jpg', icon: '👦' },
            { en: 'Sister', guna: 'Nueded', image: '../Multimedia/Images/Memory match/Nueded.jpg', icon: '👧' },
            { en: 'Grandfather', guna: 'Bab', image: '../Multimedia/Images/Memory match/Bab.png', icon: '👴' },
            { en: 'Grandmother', guna: 'Dada', image: '../Multimedia/Images/Memory match/Dada.jpg', icon: '👵' },
            { en: 'House', guna: 'Muu', image: '../Multimedia/Images/Memory match/Muu.jpg', icon: '🏠' },
            { en: 'Table', guna: 'Nika', image: '../Multimedia/Images/Memory match/Nika.jpg', icon: '🪵' },
            { en: 'Plate', guna: 'Misi', image: '../Multimedia/Images/Memory match/Misi.jpg', icon: '🍽️' },
            { en: 'Spoon', guna: 'Tapa', image: '../Multimedia/Images/Memory match/Tapa.jpg', icon: '🥄' },
            { en: 'Clothes', guna: 'Bii', image: '../Multimedia/Images/Memory match/Bii.jpg', icon: '👕' }
        ];
    }

    shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    render() {
        const config = this.getDifficultyConfig();
        this.innerHTML = `
            <div class="hub-module games-mola-shell">
                <h2 class="hub-section-title">Memory Match</h2>
                <p class="hub-section-subtitle">Memorize cards for 5 seconds, then find matching pairs.</p>
                <div class="hub-tabs" style="margin-bottom:1rem;">
                    ${['easy', 'medium', 'hard'].map(d => `
                        <button type="button" class="hub-tab ${d === this.difficulty ? 'active' : ''}" data-diff="${d}">
                            ${d.charAt(0).toUpperCase() + d.slice(1)} — +${({ easy: 10, medium: 25, hard: 50 })[d]} Ogods
                        </button>
                    `).join('')}
                </div>
                <div class="hub-card" style="text-align:center;margin-bottom:1rem;" id="memorizationPhase" hidden>
                    <p style="font-weight:600;">Memorize the words!</p>
                    <div id="countdownNumber" style="font-size:3rem;font-weight:700;">5</div>
                    <div class="hub-progress-bar"><div class="hub-progress-fill" id="countdownProgress" style="width:100%"></div></div>
                </div>
                <div style="display:flex;gap:2rem;justify-content:center;margin-bottom:1rem;">
                    <span>Moves: <strong id="memoryMoves">0</strong></span>
                    <span>Pairs: <strong id="memoryPairs">0</strong> / <span id="memoryTotal">${config.pairs}</span></span>
                    <span>Lives: <strong id="memoryLives">${typeof GunaLives !== 'undefined' ? GunaLives.getLives() : 5}</strong></span>
                </div>
                <div class="memory-grid-modern ${config.grid}" id="memoryGrid"></div>
                <div id="memoryVictory" hidden></div>
            </div>
        `;

        this.querySelectorAll('[data-diff]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.difficulty = btn.dataset.diff;
                if (this.countdownInterval) clearInterval(this.countdownInterval);
                this.render();
                this.startGame();
            });
        });
    }

    startGame() {
        const config = this.getDifficultyConfig();
        const engineApi = window.MemoryMatchEngine;
        const words = this.shuffle(this.getWords()).slice(0, config.pairs);
        const grid = this.querySelector('#memoryGrid');
        const memorizationPhase = this.querySelector('#memorizationPhase');
        const victoryEl = this.querySelector('#memoryVictory');
        if (victoryEl) victoryEl.hidden = true;

        const cards = [];
        words.forEach((w, i) => {
            const id = `pair-${i}`;
            cards.push({ pairId: id, type: 'english', label: w.en, image: w.image, icon: w.icon, language: 'English' });
            cards.push({ pairId: id, type: 'indigenous', label: w.guna, image: w.image, icon: w.icon, language: 'Guna' });
        });

        const initialLives = typeof GunaLives !== 'undefined' ? GunaLives.getLives() : 5;
        const sessionId = `mm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        let settled = false;

        let previewCards = this.shuffle(cards).map((c) => ({ ...c, revealed: true, matched: false }));
        let state = engineApi
            ? engineApi.createMemoryMatchEngine({ cards: this.shuffle(cards), lives: initialLives })
            : { cards: this.shuffle(cards).map((c) => ({ ...c, revealed: false, matched: false })), flipped: [], lives: initialLives, lock: true, status: 'playing', moves: 0, matchedPairs: 0, totalPairs: config.pairs };

        state.lock = true;
        state.cards.forEach((c) => { c.revealed = true; });

        const renderGrid = (displayCards = state.cards) => {
            grid.className = `memory-grid-modern ${config.grid}`;
            grid.innerHTML = displayCards.map((c, i) => `
                <button type="button" class="memory-card-modern ${c.matched ? 'matched' : ''} ${c.error ? 'error' : ''} ${c.revealed ? 'flipped' : ''}"
                        data-idx="${i}" ${c.matched || state.lock && !c.revealed || state.status !== 'playing' ? 'disabled' : ''}>
                    <div class="card-inner">
                        <div class="card-front guna-card-back" aria-hidden="true">
                            <div class="guna-mola-layer guna-mola-layer--diamonds"></div>
                            <div class="guna-mola-layer guna-mola-layer--circles"></div>
                            <span class="card-front-mola-mark" aria-hidden="true">◆</span>
                        </div>
                        <div class="card-back ${c.type === 'english' ? 'english-card' : 'indigenous-card'}">
                            ${c.image ? `<img src="${c.image}" alt="${c.label}" class="card-image" onerror="this.classList.add('is-broken')">` : ''}
                            <span class="card-fallback">${c.icon || '◆'}</span>
                            <span class="card-language">${c.language}</span>
                            <span class="card-word">${c.label}</span>
                        </div>
                    </div>
                </button>
            `).join('');
            const movesEl = this.querySelector('#memoryMoves');
            const pairsEl = this.querySelector('#memoryPairs');
            const livesEl = this.querySelector('#memoryLives');
            if (movesEl) movesEl.textContent = state.moves;
            if (pairsEl) pairsEl.textContent = state.matchedPairs ?? state.matched ?? 0;
            if (livesEl) livesEl.textContent = state.lives;
        };

        let countdown = 5;
        memorizationPhase.hidden = false;
        this.querySelector('#countdownNumber').textContent = countdown;
        renderGrid(previewCards);

        this.countdownInterval = setInterval(() => {
            countdown--;
            this.querySelector('#countdownNumber').textContent = countdown;
            this.querySelector('#countdownProgress').style.width = `${(countdown / 5) * 100}%`;
            if (countdown <= 0) {
                clearInterval(this.countdownInterval);
                memorizationPhase.hidden = true;
                state.lock = false;
                state.cards = this.shuffle(state.cards.map((c) => ({ ...c, revealed: false, matched: false })));
                state.flipped = [];
                renderGrid();
            }
        }, 1000);

        const settle = (won) => {
            if (settled) return;
            settled = true;
            const livesLost = Math.max(0, initialLives - state.lives);
            GameRewards.settleGame({
                source: 'memory-match',
                sessionId,
                ogods: won ? config.reward : 0,
                burdaDelta: -livesLost
            });
            if (won && typeof GunaGamification !== 'undefined') {
                GunaGamification.onMemoryGameComplete(state.mismatches === 0);
            }
        };

        const showVictory = () => {
            settle(true);
            victoryEl.hidden = false;
            victoryEl.innerHTML = `
                <div class="hub-card" style="text-align:center;margin-top:2rem;">
                    <h2>Excellent work!</h2>
                    <p>Moves: ${state.moves} — +${config.reward} Ogods</p>
                    <div id="memoryFinalActions"></div>
                </div>
            `;
            HubFlow.renderFinalActions(victoryEl.querySelector('#memoryFinalActions'), {
                nextLabel: 'Next Lesson',
                onNext: () => { this.difficulty = this.difficulty === 'easy' ? 'medium' : this.difficulty === 'medium' ? 'hard' : 'easy'; this.render(); this.startGame(); }
            });
            HubFlow.handleNext();
        };

        const showDefeat = () => {
            settle(false);
            victoryEl.hidden = false;
            victoryEl.innerHTML = `
                <div class="hub-card" style="text-align:center;margin-top:2rem;">
                    <h2>Game Over</h2>
                    <p>No lives left. You lost ${Math.max(0, initialLives - state.lives)} Burda.</p>
                    <div id="memoryFinalActions"></div>
                </div>
            `;
            HubFlow.renderFinalActions(victoryEl.querySelector('#memoryFinalActions'), {
                nextLabel: 'Try Again',
                onNext: () => { this.render(); this.startGame(); }
            });
            HubFlow.handleNext();
        };

        grid.onclick = (e) => {
            if (state.status !== 'playing') return;
            const btn = e.target.closest('.memory-card-modern');
            if (!btn) return;
            const idx = parseInt(btn.dataset.idx, 10);

            if (engineApi) {
                const next = engineApi.flipCard(state, idx);
                if (next.lastResult?.error) return;
                state = next;
                if (state.lastResult?.match === false) {
                    state.cards[state.flipped[0]].error = true;
                    state.cards[state.flipped[1]].error = true;
                    renderGrid();
                    setTimeout(() => {
                        state = engineApi.resolveMismatch(state);
                        renderGrid();
                        if (state.status === 'lost') showDefeat();
                    }, 800);
                    return;
                }
                renderGrid();
                if (state.status === 'won') setTimeout(showVictory, 400);
                return;
            }

            if (state.lock || state.flipped.length >= 2) return;
            const card = state.cards[idx];
            if (!card || card.matched || card.revealed) return;
            card.revealed = true;
            state.flipped.push(idx);
            renderGrid();
            if (state.flipped.length < 2) return;
            state.moves++;
            state.lock = true;
            const [a, b] = state.flipped.map((i) => state.cards[i]);
            if (a.pairId === b.pairId) {
                a.matched = true;
                b.matched = true;
                state.matchedPairs = (state.matchedPairs || 0) + 1;
                state.flipped = [];
                state.lock = false;
                renderGrid();
                if (state.matchedPairs >= state.totalPairs) {
                    state.status = 'won';
                    setTimeout(showVictory, 400);
                }
            } else {
                a.error = true;
                b.error = true;
                state.lives = Math.max(0, state.lives - 1);
                renderGrid();
                setTimeout(() => {
                    a.revealed = false;
                    b.revealed = false;
                    a.error = false;
                    b.error = false;
                    state.flipped = [];
                    state.lock = false;
                    renderGrid();
                    if (state.lives <= 0) {
                        state.status = 'lost';
                        showDefeat();
                    }
                }, 800);
            }
        };
    }
}

customElements.define('memory-match-game', MemoryMatchGame);
