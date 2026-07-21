/**
 * CulturalReadings — Unified Cultural Hub
 * Readings list + fluid reader + one-by-one quiz + Guna Yala & Territories
 */
class CulturalReadings extends HTMLElement {
    connectedCallback() {
        this.view = 'hub';
        this.activeTab = 'readings';
        this.currentReading = null;
        this.quizIndex = 0;
        this.quizScore = 0;
        this.selectedAnswer = null;
        this.readings = this.getReadings();
        this.comarcas = this.getComarcas();
        this.selectedComarca = null;
        this.render();
    }

    getReadings() {
        return [
            {
                id: 'mola-history',
                title: 'The History of Molas',
                category: 'Culture',
                content: `
                    <h2>The Art of Guna Molas</h2>
                    <p>Molas are a traditional textile art form of the Guna people, who inhabit the Guna Yala region in Panama and some areas of Colombia. These beautiful creations are much more than simple decorations: they are expressions of the worldview, history, and spirituality of the Guna people.</p>
                    <h3>Origins and Meaning</h3>
                    <p>The word "mola" comes from the Guna language and means "clothing" or "garment". Traditionally, Guna women wear molas as part of their daily attire, but each mola tells a unique story.</p>
                    <h3>Creation Process</h3>
                    <p>The mola technique uses the "reverse appliqué" method. Artisans layer several pieces of fabric of different colors and cut patterns to reveal the colors underneath.</p>
                    <h3>Cultural Symbolism</h3>
                    <p>Each element in a mola has meaning. Circles represent the cycle of life, triangles symbolize sacred mountains, and animal figures represent guardian spirits.</p>
                    <h3>Cultural Heritage</h3>
                    <p>In 2017, the art of molas was recognized as Intangible Cultural Heritage of Humanity by UNESCO.</p>
                `,
                quiz: [
                    { question: "What does the word 'mola' mean in the Guna language?", options: ["Art", "Clothing or garment", "Colors", "History"], correct: 1 },
                    { question: "What technique is used to create molas?", options: ["Traditional weaving", "Reverse appliqué", "Painting on fabric", "Conventional embroidery"], correct: 1 },
                    { question: "What does the color red represent in molas?", options: ["The sun and prosperity", "Blood and life", "Spiritual protection", "Nature"], correct: 1 },
                    { question: "In what year were molas recognized by UNESCO?", options: ["2010", "2015", "2017", "2020"], correct: 2 },
                    { question: "What do circles represent in molas?", options: ["Sacred mountains", "The cycle of life", "Guardian spirits", "The sea"], correct: 1 }
                ]
            },
            {
                id: 'guna-language',
                title: 'The Guna Language: An Overview',
                category: 'Language',
                content: `
                    <h2>The Guna Language</h2>
                    <p>The Guna language (also known as Kuna) is an indigenous language spoken by approximately 60,000 people in Panama and Colombia. It belongs to the Chibchense language family.</p>
                    <h3>Unique Characteristics</h3>
                    <p>Guna is distinguished by its complex phonological system and rich morphology, including a specific counter system for different types of objects.</p>
                    <h3>Grammatical Structure</h3>
                    <p>Guna tends to place the verb at the end of the sentence. Nouns can have multiple suffixes that modify their meaning.</p>
                    <h3>Cultural Preservation</h3>
                    <p>The Guna language is fundamental to cultural identity, transmitting stories, traditional knowledge, and spiritual practices.</p>
                `,
                quiz: [
                    { question: "Which language family does Guna belong to?", options: ["Arawak", "Chibchense", "Caribbean", "Quechua"], correct: 1 },
                    { question: "Approximately how many people speak Guna?", options: ["20,000", "40,000", "60,000", "80,000"], correct: 2 },
                    { question: "Where does the verb tend to be placed?", options: ["At the beginning", "In the middle", "At the end", "No fixed position"], correct: 2 },
                    { question: "What specific system does Guna have for objects?", options: ["Gender system", "Counter system", "Case system", "Number system"], correct: 1 },
                    { question: "What is fundamental to Guna cultural identity?", options: ["Geography", "Economy", "Language", "Religion"], correct: 2 }
                ]
            },
            {
                id: 'guna-territory',
                title: 'The Guna Yala Territory',
                category: 'Geography',
                content: `
                    <h2>The Guna Yala Region</h2>
                    <p>Guna Yala is an autonomous territory in Panama comprising an archipelago of more than 365 islands along the Caribbean coast.</p>
                    <h3>Archipelago Geography</h3>
                    <p>Only approximately 49 of the islands are permanently inhabited. Others are used for agriculture or sacred ceremonies.</p>
                    <h3>Autonomous Government</h3>
                    <p>The Guna General Congress is the highest authority, composed of leaders (sailas) from each community.</p>
                    <h3>Sustainability</h3>
                    <p>The Guna maintain deep respect for the environment through traditional sustainable fishing and agricultural practices.</p>
                `,
                quiz: [
                    { question: "How many islands does Guna Yala comprise?", options: ["100", "200", "365", "500"], correct: 2 },
                    { question: "How many islands are permanently inhabited?", options: ["~20", "~49", "~100", "~200"], correct: 1 },
                    { question: "What is the highest Guna authority?", options: ["President of Panama", "Guna General Congress", "Council of elders", "Local governor"], correct: 1 },
                    { question: "What sustainability challenge do the Guna face?", options: ["Overfishing", "Climate change and tourism", "Deforestation", "Industrial pollution"], correct: 1 },
                    { question: "What must visitors do to visit islands?", options: ["Only pay a fee", "Obtain permits from local authorities", "No restrictions", "Visit certain islands only"], correct: 1 }
                ]
            }
        ];
    }

    getComarcas() {
        return [
            {
                id: 'guna-yala',
                name: 'Guna Yala',
                shortDesc: 'Autonomous island archipelago on the Caribbean coast',
                detail: `Guna Yala (formerly San Blas) is the primary homeland of the Guna people — an autonomous indigenous comarca spanning over 365 Caribbean islands and a strip of mainland coast.\n\nHistorically, the name reflects the Guna people's self-determination. After the 1925 Tule Revolution, the Guna secured political autonomy and the right to govern their own territory according to ancestral customs.\n\nThe sailas (community leaders) and the Guna General Congress maintain governance. Daily life revolves around the sea: fishing, coconut harvesting, and canoe travel between islands.\n\nCulturally, Guna Yala is the heart of mola art, traditional dress, and spiritual practices connected to Ibeorgun (the creator) and nature spirits.`
            },
            {
                id: 'madugandi',
                name: 'Madugandí',
                shortDesc: 'Mainland comarca in the Darién region',
                detail: `Madugandí is a mainland comarca in eastern Panama where Guna communities have lived for generations, distinct from the island communities of Guna Yala.\n\nThe name and territory represent the Guna people's expansion and adaptation beyond the archipelago — maintaining language, dress, and congress traditions while integrating with rainforest ecology.\n\nMadugandí communities practice agriculture, river fishing, and forest gathering. Cultural identity remains strong through Dulegaya language use, mola traditions, and participation in the broader Guna political structure.\n\nThe comarca symbolizes the diversity within Guna identity: island Guna and mainland Guna share heritage while adapting to different environments.`
            },
            {
                id: 'wargandi',
                name: 'Wargandí',
                shortDesc: 'Mountain and forest comarca in eastern Panama',
                detail: `Wargandí is the smallest of the three Guna comarcas, located in the mountains and forests near the Colombian border in the Darién province.\n\nEstablished to recognize Guna communities living in highland and riverine areas, Wargandí represents the Guna people's deep connection to diverse ecosystems beyond the Caribbean coast.\n\nLife in Wargandí blends forest agriculture, river transport, and traditional governance through local sailas. Community members preserve oral histories, medicinal plant knowledge, and the Dulegaya language.\n\nCulturally, Wargandí demonstrates that Guna identity is not limited to island life — it is a unified people across multiple territories, each with unique environmental relationships.`
            }
        ];
    }

    render() {
        this.innerHTML = `
            <div class="hub-module cultural-readings-hub">
                <soggy-avatar></soggy-avatar>
                <header>
                    <h1 class="hub-section-title">Cultural Learning Hub</h1>
                    <p class="hub-section-subtitle">Explore readings, territories, and Guna heritage — earn Ogods by mastering each lesson.</p>
                </header>
                <div class="hub-tabs" role="tablist">
                    <button type="button" class="hub-tab ${this.activeTab === 'readings' ? 'active' : ''}" data-tab="readings">Cultural Readings</button>
                    <button type="button" class="hub-tab ${this.activeTab === 'bookshelf' ? 'active' : ''}" data-tab="bookshelf">My Bookshelf</button>
                    <button type="button" class="hub-tab ${this.activeTab === 'territories' ? 'active' : ''}" data-tab="territories">Guna Yala & Territories</button>
                </div>
                <div id="culturalHubContent"></div>
            </div>
        `;
        this.bindTabEvents();
        this.renderContent();
    }

    bindTabEvents() {
        this.querySelectorAll('.hub-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.activeTab = tab.dataset.tab;
                this.view = 'hub';
                this.currentReading = null;
                this.selectedComarca = null;
                this.render();
            });
        });
    }

    renderContent() {
        const container = this.querySelector('#culturalHubContent');
        if (!container) return;

        if (this.activeTab === 'readings') {
            this.renderReadingsView(container);
        } else if (this.activeTab === 'bookshelf') {
            container.innerHTML = '<my-bookshelf context="readings"></my-bookshelf>';
        } else {
            this.renderTerritoriesView(container);
        }
    }

    renderReadingsView(container) {
        switch (this.view) {
            case 'reader':
                container.innerHTML = this.renderReader();
                this.bindReaderEvents();
                break;
            case 'quiz':
                container.innerHTML = this.renderQuiz();
                this.bindQuizEvents();
                break;
            case 'quiz-result':
                container.innerHTML = this.renderQuizResult();
                this.bindResultEvents();
                break;
            default:
                container.innerHTML = `
                    <div class="hub-card-grid">
                        ${this.readings.map(r => `
                            <div class="hub-card reading-select-card" data-id="${r.id}">
                                <span style="font-size:0.85rem;opacity:0.6;">${r.category}</span>
                                <h3 style="margin:0.5rem 0;">${r.title}</h3>
                                <button class="hub-btn hub-btn-primary" style="margin-top:1rem;">
                                    <i class="fas fa-book-open"></i> Read
                                </button>
                            </div>
                        `).join('')}
                    </div>
                `;
                container.querySelectorAll('.reading-select-card').forEach(card => {
                    card.addEventListener('click', () => this.openReading(card.dataset.id));
                });
        }
    }

    renderTerritoriesView(container) {
        if (this.selectedComarca) {
            const c = this.comarcas.find(x => x.id === this.selectedComarca);
            container.innerHTML = `
                <div class="hub-card hub-comarca-card">
                    <button class="hub-btn hub-btn-secondary" id="backComarcasBtn" style="margin-bottom:1.5rem;">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <h2 class="comarca-name">${c.name}</h2>
                    <div class="hub-reader-content">${c.detail.split('\n\n').map(p => `<p>${p}</p>`).join('')}</div>
                </div>
                <div id="comarcaFinalActions"></div>
            `;
            HubFlow.renderFinalActions(container.querySelector('#comarcaFinalActions'), {
                nextLabel: 'Next Territory',
                onNext: () => {
                    const idx = this.comarcas.findIndex(x => x.id === this.selectedComarca);
                    if (idx < this.comarcas.length - 1) {
                        this.selectedComarca = this.comarcas[idx + 1].id;
                        HubFlow.trackActivity('reading', this.selectedComarca);
                    } else {
                        this.selectedComarca = null;
                    }
                    this.renderContent();
                }
            });
            container.querySelector('#backComarcasBtn')?.addEventListener('click', () => {
                this.selectedComarca = null;
                this.renderContent();
            });
        } else {
            container.innerHTML = `
                <div class="hub-card-grid">
                    ${this.comarcas.map(c => `
                        <div class="hub-card comarca-select-card" data-id="${c.id}">
                            <h3>${c.name}</h3>
                            <p style="opacity:0.75;margin:0.5rem 0;">${c.shortDesc}</p>
                            <button class="hub-btn hub-btn-primary">
                                <i class="fas fa-map-marker-alt"></i> Explore
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
            container.querySelectorAll('.comarca-select-card').forEach(card => {
                card.addEventListener('click', () => {
                    this.selectedComarca = card.dataset.id;
                    HubFlow.trackActivity('reading', card.dataset.id);
                    HubFlow.handleNext();
                    this.renderContent();
                });
            });
        }
    }

    openReading(id) {
        this.currentReading = this.readings.find(r => r.id === id);
        this.view = 'reader';
        HubFlow.trackActivity('reading', id);
        HubFlow.handleNext();
        this.renderContent();
    }

    renderReader() {
        return `
            <div class="hub-reader">
                <button class="hub-btn hub-btn-secondary" id="backReadingsBtn" style="margin-bottom:1.5rem;">
                    <i class="fas fa-arrow-left"></i> Back to Readings
                </button>
                <div class="hub-card">
                    <h2>${this.currentReading.title}</h2>
                    <div class="hub-reader-content" id="readerContent">${this.currentReading.content}</div>
                </div>
                <div style="text-align:center;margin-top:2rem;">
                    <button class="hub-btn hub-btn-primary" id="checkUnderstandingBtn">
                        <i class="fas fa-question-circle"></i> Check Understanding
                    </button>
                </div>
            </div>
        `;
    }

    bindReaderEvents() {
        this.querySelector('#backReadingsBtn')?.addEventListener('click', () => {
            this.view = 'hub';
            this.currentReading = null;
            this.renderContent();
        });
        this.querySelector('#checkUnderstandingBtn')?.addEventListener('click', () => {
            this.view = 'quiz';
            this.quizIndex = 0;
            this.quizScore = 0;
            this.selectedAnswer = null;
            HubFlow.handleNext();
            this.renderContent();
        });
    }

    renderQuiz() {
        const q = this.currentReading.quiz[this.quizIndex];
        const total = this.currentReading.quiz.length;
        return `
            <div class="hub-reader">
                <div class="hub-card">
                    <p style="opacity:0.7;margin-bottom:0.5rem;">Question ${this.quizIndex + 1} of ${total}</p>
                    <div class="hub-progress-bar"><div class="hub-progress-fill" style="width:${((this.quizIndex + 1) / total) * 100}%"></div></div>
                    <h3 style="margin:1.5rem 0;">${q.question}</h3>
                    <div id="quizOptions">
                        ${q.options.map((opt, i) => `
                            <button type="button" class="hub-quiz-option" data-index="${i}">${opt}</button>
                        `).join('')}
                    </div>
                </div>
                <div style="text-align:center;margin-top:1.5rem;">
                    <button class="hub-btn hub-btn-primary" id="quizNextBtn" disabled>Next</button>
                </div>
            </div>
        `;
    }

    bindQuizEvents() {
        const nextBtn = this.querySelector('#quizNextBtn');
        this.querySelectorAll('.hub-quiz-option').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectedAnswer = parseInt(btn.dataset.index, 10);
                this.querySelectorAll('.hub-quiz-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                if (nextBtn) nextBtn.disabled = false;
            });
        });
        nextBtn?.addEventListener('click', () => {
            const q = this.currentReading.quiz[this.quizIndex];
            if (this.selectedAnswer === q.correct) this.quizScore++;

            this.quizIndex++;
            if (this.quizIndex >= this.currentReading.quiz.length) {
                this.view = 'quiz-result';
            }
            this.selectedAnswer = null;
            HubFlow.handleNext();
            this.renderContent();
        });
    }

    renderQuizResult() {
        const total = this.currentReading.quiz.length;
        const perfect = this.quizScore === total;
        return `
            <div class="hub-reader" style="text-align:center;">
                <div class="hub-card">
                    <div style="font-size:3rem;margin-bottom:1rem;">${perfect ? '🏆' : '📖'}</div>
                    <h2>${perfect ? 'Excellent!' : 'Good Effort!'}</h2>
                    <p style="margin:1rem 0;">You scored ${this.quizScore} / ${total}</p>
                    ${perfect ? '<p style="font-weight:600;">+50 Ogods earned!</p>' : '<p>Review the reading and try again to earn Ogods.</p>'}
                </div>
                <div id="readingFinalActions"></div>
            </div>
        `;
    }

    bindResultEvents() {
        const total = this.currentReading.quiz.length;
        const perfect = this.quizScore === total;

        if (perfect) {
            GameRewards.awardOgods(50, 'cultural-reading');
        } else if (typeof GunaLives !== 'undefined') {
            GameRewards.loseBurda('cultural-reading');
        }

        HubFlow.renderFinalActions(this.querySelector('#readingFinalActions'), {
            nextLabel: 'Next Lesson',
            onNext: () => {
                const idx = this.readings.findIndex(r => r.id === this.currentReading.id);
                if (idx < this.readings.length - 1) {
                    this.openReading(this.readings[idx + 1].id);
                } else {
                    this.view = 'hub';
                    this.currentReading = null;
                    this.renderContent();
                }
            }
        });
    }
}

customElements.define('cultural-readings', CulturalReadings);
