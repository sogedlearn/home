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
            { en: 'I', guna: 'Na', image: '../Multimedia/Images/Memory match/Na.png' },
            { en: 'You', guna: 'Be', image: '../Multimedia/Images/Memory match/Be.jpg' },
            { en: 'Yes', guna: 'Eye', image: '../Multimedia/Images/Memory match/Eye.jpg' },
            { en: 'Hello', guna: 'anna', image: '../Multimedia/Images/Memory match/anna.png' },
            { en: 'Goodbye', guna: 'degi malo', image: '../Multimedia/Images/Memory match/degi malo.jpg' },
            { en: 'Mother', guna: 'Nana', image: '../Multimedia/Images/Memory match/Nana.jpg' },
            { en: 'Father', guna: 'Tata', image: '../Multimedia/Images/Memory match/Tata.jpg' },
            { en: 'Brother', guna: 'Dummad', image: '../Multimedia/Images/Memory match/Dummad.jpg' },
            { en: 'Sister', guna: 'Nueded', image: '../Multimedia/Images/Memory match/Nueded.jpg' },
            { en: 'Grandfather', guna: 'Bab', image: '../Multimedia/Images/Memory match/Bab.png' },
            { en: 'Grandmother', guna: 'Dada', image: '../Multimedia/Images/Memory match/Dada.jpg' },
            { en: 'House', guna: 'Muu', image: '../Multimedia/Images/Memory match/Muu.jpg' },
            { en: 'Table', guna: 'Nika', image: '../Multimedia/Images/Memory match/Nika.jpg' },
            { en: 'Plate', guna: 'Misi', image: '../Multimedia/Images/Memory match/Misi.jpg' },
            { en: 'Spoon', guna: 'Tapa', image: '../Multimedia/Images/Memory match/Tapa.jpg' },
            { en: 'Clothes', guna: 'Bii', image: '../Multimedia/Images/Memory match/Bii.jpg' }
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
            <div class="hub-module">
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
        const words = this.shuffle(this.getWords()).slice(0, config.pairs);
        const grid = this.querySelector('#memoryGrid');
        const memorizationPhase = this.querySelector('#memorizationPhase');
        const victoryEl = this.querySelector('#memoryVictory');
        if (victoryEl) victoryEl.hidden = true;

        const cards = [];
        words.forEach((w, i) => {
            const id = `pair-${i}`;
            cards.push({ pairId: id, type: 'english', label: w.en, image: w.image, language: 'English', revealed: true });
            cards.push({ pairId: id, type: 'indigenous', label: w.guna, image: w.image, language: 'Guna', revealed: true });
        });

        let state = { cards: this.shuffle(cards), flipped: [], moves: 0, matched: 0, lock: true, totalPairs: config.pairs };
        let maxMoves = config.pairs * 4;
        let gameLost = false;

        const renderGrid = () => {
            grid.className = `memory-grid-modern ${config.grid}`;
            grid.innerHTML = state.cards.map((c, i) => `
                <button type="button" class="memory-card-modern ${c.matched ? 'matched' : ''} ${c.error ? 'error' : ''} ${c.revealed ? 'flipped' : ''}"
                        data-idx="${i}" ${c.matched || state.lock && !c.revealed ? 'disabled' : ''}>
                    <div class="card-inner">
                        <div class="card-front guna-card-back" aria-hidden="true">
                            <div class="guna-mola-layer guna-mola-layer--diamonds"></div>
                            <div class="guna-mola-layer guna-mola-layer--circles"></div>
                            <img src="../Multimedia/Images/Soged/mola-icon.png" alt="" class="card-front-mola-emblem" data-no-mola-attribution="true">
                        </div>
                        <div class="card-back ${c.type === 'english' ? 'english-card' : 'indigenous-card'}">
                            ${c.image ? `<img src="${c.image}" alt="${c.label}" class="card-image">` : ''}
                            <span class="card-language">${c.language}</span>
                            <span class="card-word">${c.label}</span>
                        </div>
                    </div>
                </button>
            `).join('');
            this.querySelector('#memoryMoves').textContent = state.moves;
            this.querySelector('#memoryPairs').textContent = state.matched;
        };

        let countdown = 5;
        memorizationPhase.hidden = false;
        this.querySelector('#countdownNumber').textContent = countdown;
        renderGrid();

        this.countdownInterval = setInterval(() => {
            countdown--;
            this.querySelector('#countdownNumber').textContent = countdown;
            this.querySelector('#countdownProgress').style.width = `${(countdown / 5) * 100}%`;
            if (countdown <= 0) {
                clearInterval(this.countdownInterval);
                memorizationPhase.hidden = true;
                state.lock = false;
                state.cards.forEach(c => c.revealed = false);
                state.cards = this.shuffle(state.cards);
                renderGrid();
            }
        }, 1000);

        const showVictory = () => {
            victoryEl.hidden = false;
            victoryEl.innerHTML = `
                <div class="hub-card" style="text-align:center;margin-top:2rem;">
                    <h2>Excellent work!</h2>
                    <p>Moves: ${state.moves} — +${config.reward} Ogods</p>
                    <div id="memoryFinalActions"></div>
                </div>
            `;
            GameRewards.awardOgods(config.reward, 'memory-match');
            HubFlow.renderFinalActions(victoryEl.querySelector('#memoryFinalActions'), {
                nextLabel: 'Next Lesson',
                onNext: () => { this.difficulty = this.difficulty === 'easy' ? 'medium' : this.difficulty === 'medium' ? 'hard' : 'easy'; this.render(); this.startGame(); }
            });
            HubFlow.handleNext();
        };

        const showDefeat = () => {
            gameLost = true;
            GameRewards.loseBurda('memory-match');
            victoryEl.hidden = false;
            victoryEl.innerHTML = `
                <div class="hub-card" style="text-align:center;margin-top:2rem;">
                    <h2>Game Over</h2>
                    <p>Too many moves! You lost 1 Burda.</p>
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
            if (gameLost) return;
            const btn = e.target.closest('.memory-card-modern');
            if (!btn || btn.disabled || state.lock) return;
            const idx = parseInt(btn.dataset.idx, 10);
            const card = state.cards[idx];
            if (!card || card.matched || card.revealed) return;

            card.revealed = true;
            state.flipped.push(idx);
            renderGrid();

            if (state.flipped.length < 2) return;
            state.moves++;
            state.lock = true;
            const [a, b] = state.flipped.map(i => state.cards[i]);

            if (a.pairId === b.pairId) {
                a.matched = true;
                b.matched = true;
                state.matched++;
                state.flipped = [];
                state.lock = false;
                renderGrid();
                if (state.matched >= state.totalPairs) setTimeout(showVictory, 500);
            } else {
                a.error = true;
                b.error = true;
                renderGrid();
                setTimeout(() => {
                    a.revealed = false;
                    b.revealed = false;
                    a.error = false;
                    b.error = false;
                    state.flipped = [];
                    state.lock = false;
                    renderGrid();
                    if (state.moves >= maxMoves && state.matched < state.totalPairs) showDefeat();
                }, 1000);
            }
        };
    }
}

customElements.define('memory-match-game', MemoryMatchGame);
