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
                title: 'La Historia de las Molas',
                category: 'culture',
                content: `
                    <h2>El Arte de las Molas Guna</h2>
                    <p>Las molas son una forma de arte textil tradicional del pueblo Guna, que habita en la comarca Guna Yala en Panamá y en algunas regiones de Colombia. Estas hermosas creaciones son mucho más que simples decoraciones: son expresiones de la cosmovisión, historia y espiritualidad del pueblo Guna.</p>
                    
                    <h3>Orígenes y Significado</h3>
                    <p>La palabra "mola" proviene del idioma Guna y significa "ropa" o "vestimenta". Tradicionalmente, las mujeres Guna llevan molas como parte de su vestimenta diaria, pero cada mola cuenta una historia única. Los patrones geométricos y figurativos representan elementos de la naturaleza, animales, mitos y eventos históricos importantes para la comunidad.</p>
                    
                    <h3>Proceso de Creación</h3>
                    <p>La técnica de las molas utiliza el método de "aplicación inversa" o "reverse appliqué". Las artesanas superponen varias capas de tela de diferentes colores y recortan patrones para revelar los colores inferiores, creando diseños intrincados y vibrantes. Este proceso puede tomar semanas o incluso meses para completar una sola mola compleja.</p>
                    
                    <h3>Simbolismo Cultural</h3>
                    <p>Cada elemento en una mola tiene significado. Los círculos representan el ciclo de la vida, los triángulos simbolizan las montañas sagradas, y las figuras de animales representan los espíritus guardianes. Los colores también tienen importancia: el rojo representa la sangre y la vida, el amarillo el sol y la prosperidad, y el negro la protección espiritual.</p>
                    
                    <h3>Patrimonio Cultural</h3>
                    <p>En 2017, el arte de las molas fue reconocido como Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO. Este reconocimiento destaca no solo la belleza estética de las molas, sino también su importancia como vehículo de transmisión de conocimientos culturales y tradiciones ancestrales de generación en generación.</p>
                `,
                quiz: [
                    {
                        question: "¿Qué significa la palabra 'mola' en el idioma Guna?",
                        options: ["Arte", "Ropa o vestimenta", "Colores", "Historia"],
                        correct: 1
                    },
                    {
                        question: "¿Qué técnica se utiliza para crear las molas?",
                        options: ["Tejido tradicional", "Aplicación inversa (reverse appliqué)", "Pintura sobre tela", "Bordado convencional"],
                        correct: 1
                    },
                    {
                        question: "¿Qué representa el color rojo en las molas?",
                        options: ["El sol y la prosperidad", "La sangre y la vida", "La protección espiritual", "La naturaleza"],
                        correct: 1
                    },
                    {
                        question: "¿En qué año las molas fueron reconocidas como Patrimonio Cultural Inmaterial por la UNESCO?",
                        options: ["2010", "2015", "2017", "2020"],
                        correct: 2
                    },
                    {
                        question: "¿Qué representan los círculos en las molas?",
                        options: ["Las montañas sagradas", "El ciclo de la vida", "Los espíritus guardianes", "El mar"],
                        correct: 1
                    }
                ]
            },
            {
                id: 'guna-language',
                title: 'La Lengua Guna: Una Visión General',
                category: 'language',
                content: `
                    <h2>La Lengua Guna</h2>
                    <p>El idioma Guna (también conocido como Kuna) es una lengua indígena hablada por aproximadamente 60,000 personas en Panamá y Colombia. Pertenece a la familia lingüística Chibchense y es una de las lenguas indígenas más vitales de la región.</p>
                    
                    <h3>Características Únicas</h3>
                    <p>El Guna se distingue por su sistema fonológico complejo y su rica morfología. Una característica notable es el uso de sufijos para indicar diferentes aspectos gramaticales, incluyendo tiempo, modo y persona. La lengua también tiene un sistema de contadores específicos para diferentes tipos de objetos.</p>
                    
                    <h3>Estructura Gramatical</h3>
                    <p>A diferencia del español o inglés, el Guna sigue un orden de palabras flexible pero tiende a colocar el verbo al final de la oración. Los sustantivos pueden tener múltiples sufijos que modifican su significado, y los adjetivos generalmente preceden a los sustantivos que modifican.</p>
                    
                    <h3>Preservación Cultural</h3>
                    <p>El idioma Guna es fundamental para la identidad cultural del pueblo Guna. A través de la lengua se transmiten historias, conocimientos tradicionales, prácticas espirituales y normas sociales. Los esfuerzos para preservar el idioma incluyen programas educativos bilingües y la documentación de historias orales de los ancianos.</p>
                    
                    <h3>Desafíos Modernos</h3>
                    <p>A pesar de su vitalidad, el idioma Guna enfrenta desafíos como la influencia del español y la migración de jóvenes a áreas urbanas. Sin embargo, la fuerte identidad cultural Guna y el orgullo por su lengua han contribuido a su continuidad, con muchas comunidades manteniendo el Guna como lengua principal en la vida diaria.</p>
                `,
                quiz: [
                    {
                        question: "¿A qué familia lingüística pertenece el idioma Guna?",
                        options: ["Arawak", "Chibchense", "Caribe", "Quechua"],
                        correct: 1
                    },
                    {
                        question: "¿Cuántas personas hablan aproximadamente el idioma Guna?",
                        options: ["20,000", "40,000", "60,000", "80,000"],
                        correct: 2
                    },
                    {
                        question: "¿Dónde tiende a colocarse el verbo en las oraciones Guna?",
                        options: ["Al principio", "En el medio", "Al final", "No tiene posición fija"],
                        correct: 2
                    },
                    {
                        question: "¿Qué sistema específico tiene el Guna para diferentes tipos de objetos?",
                        options: ["Sistema de género", "Sistema de contadores", "Sistema de casos", "Sistema de números"],
                        correct: 1
                    },
                    {
                        question: "¿Qué es fundamental para la identidad cultural del pueblo Guna?",
                        options: ["La geografía", "La economía", "El idioma", "La religión"],
                        correct: 2
                    }
                ]
            },
            {
                id: 'guna-territory',
                title: 'El Territorio Guna Yala',
                category: 'geography',
                content: `
                    <h2>La Comarca Guna Yala</h2>
                    <p>La Comarca Guna Yala es un territorio autónomo en Panamá que comprende un archipiélago de más de 365 islas a lo largo de la costa caribeña. Es el hogar del pueblo Guna y representa uno de los ejemplos más exitosos de autonomía indígena en América Latina.</p>
                    
                    <h3>Geografía del Archipiélago</h3>
                    <p>Las islas de Guna Yala se dividen en tres regiones principales: las islas habitadas, las islas desiertas utilizadas para agricultura y recolección, y las islas sagradas reservadas para ceremonias espirituales. Solo aproximadamente 49 de las islas están habitadas permanentemente.</p>
                    
                    <h3>Gobierno Autónomo</h3>
                    <p>El pueblo Guna mantiene un sistema de gobierno autónomo basado en tradiciones ancestrales. El Congreso General Guna es la autoridad máxima, compuesto por líderes (sailas) de cada comunidad. Este sistema ha permitido a los Guna preservar su cultura, idioma y territorio frente a presiones externas.</p>
                    
                    <h3>Sostenibilidad y Medio Ambiente</h3>
                    <p>Los Guna son conocidos por su profundo respeto por el medio ambiente. Prácticas tradicionales de pesca y agricultura sostenibles han mantenido la salud de los ecosistemas marinos y terrestres por generaciones. Sin embargo, el cambio climático y el turismo representan nuevos desafíos para la sostenibilidad del territorio.</p>
                    
                    <h3>Turismo Responsable</h3>
                    <p>En décadas recientes, Guna Yala se ha convertido en un destino turístico popular. Los líderes Guna han implementado regulaciones para asegurar que el turismo sea responsable y respetuoso con la cultura local. Los visitantes deben seguir pautas estrictas y obtener permisos de las autoridades locales para visitar las islas.</p>
                `,
                quiz: [
                    {
                        question: "¿Cuántas islas comprende aproximadamente el archipiélago de Guna Yala?",
                        options: ["100", "200", "365", "500"],
                        correct: 2
                    },
                    {
                        question: "¿Cuántas islas están habitadas permanentemente?",
                        options: ["Aproximadamente 20", "Aproximadamente 49", "Aproximadamente 100", "Aproximadamente 200"],
                        correct: 1
                    },
                    {
                        question: "¿Cuál es la autoridad máxima del gobierno Guna?",
                        options: ["El presidente de Panamá", "El Congreso General Guna", "El consejo de ancianos", "El gobernador local"],
                        correct: 1
                    },
                    {
                        question: "¿Qué desafío nuevo enfrentan los Guna respecto a la sostenibilidad?",
                        options: ["La pesca excesiva", "El cambio climático y el turismo", "La deforestación", "La contaminación industrial"],
                        correct: 1
                    },
                    {
                        question: "¿Qué deben hacer los visitantes para visitar las islas?",
                        options: ["Solo pagar una tarifa", "Obtener permisos de autoridades locales", "No hay restricciones", "Solo visitar ciertas islas"],
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
        if (typeof OgobEconomy !== 'undefined') {
            OgobEconomy.addOgob(amount);
            OgobEconomy.triggerConfetti();
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
