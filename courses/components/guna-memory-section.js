/**
 * Educational Memory Match game — Spanish to Indigenous Language
 */
class GunaMemorySection extends HTMLElement {
    connectedCallback() {
        this.difficulty = 'medium';
        this.isRevealedPhase = false;
        this.isGameStarted = true;
        this.countdown = 5;
        this.countdownInterval = null;
        this.render();
        this.startGame();
    }

    getDifficultyConfig() {
        const configs = {
            easy: { pairs: 6, grid: 'grid-3x4', reward: 10, timeLimit: null },
            medium: { pairs: 8, grid: 'grid-4x4', reward: 25, timeLimit: null },
            hard: { pairs: 12, grid: 'grid-4x6', reward: 50, timeLimit: 120 } // 2 minutes
        };
        return configs[this.difficulty] || configs.medium;
    }
    getWords() {
        // Direct word pairs with images - English to Guna
        const educationalPairs = [
            { en: 'I', guna: 'Na', icon: '👤', image: '../Images/Memory match/Na.png' },
            { en: 'You', guna: 'Be', icon: '👋', image: '../Images/Memory match/Be.jpg' },
            { en: 'Yes', guna: 'Eye', icon: '✅', image: '../Images/Memory match/Eye.jpg' },
            { en: 'That is right', guna: 'Degii', icon: '👍', image: '../Images/Memory match/Degii.png' },
            { en: 'Hello', guna: 'anna', icon: '🏝️', image: '../Images/Memory match/anna.png' },
            { en: 'Goodbye', guna: 'degi malo', icon: '👋', image: '../Images/Memory match/degi malo.jpg' },
            { en: 'See you tomorrow', guna: 'Banmalo', icon: '🌅', image: '../Images/Memory match/Banmalo.jpg' },
            { en: 'Mother', guna: 'Nana', icon: '👩', image: '../Images/Memory match/Nana.jpg' },
            { en: 'Father', guna: 'Tata', icon: '👨', image: '../Images/Memory match/Tata.jpg' },
            { en: 'Brother', guna: 'Dummad', icon: '👦', image: '../Images/Memory match/Dummad.jpg' },
            { en: 'Sister', guna: 'Nueded', icon: '👧', image: '../Images/Memory match/Nueded.jpg' },
            { en: 'Grandfather', guna: 'Bab', icon: '👴', image: '../Images/Memory match/Bab.png' },
            { en: 'Grandmother', guna: 'Dada', icon: '👵', image: '../Images/Memory match/Dada.jpg' },
            { en: 'House', guna: 'Muu', icon: '🏠', image: '../Images/Memory match/Muu.jpg' },
            { en: 'Table', guna: 'Nika', icon: '🪑', image: '../Images/Memory match/Nika.jpg' },
            { en: 'Plate', guna: 'Misi', icon: '🍽️', image: '../Images/Memory match/Misi.jpg' },
            { en: 'Spoon', guna: 'Tapa', icon: '🥄', image: '../Images/Memory match/Tapa.jpg' },
            { en: 'Clothes', guna: 'Bii', icon: '👕', image: '../Images/Memory match/Bii.jpg' }
        ];
        return educationalPairs;
    }

    speak(text) {
        if (!text || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        u.rate = 0.85;
        window.speechSynthesis.speak(u);
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
        this.innerHTML = `
            <div class="memory-section-modern">
                <header class="memory-hero-modern" data-aos="fade-up">
                    <div class="memory-header-content">
                        <h1 class="memory-title-modern">🧠 Educational Memory Game</h1>
                        <p class="memory-subtitle-modern">Match words in English with their translation in indigenous language</p>
                    </div>
                    <div class="memory-stats-modern">
                        <div class="stat-box">
                            <span class="stat-label">Moves</span>
                            <span class="stat-value" id="memoryMoves">0</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label">Pairs</span>
                            <span class="stat-value"><span id="memoryPairs">0</span> / <span id="memoryTotal">0</span></span>
                        </div>
                    </div>
                </header>

                <div class="memory-controls-modern" data-aos="fade-up" data-aos-delay="100">
                    <div class="difficulty-selector" role="group" aria-label="Difficulty">
                        ${['easy', 'medium', 'hard'].map(d => {
                            const counts = { easy: 6, medium: 8, hard: 12 };
                            const rewards = { easy: 10, medium: 25, hard: 50 };
                            return `<button type="button" class="difficulty-btn ${d === this.difficulty ? 'active' : ''}" data-diff="${d}">
                                ${d.charAt(0).toUpperCase() + d.slice(1)} (${counts[d]} pairs) - 🥥${rewards[d]}
                            </button>`;
                        }).join('')}
                    </div>
                </div>

                <div class="memorization-phase" id="memorizationPhase" hidden>
                    <div class="countdown-container">
                        <div class="countdown-text">Memorize the words:</div>
                        <div class="countdown-number" id="countdownNumber">5</div>
                        <div class="countdown-bar">
                            <div class="countdown-progress" id="countdownProgress"></div>
                        </div>
                    </div>
                </div>

                <div class="memory-game-container" data-aos="fade-up" data-aos-delay="200">
                    <div class="memory-grid-modern" id="memoryGrid"></div>
                </div>

                <div class="memory-feedback-modern" id="memoryFeedback" hidden></div>
                
                <div class="victory-screen" id="victoryScreen" hidden>
                    <div class="victory-content">
                        <img src="../Images/Soged/Newturttle.png" alt="Soggy" class="victory-soggy">
                        <h2 class="victory-title">Excellent work!</h2>
                        <p class="victory-message">You have completed the memory game</p>
                        <div class="victory-stats">
                            <div class="victory-stat">
                                <span class="victory-stat-label">Moves</span>
                                <span class="victory-stat-value" id="victoryMoves">0</span>
                            </div>
                            <div class="victory-reward">
                                <span class="reward-icon">🥥</span>
                                <span class="reward-count" id="rewardCount">+0</span>
                                <span class="reward-text">COCOS</span>
                            </div>
                        </div>
                        <div class="victory-actions">
                            <button class="victory-btn primary" id="nextLevelBtn">
                                <i class="fas fa-arrow-right"></i> Next Level
                            </button>
                            <button class="victory-btn secondary" id="backToMapBtn">
                                <i class="fas fa-map"></i> Back to Map
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.difficulty = btn.dataset.diff;
                this.render();
                this.startGame();
            });
        });

        this.querySelector('#nextLevelBtn')?.addEventListener('click', () => {
            // Increase difficulty if possible
            const difficulties = ['easy', 'medium', 'hard'];
            const currentIndex = difficulties.indexOf(this.difficulty);
            if (currentIndex < difficulties.length - 1) {
                this.difficulty = difficulties[currentIndex + 1];
            }
            this.render();
            this.startGame();
        });

        this.querySelector('#backToMapBtn')?.addEventListener('click', () => {
            window.location.href = '../courses/learning-hub.html';
        });

        this.addEventListener('restart', () => {
            this.render();
            this.startGame();
        });
    }

    startGame() {
        // Clear any existing countdown
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }

        // Get difficulty configuration
        const config = this.getDifficultyConfig();
        const count = config.pairs;
        const words = this.shuffle(this.getWords()).slice(0, count);
        const pairs = words.map((w, i) => ({
            id: `pair-${i}`, en: w.en, guna: w.guna, icon: w.icon, image: w.image
        }));

        const grid = this.querySelector('#memoryGrid');
        const totalEl = this.querySelector('#memoryTotal');
        const victoryScreen = this.querySelector('#victoryScreen');
        const memorizationPhase = this.querySelector('#memorizationPhase');

        // Force hide victory modal on game start
        if (victoryScreen) {
            victoryScreen.hidden = true;
            victoryScreen.style.display = 'none';
        }
        if (totalEl) totalEl.textContent = count;
        if (!grid) return;

        // Reset game state
        this.isRevealedPhase = true;
        this.isGameStarted = false;
        this.countdown = 5;

        // Create cards: English word and Indigenous translation
        const cards = [];
        pairs.forEach(p => {
            cards.push({ pairId: p.id, type: 'english', label: p.en, icon: p.icon, image: p.image, language: 'English', revealed: true });
            cards.push({ pairId: p.id, type: 'indigenous', label: p.guna, icon: p.icon, image: p.image, language: 'Guna', revealed: true });
        });

        let state = {
            cards: this.shuffle(cards),
            flipped: [],
            moves: 0,
            matched: 0,
            lock: true, // Lock during memorization phase
            totalPairs: count,
            errorCards: []
        };

        const renderGrid = () => {
            // Use difficulty-specific grid
            grid.className = `memory-grid-modern ${config.grid}`;
            
            grid.innerHTML = state.cards.map((c, i) => `
                <button type="button" 
                        class="memory-card-modern ${c.matched ? 'matched' : ''} ${c.error ? 'error' : ''} ${c.revealed ? 'flipped' : ''}" 
                        data-idx="${i}" 
                        aria-label="Memory card: ${c.label}" 
                        ${c.matched || !this.isGameStarted ? 'disabled' : ''}>
                    <div class="card-inner">
                        <div class="card-front">
                            <div class="mola-pattern"></div>
                        </div>
                        <div class="card-back ${c.type === 'english' ? 'english-card' : 'indigenous-card'}">
                            ${c.image ? `<img src="${c.image}" alt="${c.label}" class="card-image">` : ''}
                            <span class="card-language">${c.language}</span>
                            <span class="card-word">${c.label}</span>
                            ${c.matched ? '<span class="checkmark">✓</span>' : ''}
                        </div>
                    </div>
                </button>
            `).join('');
            
            const movesEl = this.querySelector('#memoryMoves');
            const pairsEl = this.querySelector('#memoryPairs');
            if (movesEl) movesEl.textContent = state.moves;
            if (pairsEl) pairsEl.textContent = state.matched;
        };

        const startMemorizationPhase = () => {
            memorizationPhase.hidden = false;
            const countdownNumber = this.querySelector('#countdownNumber');
            const countdownProgress = this.querySelector('#countdownProgress');
            
            // Show all cards revealed
            state.cards.forEach(c => c.revealed = true);
            renderGrid();

            // Start countdown
            this.countdown = 5;
            countdownNumber.textContent = this.countdown;
            countdownProgress.style.width = '100%';

            this.countdownInterval = setInterval(() => {
                this.countdown--;
                countdownNumber.textContent = this.countdown;
                countdownProgress.style.width = `${(this.countdown / 5) * 100}%`;

                if (this.countdown <= 0) {
                    clearInterval(this.countdownInterval);
                    endMemorizationPhase();
                }
            }, 1000);
        };

        const endMemorizationPhase = () => {
            memorizationPhase.hidden = true;
            this.isRevealedPhase = false;
            this.isGameStarted = true;
            state.lock = false;

            // Flip all cards simultaneously
            state.cards.forEach(c => c.revealed = false);
            
            // Shuffle cards again after memorization phase
            state.cards = this.shuffle(state.cards);
            
            renderGrid();

            // Play sound if available
            if (typeof playGameSound === 'function') {
                playGameSound('start');
            }
        };

        const onWin = () => {
            const victoryScreen = this.querySelector('#victoryScreen');
            const victoryMoves = this.querySelector('#victoryMoves');
            const rewardCount = this.querySelector('#rewardCount');
            const config = this.getDifficultyConfig();
            
            if (victoryScreen) {
                victoryScreen.hidden = false;
                if (victoryMoves) victoryMoves.textContent = state.moves;
            }

            // Animate Cocos reward
            if (rewardCount) {
                let currentCount = 0;
                const targetCount = config.reward;
                const duration = 1500;
                const increment = targetCount / (duration / 16);
                
                const animateCocos = () => {
                    currentCount += increment;
                    if (currentCount >= targetCount) {
                        currentCount = targetCount;
                        rewardCount.textContent = `+${currentCount}`;
                    } else {
                        rewardCount.textContent = `+${Math.floor(currentCount)}`;
                        requestAnimationFrame(animateCocos);
                    }
                };
                animateCocos();
            }

            // Award cocos via Supabase
            this.updateCocosInSupabase(config.reward);

            // Award oggob locally if economy system exists
            if (typeof CocosEconomy !== 'undefined') {
                CocosEconomy.addOggob(config.reward);
                CocosEconomy.triggerConfetti();
            }

            if (typeof GunaGamification !== 'undefined') {
                GunaGamification.onMemoryGameComplete(state.moves <= state.totalPairs + 2);
            }
        };

        const updateCocosInSupabase = async (amount) => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) return;

                const response = await fetch('/api/update-cocos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId, amount })
                });

                if (response.ok) {
                    console.log('Cocos updated successfully in Supabase');
                }
            } catch (error) {
                console.error('Error updating Cocos:', error);
            }
        };

        grid.onclick = (e) => {
            const btn = e.target.closest('.memory-card-modern');
            if (!btn || btn.disabled || state.lock) return;
            
            const idx = parseInt(btn.dataset.idx, 10);
            const card = state.cards[idx];
            if (!card || card.matched || card.revealed) return;

            card.revealed = true;
            state.flipped.push(idx);
            this.speak(card.label);
            renderGrid();

            if (state.flipped.length < 2) return;

            state.moves++;
            state.lock = true;
            const [a, b] = state.flipped.map(i => state.cards[i]);

            if (a.pairId === b.pairId) {
                // Match found - show success
                a.matched = true;
                b.matched = true;
                state.matched++;
                state.flipped = [];
                state.lock = false;
                renderGrid();
                
                if (state.matched >= state.totalPairs) {
                    setTimeout(onWin, 500);
                }
            } else {
                // No match - show error then flip back after 1 second
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
                }, 1000);
            }
        };

        // Start the memorization phase
        startMemorizationPhase();
    }
}

customElements.define('guna-memory-section', GunaMemorySection);
