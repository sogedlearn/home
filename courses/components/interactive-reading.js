/**
 * Interactive Reading Component with Quiz System
 * Awards +50 Cocos for perfect quiz completion
 */
class InteractiveReading extends HTMLElement {
    connectedCallback() {
        this.currentReading = null;
        this.quizStarted = false;
        this.quizCompleted = false;
        this.currentQuestion = 0;
        this.score = 0;
        this.readings = this.getReadings();
        this.render();
    }

    getReadings() {
        return [
            {
                id: 'mola-history',
                title: 'The History of Molas',
                category: 'culture',
                content: `
                    <h2>The Art of Guna Molas</h2>
                    <p>Molas are a traditional textile art form of the Guna people, who inhabit the Guna Yala region in Panama and some areas of Colombia. These beautiful creations are much more than simple decorations: they are expressions of the worldview, history, and spirituality of the Guna people.</p>
                    
                    <h3>Origins and Meaning</h3>
                    <p>The word "mola" comes from the Guna language and means "clothing" or "garment". Traditionally, Guna women wear molas as part of their daily attire, but each mola tells a unique story. Geometric and figurative patterns represent elements of nature, animals, myths, and historical events important to the community.</p>
                    
                    <h3>Creation Process</h3>
                    <p>The mola technique uses the "reverse appliqué" method. Artisans layer several pieces of fabric of different colors and cut patterns to reveal the colors underneath, creating intricate and vibrant designs. This process can take weeks or even months to complete a single complex mola.</p>
                    
                    <h3>Cultural Symbolism</h3>
                    <p>Each element in a mola has meaning. Circles represent the cycle of life, triangles symbolize sacred mountains, and animal figures represent guardian spirits. Colors also have importance: red represents blood and life, yellow the sun and prosperity, and black spiritual protection.</p>
                    
                    <h3>Cultural Heritage</h3>
                    <p>In 2017, the art of molas was recognized as Intangible Cultural Heritage of Humanity by UNESCO. This recognition highlights not only the aesthetic beauty of molas, but also their importance as a vehicle for transmitting cultural knowledge and ancestral traditions from generation to generation.</p>
                `,
                quiz: [
                    {
                        question: "What does the word 'mola' mean in the Guna language?",
                        options: ["Art", "Clothing or garment", "Colors", "History"],
                        correct: 1
                    },
                    {
                        question: "What technique is used to create molas?",
                        options: ["Traditional weaving", "Reverse appliqué", "Painting on fabric", "Conventional embroidery"],
                        correct: 1
                    },
                    {
                        question: "What does the color red represent in molas?",
                        options: ["The sun and prosperity", "Blood and life", "Spiritual protection", "Nature"],
                        correct: 1
                    },
                    {
                        question: "In what year were molas recognized as Intangible Cultural Heritage by UNESCO?",
                        options: ["2010", "2015", "2017", "2020"],
                        correct: 2
                    },
                    {
                        question: "What do circles represent in molas?",
                        options: ["Sacred mountains", "The cycle of life", "Guardian spirits", "The sea"],
                        correct: 1
                    }
                ]
            },
            {
                id: 'guna-language',
                title: 'The Guna Language: An Overview',
                category: 'language',
                content: `
                    <h2>The Guna Language</h2>
                    <p>The Guna language (also known as Kuna) is an indigenous language spoken by approximately 60,000 people in Panama and Colombia. It belongs to the Chibchense language family and is one of the most vital indigenous languages in the region.</p>
                    
                    <h3>Unique Characteristics</h3>
                    <p>Guna is distinguished by its complex phonological system and rich morphology. A notable feature is the use of suffixes to indicate different grammatical aspects, including tense, mood, and person. The language also has a specific counter system for different types of objects.</p>
                    
                    <h3>Grammatical Structure</h3>
                    <p>Unlike Spanish or English, Guna follows a flexible word order but tends to place the verb at the end of the sentence. Nouns can have multiple suffixes that modify their meaning, and adjectives generally precede the nouns they modify.</p>
                    
                    <h3>Cultural Preservation</h3>
                    <p>The Guna language is fundamental to the cultural identity of the Guna people. Through the language, stories, traditional knowledge, spiritual practices, and social norms are transmitted. Efforts to preserve the language include bilingual educational programs and documentation of oral histories from elders.</p>
                    
                    <h3>Modern Challenges</h3>
                    <p>Despite its vitality, the Guna language faces challenges such as the influence of Spanish and the migration of youth to urban areas. However, the strong Guna cultural identity and pride in their language have contributed to its continuity, with many communities maintaining Guna as the primary language in daily life.</p>
                `,
                quiz: [
                    {
                        question: "Which language family does the Guna language belong to?",
                        options: ["Arawak", "Chibchense", "Caribbean", "Quechua"],
                        correct: 1
                    },
                    {
                        question: "Approximately how many people speak the Guna language?",
                        options: ["20,000", "40,000", "60,000", "80,000"],
                        correct: 2
                    },
                    {
                        question: "Where does the verb tend to be placed in Guna sentences?",
                        options: ["At the beginning", "In the middle", "At the end", "No fixed position"],
                        correct: 2
                    },
                    {
                        question: "What specific system does Guna have for different types of objects?",
                        options: ["Gender system", "Counter system", "Case system", "Number system"],
                        correct: 1
                    },
                    {
                        question: "What is fundamental to the cultural identity of the Guna people?",
                        options: ["Geography", "Economy", "Language", "Religion"],
                        correct: 2
                    }
                ]
            },
            {
                id: 'guna-territory',
                title: 'The Guna Yala Territory',
                category: 'geography',
                content: `
                    <h2>The Guna Yala Region</h2>
                    <p>The Guna Yala Region is an autonomous territory in Panama comprising an archipelago of more than 365 islands along the Caribbean coast. It is the home of the Guna people and represents one of the most successful examples of indigenous autonomy in Latin America.</p>
                    
                    <h3>Archipelago Geography</h3>
                    <p>The islands of Guna Yala are divided into three main regions: inhabited islands, uninhabited islands used for agriculture and gathering, and sacred islands reserved for spiritual ceremonies. Only approximately 49 of the islands are permanently inhabited.</p>
                    
                    <h3>Autonomous Government</h3>
                    <p>The Guna people maintain an autonomous government system based on ancestral traditions. The Guna General Congress is the highest authority, composed of leaders (sailas) from each community. This system has allowed the Guna to preserve their culture, language, and territory against external pressures.</p>
                    
                    <h3>Sustainability and Environment</h3>
                    <p>The Guna are known for their deep respect for the environment. Traditional sustainable fishing and agricultural practices have maintained the health of marine and terrestrial ecosystems for generations. However, climate change and tourism represent new challenges for the territory's sustainability.</p>
                    
                    <h3>Responsible Tourism</h3>
                    <p>In recent decades, Guna Yala has become a popular tourist destination. Guna leaders have implemented regulations to ensure tourism is responsible and respectful of local culture. Visitors must follow strict guidelines and obtain permits from local authorities to visit the islands.</p>
                `,
                quiz: [
                    {
                        question: "Approximately how many islands does the Guna Yala archipelago comprise?",
                        options: ["100", "200", "365", "500"],
                        correct: 2
                    },
                    {
                        question: "How many islands are permanently inhabited?",
                        options: ["Approximately 20", "Approximately 49", "Approximately 100", "Approximately 200"],
                        correct: 1
                    },
                    {
                        question: "What is the highest authority of the Guna government?",
                        options: ["The President of Panama", "The Guna General Congress", "The council of elders", "The local governor"],
                        correct: 1
                    },
                    {
                        question: "What new challenge do the Guna face regarding sustainability?",
                        options: ["Overfishing", "Climate change and tourism", "Deforestation", "Industrial pollution"],
                        correct: 1
                    },
                    {
                        question: "What must visitors do to visit the islands?",
                        options: ["Only pay a fee", "Obtain permits from local authorities", "No restrictions", "Only visit certain islands"],
                        correct: 1
                    }
                ]
            }
        ];
    }

    render() {
        this.innerHTML = `
            <div class="interactive-reading-container">
                <div class="reading-header">
                    <h2 class="reading-title">📚 Lecturas Interactivas</h2>
                    <p class="reading-subtitle">Lee sobre la cultura Guna y gana Cocos completando los cuestionarios</p>
                </div>

                <div class="reading-selection" id="readingSelection">
                    <h3>Selecciona una lectura:</h3>
                    <div class="reading-cards">
                        ${this.readings.map(reading => `
                            <div class="reading-card" data-reading="${reading.id}">
                                <div class="reading-card-icon">
                                    <i class="fas fa-${this.getCategoryIcon(reading.category)}"></i>
                                </div>
                                <h4 class="reading-card-title">${reading.title}</h4>
                                <span class="reading-card-category">${this.capitalizeFirst(reading.category)}</span>
                                <button class="reading-card-btn">
                                    <i class="fas fa-book-open"></i> Leer
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="reading-content" id="readingContent" hidden>
                    <button class="back-btn" id="backBtn">
                        <i class="fas fa-arrow-left"></i> Volver a lecturas
                    </button>
                    <div class="reading-text" id="readingText"></div>
                    <div class="reading-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" id="readingProgress" style="width: 0%"></div>
                        </div>
                        <span class="progress-text">Desplázate para leer completamente</span>
                    </div>
                    <button class="start-quiz-btn" id="startQuizBtn" disabled>
                        <i class="fas fa-question-circle"></i> Comenzar Cuestionario
                    </button>
                </div>

                <div class="quiz-container" id="quizContainer" hidden>
                    <div class="quiz-header">
                        <h3 class="quiz-title">🎯 Cuestionario</h3>
                        <div class="quiz-progress">
                            <span class="question-counter">Pregunta <span id="currentQuestion">1</span> de <span id="totalQuestions">5</span></span>
                            <div class="quiz-progress-bar">
                                <div class="quiz-progress-fill" id="quizProgressFill" style="width: 20%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="quiz-content">
                        <div class="question-card">
                            <h4 class="question-text" id="questionText"></h4>
                            <div class="options-grid" id="optionsGrid"></div>
                        </div>
                    </div>

                    <div class="quiz-actions">
                        <button class="quiz-btn next-btn" id="nextBtn" disabled>
                            Siguiente <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>

                <div class="quiz-results" id="quizResults" hidden>
                    <div class="results-content">
                        <div class="results-icon">
                            <i class="fas fa-${this.getResultsIcon()}" id="resultsIcon"></i>
                        </div>
                        <h2 class="results-title" id="resultsTitle"></h2>
                        <p class="results-message" id="resultsMessage"></p>
                        <div class="results-score">
                            <span class="score-number" id="scoreNumber">0</span>
                            <span class="score-total">/ 5</span>
                        </div>
                        <div class="results-reward" id="resultsReward" hidden>
                            <span class="reward-icon">🥥</span>
                            <span class="reward-count">+50</span>
                            <span class="reward-text">COCOS</span>
                        </div>
                        <div class="results-actions">
                            <button class="results-btn retry-btn" id="retryBtn">
                                <i class="fas fa-redo"></i> Intentar de nuevo
                            </button>
                            <button class="results-btn continue-btn" id="continueBtn">
                                <i class="fas fa-book"></i> Otra lectura
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    getCategoryIcon(category) {
        const icons = {
            culture: 'palette',
            language: 'language',
            geography: 'map-marked-alt'
        };
        return icons[category] || 'book';
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    bindEvents() {
        this.querySelectorAll('.reading-card').forEach(card => {
            card.addEventListener('click', () => {
                const readingId = card.dataset.reading;
                this.startReading(readingId);
            });
        });

        this.querySelector('#backBtn')?.addEventListener('click', () => {
            this.showReadingSelection();
        });

        this.querySelector('#startQuizBtn')?.addEventListener('click', () => {
            this.startQuiz();
        });

        this.querySelector('#nextBtn')?.addEventListener('click', () => {
            this.nextQuestion();
        });

        this.querySelector('#retryBtn')?.addEventListener('click', () => {
            this.retryQuiz();
        });

        this.querySelector('#continueBtn')?.addEventListener('click', () => {
            this.showReadingSelection();
        });

        // Track reading progress
        this.querySelector('#readingText')?.addEventListener('scroll', () => {
            this.trackReadingProgress();
        });
    }

    startReading(readingId) {
        this.currentReading = this.readings.find(r => r.id === readingId);
        if (!this.currentReading) return;

        const readingSelection = this.querySelector('#readingSelection');
        const readingContent = this.querySelector('#readingContent');
        const readingText = this.querySelector('#readingText');
        const startQuizBtn = this.querySelector('#startQuizBtn');

        readingSelection.hidden = true;
        readingContent.hidden = false;
        readingText.innerHTML = this.currentReading.content;
        startQuizBtn.disabled = true;

        this.quizStarted = false;
        this.quizCompleted = false;
        this.currentQuestion = 0;
        this.score = 0;
    }

    trackReadingProgress() {
        const readingText = this.querySelector('#readingText');
        const progressFill = this.querySelector('#readingProgress');
        const startQuizBtn = this.querySelector('#startQuizBtn');

        if (!readingText || !progressFill || !startQuizBtn) return;

        const scrollTop = readingText.scrollTop;
        const scrollHeight = readingText.scrollHeight - readingText.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;

        progressFill.style.width = `${Math.min(progress, 100)}%`;

        if (progress >= 90) {
            startQuizBtn.disabled = false;
        }
    }

    startQuiz() {
        // Check if user is guest - block quiz access
        const isGuest = localStorage.getItem('isGuest') === 'true';
        if (isGuest) {
            alert('Quiz access is restricted for guest users. Please register to take quizzes and earn Cocos.');
            return;
        }

        const readingContent = this.querySelector('#readingContent');
        const quizContainer = this.querySelector('#quizContainer');

        readingContent.hidden = true;
        quizContainer.hidden = false;

        this.quizStarted = true;
        this.currentQuestion = 0;
        this.score = 0;

        this.renderQuestion();
    }

    renderQuestion() {
        const question = this.currentReading.quiz[this.currentQuestion];
        const questionText = this.querySelector('#questionText');
        const optionsGrid = this.querySelector('#optionsGrid');
        const currentQuestionEl = this.querySelector('#currentQuestion');
        const totalQuestionsEl = this.querySelector('#totalQuestions');
        const quizProgressFill = this.querySelector('#quizProgressFill');
        const nextBtn = this.querySelector('#nextBtn');

        questionText.textContent = question.question;
        currentQuestionEl.textContent = this.currentQuestion + 1;
        totalQuestionsEl.textContent = this.currentReading.quiz.length;
        quizProgressFill.style.width = `${((this.currentQuestion + 1) / this.currentReading.quiz.length) * 100}%`;

        optionsGrid.innerHTML = question.options.map((option, index) => `
            <button class="option-btn" data-index="${index}">
                <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                <span class="option-text">${option}</span>
            </button>
        `).join('');

        optionsGrid.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectOption(parseInt(btn.dataset.index));
            });
        });

        nextBtn.disabled = true;
    }

    selectOption(index) {
        const optionsGrid = this.querySelector('#optionsGrid');
        const nextBtn = this.querySelector('#nextBtn');

        optionsGrid.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        optionsGrid.querySelector(`[data-index="${index}"]`).classList.add('selected');
        this.selectedAnswer = index;
        nextBtn.disabled = false;
    }

    nextQuestion() {
        const question = this.currentReading.quiz[this.currentQuestion];
        
        if (this.selectedAnswer === question.correct) {
            this.score++;
        }

        this.currentQuestion++;

        if (this.currentQuestion >= this.currentReading.quiz.length) {
            this.showResults();
        } else {
            this.renderQuestion();
        }
    }

    showResults() {
        const quizContainer = this.querySelector('#quizContainer');
        const quizResults = this.querySelector('#quizResults');
        const resultsIcon = this.querySelector('#resultsIcon');
        const resultsTitle = this.querySelector('#resultsTitle');
        const resultsMessage = this.querySelector('#resultsMessage');
        const scoreNumber = this.querySelector('#scoreNumber');
        const resultsReward = this.querySelector('#resultsReward');

        quizContainer.hidden = true;
        quizResults.hidden = false;

        scoreNumber.textContent = this.score;

        if (this.score === this.currentReading.quiz.length) {
            resultsIcon.className = 'fas fa-trophy';
            resultsTitle.textContent = '¡Excelente!';
            resultsMessage.textContent = 'Has respondido todas las preguntas correctamente. ¡Has ganado 50 Cocos!';
            resultsReward.hidden = false;
            this.awardCocos(50);
        } else {
            resultsIcon.className = 'fas fa-book-reader';
            resultsTitle.textContent = 'Buen intento';
            resultsMessage.textContent = 'Lee de nuevo e intenta conseguir todas las respuestas correctas para ganar Cocos.';
            resultsReward.hidden = true;
        }
    }

    getResultsIcon() {
        return 'trophy';
    }

    async awardCocos(amount) {
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

        // Award cocos locally if economy system exists
        if (typeof CocosEconomy !== 'undefined') {
            CocosEconomy.addCocos(amount);
            CocosEconomy.triggerConfetti();
        }
    }

    retryQuiz() {
        const quizResults = this.querySelector('#quizResults');
        const quizContainer = this.querySelector('#quizContainer');

        quizResults.hidden = true;
        quizContainer.hidden = false;

        this.currentQuestion = 0;
        this.score = 0;
        this.renderQuestion();
    }

    showReadingSelection() {
        const readingContent = this.querySelector('#readingContent');
        const quizContainer = this.querySelector('#quizContainer');
        const quizResults = this.querySelector('#quizResults');
        const readingSelection = this.querySelector('#readingSelection');

        readingContent.hidden = true;
        quizContainer.hidden = true;
        quizResults.hidden = true;
        readingSelection.hidden = false;

        this.currentReading = null;
        this.quizStarted = false;
        this.quizCompleted = false;
    }
}

customElements.define('interactive-reading', InteractiveReading);
