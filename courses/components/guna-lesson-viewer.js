/**
 * Guna Lesson Viewer Web Component
 * Interactive lesson viewer for Guna language lessons
 */

class GunaLessonViewer extends HTMLElement {
    constructor() {
        super();
        this.currentLessonId = 1;
        this.currentSectionIndex = 0;
        this.maxSectionReached = 0;
        this.gunaLessons = null;
        this.lessonContent = null;
        this.userAnswers = {};
        this.quizCompleted = false;
        this.memoryCompleted = false;
        this.flashcardsDone = false;
        this.pronunciationDone = false;
        this.conversationCompleted = false;
        this.isReviewMode = false;
        this.currentActivityIndex = 0;
    }

    t(key, fallback) {
        if (window.SiteI18n && typeof SiteI18n.t === 'function') return SiteI18n.t(key);
        if (window.GunaI18n && typeof GunaI18n.t === 'function') return GunaI18n.t(key);
        return fallback || key;
    }

    connectedCallback() {
        document.body.classList.add('hub-lesson-active');
        this.currentLessonId = parseInt(this.getAttribute('lesson-id'), 10) || 1;
        this.isReviewMode = this.getAttribute('review') === 'true' ||
            (typeof GunaProgress !== 'undefined' && GunaProgress.isCompleted(this.currentLessonId));

        if (typeof GunaProgress !== 'undefined' && !GunaProgress.canAccessLesson(this.currentLessonId, this.isReviewMode)) {
            this.innerHTML = `
                <div class="lesson-viewer lesson-locked">
                    <h2>🔒 Lección bloqueada</h2>
                    <p>Completa la lección anterior para desbloquear este nivel.</p>
                    <button type="button" class="nav-btn" id="backToPathBtn"><i class="fas fa-arrow-left"></i> Volver al camino</button>
                </div>`;
            this.querySelector('#backToPathBtn')?.addEventListener('click', () => this.backToPath());
            return;
        }

        this.gunaLessons = new GunaLessons();
        this.currentSectionIndex = 0;
        document.addEventListener('guna-language-changed', () => {
            if (typeof this.syncDuoCheckButton === 'function') this.syncDuoCheckButton();
        });
        this.maxSectionReached = 0;
        this.userAnswers = {};
        this.quizCompleted = false;
        this.memoryCompleted = false;
        this.flashcardsDone = false;
        this.pronunciationDone = false;
        this.conversationCompleted = false;
        this.currentActivityIndex = 0;
        this.quizActivityIndex = 0;

        const session = typeof GunaProgress !== 'undefined' ? GunaProgress.getLessonSession(this.currentLessonId) : null;
        if (session && !this.isReviewMode) {
            this.currentSectionIndex = session.sectionIndex || 0;
            this.maxSectionReached = session.maxSectionReached ?? this.currentSectionIndex;
            this.userAnswers = session.userAnswers || {};
            this.quizCompleted = !!session.quizCompleted;
            this.memoryCompleted = !!session.memoryCompleted;
            this.flashcardsDone = !!session.flashcardsDone;
            this.pronunciationDone = !!session.pronunciationDone;
            this.conversationCompleted = !!session.conversationCompleted;
            this.currentActivityIndex = session.activityIndex || 0;
            this.quizActivityIndex = session.activityIndex || 0;
        }

        this.loadLesson();
        this.skipInfoSections();
        this.render();
        this.initializeEventListeners();
    }

    loadLesson() {
        this.lessonContent = this.gunaLessons.getLessonContent(this.currentLessonId);
        if (!this.lessonContent) {
            this.lessonContent = this.gunaLessons.getLessonContent(1);
        }
    }

    skipInfoSections() {
        const sections = this.lessonContent?.sections || [];
        const currentType = sections[this.currentSectionIndex]?.type;
        if (!['introduction', 'vocabulary', 'summary'].includes(currentType)) return;
        const idx = sections.findIndex((section) => this.isPracticeSection(section.type));
        if (idx < 0) return;
        this.currentSectionIndex = idx;
        this.maxSectionReached = Math.max(this.maxSectionReached, idx);
    }

    render() {
        if (!this.lessonContent) {
            this.innerHTML = '<p>' + this.t('lessonLoading', 'Loading lesson...') + '</p>';
            return;
        }

        this.innerHTML = `
            <style>
                .lesson-viewer {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 2rem;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                }

                .lesson-header {
                    text-align: center;
                    margin-bottom: 3rem;
                    padding: 2rem;
                    background: linear-gradient(165deg, #fffef9 0%, #f8f3ea 35%, rgba(255, 179, 0, 0.2) 65%, rgba(17, 128, 43, 0.16) 100%);
                    color: #3d1f0a;
                    border-radius: 16px;
                    position: relative;
                    overflow: hidden;
                    border-bottom: 4px solid transparent;
                    border-image: repeating-linear-gradient(90deg, #c0392b 0, #c0392b 12px, #ffb300 12px, #ffb300 24px, #11802b 24px, #11802b 36px, #d4a017 36px, #d4a017 48px) 1;
                }

                .lesson-back-btn {
                    position: absolute;
                    top: 1rem;
                    left: 1rem;
                    z-index: 2;
                    padding: 0.5rem 1rem;
                    background: rgba(17, 128, 43, 0.12);
                    color: #3d1f0a;
                    border: 1px solid rgba(17, 128, 43, 0.25);
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    font-size: 0.9rem;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    transition: background 0.2s;
                }

                .lesson-back-btn:hover {
                    background: rgba(255,255,255,0.35);
                }

                .lesson-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23pattern)"/></svg>');
                    opacity: 0.3;
                }

                .lesson-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                    position: relative;
                    z-index: 1;
                }

                .lesson-subtitle {
                    font-size: 1.2rem;
                    opacity: 0.9;
                    position: relative;
                    z-index: 1;
                }

                .lesson-stats {
                    display: flex;
                    justify-content: center;
                    gap: 2rem;
                    margin-top: 1.5rem;
                    position: relative;
                    z-index: 1;
                }

                .stat-item {
                    text-align: center;
                }

                .stat-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    display: block;
                }

                .stat-label {
                    font-size: 0.9rem;
                    opacity: 0.8;
                }

                .section-navigation {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                }

                .section-tab {
                    padding: 0.75rem 1.5rem;
                    background: var(--bg-tertiary);
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 500;
                }

                .section-tab.active {
                    background: linear-gradient(135deg, #11802b 0%, #1a5c2e 55%, #d4a017 100%);
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(17, 128, 43, 0.28);
                }

                .section-tab:hover:not(.active) {
                    background: var(--primary-color);
                    color: white;
                    transform: translateY(-1px);
                }

                .section-content {
                    min-height: 400px;
                    padding: 2rem;
                    background: var(--bg-secondary);
                    border-radius: 16px;
                    margin-bottom: 2rem;
                }

                .lesson-intro {
                    text-align: center;
                }

                .intro-header h2 {
                    color: #3d1f0a;
                    margin-bottom: 1rem;
                }

                .cultural-context {
                    margin-top: 2rem;
                    text-align: left;
                }

                .cultural-highlights {
                    display: flex;
                    justify-content: center;
                    gap: 2rem;
                    margin-top: 1.5rem;
                    flex-wrap: wrap;
                }

                .highlight-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1rem;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .highlight-item i {
                    color: var(--primary-color);
                    font-size: 1.2rem;
                }

                .vocabulary-section {
                    text-align: left;
                }

                .vocabulary-table {
                    margin: 2rem 0;
                    overflow-x: auto;
                }

                .vocabulary-table table {
                    width: 100%;
                    border-collapse: collapse;
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                }

                .vocabulary-table th,
                .vocabulary-table td {
                    padding: 1rem;
                    text-align: left;
                    border-bottom: 1px solid var(--bg-tertiary);
                }

                .vocabulary-table th {
                    background: linear-gradient(135deg, #11802b 0%, #1a5c2e 55%, #d4a017 100%);
                    color: white;
                    font-weight: 600;
                }

                .vocabulary-table tr:hover {
                    background: var(--bg-tertiary);
                }

                .pronunciation-tips {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    margin-top: 2rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .pronunciation-tips ul {
                    list-style: none;
                    padding: 0;
                }

                .pronunciation-tips li {
                    padding: 0.5rem 0;
                    border-bottom: 1px solid var(--bg-tertiary);
                }

                .pronunciation-tips li:last-child {
                    border-bottom: none;
                }

                .interactive-section {
                    text-align: left;
                }

                .quiz-container {
                    margin: 2rem 0;
                }

                .quiz-question {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    margin-bottom: 2rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .quiz-options {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                    margin-top: 1rem;
                }

                .quiz-option {
                    padding: 1rem;
                    background: var(--bg-tertiary);
                    border: 2px solid transparent;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 500;
                }

                .quiz-option:hover {
                    background: var(--primary-color);
                    color: white;
                    transform: translateY(-2px);
                }

                .quiz-option.selected {
                    background: var(--primary-color);
                    color: white;
                    border-color: var(--primary-color);
                }

                .quiz-option.correct {
                    background: var(--success-color);
                    color: white;
                    border-color: var(--success-color);
                }

                .quiz-option.incorrect {
                    background: var(--danger-color);
                    color: white;
                    border-color: var(--danger-color);
                }

                .quiz-feedback {
                    margin-top: 1rem;
                    padding: 1rem;
                    border-radius: 8px;
                    font-weight: 500;
                }

                .quiz-feedback.correct {
                    background: rgba(46, 204, 113, 0.1);
                    color: var(--success-color);
                    border: 1px solid var(--success-color);
                }

                .quiz-feedback.incorrect {
                    background: rgba(231, 76, 60, 0.1);
                    color: var(--danger-color);
                    border: 1px solid var(--danger-color);
                }

                .matching-exercise {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    margin-top: 1rem;
                }

                .matching-pairs {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .matching-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: var(--bg-tertiary);
                    border-radius: 8px;
                }

                .guna-text {
                    font-weight: 600;
                    color: var(--primary-color);
                    min-width: 120px;
                }

                .matching-select {
                    padding: 0.5rem;
                    border: 2px solid var(--bg-tertiary);
                    border-radius: 8px;
                    background: white;
                    font-size: 1rem;
                }

                .check-matching-btn {
                    padding: 0.75rem 1.5rem;
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                }

                .quiz-results {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    text-align: center;
                    margin-top: 2rem;
                }

                .progress-bar {
                    width: 100%;
                    height: 20px;
                    background: var(--bg-tertiary);
                    border-radius: 10px;
                    overflow: hidden;
                    margin: 1rem 0;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(135deg, var(--success-color), #27AE60);
                    transition: width 0.5s ease;
                }

                .conversation-section {
                    text-align: left;
                }

                .conversation-scenarios {
                    margin: 2rem 0;
                }

                .scenario {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    margin-bottom: 2rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .scenario-options {
                    display: flex;
                    gap: 1rem;
                    margin: 1rem 0;
                    flex-wrap: wrap;
                }

                .scenario-option {
                    padding: 0.75rem 1rem;
                    background: var(--bg-tertiary);
                    border: 2px solid transparent;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .scenario-option:hover {
                    background: var(--primary-color);
                    color: white;
                }

                .scenario-option.selected {
                    background: var(--primary-color);
                    color: white;
                    border-color: var(--primary-color);
                }

                .lesson-summary {
                    text-align: left;
                }

                .summary-content {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    margin: 2rem 0;
                }

                .learned-greetings,
                .cultural-notes,
                .next-steps {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .lesson-completion {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-top: 2rem;
                }

                .complete-lesson-btn,
                .review-lesson-btn {
                    padding: 1rem 2rem;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .complete-lesson-btn {
                    background: linear-gradient(135deg, var(--success-color), #27AE60);
                    color: white;
                }

                .review-lesson-btn {
                    background: var(--bg-tertiary);
                    color: var(--text-primary);
                }

                .complete-lesson-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
                }

                .review-lesson-btn:hover {
                    background: var(--primary-color);
                    color: white;
                    transform: translateY(-2px);
                }

                .navigation-buttons {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 2rem;
                }

                .nav-btn {
                    padding: 0.75rem 1.5rem;
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }

                .nav-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 160, 224, 0.3);
                }

                .nav-btn:disabled {
                    background: var(--bg-tertiary);
                    color: var(--text-light);
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                @media (max-width: 768px) {
                    .lesson-viewer {
                        padding: 1rem;
                    }

                    .lesson-title {
                        font-size: 2rem;
                    }

                    .lesson-stats {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .section-navigation {
                        flex-direction: column;
                    }

                    .quiz-options {
                        grid-template-columns: 1fr;
                    }

                    .scenario-options {
                        flex-direction: column;
                    }

                    .summary-content {
                        grid-template-columns: 1fr;
                    }
                }
            </style>

            ${this.buildLessonShellHtml()}
        `;
        this.syncDuoProgress();
    }

    isPracticeSection(type) {
        return ['interactive', 'conversation', 'flashcards', 'memory', 'pronunciation'].includes(type);
    }

    getDuoPromptTitle(section) {
        const map = {
            interactive: 'Choose the correct answer',
            conversation: 'Pick the best reply',
            flashcards: 'Tap the card to flip',
            memory: 'Find the matching pairs',
            pronunciation: 'Listen and practice',
            introduction: 'Welcome',
            vocabulary: 'Study the words',
            completion: 'Lesson complete',
            summary: 'What you learned'
        };
        return map[section?.type] || section?.title || 'Continue';
    }

    getOverallProgressPercent() {
        const total = this.lessonContent?.sections?.length || 1;
        const section = this.lessonContent?.sections?.[this.currentSectionIndex];
        let fraction = this.currentSectionIndex / total;
        if (section && (section.type === 'interactive' || section.type === 'conversation')) {
            const screens = this.getActivityScreens?.() || [];
            const count = Math.max(screens.length, 1);
            fraction = (this.currentSectionIndex + ((this.currentActivityIndex || 0) + 1) / count) / total;
        } else {
            fraction = (this.currentSectionIndex + 1) / total;
        }
        return Math.max(4, Math.min(100, Math.round(fraction * 100)));
    }

    syncDuoProgress() {
        const fill = this.querySelector('#duoProgressFill');
        if (fill) fill.style.width = `${this.getOverallProgressPercent()}%`;
        const hearts = this.querySelector('#duoHeartsCount');
        if (hearts && typeof GunaLives !== 'undefined') hearts.textContent = String(GunaLives.getLives());
        const title = this.querySelector('#duoPromptTitle');
        const section = this.lessonContent?.sections?.[this.currentSectionIndex];
        if (title && section) {
            const active = this.querySelector('.lesson-activity-screen.active .duo-exercise, .lesson-activity-screen.active .duo-prompt-title, .quiz-question.duo-exercise');
            const custom = active?.dataset?.prompt;
            title.textContent = custom || this.getDuoPromptTitle(section);
        }
        this.syncDuoCheckButton();
    }

    syncDuoCheckButton() {
        const btn = this.querySelector('#duoCheckBtn');
        const banner = this.querySelector('#duoFeedbackBanner');
        if (!btn) return;
        const section = this.lessonContent?.sections?.[this.currentSectionIndex];
        const practice = this.isPracticeSection(section?.type);

        if (this._duoAwaitingContinue) {
            btn.textContent = this.t('lessonContinue', 'CONTINUE');
            btn.className = 'duo-check-btn is-continue';
            btn.disabled = false;
            return;
        }

        if (!practice) {
            const canNext = !this.isNextDisabled();
            const isEnd = section?.type === 'completion' || section?.type === 'summary'
                || this.currentSectionIndex >= (this.lessonContent.sections.length - 1);
            btn.textContent = isEnd ? this.t('lessonDone', 'DONE') : this.t('lessonContinue', 'CONTINUE');
            btn.className = (canNext || isEnd) ? 'duo-check-btn is-ready' : 'duo-check-btn';
            btn.disabled = !(canNext || isEnd);
            if (banner) banner.className = 'duo-feedback-banner';
            return;
        }

        const screen = this.querySelector('.lesson-activity-screen.active') || this.querySelector('.section-content');
        const selected = screen?.querySelector('.quiz-option.selected, .duo-chip.selected, .scenario-option.selected');
        const matchingReady = screen?.querySelector('.matching-exercise') && [...(screen.querySelectorAll('.matching-select') || [])].every(s => s.value);
        const dropZones = screen?.querySelectorAll('.drop-zone') || [];
        const dragReady = dropZones.length > 0 && [...dropZones].every((z) => z.querySelector('.drag-item'));
        const memoryDone = section?.type === 'memory' && this.memoryCompleted;
        const flashReady = section?.type === 'flashcards' && this.flashcardsDone;
        const pronReady = section?.type === 'pronunciation';
        const onResults = screen?.dataset?.kind === 'results' || (this.quizCompleted && !!screen?.querySelector?.('.quiz-results'));
        const ready = !!(selected || matchingReady || dragReady || memoryDone || flashReady || pronReady || onResults);

        if (onResults || section?.type === 'flashcards' || section?.type === 'pronunciation') {
            btn.textContent = this.t('lessonContinue', 'CONTINUE');
            const canGo = !!(onResults || flashReady || pronReady);
            btn.className = canGo ? 'duo-check-btn is-ready' : 'duo-check-btn';
            btn.disabled = !canGo;
        } else {
            btn.textContent = this.t('lessonCheck', 'CHECK');
            btn.className = ready ? 'duo-check-btn is-ready' : 'duo-check-btn';
            btn.disabled = !ready;
        }
        if (banner && !this._duoAwaitingContinue) banner.className = 'duo-feedback-banner';
    }

    buildLessonShellHtml() {
        const section = this.lessonContent.sections[this.currentSectionIndex];
        const practice = this.isPracticeSection(section?.type);
        const lives = typeof GunaLives !== 'undefined' ? GunaLives.getLives() : 5;
        const progress = this.getOverallProgressPercent();
        const shellClass = practice ? 'lesson-viewer lesson-viewer--duo' : 'lesson-viewer lesson-viewer--duo-lite';

        return `
            <div class="${shellClass}">
                ${typeof GunaLives !== 'undefined' && !GunaLives.canPlay() ? `
                <div class="lives-warning-banner">
                    <i class="fas fa-heart-broken"></i>
                    <span>${typeof GunaI18n !== 'undefined' ? GunaI18n.t('noLives') : 'No lives left! Visit the store or wait for regeneration.'}</span>
                    <button type="button" class="btn-duo btn-duo-primary" id="goToStoreBtn">Tienda</button>
                </div>` : ''}
                <div class="duo-topbar">
                    <button type="button" class="duo-close" id="backToPathBtn" aria-label="Close">×</button>
                    <div class="duo-progress-track" aria-hidden="true">
                        <div class="duo-progress-fill" id="duoProgressFill" style="width:${progress}%"></div>
                    </div>
                    <div class="duo-hearts" title="Burdas">
                        <span class="duo-heart-icon">💙</span>
                        <span id="duoHeartsCount">${lives}</span>
                    </div>
                </div>

                <div class="duo-body">
                    <p class="lesson-section-label">${this.getSectionIcon(section?.type)} ${section?.title || ''}</p>
                    <h2 class="duo-prompt-title" id="duoPromptTitle">${this.getDuoPromptTitle(section)}</h2>
                    <div class="section-content">
                        ${section?.content || '<p>Loading section…</p>'}
                    </div>
                </div>

                <div class="duo-footer">
                    <div class="duo-feedback-banner" id="duoFeedbackBanner"></div>
                    <button type="button" class="duo-check-btn" id="duoCheckBtn" disabled>${this.t('lessonCheck', 'CHECK')}</button>
                </div>

            </div>
        `;
    }

    getSectionIcon(type) {
        const icons = {
            'introduction': '📚',
            'vocabulary': '📖',
            'pronunciation': '🔊',
            'flashcards': '🃏',
            'memory': '🧠',
            'interactive': '🎯',
            'conversation': '💬',
            'completion': '🏆',
            'summary': '📝'
        };
        return icons[type] || '📄';
    }

    isNextDisabled() {
        if (this.currentSectionIndex >= this.lessonContent.sections.length - 1) return true;
        return !this.isCurrentSectionComplete();
    }

    isCurrentSectionComplete() {
        const section = this.lessonContent?.sections?.[this.currentSectionIndex];
        if (!section) return true;
        if (section.type === 'interactive') return this.quizCompleted;
        if (section.type === 'memory') return this.memoryCompleted;
        if (section.type === 'flashcards') return this.flashcardsDone;
        if (section.type === 'pronunciation') return this.pronunciationDone;
        if (section.type === 'conversation') return this.conversationCompleted;
        return true;
    }

    canGoToSection(sectionIndex) {
        if (sectionIndex < 0 || sectionIndex >= this.lessonContent.sections.length) return false;
        if (sectionIndex <= this.maxSectionReached) return true;
        if (sectionIndex === this.maxSectionReached + 1 && this.isCurrentSectionComplete()) return true;
        return false;
    }

    saveSession() {
        if (typeof GunaProgress === 'undefined' || this.isReviewMode) return;
        GunaProgress.saveLessonSession(this.currentLessonId, {
            sectionIndex: this.currentSectionIndex,
            maxSectionReached: this.maxSectionReached,
            userAnswers: this.userAnswers,
            quizCompleted: this.quizCompleted,
            memoryCompleted: this.memoryCompleted,
            flashcardsDone: this.flashcardsDone,
            pronunciationDone: this.pronunciationDone,
            conversationCompleted: this.conversationCompleted,
            activityIndex: this.currentActivityIndex
        });
    }

    initializeEventListeners() {
        const backBtn = this.querySelector('#backToPathBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.backToPath());
        }

        this.querySelector('#goToStoreBtn')?.addEventListener('click', () => {
            window.learningHub?.loadSection('store', true);
        });

        // Section navigation
        this.querySelectorAll('.section-tab:not([disabled])').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabEl = e.currentTarget;
                const sectionIndex = parseInt(tabEl.dataset.section, 10);
                if (!isNaN(sectionIndex) && this.canGoToSection(sectionIndex)) {
                    this.navigateToSection(sectionIndex);
                }
            });
        });

        this._duoAwaitingContinue = false;
        this._pendingAnswer = null;

        // Quiz interactions
        this.setupQuizInteractions();

        // Conversation scenarios
        this.setupConversationInteractions();

        // Pronunciation, flashcards, drag-drop
        this.setupPronunciation();
        this.setupFlashcards();
        this.setupMemoryGame();
        this.setupDragDrop();
        this.setupActivityPaging();
        this.setupConversationPaging();

        // Lesson completion
        this.setupCompletionInteractions();
        this.setupDuoCheckButton();
        this.syncDuoProgress();
    }

    setupDuoCheckButton() {
        this.querySelector('#duoCheckBtn')?.addEventListener('click', () => this.handleDuoCheck());
        this.querySelectorAll('.matching-select').forEach((sel) => {
            sel.addEventListener('change', () => this.syncDuoCheckButton());
        });
        this.querySelectorAll('.drop-zone, .drag-item').forEach((el) => {
            el.addEventListener('click', () => setTimeout(() => this.syncDuoCheckButton(), 0));
            el.addEventListener('drop', () => setTimeout(() => this.syncDuoCheckButton(), 0));
        });
    }

    enhanceQuizToDuo() {
        this.querySelectorAll('.quiz-question').forEach((q) => {
            q.classList.add('duo-exercise');
            if (!q.dataset.prompt) q.dataset.prompt = 'Choose the correct answer';
            const options = q.querySelector('.quiz-options');
            if (options) options.classList.add('duo-chips');
            q.querySelectorAll('.quiz-option').forEach((opt) => opt.classList.add('duo-chip'));

            if (!q.querySelector('.duo-mascot-row')) {
                const h4 = q.querySelector('h4');
                const text = (h4?.textContent || '').replace(/^Question\s*\d+\s*:\s*/i, '').trim();
                const row = document.createElement('div');
                row.className = 'duo-mascot-row';
                row.innerHTML = `
                    <img class="duo-mascot" src="../Multimedia/Images/Soged/Newturttle.png" alt="Soggy" onerror="this.style.display='none'">
                    <div class="duo-bubble">${text || 'Choose the correct answer'}</div>
                `;
                const insertBefore = q.querySelector('.matching-exercise') || options;
                if (insertBefore) q.insertBefore(row, insertBefore);
                else q.prepend(row);
                if (h4) h4.classList.add('duo-sr-only');
            }
            if (!q.querySelector('.duo-answer-bank') && !q.querySelector('.matching-exercise')) {
                const bank = document.createElement('div');
                bank.className = 'duo-answer-bank';
                const opts = q.querySelector('.quiz-options');
                if (opts) q.insertBefore(bank, opts);
            }
        });
    }

    handleDuoCheck() {
        const section = this.lessonContent?.sections?.[this.currentSectionIndex];
        const practice = this.isPracticeSection(section?.type);
        const banner = this.querySelector('#duoFeedbackBanner');

        if (this._duoAwaitingContinue) {
            this._duoAwaitingContinue = false;
            if (banner) banner.className = 'duo-feedback-banner';
            this.advanceAfterDuoCheck();
            return;
        }

        if (!practice) {
            if (section?.type === 'completion' || section?.type === 'summary') {
                this.querySelector('.complete-lesson-btn')?.click();
                return;
            }
            if (!this.isNextDisabled()) {
                this.navigateToSection(this.currentSectionIndex + 1);
            }
            return;
        }

        const screen = this.querySelector('.lesson-activity-screen.active') || this.querySelector('.section-content');
        if (screen?.dataset?.kind === 'results' || (this.quizCompleted && screen?.querySelector?.('.quiz-results'))) {
            if (!this.isNextDisabled()) this.navigateToSection(this.currentSectionIndex + 1);
            return;
        }

        if (section?.type === 'flashcards') {
            this.flashcardsDone = true;
            this.saveSession();
            this._duoAwaitingContinue = true;
            if (banner) {
                banner.textContent = this.t('lessonGreat', 'Great review!');
                banner.className = 'duo-feedback-banner show correct';
            }
            this.syncDuoCheckButton();
            return;
        }

        if (section?.type === 'pronunciation') {
            this.pronunciationDone = true;
            this.saveSession();
            this._duoAwaitingContinue = true;
            if (banner) {
                banner.textContent = 'Nice practice!';
                banner.className = 'duo-feedback-banner show correct';
            }
            this.syncDuoCheckButton();
            return;
        }

        if (section?.type === 'memory' && this.memoryCompleted) {
            this._duoAwaitingContinue = true;
            if (banner) {
                banner.textContent = 'All pairs found!';
                banner.className = 'duo-feedback-banner show correct';
            }
            this.syncDuoCheckButton();
            return;
        }

        if (screen?.querySelector('.matching-exercise')) {
            this.checkMatchingAnswers();
            const ok = this.userAnswers[4] != null || this.userAnswers['4'] != null;
            if (banner) {
                banner.textContent = ok ? this.t('lessonExcellent', 'Excellent!') : this.t('lessonTryAgain', 'Not quite. Try again!');
                banner.className = `duo-feedback-banner show ${ok ? 'correct' : 'incorrect'}`;
            }
            if (ok) {
                this._duoAwaitingContinue = true;
                this.syncDuoCheckButton();
            }
            return;
        }

        if (screen?.querySelector('.drag-drop-exercise')) {
            const checkBtn = screen.querySelector('.check-drag-btn');
            checkBtn?.click();
            const ok = this.userAnswers.drag === 'done';
            if (banner) {
                banner.textContent = ok ? 'Perfect!' : 'Keep trying!';
                banner.className = `duo-feedback-banner show ${ok ? 'correct' : 'incorrect'}`;
            }
            if (ok) {
                this._duoAwaitingContinue = true;
                this.syncDuoCheckButton();
            }
            return;
        }

        if (screen?.querySelector('.scenario-option.selected') || section?.type === 'conversation') {
            const scenario = screen.querySelector('.scenario');
            if (scenario) scenario.dataset.done = 'true';
            const scenarios = this.querySelectorAll('.conversation-section .scenario');
            const doneCount = [...scenarios].filter((s) => s.dataset.done === 'true' || s.querySelector('.scenario-option.selected')).length;
            if (scenarios.length && doneCount >= scenarios.length) {
                this.conversationCompleted = true;
                this.saveSession();
            }
            if (banner) {
                banner.textContent = 'Nice choice!';
                banner.className = 'duo-feedback-banner show correct';
            }
            this._duoAwaitingContinue = true;
            this.syncDuoCheckButton();
            return;
        }

        if (this._pendingAnswer) {
            const { questionId, answer } = this._pendingAnswer;
            this.userAnswers[questionId] = answer;
            this.showQuizFeedback(questionId, answer);
            this.saveSession();
            const correctAnswers = this.gunaLessons.getQuizAnswers(this.currentLessonId);
            const isCorrect = String(answer) === String(correctAnswers[questionId]);
            if (banner) {
                banner.textContent = isCorrect ? this.t('lessonExcellent', 'Excellent!') : `Correct answer: ${correctAnswers[questionId]}`;
                banner.className = `duo-feedback-banner show ${isCorrect ? 'correct' : 'incorrect'}`;
            }
            this._duoAwaitingContinue = true;
            this.syncDuoCheckButton();
            this.checkQuizCompletion();
        }
    }

    advanceAfterDuoCheck() {
        this._pendingAnswer = null;
        const section = this.lessonContent?.sections?.[this.currentSectionIndex];
        const screens = this.getActivityScreens();
        if (screens.length && (section?.type === 'interactive' || section?.type === 'conversation')) {
            const idx = this.currentActivityIndex || 0;
            if (idx < screens.length - 1) {
                this.showActivityScreen(idx + 1);
                this.syncDuoProgress();
                return;
            }
            if (section?.type === 'conversation') {
                this.conversationCompleted = true;
                this.saveSession();
            }
        }
        if (!this.isNextDisabled()) {
            this.navigateToSection(this.currentSectionIndex + 1);
        } else if (this.quizCompleted && section?.type === 'interactive') {
            // Jump to results screen if still inside interactive
            const resultsIdx = screens.findIndex((s) => s.dataset.kind === 'results');
            if (resultsIdx >= 0 && (this.currentActivityIndex || 0) !== resultsIdx) {
                this.showActivityScreen(resultsIdx);
                return;
            }
            this.navigateToSection(this.currentSectionIndex + 1);
        } else {
            this.syncDuoCheckButton();
        }
    }

    speakText(text) {
        if (!text) return;
        if (window.GUNA_VOCABULARY?.play) {
            window.GUNA_VOCABULARY.play(text);
            return;
        }
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-ES';
        u.rate = 0.85;
        window.speechSynthesis.speak(u);
    }

    setupPronunciation() {
        this.querySelectorAll('[data-speak], .pronounce-btn, .pronunciation-card').forEach(el => {
            el.addEventListener('click', () => {
                const text = el.dataset.speak || el.textContent.trim();
                this.speakText(text);
                if (this.querySelector('.pronunciation-section, .pronunciation-grid')) {
                    this.pronunciationDone = true;
                    this.saveSession();
                    this.syncDuoCheckButton();
                }
            });
        });
    }

    setupFlashcards() {
        const deck = this.querySelector('.flashcard-deck');
        if (!deck) return;
        const dataEl = deck.querySelector('.flashcard-data');
        if (!dataEl) return;
        let words = [];
        try { words = JSON.parse(dataEl.textContent); } catch { return; }
        let index = 0;
        let flipped = false;

        const card = deck.querySelector('#activeFlashcard');
        const counter = deck.querySelector('.flashcard-counter');
        const prev = deck.querySelector('#flashPrev');
        const next = deck.querySelector('#flashNext');
        const speak = deck.querySelector('#flashSpeak');

        const renderCard = () => {
            const w = words[index];
            if (!w || !card) return;
            flipped = false;
            card.querySelector('.flashcard-front').style.display = '';
            card.querySelector('.flashcard-back').style.display = 'none';
            card.querySelector('.flashcard-icon').textContent = w.icon || '📝';
            card.querySelector('.flashcard-guna').textContent = w.guna;
            card.querySelector('.flashcard-es').textContent = w.es;
            card.querySelector('.flashcard-en').textContent = w.en;
            card.querySelector('.flashcard-example').innerHTML = `<em>${w.example || ''}</em>`;
            if (counter) counter.textContent = `${index + 1} / ${words.length}`;
            if (prev) prev.disabled = index === 0;
            if (next) next.disabled = index === words.length - 1;
            if (speak) speak.dataset.speak = w.guna;
            if (index >= words.length - 1) {
                this.flashcardsDone = true;
                this.saveSession();
                this.syncDuoCheckButton();
            }
        };

        card?.addEventListener('click', () => {
            flipped = !flipped;
            card.querySelector('.flashcard-front').style.display = flipped ? 'none' : '';
            card.querySelector('.flashcard-back').style.display = flipped ? '' : 'none';
            if (flipped) {
                this.flashcardsDone = true;
                this.saveSession();
                this.syncDuoCheckButton();
            }
        });

        prev?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (index > 0) { index--; renderCard(); }
        });
        next?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (index < words.length - 1) { index++; renderCard(); }
        });
        speak?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.speakText(speak.dataset.speak);
        });
        renderCard();
    }

    setupMemoryGame() {
        const exercise = this.querySelector('.memory-game-exercise');
        const grid = this.querySelector('#memoryGrid');
        if (!exercise || !grid) return;

        let pairs = [];
        try { pairs = JSON.parse(grid.dataset.pairs || '[]'); } catch { return; }

        const buildCards = (difficulty) => {
            const pairCounts = { easy: 3, medium: 6, hard: 10, expert: 15 };
            const count = Math.min(pairCounts[difficulty] || 6, pairs.length);
            const subset = pairs.slice(0, count);
            const cards = [];
            subset.forEach(p => {
                cards.push({ pairId: p.id, type: 'word', label: p.guna, speak: p.guna, es: p.es, en: p.en });
                cards.push({ pairId: p.id, type: 'image', label: p.icon, speak: p.guna, es: p.es, en: p.en });
            });
            for (let i = cards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [cards[i], cards[j]] = [cards[j], cards[i]];
            }
            return { cards, totalPairs: count };
        };

        let state = { ...buildCards(exercise.dataset.difficulty || 'medium'), flipped: [], moves: 0, matched: 0, lock: false };

        const renderGrid = () => {
            grid.innerHTML = state.cards.map((c, i) => `
                <button type="button" class="memory-card ${c.matched ? 'matched' : ''}" data-idx="${i}" aria-label="Memory card" ${c.matched ? 'disabled' : ''}>
                    <div class="memory-card-inner ${c.revealed ? 'flipped' : ''}">
                        <div class="memory-card-front">?</div>
                        <div class="memory-card-back">
                            ${c.type === 'word' ? `<span class="memory-word">${c.label}</span>` : `<span class="memory-icon">${c.label}</span>`}
                        </div>
                    </div>
                </button>
            `).join('');
            const movesEl = exercise.querySelector('#memoryMoves');
            const pairsEl = exercise.querySelector('#memoryPairs');
            if (movesEl) movesEl.textContent = state.moves;
            if (pairsEl) pairsEl.textContent = state.matched;
        };

        const onWin = (perfect) => {
            this.memoryCompleted = true;
            const fb = exercise.querySelector('#memoryFeedback');
            if (fb) {
                fb.hidden = false;
                fb.className = 'memory-feedback success';
                fb.innerHTML = `🎉 All pairs found in ${state.moves} moves! +20 XP, +8 cocos`;
            }
            if (typeof GunaGamification !== 'undefined') {
                GunaGamification.onMemoryGameComplete(perfect);
                subsetWords(state.cards).forEach(w => GunaGamification.recordVocabWord(w));
            }
            this.saveSession();
            this.syncDuoCheckButton();
        };

        const subsetWords = (cards) => [...new Set(cards.filter(c => c.speak).map(c => c.speak))];

        const handleFlip = (idx) => {
            if (state.lock) return;
            const card = state.cards[idx];
            if (!card || card.matched || card.revealed) return;

            card.revealed = true;
            state.flipped.push(idx);
            this.speakText(card.speak);
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
                if (state.matched >= state.totalPairs) {
                    onWin(state.moves <= state.totalPairs + 2);
                }
            } else {
                setTimeout(() => {
                    a.revealed = false;
                    b.revealed = false;
                    state.flipped = [];
                    state.lock = false;
                    renderGrid();
                }, 900);
            }
        };

        grid.addEventListener('click', (e) => {
            const btn = e.target.closest('.memory-card');
            if (!btn || btn.disabled) return;
            handleFlip(parseInt(btn.dataset.idx, 10));
        });

        exercise.querySelectorAll('.memory-diff-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                exercise.querySelectorAll('.memory-diff-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                exercise.dataset.difficulty = btn.dataset.diff;
                state = { ...buildCards(btn.dataset.diff), flipped: [], moves: 0, matched: 0, lock: false };
                this.memoryCompleted = false;
                renderGrid();
            });
        });

        renderGrid();
        if (this.memoryCompleted) {
            const fb = exercise.querySelector('#memoryFeedback');
            if (fb) { fb.hidden = false; fb.textContent = '✅ Memory game completed!'; }
        }
    }

    setupDragDrop() {
        const exercise = this.querySelector('.drag-drop-exercise');
        if (!exercise) return;

        if (!exercise.querySelector('.duo-mascot-row')) {
            const h4 = exercise.querySelector('h4');
            const text = (h4?.textContent || 'Match each word to its meaning').trim();
            const row = document.createElement('div');
            row.className = 'duo-mascot-row';
            row.innerHTML = `
                <img class="duo-mascot" src="../Multimedia/Images/Soged/Newturttle.png" alt="Soggy" onerror="this.style.display='none'">
                <div class="duo-bubble">${text}</div>
            `;
            exercise.insertBefore(row, exercise.firstChild);
            if (h4) h4.classList.add('duo-sr-only');
            exercise.dataset.prompt = 'Match the words';
        }

        let dragged = null;
        const selectItem = (item) => {
            exercise.querySelectorAll('.drag-item').forEach((el) => el.classList.remove('selected'));
            dragged = item;
            if (item) item.classList.add('selected');
        };

        exercise.querySelectorAll('.drag-item').forEach(item => {
            item.addEventListener('dragstart', () => { dragged = item; item.classList.add('selected'); });
            item.addEventListener('dragend', () => { item.classList.remove('selected'); });
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                selectItem(item);
            });
        });

        exercise.querySelectorAll('.drop-zone').forEach(zone => {
            zone.addEventListener('dragover', (e) => e.preventDefault());
            const place = () => {
                if (!dragged) return;
                const slot = zone.querySelector('.drop-slot');
                if (slot) {
                    slot.innerHTML = '';
                    slot.appendChild(dragged);
                    dragged.classList.remove('selected');
                    dragged = null;
                }
            };
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                place();
            });
            zone.addEventListener('click', place);
        });

        const checkBtn = exercise.querySelector('.check-drag-btn');
        if (checkBtn) {
            checkBtn.addEventListener('click', () => {
                const feedback = exercise.querySelector('.drag-feedback');
                let correct = 0;
                exercise.querySelectorAll('.drop-zone').forEach(zone => {
                    const item = zone.querySelector('.drag-item');
                    if (item && item.dataset.value === zone.dataset.accept) correct++;
                });
                const total = exercise.querySelectorAll('.drop-zone').length;
                if (feedback) {
                    feedback.style.display = 'block';
                    feedback.className = 'drag-feedback ' + (correct === total ? 'correct' : 'incorrect');
                    feedback.textContent = correct === total
                        ? 'Perfect! All matches correct!'
                        : `${correct}/${total} correct. Try again!`;
                }
                if (correct === total) {
                    this.userAnswers.drag = 'done';
                    this.updateActivityNav();
                    this.saveSession();
                } else if (typeof GunaLives !== 'undefined') {
                    GunaLives.loseLife();
                    this.showNotification(typeof GunaI18n !== 'undefined' ? GunaI18n.t('livesLost') : 'You lost a life!', 'error');
                }
            });
        }
    }

    wrapAsActivityScreen(el, kind) {
        if (el.classList.contains('lesson-activity-screen')) return el;
        if (el.parentElement?.classList.contains('lesson-activity-screen')) return el.parentElement;
        const screen = document.createElement('div');
        screen.className = 'lesson-activity-screen';
        if (kind) screen.dataset.kind = kind;
        el.parentNode.insertBefore(screen, el);
        screen.appendChild(el);
        return screen;
    }

    getActivityScreens() {
        return [...this.querySelectorAll('.interactive-section .lesson-activity-screen, .conversation-section .lesson-activity-screen')];
    }

    isActivityScreenComplete(screen) {
        if (!screen) return true;
        if (this.isReviewMode) return true;
        if (screen.dataset.kind === 'results' || screen.querySelector('.quiz-results')) return true;
        if (screen.querySelector('.drag-drop-exercise')) return this.userAnswers.drag === 'done';
        if (screen.querySelector('.matching-exercise')) {
            return this.userAnswers[4] != null || this.userAnswers['4'] != null;
        }
        const question = screen.querySelector('.quiz-question');
        if (question) {
            const id = question.dataset.question;
            return this.userAnswers[id] != null || this.userAnswers[Number(id)] != null;
        }
        if (screen.querySelector('.scenario')) {
            return screen.querySelector('.scenario[data-done="true"], .scenario-option.selected');
        }
        return true;
    }

    updateActivityNav() {
        const screens = this.getActivityScreens();
        if (!screens.length) return;
        const idx = Math.min(this.currentActivityIndex || 0, screens.length - 1);
        const label = this.querySelector('.activity-step-label');
        if (label) label.textContent = `Activity ${idx + 1} of ${screens.length}`;
        const prev = this.querySelector('#activityPrevBtn');
        const next = this.querySelector('#activityNextBtn');
        if (prev) prev.disabled = idx <= 0;
        if (next) {
            const isLast = idx >= screens.length - 1;
            next.disabled = isLast || !this.isActivityScreenComplete(screens[idx]);
            next.textContent = isLast ? 'Done' : 'Next activity →';
        }
    }

    showActivityScreen(index) {
        const screens = this.getActivityScreens();
        if (!screens.length) return;
        const idx = Math.max(0, Math.min(index, screens.length - 1));
        this.currentActivityIndex = idx;
        const section = this.lessonContent?.sections?.[this.currentSectionIndex];
        if (section?.type === 'interactive') this.quizActivityIndex = idx;
        screens.forEach((screen, i) => screen.classList.toggle('active', i === idx));
        const results = screens[idx]?.querySelector('.quiz-results');
        if (results && this.quizCompleted) results.style.display = 'block';
        this._duoAwaitingContinue = false;
        this._pendingAnswer = null;
        this.updateActivityNav();
        this.syncDuoProgress();
        this.saveSession();
    }

    bindActivityChrome(root, screens) {
        if (!root || screens.length < 2) return;
        root.dataset.paged = 'true';
        // Only the Duolingo CHECK/CONTINUE footer advances activities — no Next buttons.
        root.querySelector('.activity-nav')?.remove();
        this.showActivityScreen(this.currentActivityIndex || 0);
    }

    setupActivityPaging() {
        const root = this.querySelector('.interactive-section');
        if (!root) return;
        let screens = [...root.querySelectorAll('.lesson-activity-screen')];
        if (!screens.length) {
            root.querySelectorAll('.drag-drop-exercise').forEach((el) => this.wrapAsActivityScreen(el, 'drag'));
            root.querySelectorAll('.quiz-question').forEach((el) => {
                const kind = el.querySelector('.matching-exercise') ? 'match' : 'quiz';
                this.wrapAsActivityScreen(el, kind);
            });
            const results = root.querySelector('.quiz-results');
            if (results) this.wrapAsActivityScreen(results, 'results');
            screens = [...root.querySelectorAll('.lesson-activity-screen')];
        }
        this.bindActivityChrome(root, screens);
    }

    setupConversationPaging() {
        const root = this.querySelector('.conversation-section');
        if (!root) return;
        const scenarios = [...root.querySelectorAll('.scenario')];
        if (scenarios.length < 2) return;
        scenarios.forEach((el) => this.wrapAsActivityScreen(el, 'talk'));
        const screens = [...root.querySelectorAll('.lesson-activity-screen')];
        this.currentActivityIndex = 0;
        this.bindActivityChrome(root, screens);
    }

    navigateToSection(sectionIndex) {
        if (!this.lessonContent?.sections) return;
        if (!this.canGoToSection(sectionIndex)) return;
        if (sectionIndex >= 0 && sectionIndex < this.lessonContent.sections.length) {
            const prevType = this.lessonContent.sections[this.currentSectionIndex]?.type;
            if (prevType === 'interactive') this.quizActivityIndex = this.currentActivityIndex || 0;
            this.currentSectionIndex = sectionIndex;
            const nextType = this.lessonContent.sections[sectionIndex]?.type;
            this.currentActivityIndex = nextType === 'interactive' ? (this.quizActivityIndex || 0) : 0;
            if (sectionIndex > this.maxSectionReached) {
                this.maxSectionReached = sectionIndex;
            }
            this.saveSession();
            this.render();
            this.initializeEventListeners();
            if (window.HubFlow && typeof HubFlow.scrollToTop === 'function') {
                HubFlow.scrollToTop();
            } else if (window.learningHub && typeof window.learningHub.scrollToPageTop === 'function') {
                window.learningHub.scrollToPageTop();
            } else {
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            }
        }
    }

    disconnectedCallback() {
        document.body.classList.remove('hub-lesson-active');
    }

    backToPath() {
        document.body.classList.remove('hub-lesson-active');
        if (window.learningHub) {
            window.learningHub.loadSection('learn', true);
        }
    }

    setupQuizInteractions() {
        this.enhanceQuizToDuo();
        const canAnswer = typeof GunaLives === 'undefined' || GunaLives.canPlay();

        // Select chip first — CHECK confirms (Duolingo style)
        this.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', (e) => {
                if (!canAnswer && typeof GunaLives !== 'undefined' && !GunaLives.canPlay()) {
                    this.showNotification(typeof GunaI18n !== 'undefined' ? GunaI18n.t('noLives') : 'No lives left!', 'error');
                    return;
                }
                if (this._duoAwaitingContinue) return;
                const optionEl = e.currentTarget;
                const question = optionEl.closest('.quiz-question');
                if (!question || question.querySelector('.matching-exercise')) return;

                question.querySelectorAll('.quiz-option').forEach(opt => {
                    opt.classList.remove('selected', 'correct', 'incorrect', 'used');
                });
                optionEl.classList.add('selected', 'used');
                const bank = question.querySelector('.duo-answer-bank');
                if (bank) {
                    bank.innerHTML = `<span class="duo-chip selected">${optionEl.textContent}</span>`;
                }
                this._pendingAnswer = {
                    questionId: question.dataset.question,
                    answer: optionEl.dataset.answer,
                    option: optionEl
                };
                this.syncDuoCheckButton();
            });
        });

        const checkMatchingBtn = this.querySelector('.check-matching-btn');
        if (checkMatchingBtn) {
            checkMatchingBtn.addEventListener('click', () => {
                this.checkMatchingAnswers();
            });
        }

        const retryQuizBtn = this.querySelector('.retry-quiz-btn');
        if (retryQuizBtn) {
            retryQuizBtn.addEventListener('click', () => {
                this.retryQuiz();
            });
        }

        const continueLessonBtn = this.querySelector('.continue-lesson-btn');
        if (continueLessonBtn) {
            continueLessonBtn.addEventListener('click', () => {
                this.navigateToSection(this.currentSectionIndex + 1);
            });
        }
    }

    setupConversationInteractions() {
        this.querySelectorAll('.scenario-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const scenario = e.target.closest('.scenario');
                const scenarioId = scenario.dataset.scenario;
                
                // Remove previous selections
                scenario.querySelectorAll('.scenario-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Select current option
                e.target.classList.add('selected');
                
                // Show response
                const response = scenario.querySelector('.scenario-response');
                if (response) {
                    response.style.display = 'block';
                }
                scenario.dataset.done = 'true';
                this.updateActivityNav();
                this.syncDuoCheckButton();
            });
        });
    }

    setupCompletionInteractions() {
        const completeLessonBtn = this.querySelector('.complete-lesson-btn');
        if (completeLessonBtn) {
            const hasInteractive = this.lessonContent?.sections?.some(s => s.type === 'interactive');
            if (hasInteractive && !this.quizCompleted && !this.isReviewMode) {
                completeLessonBtn.disabled = true;
                completeLessonBtn.title = 'Complete the quiz first';
            }
            completeLessonBtn.addEventListener('click', () => {
                if (hasInteractive && !this.quizCompleted && !this.isReviewMode) {
                    this.showNotification('Complete all quiz exercises before finishing.', 'error');
                    return;
                }
                if (typeof GunaLives !== 'undefined' && !GunaLives.canPlay() && hasInteractive) {
                    this.showNotification(typeof GunaI18n !== 'undefined' ? GunaI18n.t('noLives') : 'No lives left!', 'error');
                    return;
                }
                this.completeLesson();
            });
        }

        const reviewLessonBtn = this.querySelector('.review-lesson-btn');
        if (reviewLessonBtn) {
            reviewLessonBtn.addEventListener('click', () => {
                this.navigateToSection(0);
            });
        }
    }

    showQuizFeedback(questionId, userAnswer) {
        const question = this.querySelector(`[data-question="${questionId}"]`);
        if (!question) return;
        const feedback = question.querySelector('.quiz-feedback');
        if (!feedback) return;
        const correctAnswers = this.gunaLessons.getQuizAnswers(this.currentLessonId);
        
        if (Number(questionId) <= 3) {
            // Multiple choice questions
            const isCorrect = userAnswer === correctAnswers[questionId];
            const selectedOption = question.querySelector(`[data-answer="${userAnswer}"]`);
            
            if (isCorrect) {
                selectedOption.classList.add('correct');
                feedback.textContent = "¡Correcto! Well done!";
                feedback.className = 'quiz-feedback correct';
            } else {
                selectedOption.classList.add('incorrect');
                feedback.textContent = `Incorrect. The correct answer is: ${correctAnswers[questionId]}`;
                feedback.className = 'quiz-feedback incorrect';
                if (typeof GunaLives !== 'undefined') {
                    GunaLives.loseLife();
                    this.showNotification(typeof GunaI18n !== 'undefined' ? GunaI18n.t('livesLost') : 'You lost a life!', 'error');
                    this.syncDuoProgress();
                }
            }
        }
        
        feedback.style.display = 'block';
        
        // Check if all questions are answered
        this.checkQuizCompletion();
    }

    checkMatchingAnswers() {
        const matchingExercise = this.querySelector('.matching-exercise');
        const feedback = matchingExercise.querySelector('.matching-feedback');
        const correctAnswers = this.gunaLessons.getQuizAnswers(this.currentLessonId)[4];
        
        let allCorrect = true;
        const userAnswers = {};
        
        matchingExercise.querySelectorAll('.matching-item').forEach(item => {
            const pairId = item.dataset.pair;
            const select = item.querySelector('.matching-select');
            const userAnswer = select.value;
            userAnswers[pairId] = userAnswer;
            
            if (userAnswer === correctAnswers[pairId]) {
                select.style.borderColor = 'var(--success-color)';
                select.style.backgroundColor = 'rgba(46, 204, 113, 0.1)';
            } else {
                select.style.borderColor = 'var(--danger-color)';
                select.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
                allCorrect = false;
            }
        });
        
        this.userAnswers[4] = allCorrect ? userAnswers : undefined;
        if (!allCorrect) delete this.userAnswers[4];

        if (allCorrect) {
            feedback.textContent = "¡Perfecto! All matches are correct!";
            feedback.className = 'matching-feedback correct';
        } else {
            feedback.textContent = "Some matches are incorrect. Try again!";
            feedback.className = 'matching-feedback incorrect';
            if (typeof GunaLives !== 'undefined') {
                GunaLives.loseLife();
                this.showNotification(typeof GunaI18n !== 'undefined' ? GunaI18n.t('livesLost') : 'You lost a life!', 'error');
            }
        }
        
        feedback.style.display = 'block';
        this.updateActivityNav();
        this.checkQuizCompletion();
        this.saveSession();
    }

    checkQuizCompletion() {
        const answered = (n) => this.userAnswers[n] != null || this.userAnswers[String(n)] != null;
        if (answered(1) && answered(2) && answered(3) && answered(4)) {
            this.showQuizResults();
        }
    }

    showQuizResults() {
        const results = this.gunaLessons.validateQuiz(this.userAnswers, this.currentLessonId);
        const resultsDiv = this.querySelector('.quiz-results');
        if (!resultsDiv) {
            this.quizCompleted = true;
            this.gunaLessons.saveProgress(this.currentLessonId, {
                quizScore: results.score,
                quizPercentage: results.percentage,
                completed: true
            });
            return;
        }
        const correctAnswersSpan = resultsDiv.querySelector('.correct-answers');
        const progressFill = resultsDiv.querySelector('.progress-fill');
        
        if (correctAnswersSpan) correctAnswersSpan.textContent = results.score;
        if (progressFill) progressFill.style.width = `${results.percentage}%`;
        
        resultsDiv.style.display = 'block';
        this.quizCompleted = true;
        if (results.percentage === 100) localStorage.setItem('guna_perfect_quiz', '1');
        if (typeof GunaGamification !== 'undefined') GunaGamification.checkAllBadges();
        this.saveSession();
        
        this.gunaLessons.saveProgress(this.currentLessonId, {
            quizScore: results.score,
            quizPercentage: results.percentage,
            completed: true
        });
    }

    retryQuiz() {
        this.userAnswers = {};
        this.quizCompleted = false;
        
        this.querySelectorAll('.quiz-option').forEach(option => {
            option.classList.remove('selected', 'correct', 'incorrect');
        });
        
        this.querySelectorAll('.quiz-feedback').forEach(feedback => {
            feedback.style.display = 'none';
        });
        
        this.querySelectorAll('.matching-select').forEach(select => {
            select.value = '';
            select.style.borderColor = '';
            select.style.backgroundColor = '';
        });
        
        const matchFeedback = this.querySelector('.matching-feedback');
        if (matchFeedback) matchFeedback.style.display = 'none';
        const quizResults = this.querySelector('.quiz-results');
        if (quizResults) quizResults.style.display = 'none';
        this.currentActivityIndex = 0;
        this.quizActivityIndex = 0;
        this.showActivityScreen(0);
    }

    async completeLesson() {
        if (typeof GunaProgress !== 'undefined' && !GunaProgress.canAccessLesson(this.currentLessonId)) {
            this.showNotification('Cannot complete a locked lesson.', 'error');
            return;
        }
        if (typeof GunaProgress !== 'undefined') {
            await GunaProgress.completeLesson(this.currentLessonId);
        }
        this.gunaLessons.saveProgress(this.currentLessonId, {
            completed: true,
            completedAt: new Date().toISOString()
        });

        const nextId = this.currentLessonId + 1;
        const hasNext = typeof GunaProgress !== 'undefined' && nextId <= GunaProgress.TOTAL_LESSONS;
        this.showNotification(
            hasNext
                ? `🎉 Level ${this.currentLessonId} done! Next on the path: Level ${nextId}`
                : '🎉 Lesson completed! Great job!',
            'success'
        );

        window.dispatchEvent(new CustomEvent('soged:progress-updated', {
            detail: { lessonId: this.currentLessonId, nextLessonId: hasNext ? nextId : null }
        }));

        this.dispatchEvent(new CustomEvent('lessonCompleted', {
            detail: {
                lessonId: this.currentLessonId,
                nextLessonId: hasNext ? nextId : null,
                course: 'guna'
            },
            bubbles: true
        }));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#2ECC71' : '#00A3E0',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Register the custom element
customElements.define('guna-lesson-viewer', GunaLessonViewer);
