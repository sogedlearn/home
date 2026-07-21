/**
 * My Bookshelf — interactive wooden shelf library with detail panel & quizzes
 */
class MyBookshelf extends HTMLElement {
    connectedCallback() {
        this.context = this.getAttribute('context') || 'readings';
        this.selectedBook = null;
        this.detailView = 'info'; // info | quiz | quiz-result
        this.quizIndex = 0;
        this.quizScore = 0;
        this.selectedAnswer = null;
        this.render();
        this.bindGlobalEvents();
    }

    getBooks() {
        return typeof BookshelfStore !== 'undefined'
            ? BookshelfStore.getBooks(this.context)
            : [];
    }

    renderStars(rating) {
        if (!rating) {
            return '<span style="color:rgba(0,0,0,0.25);font-size:0.75rem;">Not rated yet</span>';
        }
        const full = Math.floor(rating);
        const half = rating - full >= 0.5;
        let html = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= full) html += '<i class="fas fa-star"></i>';
            else if (i === full + 1 && half) html += '<i class="fas fa-star-half-alt"></i>';
            else html += '<i class="far fa-star" style="opacity:0.35"></i>';
        }
        return html + `<span class="rating-num">${rating.toFixed(1)}</span>`;
    }

    renderShelfRow(shelf, books) {
        const shelfBooks = books.filter(b => b.shelf === shelf.id);
        const count = shelfBooks.length;
        const label = shelf.subtitle ? `${shelf.label} <span style="font-weight:400;letter-spacing:0;text-transform:none;font-size:0.7rem;opacity:0.6">/ ${shelf.subtitle}</span>` : shelf.label;

        return `
            <div class="bookshelf-row" data-shelf="${shelf.id}">
                <div class="bookshelf-row-header">
                    <div class="bookshelf-row-label">${shelf.icon} ${label}</div>
                    <div class="bookshelf-row-count"><span>${count}</span> book${count !== 1 ? 's' : ''} ›</div>
                </div>
                <div class="bookshelf-plank">
                    <div class="bookshelf-books">
                        ${count === 0
                            ? '<p class="bookshelf-empty">No books on this shelf yet</p>'
                            : shelfBooks.map(book => this.renderBookCover(book)).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderBookCover(book) {
        return `
            <button type="button" class="bookshelf-book" data-book-id="${book.id}" aria-label="Open ${book.title}">
                <img src="${book.cover}" alt="${book.title}" class="bookshelf-book-cover"
                     onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                <div class="bookshelf-book-cover bookshelf-book-cover--placeholder" style="display:none" aria-hidden="true">
                    <i class="fas fa-book"></i>
                </div>
            </button>
        `;
    }

    getLivesCount() {
        if (typeof GunaLives !== 'undefined') {
            return GunaLives.getState().lives;
        }
        return 5;
    }

    renderDetailPanel() {
        if (!this.selectedBook) return '';

        const book = this.selectedBook;
        const quiz = BookshelfStore.getQuizForBook(book);
        const quizDone = BookshelfStore.isQuizCompleted(book.id);
        const notes = BookshelfStore.getBookNotes(book.id);
        const lives = this.getLivesCount();

        let bodyContent = '';

        if (this.detailView === 'quiz' && quiz) {
            bodyContent = this.renderQuizView(quiz);
        } else if (this.detailView === 'quiz-result') {
            bodyContent = this.renderQuizResultView(quiz);
        } else {
            bodyContent = this.renderInfoView(book, quiz, quizDone, notes);
        }

        return `
            <div class="bookshelf-detail-overlay ${this.selectedBook ? 'is-open' : ''}" id="bookshelfOverlay">
                <div class="bookshelf-detail-panel" role="dialog" aria-modal="true" aria-labelledby="bookshelfDetailTitle">
                    <div class="bookshelf-detail-topbar">
                        <button type="button" class="bookshelf-detail-close" id="bookshelfCloseBtn" aria-label="Close">&times;</button>
                        <div class="bookshelf-lives-badge" title="Burda lives remaining">
                            ${Array.from({ length: lives }, () => '<img src="../Multimedia/Images/Soged/Burba.png" alt="">').join('')}
                            <span>${lives} Burda${lives !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                    <div class="bookshelf-detail-body">
                        ${bodyContent}
                    </div>
                </div>
            </div>
        `;
    }

    renderInfoView(book, quiz, quizDone, notes) {
        const shelfLabel = { read: 'Completed', tbr: 'To Be Read', dnf: 'Did Not Finish' }[book.shelf] || book.shelf;

        return `
            <div class="bookshelf-detail-hero">
                <img src="${book.cover}" alt="${book.title}" class="bookshelf-detail-cover"
                     onerror="this.src='../Multimedia/Images/Soged/Soged.jpg'">
                <div class="bookshelf-detail-meta">
                    <h3 id="bookshelfDetailTitle">${book.title}</h3>
                    <p class="bookshelf-detail-author">by ${book.author}</p>
                    <div class="bookshelf-detail-stars">${this.renderStars(book.rating)}</div>
                    <div class="bookshelf-genre-tags">
                        ${book.genres.map(g => `<span class="bookshelf-genre-tag">${g}</span>`).join('')}
                    </div>
                </div>
            </div>

            <div class="bookshelf-status-bar">
                <div class="bookshelf-status-item">
                    <label>Status</label>
                    <span>${shelfLabel}</span>
                </div>
                <div class="bookshelf-status-item">
                    <label>Format</label>
                    <span>${book.format}</span>
                </div>
                <div class="bookshelf-status-item">
                    <label>Reward</label>
                    <span>+${book.ogodsReward} Ogods</span>
                </div>
            </div>

            <div class="bookshelf-card">
                <h4>Notes & Reflections</h4>
                <textarea class="bookshelf-notes-area" id="bookshelfNotes" placeholder="Write your reading notes and reflections here...">${notes}</textarea>
                <button type="button" class="bookshelf-notes-save" id="bookshelfSaveNotes">Save notes</button>
            </div>

            <div class="bookshelf-card">
                <h4>Reading Comprehension</h4>
                ${quiz ? (
                    quizDone
                        ? `<p class="bookshelf-quiz-complete"><i class="fas fa-check-circle"></i> Quiz completed — Ogods earned!</p>`
                        : `<button type="button" class="bookshelf-quiz-btn" id="bookshelfStartQuiz">
                            <i class="fas fa-question-circle"></i> Take Comprehension Quiz (+${book.ogodsReward} Ogods)
                           </button>`
                ) : `<p style="font-size:0.85rem;color:rgba(0,0,0,0.45);margin:0;">Quiz coming soon for this title.</p>`}
            </div>

            ${book.shelf === 'read' ? `
                <div class="bookshelf-recommend-tape">
                    <i class="fas fa-heart" style="color:#e8756a;margin-right:0.35rem"></i>
                    would recommend to a friend!
                </div>
            ` : ''}
        `;
    }

    renderQuizView(quiz) {
        const q = quiz[this.quizIndex];
        const total = quiz.length;
        const progress = ((this.quizIndex + 1) / total) * 100;

        return `
            <button type="button" class="bookshelf-detail-close" id="bookshelfQuizBack" style="position:static;margin-bottom:1rem;background:rgba(0,0,0,0.06);width:auto;padding:0.4rem 0.75rem;border-radius:8px;font-size:0.8rem;">
                <i class="fas fa-arrow-left"></i> Back
            </button>
            <p style="font-size:0.75rem;color:rgba(0,0,0,0.45);margin:0 0 0.5rem;">Question ${this.quizIndex + 1} of ${total}</p>
            <div class="bookshelf-quiz-progress"><div class="bookshelf-quiz-progress-fill" style="width:${progress}%"></div></div>
            <div class="bookshelf-quiz-view">
                <p class="bookshelf-quiz-question">${q.question}</p>
                <div class="bookshelf-quiz-options" id="bookshelfQuizOptions">
                    ${q.options.map((opt, i) => `
                        <button type="button" class="bookshelf-quiz-option ${this.selectedAnswer === i ? 'selected' : ''}" data-index="${i}">${opt}</button>
                    `).join('')}
                </div>
                <button type="button" class="bookshelf-quiz-next" id="bookshelfQuizNext" ${this.selectedAnswer === null ? 'disabled' : ''}>
                    ${this.quizIndex >= total - 1 ? 'See Results' : 'Next'}
                </button>
            </div>
        `;
    }

    renderQuizResultView(quiz) {
        const total = quiz ? quiz.length : 0;
        const perfect = this.quizScore === total;
        const reward = this.selectedBook.ogodsReward;

        return `
            <div class="bookshelf-quiz-result">
                <div class="bookshelf-quiz-result-icon">${perfect ? '🏆' : '📖'}</div>
                <h4 style="color:#000;margin:0 0 0.35rem;">${perfect ? 'Excellent!' : 'Good Effort!'}</h4>
                <p style="font-size:0.9rem;color:rgba(0,0,0,0.6);margin:0 0 0.75rem;">You scored ${this.quizScore} / ${total}</p>
                ${perfect
                    ? `<p style="font-weight:700;color:#11802b;margin:0;">+${reward} Ogods earned!</p>`
                    : `<p style="font-size:0.85rem;color:rgba(0,0,0,0.55);margin:0;">Review the reading and try again. −1 Burda applied.</p>`}
                <button type="button" class="bookshelf-quiz-next" id="bookshelfQuizDone" style="margin-top:1.25rem;">Back to Book</button>
            </div>
        `;
    }

    render() {
        const books = this.getBooks();
        const shelves = BookshelfStore.SHELVES;

        this.innerHTML = `
            <div class="my-bookshelf">
                <div class="my-bookshelf-inner">
                    <header class="my-bookshelf-header">
                        <h2>my bookshelf</h2>
                        <p>Your personal reading library — tap a cover to explore</p>
                    </header>
                    ${shelves.map(shelf => this.renderShelfRow(shelf, books)).join('')}
                </div>
            </div>
            ${this.renderDetailPanel()}
        `;

        this.bindShelfEvents();
        if (this.selectedBook) this.bindDetailEvents();
    }

    bindGlobalEvents() {
        this._keydownHandler = (e) => {
            if (e.key === 'Escape' && this.selectedBook) this.closeDetail();
        };
        document.addEventListener('keydown', this._keydownHandler);
    }

    disconnectedCallback() {
        document.removeEventListener('keydown', this._keydownHandler);
    }

    bindShelfEvents() {
        this.querySelectorAll('.bookshelf-book').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.bookId;
                this.selectedBook = this.getBooks().find(b => b.id === id);
                this.detailView = 'info';
                this.quizIndex = 0;
                this.quizScore = 0;
                this.selectedAnswer = null;
                this.render();
            });
        });
    }

    closeDetail() {
        this.selectedBook = null;
        this.detailView = 'info';
        this.render();
    }

    bindDetailEvents() {
        this.querySelector('#bookshelfCloseBtn')?.addEventListener('click', () => this.closeDetail());
        this.querySelector('#bookshelfOverlay')?.addEventListener('click', (e) => {
            if (e.target.id === 'bookshelfOverlay') this.closeDetail();
        });

        this.querySelector('#bookshelfSaveNotes')?.addEventListener('click', () => {
            const notes = this.querySelector('#bookshelfNotes')?.value || '';
            BookshelfStore.setBookNotes(this.selectedBook.id, notes);
            const btn = this.querySelector('#bookshelfSaveNotes');
            if (btn) {
                btn.textContent = 'Saved!';
                setTimeout(() => { btn.textContent = 'Save notes'; }, 1500);
            }
        });

        this.querySelector('#bookshelfStartQuiz')?.addEventListener('click', () => {
            if (typeof GameRewards !== 'undefined' && !GameRewards.canPlay()) {
                GameRewards.showNoLivesMessage(this.querySelector('.bookshelf-detail-body'));
                return;
            }
            this.detailView = 'quiz';
            this.quizIndex = 0;
            this.quizScore = 0;
            this.selectedAnswer = null;
            this.render();
        });

        this.querySelector('#bookshelfQuizBack')?.addEventListener('click', () => {
            this.detailView = 'info';
            this.render();
        });

        this.querySelectorAll('.bookshelf-quiz-option').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectedAnswer = parseInt(btn.dataset.index, 10);
                this.querySelectorAll('.bookshelf-quiz-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                const next = this.querySelector('#bookshelfQuizNext');
                if (next) next.disabled = false;
            });
        });

        this.querySelector('#bookshelfQuizNext')?.addEventListener('click', () => {
            const quiz = BookshelfStore.getQuizForBook(this.selectedBook);
            if (!quiz) return;

            if (this.selectedAnswer === quiz[this.quizIndex].correct) this.quizScore++;

            if (this.quizIndex >= quiz.length - 1) {
                this.detailView = 'quiz-result';
                this.processQuizRewards();
            } else {
                this.quizIndex++;
                this.selectedAnswer = null;
            }
            this.render();
        });

        this.querySelector('#bookshelfQuizDone')?.addEventListener('click', () => {
            this.detailView = 'info';
            this.render();
        });
    }

    async processQuizRewards() {
        const book = this.selectedBook;
        const quiz = BookshelfStore.getQuizForBook(book);
        if (!quiz) return;

        const total = quiz.length;
        const perfect = this.quizScore === total;
        const alreadyDone = BookshelfStore.isQuizCompleted(book.id);

        if (perfect && !alreadyDone) {
            BookshelfStore.markQuizCompleted(book.id, this.quizScore, total);
            if (typeof GameRewards !== 'undefined') {
                await GameRewards.awardOgods(book.ogodsReward, 'bookshelf-quiz');
            }
        } else if (!perfect) {
            if (typeof GameRewards !== 'undefined') {
                await GameRewards.loseBurda('bookshelf-quiz');
            }
        } else if (perfect && alreadyDone) {
            BookshelfStore.markQuizCompleted(book.id, this.quizScore, total);
        }
    }
}

customElements.define('my-bookshelf', MyBookshelf);
