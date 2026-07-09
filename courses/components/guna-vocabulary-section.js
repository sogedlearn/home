/**
 * Guna Vocabulary Section — dictionary, flashcards & practice
 */
class GunaVocabularySection extends HTMLElement {
    constructor() {
        super();
        this.activeCategory = 'greetings';
        this.searchQuery = '';
        this.mode = 'browse';
        this.practiceIndex = 0;
        this.practiceScore = 0;
        this.practiceWords = [];
        this.reviewQueue = this.loadReviewQueue();
    }

    connectedCallback() {
        this.render();
        this.bindEvents();
    }

    loadReviewQueue() {
        try {
            return JSON.parse(localStorage.getItem('guna_vocab_review') || '[]');
        } catch { return []; }
    }

    saveReviewQueue() {
        localStorage.setItem('guna_vocab_review', JSON.stringify(this.reviewQueue));
    }

    getCategories() {
        return window.GUNA_VOCABULARY?.CATEGORIES || [];
    }

    getFilteredWords() {
        const cats = this.getCategories();
        const cat = cats.find(c => c.id === this.activeCategory) || cats[0];
        if (!cat) return [];
        const q = this.searchQuery.toLowerCase();
        if (!q) return cat.words;
        return cat.words.filter(w =>
            w.guna.toLowerCase().includes(q) ||
            w.es.toLowerCase().includes(q) ||
            w.en.toLowerCase().includes(q)
        );
    }

    getAllWords() {
        return this.getCategories().flatMap(c => c.words);
    }

    speakWord(text) {
        if (!text || !window.speechSynthesis) return;
        const settings = typeof GunaUserData !== 'undefined' ? GunaUserData.getSettings() : {};
        if (settings.audioPlayback === false) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-ES';
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

    startPractice(direction) {
        this.mode = direction;
        this.practiceWords = this.shuffle(this.getFilteredWords()).slice(0, 8);
        this.practiceIndex = 0;
        this.practiceScore = 0;
        this.render();
        this.bindEvents();
    }

    renderBrowse(words) {
        return `
            <div class="vocab-grid" id="vocabGrid">
                ${words.length ? words.map(w => `
                    <article class="vocab-card" data-aos="fade-up">
                        ${w.image ? `<img src="${w.image}" alt="${w.guna}" class="vocab-card-image">` : `<div class="vocab-card-icon">${w.icon || '📝'}</div>`}
                        <h3 class="vocab-guna">${w.guna}</h3>
                        <p class="vocab-es">${w.es}</p>
                        <p class="vocab-en">${w.en}</p>
                        <p class="vocab-example"><em>${w.example || ''}</em></p>
                        <div class="vocab-card-actions">
                            <button type="button" class="vocab-speak-btn" data-speak="${w.guna}" title="Listen">
                                <i class="fas fa-volume-up"></i> Listen
                            </button>
                        </div>
                    </article>
                `).join('') : '<p class="vocab-empty">No words found. Try another search.</p>'}
            </div>`;
    }

    renderFlashcards(words) {
        const w = words[this.practiceIndex] || words[0];
        if (!w) return '<p class="vocab-empty">No words in this category.</p>';
        return `
            <div class="vocab-flashcard-mode">
                <div class="vocab-flashcard" id="vocabFlashcard">
                    <div class="vocab-flash-front">
                        ${w.image ? `<img src="${w.image}" alt="${w.guna}" class="vocab-flashcard-image">` : `<span class="vocab-card-icon">${w.icon || '📝'}</span>`}
                        <h3>${w.guna}</h3>
                        <p>Tap to reveal translation</p>
                    </div>
                    <div class="vocab-flash-back" hidden>
                        <p class="vocab-es">${w.es}</p>
                        <p class="vocab-en">${w.en}</p>
                        <p class="vocab-example"><em>${w.example || ''}</em></p>
                    </div>
                </div>
                <div class="vocab-flash-controls">
                    <button type="button" class="btn-duo" id="flashPrev" ${this.practiceIndex === 0 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>
                    <span>${this.practiceIndex + 1} / ${words.length}</span>
                    <button type="button" class="btn-duo" id="flashNext" ${this.practiceIndex >= words.length - 1 ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>
                    <button type="button" class="vocab-speak-btn" data-speak="${w.guna}"><i class="fas fa-volume-up"></i></button>
                </div>
            </div>`;
    }

    renderPractice(direction) {
        const words = this.practiceWords;
        const w = words[this.practiceIndex];
        if (!w) {
            return `<div class="vocab-practice-result">
                <h3>Practice complete!</h3>
                <p>Score: ${this.practiceScore} / ${words.length}</p>
                <button type="button" class="btn-duo btn-duo-primary" id="retryPractice">Try again</button>
            </div>`;
        }
        const prompt = direction === 'guna-es' ? w.guna : w.es;
        const answer = direction === 'guna-es' ? w.es : w.guna;
        const options = this.shuffle([
            answer,
            ...this.shuffle(this.getAllWords().filter(x => x !== w)).slice(0, 3).map(x => direction === 'guna-es' ? x.es : x.guna)
        ]);
        return `
            <div class="vocab-practice">
                <p class="vocab-practice-label">${direction === 'guna-es' ? 'Guna → Español' : 'Español → Guna'}</p>
                <h3 class="vocab-practice-prompt">${prompt}</h3>
                <div class="vocab-practice-options">
                    ${options.map(opt => `
                        <button type="button" class="vocab-practice-opt" data-answer="${opt}" data-correct="${opt === answer}">${opt}</button>
                    `).join('')}
                </div>
                <p class="vocab-practice-progress">${this.practiceIndex + 1} / ${words.length} · Score: ${this.practiceScore}</p>
            </div>`;
    }

    renderReview() {
        const due = this.reviewQueue.filter(r => r.due <= Date.now());
        if (!due.length) {
            return `<div class="vocab-practice-result">
                <h3>Review queue empty</h3>
                <p>Practice words to add them to your review deck.</p>
            </div>`;
        }
        const item = due[0];
        const w = this.getAllWords().find(x => x.guna === item.guna);
        if (!w) return '<p class="vocab-empty">No review items.</p>';
        const options = this.shuffle([w.es, ...this.shuffle(this.getAllWords().filter(x => x.guna !== w.guna)).slice(0, 3).map(x => x.es)]);
        return `
            <div class="vocab-practice">
                <p class="vocab-practice-label">🔄 Review — What does it mean?</p>
                <h3 class="vocab-practice-prompt">${w.guna}</h3>
                <div class="vocab-practice-options">
                    ${options.map(opt => `
                        <button type="button" class="vocab-review-opt" data-guna="${w.guna}" data-answer="${opt}" data-correct="${opt === w.es}">${opt}</button>
                    `).join('')}
                </div>
                <p class="vocab-practice-progress">${due.length} words due for review</p>
            </div>`;
    }

    render() {
        const cats = this.getCategories();
        const words = this.getFilteredWords();

        this.innerHTML = `
            <div class="vocab-section">
                <header class="vocab-hero" data-aos="fade-up">
                    <h1>📖 Guna Vocabulary</h1>
                    <p>Interactive dictionary — flashcards, pronunciation & practice</p>
                    <div class="vocab-search-wrap">
                        <i class="fas fa-search"></i>
                        <input type="search" class="vocab-search" placeholder="Search Guna, Spanish or English..." id="vocabSearch" value="${this.searchQuery}">
                    </div>
                </header>

                <div class="vocab-modes" role="tablist">
                    <button type="button" class="vocab-mode-btn ${this.mode === 'browse' ? 'active' : ''}" data-mode="browse">📚 Dictionary</button>
                    <button type="button" class="vocab-mode-btn ${this.mode === 'flashcards' ? 'active' : ''}" data-mode="flashcards">🃏 Flashcards</button>
                    <button type="button" class="vocab-mode-btn ${this.mode === 'guna-es' ? 'active' : ''}" data-mode="guna-es">Guna → ES</button>
                    <button type="button" class="vocab-mode-btn ${this.mode === 'es-guna' ? 'active' : ''}" data-mode="es-guna">ES → Guna</button>
                    <button type="button" class="vocab-mode-btn ${this.mode === 'review' ? 'active' : ''}" data-mode="review">🔄 Review</button>
                </div>

                <div class="vocab-categories" role="tablist">
                    ${cats.map(c => `
                        <button type="button" class="vocab-cat-btn ${c.id === this.activeCategory ? 'active' : ''}"
                                data-cat="${c.id}" role="tab">
                            <span>${c.icon}</span> ${c.label}
                            <span class="vocab-cat-count">${c.words.length}</span>
                        </button>
                    `).join('')}
                </div>

                <div class="vocab-mode-content">
                    ${this.mode === 'browse' ? this.renderBrowse(words) : ''}
                    ${this.mode === 'flashcards' ? this.renderFlashcards(words) : ''}
                    ${this.mode === 'guna-es' || this.mode === 'es-guna' ? this.renderPractice(this.mode) : ''}
                    ${this.mode === 'review' ? this.renderReview() : ''}
                </div>

                <div class="vocab-footer-cta">
                    <p>Ready to practice? Go to the Learning Path and complete a level.</p>
                    <button type="button" class="btn-duo btn-duo-primary" id="goToLearnBtn">
                        Start Learning <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
    }

    addToReview(guna) {
        const existing = this.reviewQueue.find(r => r.guna === guna);
        const due = Date.now() + 24 * 60 * 60 * 1000;
        if (existing) {
            existing.due = due;
        } else {
            this.reviewQueue.push({ guna, due });
        }
        this.saveReviewQueue();
    }

    bindEvents() {
        this.querySelector('#vocabSearch')?.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            if (this.mode === 'browse' || this.mode === 'flashcards') {
                this.render();
                this.bindEvents();
            }
        });

        this.querySelectorAll('.vocab-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                if (mode === 'guna-es' || mode === 'es-guna') {
                    this.startPractice(mode);
                } else {
                    this.mode = mode;
                    if (mode === 'flashcards') {
                        this.practiceIndex = 0;
                        this.practiceWords = this.getFilteredWords();
                    }
                    this.render();
                    this.bindEvents();
                }
            });
        });

        this.querySelectorAll('.vocab-cat-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.activeCategory = btn.dataset.cat;
                this.searchQuery = '';
                if (this.mode === 'guna-es' || this.mode === 'es-guna') {
                    this.startPractice(this.mode);
                } else {
                    this.practiceIndex = 0;
                    this.render();
                    this.bindEvents();
                }
            });
        });

        this.querySelectorAll('.vocab-speak-btn').forEach(btn => {
            btn.addEventListener('click', () => this.speakWord(btn.dataset.speak));
        });

        const flashcard = this.querySelector('#vocabFlashcard');
        if (flashcard) {
            flashcard.addEventListener('click', () => {
                const front = flashcard.querySelector('.vocab-flash-front');
                const back = flashcard.querySelector('.vocab-flash-back');
                if (front && back) {
                    const showBack = back.hidden;
                    front.hidden = showBack;
                    back.hidden = !showBack;
                }
            });
        }

        this.querySelector('#flashPrev')?.addEventListener('click', () => {
            if (this.practiceIndex > 0) {
                this.practiceIndex--;
                this.render();
                this.bindEvents();
            }
        });

        this.querySelector('#flashNext')?.addEventListener('click', () => {
            const words = this.getFilteredWords();
            if (this.practiceIndex < words.length - 1) {
                this.practiceIndex++;
                this.render();
                this.bindEvents();
            }
        });

        this.querySelectorAll('.vocab-practice-opt').forEach(btn => {
            btn.addEventListener('click', () => {
                const correct = btn.dataset.correct === 'true';
                btn.classList.add(correct ? 'correct' : 'incorrect');
                if (correct) {
                    this.practiceScore++;
                    const w = this.practiceWords[this.practiceIndex];
                    if (w && typeof GunaGamification !== 'undefined') GunaGamification.recordVocabWord(w.guna);
                } else {
                    const w = this.practiceWords[this.practiceIndex];
                    if (w) this.addToReview(w.guna);
                }
                setTimeout(() => {
                    this.practiceIndex++;
                    this.render();
                    this.bindEvents();
                }, 600);
            });
        });

        this.querySelectorAll('.vocab-review-opt').forEach(btn => {
            btn.addEventListener('click', () => {
                const correct = btn.dataset.correct === 'true';
                const guna = btn.dataset.guna;
                if (correct) {
                    this.reviewQueue = this.reviewQueue.filter(r => r.guna !== guna);
                } else {
                    const item = this.reviewQueue.find(r => r.guna === guna);
                    if (item) item.due = Date.now() + 60 * 60 * 1000;
                }
                this.saveReviewQueue();
                this.render();
                this.bindEvents();
            });
        });

        this.querySelector('#retryPractice')?.addEventListener('click', () => {
            this.startPractice(this.mode);
        });

        this.querySelector('#goToLearnBtn')?.addEventListener('click', () => {
            window.learningHub?.navigateToSection('learn');
        });
    }
}

customElements.define('guna-vocabulary-section', GunaVocabularySection);
