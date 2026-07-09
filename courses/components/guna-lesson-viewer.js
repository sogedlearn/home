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
        this.isReviewMode = false;
    }

    connectedCallback() {
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
        this.maxSectionReached = 0;
        this.userAnswers = {};
        this.quizCompleted = false;
        this.memoryCompleted = false;

        const session = typeof GunaProgress !== 'undefined' ? GunaProgress.getLessonSession(this.currentLessonId) : null;
        if (session && !this.isReviewMode) {
            this.currentSectionIndex = session.sectionIndex || 0;
            this.maxSectionReached = session.maxSectionReached ?? this.currentSectionIndex;
            this.userAnswers = session.userAnswers || {};
            this.quizCompleted = !!session.quizCompleted;
            this.memoryCompleted = !!session.memoryCompleted;
        }

        this.loadLesson();
        this.render();
        this.initializeEventListeners();
    }

    loadLesson() {
        this.lessonContent = this.gunaLessons.getLessonContent(this.currentLessonId);
        if (!this.lessonContent) {
            this.lessonContent = this.gunaLessons.getLessonContent(1);
        }
    }

    render() {
        if (!this.lessonContent) {
            this.innerHTML = '<p>Loading lesson...</p>';
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
                    background: linear-gradient(135deg, #00A3E0, #29B6F6);
                    color: white;
                    border-radius: 16px;
                    position: relative;
                    overflow: hidden;
                }

                .lesson-back-btn {
                    position: absolute;
                    top: 1rem;
                    left: 1rem;
                    z-index: 2;
                    padding: 0.5rem 1rem;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.4);
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
                    background: linear-gradient(135deg, #00A3E0, #29B6F6);
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 160, 224, 0.3);
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
                    color: var(--primary-color);
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
                    background: var(--primary-color);
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

                .audio-player-container {
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin: 2rem 0;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .audio-player-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .audio-player-header i {
                    font-size: 1.5rem;
                    color: var(--primary-color);
                }

                .audio-player-header h4 {
                    margin: 0;
                    color: var(--text-primary);
                }

                .audio-controls {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .play-btn {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: var(--gradient-primary);
                    color: white;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    transition: all 0.3s ease;
                }

                .play-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
                }

                .progress-container {
                    flex: 1;
                    height: 8px;
                    background: #e9ecef;
                    border-radius: 4px;
                    overflow: hidden;
                    cursor: pointer;
                }

                .progress-bar-audio {
                    height: 100%;
                    background: var(--gradient-primary);
                    width: 0%;
                    transition: width 0.1s linear;
                }

                .time-display {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    min-width: 80px;
                    text-align: center;
                }

                .volume-control {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .volume-slider {
                    width: 80px;
                    cursor: pointer;
                }

                .download-resources {
                    background: white;
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin: 2rem 0;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .download-resources h4 {
                    margin-bottom: 1rem;
                    color: var(--text-primary);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .download-resources h4 i {
                    color: var(--primary-color);
                }

                .download-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                }

                .download-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem;
                    background: var(--bg-tertiary);
                    border-radius: 8px;
                    text-decoration: none;
                    color: var(--text-primary);
                    transition: all 0.3s ease;
                }

                .download-item:hover {
                    background: var(--primary-light);
                    transform: translateY(-2px);
                }

                .download-item i {
                    font-size: 1.2rem;
                    color: var(--primary-color);
                }

                .download-item .file-info {
                    flex: 1;
                }

                .download-item .file-name {
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .download-item .file-size {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                }

                .download-item .download-icon {
                    color: var(--primary-color);
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

            <div class="lesson-viewer">
                ${typeof GunaLives !== 'undefined' && !GunaLives.canPlay() ? `
                <div class="lives-warning-banner">
                    <i class="fas fa-heart-broken"></i>
                    <span>${typeof GunaI18n !== 'undefined' ? GunaI18n.t('noLives') : 'No lives left! Visit the store or wait for regeneration.'}</span>
                    <button type="button" class="btn-duo btn-duo-primary" id="goToStoreBtn">Tienda</button>
                </div>` : ''}
                <div class="lesson-header">
                    <button type="button" class="lesson-back-btn" id="backToPathBtn">
                        <i class="fas fa-arrow-left"></i> Back to Path
                    </button>
                    <h1 class="lesson-title">${this.lessonContent.title}</h1>
                    <p class="lesson-subtitle">${this.lessonContent.subtitle}</p>
                    
                    <div class="lesson-stats">
                        <div class="stat-item">
                            <span class="stat-value">${this.lessonContent.duration}</span>
                            <span class="stat-label">minutes</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${this.lessonContent.xp}</span>
                            <span class="stat-label">XP</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${this.lessonContent.sections.length}</span>
                            <span class="stat-label">sections</span>
                        </div>
                    </div>
                </div>

                <div class="section-navigation">
                    ${this.lessonContent.sections.map((section, index) => {
                        const locked = index > this.maxSectionReached;
                        return `
                        <button class="section-tab ${index === this.currentSectionIndex ? 'active' : ''} ${locked ? 'tab-locked' : ''}" 
                                data-section="${index}" ${locked ? 'disabled' : ''}>
                            ${this.getSectionIcon(section.type)} ${section.title}
                        </button>`;
                    }).join('')}
                </div>

                <div class="section-content">
                    ${this.lessonContent.sections[this.currentSectionIndex]?.content || '<p>Loading section…</p>'}
                </div>

                <!-- Audio Player Section -->
                <div class="audio-player-container">
                    <div class="audio-player-header">
                        <i class="fas fa-headphones"></i>
                        <h4>Audio Nativo</h4>
                    </div>
                    <div class="audio-controls">
                        <button class="play-btn" id="audioPlayBtn">
                            <i class="fas fa-play"></i>
                        </button>
                        <div class="progress-container" id="audioProgress">
                            <div class="progress-bar-audio" id="audioProgressBar"></div>
                        </div>
                        <span class="time-display" id="audioTime">0:00 / 0:00</span>
                        <div class="volume-control">
                            <i class="fas fa-volume-up"></i>
                            <input type="range" class="volume-slider" id="volumeSlider" min="0" max="100" value="80">
                        </div>
                    </div>
                    <audio id="audioElement" src="../audio/guna-lesson-${this.currentLessonId}.mp3" preload="auto"></audio>
                </div>

                <!-- Download Resources Section -->
                <div class="download-resources">
                    <h4>
                        <i class="fas fa-download"></i>
                        Recursos Offline
                    </h4>
                    <div class="download-grid">
                        <a href="../resources/lesson-${this.currentLessonId}-audio.mp3" download class="download-item">
                            <i class="fas fa-file-audio"></i>
                            <div class="file-info">
                                <span class="file-name">Audio de la Lección</span>
                                <span class="file-size">2.5 MB</span>
                            </div>
                            <i class="fas fa-download download-icon"></i>
                        </a>
                        <a href="../resources/lesson-${this.currentLessonId}-vocabulary.pdf" download class="download-item">
                            <i class="fas fa-file-pdf"></i>
                            <div class="file-info">
                                <span class="file-name">Vocabulario PDF</span>
                                <span class="file-size">1.2 MB</span>
                            </div>
                            <i class="fas fa-download download-icon"></i>
                        </a>
                        <a href="../resources/lesson-${this.currentLessonId}-transcript.pdf" download class="download-item">
                            <i class="fas fa-file-alt"></i>
                            <div class="file-info">
                                <span class="file-name">Transcripción</span>
                                <span class="file-size">0.8 MB</span>
                            </div>
                            <i class="fas fa-download download-icon"></i>
                        </a>
                    </div>
                </div>

                <div class="navigation-buttons">
                    <button class="nav-btn" id="prevBtn" ${this.currentSectionIndex === 0 ? 'disabled' : ''}>
                        <i class="fas fa-arrow-left"></i> Previous
                    </button>
                    <button class="nav-btn" id="nextBtn" ${this.isNextDisabled() ? 'disabled' : ''}>
                        Next <i class="fas fa-arrow-right"></i>
                    </button>
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
            memoryCompleted: this.memoryCompleted
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

        // Audio player functionality
        this.initializeAudioPlayer();

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

        // Navigation buttons
        this.querySelector('#prevBtn')?.addEventListener('click', () => {
            this.navigateToSection(this.currentSectionIndex - 1);
        });

        this.querySelector('#nextBtn')?.addEventListener('click', () => {
            if (this.isCurrentSectionComplete()) {
                this.navigateToSection(this.currentSectionIndex + 1);
            }
        });

        // Quiz interactions
        this.setupQuizInteractions();

        // Conversation scenarios
        this.setupConversationInteractions();

        // Pronunciation, flashcards, drag-drop
        this.setupPronunciation();
        this.setupFlashcards();
        this.setupMemoryGame();
        this.setupDragDrop();

        // Lesson completion
        this.setupCompletionInteractions();
    }

    speakText(text) {
        if (!text || !window.speechSynthesis) return;
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
        };

        card?.addEventListener('click', () => {
            flipped = !flipped;
            card.querySelector('.flashcard-front').style.display = flipped ? 'none' : '';
            card.querySelector('.flashcard-back').style.display = flipped ? '' : 'none';
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

    initializeAudioPlayer() {
        const audioElement = this.querySelector('#audioElement');
        const playBtn = this.querySelector('#audioPlayBtn');
        const progressBar = this.querySelector('#audioProgressBar');
        const progressContainer = this.querySelector('#audioProgress');
        const timeDisplay = this.querySelector('#audioTime');
        const volumeSlider = this.querySelector('#volumeSlider');

        if (!audioElement || !playBtn) return;

        let isPlaying = false;

        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        };

        const updateTimeDisplay = () => {
            const current = audioElement.currentTime;
            const duration = audioElement.duration || 0;
            timeDisplay.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
        };

        const updateProgress = () => {
            const progress = (audioElement.currentTime / audioElement.duration) * 100;
            progressBar.style.width = `${progress}%`;
        };

        playBtn.addEventListener('click', () => {
            if (isPlaying) {
                audioElement.pause();
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
            } else {
                audioElement.play();
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
            isPlaying = !isPlaying;
        });

        audioElement.addEventListener('timeupdate', () => {
            updateTimeDisplay();
            updateProgress();
        });

        audioElement.addEventListener('ended', () => {
            isPlaying = false;
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            progressBar.style.width = '0%';
        });

        audioElement.addEventListener('loadedmetadata', () => {
            updateTimeDisplay();
        });

        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = rect.width;
            const percentage = x / width;
            audioElement.currentTime = percentage * audioElement.duration;
        });

        volumeSlider.addEventListener('input', (e) => {
            audioElement.volume = e.target.value / 100;
        });

        // Set initial volume
        audioElement.volume = 0.8;
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

        let dragged = null;
        exercise.querySelectorAll('.drag-item').forEach(item => {
            item.addEventListener('dragstart', () => { dragged = item; });
            item.addEventListener('dragend', () => { dragged = null; });
        });

        exercise.querySelectorAll('.drop-zone').forEach(zone => {
            zone.addEventListener('dragover', (e) => e.preventDefault());
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                if (!dragged) return;
                const slot = zone.querySelector('.drop-slot');
                if (slot) {
                    slot.innerHTML = '';
                    slot.appendChild(dragged);
                }
            });
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
                } else if (typeof GunaLives !== 'undefined') {
                    GunaLives.loseLife();
                    this.showNotification(typeof GunaI18n !== 'undefined' ? GunaI18n.t('livesLost') : 'You lost a life!', 'error');
                }
            });
        }
    }

    navigateToSection(sectionIndex) {
        if (!this.lessonContent?.sections) return;
        if (!this.canGoToSection(sectionIndex)) return;
        if (sectionIndex >= 0 && sectionIndex < this.lessonContent.sections.length) {
            this.currentSectionIndex = sectionIndex;
            if (sectionIndex > this.maxSectionReached) {
                this.maxSectionReached = sectionIndex;
            }
            this.saveSession();
            this.render();
            this.initializeEventListeners();
        }
    }

    backToPath() {
        if (window.learningHub) {
            window.learningHub.loadSection('learn', true);
        }
    }

    setupQuizInteractions() {
        const canAnswer = typeof GunaLives === 'undefined' || GunaLives.canPlay();

        // Quiz options
        this.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', (e) => {
                if (!canAnswer && typeof GunaLives !== 'undefined' && !GunaLives.canPlay()) {
                    this.showNotification(typeof GunaI18n !== 'undefined' ? GunaI18n.t('noLives') : 'No lives left!', 'error');
                    return;
                }
                const optionEl = e.currentTarget;
                const question = optionEl.closest('.quiz-question');
                if (!question) return;
                const questionId = question.dataset.question;
                
                question.querySelectorAll('.quiz-option').forEach(opt => {
                    opt.classList.remove('selected', 'correct', 'incorrect');
                });
                
                optionEl.classList.add('selected');
                this.userAnswers[questionId] = optionEl.dataset.answer;
                this.showQuizFeedback(questionId, optionEl.dataset.answer);
                this.saveSession();
            });
        });

        // Matching exercise
        const checkMatchingBtn = this.querySelector('.check-matching-btn');
        if (checkMatchingBtn) {
            checkMatchingBtn.addEventListener('click', () => {
                this.checkMatchingAnswers();
            });
        }

        // Quiz results
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
        const feedback = question.querySelector('.quiz-feedback');
        const correctAnswers = this.gunaLessons.getQuizAnswers(this.currentLessonId);
        
        if (questionId <= 3) {
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
                    if (!GunaLives.canPlay()) {
                        setTimeout(() => this.render(), 600);
                    }
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
        
        this.userAnswers[4] = userAnswers;
        
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
        this.checkQuizCompletion();
        this.saveSession();
    }

    checkQuizCompletion() {
        const totalQuestions = 4;
        const answeredQuestions = Object.keys(this.userAnswers).length;
        
        if (answeredQuestions === totalQuestions) {
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
    }

    completeLesson() {
        if (typeof GunaProgress !== 'undefined' && !GunaProgress.canAccessLesson(this.currentLessonId)) {
            this.showNotification('Cannot complete a locked lesson.', 'error');
            return;
        }
        if (typeof GunaProgress !== 'undefined') {
            GunaProgress.completeLesson(this.currentLessonId);
        }
        if (typeof GunaGamification !== 'undefined') {
            GunaGamification.onLessonComplete(this.currentLessonId, this.lessonContent?.xp || 50);
            if (this.currentLessonId === 10) {
                GunaGamification.awardBadge('guna-master');
                if (typeof CocosEconomy !== 'undefined') CocosEconomy.addOggob(25);
            }
        }
        this.gunaLessons.saveProgress(this.currentLessonId, {
            completed: true,
            completedAt: new Date().toISOString()
        });
        
        this.showNotification('🎉 Lesson completed! Great job!', 'success');
        
        this.dispatchEvent(new CustomEvent('lessonCompleted', {
            detail: {
                lessonId: this.currentLessonId,
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
