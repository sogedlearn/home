/**
 * Guna Language Lessons Content
 * Interactive lessons for the Guna language
 */

class GunaLessons {
    constructor() {
        this.currentLesson = null;
        this.userAnswers = {};
        this.lessonProgress = {};
    }

    // Get lesson content by ID
    getLessonContent(lessonId) {
        const lessons = {
            1: this.getGreetingsLesson(),
            2: this.getFamilyLesson(),
            3: this.getHomeObjectsLesson(),
            4: this.getNatureLesson(),
            5: this.getAnimalsLesson(),
            6: this.getPlantsLesson(),
            7: this.getBasicConversationLesson(),
            8: this.getAdvancedConversationLesson(),
            9: this.getCultureLesson(),
            10: this.getFinalExamLesson()
        };
        return lessons[lessonId] || lessons[1];
    }

    buildVocabRows(words) {
        return (words || []).map(w => `
            <tr>
                <td><strong>${w.guna}</strong></td>
                <td>${w.es}</td>
                <td>${w.en}</td>
                <td>
                    <button type="button" class="pronounce-btn" data-speak="${w.guna}" title="Listen">
                        <i class="fas fa-volume-up"></i> ${w.guna}
                    </button>
                </td>
            </tr>
        `).join('');
    }

    buildQuizQuestion(num, question, options) {
        return `
            <div class="quiz-question" data-question="${num}">
                <h4>Question ${num}: ${question}</h4>
                <div class="quiz-options">
                    ${options.map(o => `<button class="quiz-option" data-answer="${o.value}">${o.label}</button>`).join('')}
                </div>
                <div class="quiz-feedback" style="display: none;"></div>
            </div>
        `;
    }

    buildMatchingExercise(pairs) {
        return `
            <div class="quiz-question" data-question="4">
                <h4>Question 4: Match each Guna word with its meaning:</h4>
                <div class="matching-exercise">
                    <div class="matching-pairs">
                        ${pairs.map((p, i) => `
                            <div class="matching-item" data-pair="${i + 1}">
                                <span class="guna-text">${p.guna}</span>
                                <select class="matching-select">
                                    <option value="">Select meaning...</option>
                                    ${p.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
                                </select>
                            </div>
                        `).join('')}
                    </div>
                    <div class="matching-feedback" style="display: none;"></div>
                    <button type="button" class="check-matching-btn">Check Matches</button>
                </div>
            </div>
        `;
    }

    buildMemoryGame(words, difficulty = 'medium') {
        const pairCounts = { easy: 3, medium: 6, hard: 10, expert: 15 };
        const count = Math.min(pairCounts[difficulty] || 6, words.length);
        const selected = words.slice(0, count);
        const pairs = selected.map((w, i) => ({
            id: `pair-${i}`,
            guna: w.guna,
            icon: w.icon || '📝',
            es: w.es,
            en: w.en
        }));
        return `
            <div class="memory-game-exercise" data-difficulty="${difficulty}">
                <h3>🧠 Memory Match</h3>
                <p>Find matching pairs — Guna word + meaning image. Tap cards to flip. Complete all pairs to continue!</p>
                <div class="memory-difficulty-bar" role="group" aria-label="Difficulty">
                    ${['easy', 'medium', 'hard', 'expert'].map(d => `
                        <button type="button" class="memory-diff-btn ${d === difficulty ? 'active' : ''}" data-diff="${d}">
                            ${d.charAt(0).toUpperCase() + d.slice(1)} (${(pairCounts[d] || 3) * 2})
                        </button>
                    `).join('')}
                </div>
                <div class="memory-stats">
                    <span>Moves: <strong id="memoryMoves">0</strong></span>
                    <span>Pairs: <strong id="memoryPairs">0</strong> / ${count}</span>
                </div>
                <div class="memory-grid" id="memoryGrid" data-pairs='${JSON.stringify(pairs).replace(/'/g, "&#39;")}'></div>
                <div class="memory-feedback" id="memoryFeedback" hidden></div>
            </div>
        `;
    }

    buildFlashcards(words) {
        if (!words?.length) return '<p>No flashcards available.</p>';
        return `
            <div class="flashcard-deck" data-deck-size="${words.length}">
                <div class="flashcard" id="activeFlashcard">
                    <div class="flashcard-front">
                        <span class="flashcard-icon">${words[0].icon || '📝'}</span>
                        <h3 class="flashcard-guna">${words[0].guna}</h3>
                        <p class="flashcard-hint">Tap to reveal meaning</p>
                    </div>
                    <div class="flashcard-back" style="display:none;">
                        <p class="flashcard-es">${words[0].es}</p>
                        <p class="flashcard-en">${words[0].en}</p>
                        <p class="flashcard-example"><em>${words[0].example || ''}</em></p>
                    </div>
                </div>
                <div class="flashcard-controls">
                    <button type="button" class="flashcard-btn" id="flashPrev" disabled><i class="fas fa-chevron-left"></i></button>
                    <span class="flashcard-counter">1 / ${words.length}</span>
                    <button type="button" class="flashcard-btn" id="flashNext"><i class="fas fa-chevron-right"></i></button>
                    <button type="button" class="flashcard-speak" id="flashSpeak" data-speak="${words[0].guna}"><i class="fas fa-volume-up"></i></button>
                </div>
                <script type="application/json" class="flashcard-data">${JSON.stringify(words)}</script>
            </div>
        `;
    }

    buildDragDropExercise(pairs) {
        const items = pairs.map((p, i) => `
            <div class="drag-item" draggable="true" data-value="${p.value}" id="drag-${i}">${p.guna}</div>
        `).join('');
        const zones = pairs.map((p, i) => `
            <div class="drop-zone" data-accept="${p.value}" id="zone-${i}">
                <span class="drop-label">${p.label}</span>
                <div class="drop-slot"></div>
            </div>
        `).join('');
        return `
            <div class="drag-drop-exercise" data-question="drag">
                <h4>Drag each Guna word to its meaning:</h4>
                <div class="drag-items">${items}</div>
                <div class="drop-zones">${zones}</div>
                <div class="drag-feedback" style="display:none;"></div>
                <button type="button" class="check-drag-btn">Check Answers</button>
            </div>
        `;
    }

    buildPronunciationSection(words) {
        return `
            <div class="pronunciation-section">
                <h3>🔊 Pronunciation Practice</h3>
                <p>Tap each word to hear it. Repeat aloud to practice.</p>
                <div class="pronunciation-grid">
                    ${(words || []).map(w => `
                        <button type="button" class="pronunciation-card" data-speak="${w.guna}">
                            <span class="pron-icon">${w.icon || '🔊'}</span>
                            <strong>${w.guna}</strong>
                            <small>${w.en}</small>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    buildStandardLesson(config) {
        const words = config.words || [];
        const matchPairs = config.matchPairs || [];
        const optionPool = config.matchOptionPool || [];
        const dragPairs = config.dragPairs || matchPairs.map((p, i) => ({
            guna: p.guna,
            value: optionPool[i]?.value || `m${i}`,
            label: optionPool[i]?.label || `Meaning ${i + 1}`
        }));

        return {
            id: config.id,
            title: config.title,
            subtitle: config.subtitle,
            duration: config.duration,
            xp: config.xp,
            sections: [
                {
                    type: 'introduction',
                    title: config.introTitle,
                    content: `
                        <div class="lesson-intro">
                            <div class="intro-header">
                                <h2>${config.introHeading}</h2>
                                <p>${config.introText}</p>
                            </div>
                            <div class="cultural-context">
                                <h3>🌊 Cultural Context</h3>
                                <p>${config.culturalText}</p>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'vocabulary',
                    title: config.vocabTitle,
                    content: `
                        <div class="vocabulary-section">
                            <h3>📚 ${config.vocabTitle}</h3>
                            <p>${config.vocabIntro}</p>
                            <div class="vocabulary-table">
                                <table>
                                    <thead>
                                        <tr><th>Guna</th><th>Español</th><th>English</th><th>Pronunciation</th></tr>
                                    </thead>
                                    <tbody>${this.buildVocabRows(words)}</tbody>
                                </table>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'pronunciation',
                    title: 'Pronunciation',
                    content: this.buildPronunciationSection(words)
                },
                {
                    type: 'flashcards',
                    title: 'Flashcards',
                    content: this.buildFlashcards(words)
                },
                {
                    type: 'memory',
                    title: 'Memory Match',
                    content: this.buildMemoryGame(words, config.memoryDifficulty || 'medium')
                },
                {
                    type: 'interactive',
                    title: 'Practice & Quiz',
                    content: `
                        <div class="interactive-section">
                            <h3>🎯 Let's Practice!</h3>
                            <p>Complete all exercises to finish this level:</p>
                            ${config.dragPairs ? this.buildDragDropExercise(dragPairs) : ''}
                            <div class="quiz-container">
                                ${this.buildQuizQuestion(1, config.quiz[0].q, config.quiz[0].options)}
                                ${this.buildQuizQuestion(2, config.quiz[1].q, config.quiz[1].options)}
                                ${this.buildQuizQuestion(3, config.quiz[2].q, config.quiz[2].options)}
                                ${this.buildMatchingExercise(matchPairs.map(p => ({
                                    guna: p.guna,
                                    options: optionPool
                                })))}
                                <div class="quiz-results" style="display: none;">
                                    <h4>Quiz Results</h4>
                                    <p>Score: <span class="correct-answers">0</span> / 4</p>
                                    <div class="progress-track"><div class="progress-fill" style="width: 0%"></div></div>
                                    <button type="button" class="continue-lesson-btn" style="margin-top:1rem;">Continue to Summary →</button>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'completion',
                    title: 'Lesson Complete!',
                    content: `
                        <div class="completion-section">
                            <h3>🎉 ${config.completionTitle}</h3>
                            <p>${config.completionText}</p>
                            <div class="learned-greetings">
                                <h4>✅ Words you learned:</h4>
                                <ul>${words.map(w => `<li><strong>${w.guna}</strong> — ${w.en}</li>`).join('')}</ul>
                            </div>
                            <div class="lesson-xp-reward">
                                <span class="xp-badge">+${config.xp} XP</span>
                                <span class="ogobs-badge">+25 🥥</span>
                            </div>
                            <div class="lesson-completion">
                                <button class="complete-lesson-btn">Complete Lesson</button>
                                <button class="review-lesson-btn">Review Again</button>
                            </div>
                        </div>
                    `
                }
            ]
        };
    }

    buildLessonFromConfig(configId) {
        const cfg = window.GUNA_LESSON_CONFIGS?.[configId];
        if (!cfg) {
            const fallback = window.GUNA_VOCABULARY?.greetings || [];
            return this.buildStandardLesson({
                id: 1, title: 'Guna Lesson', subtitle: '', duration: 15, xp: 50, words: fallback,
                introTitle: 'Lesson', introHeading: 'Guna', introText: '', culturalText: '',
                vocabTitle: 'Vocabulary', vocabIntro: '', quiz: [
                    { q: 'Test', options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }, { value: 'd', label: 'D' }] },
                    { q: 'Test', options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }, { value: 'd', label: 'D' }] },
                    { q: 'Test', options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }, { value: 'd', label: 'D' }] }
                ],
                matchPairs: [], matchOptionPool: [], completionTitle: 'Done', completionText: 'Done'
            });
        }
        const words = window.GUNA_VOCABULARY?.[cfg.wordsKey] || [];
        return this.buildStandardLesson({ ...cfg, words });
    }

    getGreetingsLesson() { return window.GunaLevelLessons?.getGreetingsLesson() || this.buildLessonFromConfig(1); }
    getFamilyLesson() { return window.GunaLevelLessons?.getFamilyLesson() || this.buildLessonFromConfig(2); }
    getHomeObjectsLesson() { return window.GunaLevelLessons?.getHomeObjectsLesson() || this.buildLessonFromConfig(3); }
    getNatureLesson() { return this.buildLessonFromConfig(4); }
    getAnimalsLesson() { return this.buildLessonFromConfig(5); }
    getPlantsLesson() { return this.buildLessonFromConfig(6); }
    getBasicConversationLesson() { return this.buildLessonFromConfig(7); }

    getAdvancedConversationLesson() {
        const base = this.buildLessonFromConfig(7);
        base.id = 8;
        base.title = '💬 Advanced Conversation';
        base.subtitle = 'Advanced dialogues and real scenarios';
        base.xp = 175;
        base.duration = 35;
        base.sections.splice(4, 0, {
            type: 'conversation',
            title: 'Dialogues',
            content: `
                <div class="conversation-section">
                    <h3>💬 Practice Dialogues</h3>
                    <div class="scenario" data-scenario="1">
                        <h4>Scenario 1: Meeting on the island</h4>
                        <p><strong>Person A:</strong> ¡ anna ! — Hello!</p>
                        <p><strong>Person B:</strong> Eye, degii. Na an mar.</p>
                        <div class="scenario-options">
                            <button type="button" class="scenario-option">Reply: ¡ anna !</button>
                            <button type="button" class="scenario-option">Reply: degi malo</button>
                        </div>
                        <div class="scenario-response" style="display:none;"><p>Great! You greeted them properly.</p></div>
                    </div>
                    <div class="scenario" data-scenario="2">
                        <h4>Scenario 2: Asking where someone is</h4>
                        <p><strong>Question:</strong> Bia an mar? — Where are you?</p>
                        <div class="scenario-options">
                            <button type="button" class="scenario-option">Muu — At home</button>
                            <button type="button" class="scenario-option">Sii — At the water</button>
                        </div>
                        <div class="scenario-response" style="display:none;"><p>Good answer!</p></div>
                    </div>
                </div>
            `
        });
        return base;
    }

    getCultureLesson() {
        const words = window.GUNA_VOCABULARY?.culture || [];
        return this.buildStandardLesson({
            id: 9, title: '🧵 Guna Culture', subtitle: 'History, molas and traditions',
            duration: 35, xp: 150, words,
            introTitle: 'Guna Culture', introHeading: '🧵 Guna Culture',
            introText: 'Explore molas, the Tule Revolution, spirituality and social organization.',
            culturalText: 'The 1925 Tule Revolution defended Guna autonomy. Molas express identity. Saglas lead community congresses.',
            vocabTitle: 'Cultural Concepts', vocabIntro: 'Key cultural vocabulary:',
            quiz: [
                { q: 'What are Guna molas?', options: [
                    { value: 'textiles', label: 'Traditional textiles' }, { value: 'boats', label: 'Boats' },
                    { value: 'songs', label: 'Songs only' }, { value: 'houses', label: 'Houses' }
                ]},
                { q: 'The 1925 revolution defended:', options: [
                    { value: 'autonomy', label: 'Guna customs and autonomy' }, { value: 'trade', label: 'Trade only' },
                    { value: 'mining', label: 'Mining' }, { value: 'tourism', label: 'Tourism' }
                ]},
                { q: 'Who is the creator in Guna tradition?', options: [
                    { value: 'ibeorgun', label: 'Ibeorgun' }, { value: 'kantule', label: 'Kantule' },
                    { value: 'sagla', label: 'Sagla' }, { value: 'ardi', label: 'Ardi' }
                ]}
            ],
            matchPairs: [{ guna: 'Mola' }, { guna: 'Sagla' }, { guna: 'Dulegaya' }],
            matchOptionPool: [
                { value: 'textile', label: 'Traditional textile' }, { value: 'leader', label: 'Community leader' },
                { value: 'language', label: 'Guna language' }, { value: 'territory', label: 'Territory' }
            ],
            dragPairs: [
                { guna: 'Mola', value: 'textile', label: 'Traditional textile' },
                { guna: 'Sagla', value: 'leader', label: 'Community leader' },
                { guna: 'Dulegaya', value: 'language', label: 'Guna language' }
            ],
            completionTitle: 'Culture explored!', completionText: 'You understand Guna history, molas and traditions.'
        });
    }

    getFinalExamLesson() {
        const base = this.buildStandardLesson({
            id: 10, title: '👑 Basic Mastery — Final Exam', subtitle: 'Prove your Guna mastery',
            duration: 45, xp: 250,
            words: [
                ...(window.GUNA_VOCABULARY?.greetings || []).slice(0, 2),
                ...(window.GUNA_VOCABULARY?.family || []).slice(0, 2),
                ...(window.GUNA_VOCABULARY?.animals || []).slice(0, 2)
            ],
            introTitle: 'Final Exam', introHeading: '👑 Basic Mastery Exam',
            introText: 'Complete the final exam covering all 9 previous levels to earn your certificate.',
            culturalText: 'Finishing this path honors the Guna language and the elders who preserve it.',
            vocabTitle: 'Review', vocabIntro: 'Key words from your journey:',
            quiz: [
                { q: 'Goodbye in Guna:', options: [
                    { value: 'malo', label: 'degi malo' }, { value: 'anna', label: '¡ anna !' },
                    { value: 'gwad', label: 'Gwad' }, { value: 'nana', label: 'Nana' }
                ]},
                { q: 'The 1925 revolution is called:', options: [
                    { value: 'tule', label: 'Tule Revolution' }, { value: 'coco', label: 'Coconut Revolution' },
                    { value: 'mola', label: 'Mola Revolution' }, { value: 'sea', label: 'Sea Revolution' }
                ]},
                { q: 'Nana means:', options: [
                    { value: 'mother', label: 'Mother' }, { value: 'father', label: 'Father' },
                    { value: 'water', label: 'Water' }, { value: 'fire', label: 'Fire' }
                ]}
            ],
            matchPairs: [{ guna: 'Gwad' }, { guna: 'Sii' }, { guna: 'Ardi' }],
            matchOptionPool: [
                { value: 'coconut', label: 'Coconut' }, { value: 'water', label: 'Water' },
                { value: 'turtle', label: 'Turtle' }, { value: 'mother', label: 'Mother' }
            ],
            dragPairs: [
                { guna: 'Gwad', value: 'coconut', label: 'Coconut' },
                { guna: 'Sii', value: 'water', label: 'Water' },
                { guna: 'Ardi', value: 'turtle', label: 'Turtle' }
            ],
            completionTitle: 'Grand Master!', completionText: 'You completed all 10 levels of the Guna Learning Path!'
        });
        const completion = base.sections.find(s => s.type === 'completion');
        if (completion) {
            completion.content = `
                <div class="completion-section">
                    <div class="certificate-card">
                        <h3>🏆 Certificate of Basic Guna Mastery</h3>
                        <p>This certifies that you have completed all 10 levels of the Guna Learning Path.</p>
                        <p class="cert-date">Date: ${new Date().toLocaleDateString('en-US')}</p>
                    </div>
                    <div class="lesson-xp-reward">
                        <span class="xp-badge">+250 XP</span>
                        <span class="ogobs-badge">+50 🥥</span>
                    </div>
                    <div class="lesson-completion">
                        <button class="complete-lesson-btn">Claim Certificate</button>
                    </div>
                </div>
            `;
        }
        return base;
    }
    // Quiz answers for validation (per lesson)
    getQuizAnswers(lessonId) {
        const richAnswers = {
            1: { 1: 'anna', 2: 'goodbye', 3: 'banmalo', 4: { 1: 'hello', 2: 'goodbye', 3: 'tomorrow' } },
            2: { 1: 'nana', 2: 'father', 3: 'dada', 4: { 1: 'mother', 2: 'father', 3: 'brother' } },
            3: { 1: 'muu', 2: 'plate', 3: 'tapa', 4: { 1: 'house', 2: 'table', 3: 'spoon' } }
        };
        if (richAnswers[lessonId]) return richAnswers[lessonId];
        const answers = window.GUNA_LESSON_CONFIGS?.quizAnswers || {};
        return answers[lessonId] || answers[1];
    }

    validateQuiz(answers, lessonId = 1) {
        const correctAnswers = this.getQuizAnswers(lessonId);
        let score = 0;
        const totalQuestions = 4;
        const feedback = {};

        // Check multiple choice questions
        for (let i = 1; i <= 3; i++) {
            if (answers[i] === correctAnswers[i]) {
                score++;
                feedback[i] = { correct: true, message: "¡Correcto! Well done!" };
            } else {
                feedback[i] = { correct: false, message: `Incorrect. The correct answer is: ${correctAnswers[i]}` };
            }
        }

        // Check matching exercise
        const matchingCorrect = answers[4] && 
            answers[4][1] === correctAnswers[4][1] &&
            answers[4][2] === correctAnswers[4][2] &&
            answers[4][3] === correctAnswers[4][3];

        if (matchingCorrect) {
            score++;
            feedback[4] = { correct: true, message: "¡Perfecto! All matches are correct!" };
        } else {
            feedback[4] = { correct: false, message: "Some matches are incorrect. Try again!" };
        }

        return {
            score,
            totalQuestions,
            percentage: Math.round((score / totalQuestions) * 100),
            feedback
        };
    }

    // Save lesson progress
    saveProgress(lessonId, progress) {
        const userProgress = JSON.parse(localStorage.getItem('gunaProgress') || '{}');
        userProgress[lessonId] = {
            ...userProgress[lessonId],
            ...progress,
            completedAt: new Date().toISOString()
        };
        localStorage.setItem('gunaProgress', JSON.stringify(userProgress));
    }

    // Get lesson progress
    getProgress(lessonId) {
        const userProgress = JSON.parse(localStorage.getItem('gunaProgress') || '{}');
        return userProgress[lessonId] || null;
    }
}

// Export for use in other components
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GunaLessons;
} else {
    window.GunaLessons = GunaLessons;
}
