/**
 * Rich lesson structure (Level 1 style) for Guna levels 1–3
 * Level 1 is preserved exactly. Levels 2 & 3 use the same structure in English.
 */
const GunaLevelLessons = {
    buildVocabTableRows(words) {
        return words.map(w => `
            <tr>
                <td><strong>${w.guna}</strong></td>
                <td>${w.es}</td>
                <td>${w.en}</td>
                <td>${w.pronunciation || w.guna}</td>
            </tr>
        `).join('');
    },

    buildPronunciationTips(tips) {
        return tips.map(t => `<li>${t}</li>`).join('');
    },

    buildQuizBlock(questions) {
        return questions.map((q, i) => {
            if (q.type === 'matching') {
                return `
                    <div class="quiz-question" data-question="${q.num}">
                        <h4>Question ${q.num}: ${q.text}</h4>
                        <div class="matching-exercise">
                            <div class="matching-pairs">
                                ${q.pairs.map((p, idx) => `
                                    <div class="matching-item" data-pair="${idx + 1}">
                                        <span class="guna-text">${p.guna}</span>
                                        <select class="matching-select">
                                            <option value="">Select meaning...</option>
                                            ${p.options.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
                                        </select>
                                    </div>
                                `).join('')}
                            </div>
                            <button type="button" class="check-matching-btn">Check Answers</button>
                            <div class="matching-feedback" style="display: none;"></div>
                        </div>
                    </div>
                `;
            }
            return `
                <div class="quiz-question" data-question="${q.num}">
                    <h4>Question ${q.num}: ${q.text}</h4>
                    <div class="quiz-options">
                        ${q.options.map(o => `<button type="button" class="quiz-option" data-answer="${o.value}">${o.label}</button>`).join('')}
                    </div>
                    <div class="quiz-feedback" style="display: none;"></div>
                </div>
            `;
        }).join('');
    },

    buildConversationBlock(scenarios) {
        return scenarios.map((s, i) => `
            <div class="scenario" data-scenario="${i + 1}">
                <h4>${s.title}</h4>
                <div class="scenario-content">
                    <p><strong>${s.prompt}</strong></p>
                    <div class="scenario-options">
                        ${s.choices.map(c => `<button type="button" class="scenario-option">${c}</button>`).join('')}
                    </div>
                    <div class="scenario-response" style="display: none;">
                        <p>${s.response}</p>
                    </div>
                </div>
            </div>
        `).join('');
    },

    buildRichLesson(cfg) {
        return {
            id: cfg.id,
            title: cfg.title,
            subtitle: cfg.subtitle,
            duration: cfg.duration,
            xp: cfg.xp,
            sections: [
                {
                    type: 'introduction',
                    title: cfg.introTitle,
                    content: `
                        <div class="lesson-intro">
                            <div class="intro-header">
                                <h2>${cfg.introHeading}</h2>
                                <p>${cfg.introText}</p>
                            </div>
                            <div class="cultural-context">
                                <h3>🌊 Cultural Context</h3>
                                <p>${cfg.culturalText}</p>
                                <div class="cultural-highlights">
                                    ${cfg.highlights.map(h => `
                                        <div class="highlight-item">
                                            <i class="fas ${h.icon}"></i>
                                            <span>${h.text}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'vocabulary',
                    title: cfg.vocabTitle,
                    content: `
                        <div class="vocabulary-section">
                            <h3>📚 ${cfg.vocabHeading}</h3>
                            <p>${cfg.vocabIntro}</p>
                            <div class="vocabulary-table">
                                <table>
                                    <thead>
                                        <tr><th>Guna</th><th>Spanish</th><th>English</th><th>Pronunciation</th></tr>
                                    </thead>
                                    <tbody>${this.buildVocabTableRows(cfg.words)}</tbody>
                                </table>
                            </div>
                            <div class="pronunciation-tips">
                                <h4>💡 Pronunciation Tips</h4>
                                <ul>${this.buildPronunciationTips(cfg.pronunciationTips)}</ul>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'interactive',
                    title: 'Practice Time!',
                    content: `
                        <div class="interactive-section">
                            <h3>🎯 Let's Practice!</h3>
                            <p>${cfg.practiceIntro}</p>
                            <div class="quiz-container">
                                ${this.buildQuizBlock(cfg.quizQuestions)}
                            </div>
                            <div class="quiz-results" style="display: none;">
                                <h4>🎉 Quiz Results</h4>
                                <div class="results-summary">
                                    <p>You got <span class="correct-answers">0</span> out of <span class="total-questions">4</span> questions correct!</p>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: 0%"></div>
                                    </div>
                                </div>
                                <button type="button" class="retry-quiz-btn">Try Again</button>
                                <button type="button" class="continue-lesson-btn">Continue to Next Section</button>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'conversation',
                    title: 'Real Conversation Practice',
                    content: `
                        <div class="conversation-section">
                            <h3>💬 Practice Conversation</h3>
                            <p>Practice using Guna words in realistic scenarios:</p>
                            <div class="conversation-scenarios">
                                ${this.buildConversationBlock(cfg.scenarios)}
                            </div>
                        </div>
                    `
                },
                {
                    type: 'summary',
                    title: 'Lesson Summary',
                    content: `
                        <div class="lesson-summary">
                            <h3>📝 What You've Learned</h3>
                            <div class="summary-content">
                                <div class="learned-greetings">
                                    <h4>✅ Words You Can Now Use:</h4>
                                    <ul>${cfg.summaryWords.map(w => `<li><strong>${w.guna}</strong> - ${w.en}</li>`).join('')}</ul>
                                </div>
                                <div class="cultural-notes">
                                    <h4>🌊 Cultural Notes:</h4>
                                    <ul>${cfg.culturalNotes.map(n => `<li>${n}</li>`).join('')}</ul>
                                </div>
                                <div class="next-steps">
                                    <h4>🚀 Next Steps:</h4>
                                    <p>${cfg.nextStepsIntro}</p>
                                    <ul>${cfg.nextSteps.map(s => `<li>${s}</li>`).join('')}</ul>
                                </div>
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
    },

    // LEVEL 1 — preserved exactly (do not modify)
    getGreetingsLesson() {
        return {
            id: 1,
            title: "🏝️ Island Greetings",
            subtitle: "Learn traditional Guna welcome expressions",
            duration: 15,
            xp: 50,
            sections: [
                {
                    type: 'introduction',
                    title: "Welcome to Guna Language!",
                    content: `
                        <div class="lesson-intro">
                            <div class="intro-header">
                                <h2>🏝️ Welcome to Guna Language</h2>
                                <p>Discover the beautiful language of the Guna people, who live on the islands of Panama's Caribbean coast.</p>
                            </div>
                            <div class="cultural-context">
                                <h3>🌊 Cultural Context</h3>
                                <p>The Guna people are known for their rich maritime culture, beautiful molas (traditional textiles), and strong community values. Their language reflects their deep connection to the sea and their island home.</p>
                                <div class="cultural-highlights">
                                    <div class="highlight-item"><i class="fas fa-water"></i><span>Sea-faring people</span></div>
                                    <div class="highlight-item"><i class="fas fa-palette"></i><span>Famous for molas</span></div>
                                    <div class="highlight-item"><i class="fas fa-users"></i><span>Strong community</span></div>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'vocabulary',
                    title: "Essential Greetings",
                    content: `
                        <div class="vocabulary-section">
                            <h3>📚 Basic Greetings Vocabulary</h3>
                            <p>Let's learn the most important greeting words and phrases in Guna:</p>
                            <div class="vocabulary-table">
                                <table>
                                    <thead><tr><th>Guna</th><th>Spanish</th><th>English</th><th>Pronunciation</th></tr></thead>
                                    <tbody>
                                        <tr><td><strong>¡ anna !</strong></td><td>Hola</td><td>Hello</td><td>¡ anna !</td></tr>
                                        <tr><td><strong>¡ naa !</strong></td><td>Hola</td><td>Hi</td><td>¡ naa !</td></tr>
                                        <tr><td><strong>¡ degidde !</strong></td><td>Hola</td><td>Hello</td><td>¡ degite !</td></tr>
                                        <tr><td><strong>degi malo</strong></td><td>Adios</td><td>Goodbye</td><td>Degi malo</td></tr>
                                        <tr><td><strong>¡ banmalo !</strong></td><td>Hasta mañana</td><td>See you tomorrow</td><td>Banmelo</td></tr>
                                        <tr><td><strong>¡ banemalo !</strong></td><td>Hasta mañana</td><td>See you tomorrow</td><td>Banemalo</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="pronunciation-tips">
                                <h4>💡 Pronunciation Tips</h4>
                                <ul>
                                    <li><strong>¡ anna !</strong> - Similar to "ah-nah" with emphasis</li>
                                    <li><strong>¡ naa !</strong> - Sounds like "nah" with a long 'a'</li>
                                    <li><strong>degidde</strong> - "deh-gee-deh" with soft 'g'</li>
                                    <li><strong>malo</strong> - "mah-lo" with clear 'o'</li>
                                </ul>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'interactive',
                    title: "Practice Time!",
                    content: `
                        <div class="interactive-section">
                            <h3>🎯 Let's Practice!</h3>
                            <p>Test your knowledge of Guna greetings with these interactive exercises:</p>
                            <div class="quiz-container">
                                <div class="quiz-question" data-question="1">
                                    <h4>Question 1: How do you say "Hello" in Guna?</h4>
                                    <div class="quiz-options">
                                        <button class="quiz-option" data-answer="anna">¡ anna !</button>
                                        <button class="quiz-option" data-answer="malo">degi malo</button>
                                        <button class="quiz-option" data-answer="banmalo">¡ banmalo !</button>
                                        <button class="quiz-option" data-answer="naa">¡ naa !</button>
                                    </div>
                                    <div class="quiz-feedback" style="display: none;"></div>
                                </div>
                                <div class="quiz-question" data-question="2">
                                    <h4>Question 2: What does "degi malo" mean?</h4>
                                    <div class="quiz-options">
                                        <button class="quiz-option" data-answer="hello">Hello</button>
                                        <button class="quiz-option" data-answer="goodbye">Goodbye</button>
                                        <button class="quiz-option" data-answer="tomorrow">See you tomorrow</button>
                                        <button class="quiz-option" data-answer="thanks">Thank you</button>
                                    </div>
                                    <div class="quiz-feedback" style="display: none;"></div>
                                </div>
                                <div class="quiz-question" data-question="3">
                                    <h4>Question 3: Which phrase means "See you tomorrow"?</h4>
                                    <div class="quiz-options">
                                        <button class="quiz-option" data-answer="anna">¡ anna !</button>
                                        <button class="quiz-option" data-answer="malo">degi malo</button>
                                        <button class="quiz-option" data-answer="banmalo">¡ banmalo !</button>
                                        <button class="quiz-option" data-answer="naa">¡ naa !</button>
                                    </div>
                                    <div class="quiz-feedback" style="display: none;"></div>
                                </div>
                                <div class="quiz-question" data-question="4">
                                    <h4>Question 4: Match the Guna greeting with its meaning:</h4>
                                    <div class="matching-exercise">
                                        <div class="matching-pairs">
                                            <div class="matching-item" data-pair="1">
                                                <span class="guna-text">¡ anna !</span>
                                                <select class="matching-select">
                                                    <option value="">Select meaning...</option>
                                                    <option value="hello">Hello</option>
                                                    <option value="goodbye">Goodbye</option>
                                                    <option value="tomorrow">See you tomorrow</option>
                                                </select>
                                            </div>
                                            <div class="matching-item" data-pair="2">
                                                <span class="guna-text">degi malo</span>
                                                <select class="matching-select">
                                                    <option value="">Select meaning...</option>
                                                    <option value="hello">Hello</option>
                                                    <option value="goodbye">Goodbye</option>
                                                    <option value="tomorrow">See you tomorrow</option>
                                                </select>
                                            </div>
                                            <div class="matching-item" data-pair="3">
                                                <span class="guna-text">¡ banmalo !</span>
                                                <select class="matching-select">
                                                    <option value="">Select meaning...</option>
                                                    <option value="hello">Hello</option>
                                                    <option value="goodbye">Goodbye</option>
                                                    <option value="tomorrow">See you tomorrow</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button class="check-matching-btn">Check Answers</button>
                                        <div class="matching-feedback" style="display: none;"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="quiz-results" style="display: none;">
                                <h4>🎉 Quiz Results</h4>
                                <div class="results-summary">
                                    <p>You got <span class="correct-answers">0</span> out of <span class="total-questions">4</span> questions correct!</p>
                                    <div class="progress-bar"><div class="progress-fill" style="width: 0%"></div></div>
                                </div>
                                <button class="retry-quiz-btn">Try Again</button>
                                <button class="continue-lesson-btn">Continue to Next Section</button>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'conversation',
                    title: "Real Conversation Practice",
                    content: `
                        <div class="conversation-section">
                            <h3>💬 Practice Conversation</h3>
                            <p>Practice using Guna greetings in realistic scenarios:</p>
                            <div class="conversation-scenarios">
                                <div class="scenario" data-scenario="1">
                                    <h4>Scenario 1: Meeting a Guna friend</h4>
                                    <div class="scenario-content">
                                        <p><strong>You:</strong> [Choose the appropriate greeting]</p>
                                        <div class="scenario-options">
                                            <button class="scenario-option">¡ anna !</button>
                                            <button class="scenario-option">¡ naa !</button>
                                            <button class="scenario-option">¡ degidde !</button>
                                        </div>
                                        <div class="scenario-response" style="display: none;">
                                            <p><strong>Friend:</strong> ¡ anna ! How are you?</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="scenario" data-scenario="2">
                                    <h4>Scenario 2: Saying goodbye for the day</h4>
                                    <div class="scenario-content">
                                        <p><strong>You:</strong> [Choose the appropriate farewell]</p>
                                        <div class="scenario-options">
                                            <button class="scenario-option">degi malo</button>
                                            <button class="scenario-option">¡ banmalo !</button>
                                            <button class="scenario-option">¡ banemalo !</button>
                                        </div>
                                        <div class="scenario-response" style="display: none;">
                                            <p><strong>Friend:</strong> ¡ banmalo ! Have a good day.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    type: 'summary',
                    title: "Lesson Summary",
                    content: `
                        <div class="lesson-summary">
                            <h3>📝 What You've Learned</h3>
                            <div class="summary-content">
                                <div class="learned-greetings">
                                    <h4>✅ Greetings You Can Now Use:</h4>
                                    <ul>
                                        <li><strong>¡ anna !</strong> - Hello (most common)</li>
                                        <li><strong>¡ naa !</strong> - Hi (informal)</li>
                                        <li><strong>¡ degidde !</strong> - Hello (alternative)</li>
                                        <li><strong>degi malo</strong> - Goodbye</li>
                                        <li><strong>¡ banmalo !</strong> - See you tomorrow</li>
                                    </ul>
                                </div>
                                <div class="cultural-notes">
                                    <h4>🌊 Cultural Notes:</h4>
                                    <ul>
                                        <li>Guna greetings often reflect their maritime culture</li>
                                        <li>Use "¡ anna !" as your go-to greeting</li>
                                        <li>Show respect by using the appropriate farewell</li>
                                    </ul>
                                </div>
                                <div class="next-steps">
                                    <h4>🚀 Next Steps:</h4>
                                    <p>Great job! You're ready to move on to:</p>
                                    <ul>
                                        <li>Family vocabulary</li>
                                        <li>Home objects</li>
                                        <li>Basic conversation skills</li>
                                    </ul>
                                </div>
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
    },

    // LEVEL 2 — Family (same structure, all English)
    getFamilyLesson() {
        return this.buildRichLesson({
            id: 2,
            title: '👨‍👩‍👧 Family - Guna Family Members',
            subtitle: 'Learn family words and talk about your relatives',
            duration: 20,
            xp: 75,
            introTitle: 'Welcome to Family Vocabulary!',
            introHeading: '👨‍👩‍👧 Guna Family',
            introText: 'Family is the heart of Guna society. Learn how to name parents, siblings, grandparents and talk about your relatives.',
            culturalText: 'In Guna communities, elders (Dada and Bab) pass wisdom to younger generations. Family bonds are strengthened through daily life, storytelling, and community gatherings.',
            highlights: [
                { icon: 'fa-users', text: 'Strong family bonds' },
                { icon: 'fa-book-open', text: 'Oral tradition' },
                { icon: 'fa-heart', text: 'Respect for elders' }
            ],
            vocabTitle: 'Family Vocabulary',
            vocabHeading: 'Family Members Vocabulary',
            vocabIntro: 'Learn the most important family words in Guna:',
            words: [
                { guna: 'Nana', es: 'Mamá', en: 'Mother', pronunciation: 'Nah-nah' },
                { guna: 'Tata', es: 'Papá', en: 'Father', pronunciation: 'Tah-tah' },
                { guna: 'Dummad', es: 'Hermano', en: 'Brother', pronunciation: 'Doo-mad' },
                { guna: 'Nueded', es: 'Hermana', en: 'Sister', pronunciation: 'Nweh-ded' },
                { guna: 'Bab', es: 'Abuelo', en: 'Grandfather', pronunciation: 'Bab' },
                { guna: 'Dada', es: 'Abuela', en: 'Grandmother', pronunciation: 'Dah-dah' }
            ],
            pronunciationTips: [
                '<strong>Nana</strong> - "nah-nah", stress on first syllable',
                '<strong>Tata</strong> - "tah-tah", clear short vowels',
                '<strong>Dummad</strong> - "doo-mad", soft "d" sound',
                '<strong>Dada</strong> - "dah-dah", used for grandmother'
            ],
            practiceIntro: 'Test your knowledge of Guna family words with these interactive exercises:',
            quizQuestions: [
                { num: 1, text: 'How do you say "Mother" in Guna?', options: [
                    { value: 'nana', label: 'Nana' }, { value: 'tata', label: 'Tata' },
                    { value: 'dada', label: 'Dada' }, { value: 'bab', label: 'Bab' }
                ]},
                { num: 2, text: 'What does "Tata" mean?', options: [
                    { value: 'father', label: 'Father' }, { value: 'mother', label: 'Mother' },
                    { value: 'brother', label: 'Brother' }, { value: 'sister', label: 'Sister' }
                ]},
                { num: 3, text: 'Which word means "Grandmother"?', options: [
                    { value: 'dada', label: 'Dada' }, { value: 'bab', label: 'Bab' },
                    { value: 'nueded', label: 'Nueded' }, { value: 'dummad', label: 'Dummad' }
                ]},
                { num: 4, type: 'matching', text: 'Match each Guna word with its meaning:', pairs: [
                    { guna: 'Nana', options: [
                        { value: 'mother', label: 'Mother' }, { value: 'father', label: 'Father' }, { value: 'brother', label: 'Brother' }
                    ]},
                    { guna: 'Tata', options: [
                        { value: 'mother', label: 'Mother' }, { value: 'father', label: 'Father' }, { value: 'sister', label: 'Sister' }
                    ]},
                    { guna: 'Dummad', options: [
                        { value: 'brother', label: 'Brother' }, { value: 'grandmother', label: 'Grandmother' }, { value: 'grandfather', label: 'Grandfather' }
                    ]}
                ]}
            ],
            scenarios: [
                {
                    title: 'Scenario 1: Introducing your mother',
                    prompt: 'You want to say "This is my mother" — which word do you use?',
                    choices: ['Nana', 'Tata', 'Dada'],
                    response: '<strong>Correct!</strong> Nana means Mother. You can say: "An Nana" — My mother.'
                },
                {
                    title: 'Scenario 2: Talking about siblings',
                    prompt: 'Your friend asks about your brother. Which word means brother?',
                    choices: ['Dummad', 'Nueded', 'Bab'],
                    response: '<strong>Correct!</strong> Dummad means Brother. Nueded means Sister.'
                }
            ],
            summaryWords: [
                { guna: 'Nana', en: 'Mother' }, { guna: 'Tata', en: 'Father' },
                { guna: 'Dummad', en: 'Brother' }, { guna: 'Nueded', en: 'Sister' },
                { guna: 'Bab', en: 'Grandfather' }, { guna: 'Dada', en: 'Grandmother' }
            ],
            culturalNotes: [
                'Elders (Dada and Bab) are highly respected in Guna culture',
                'Family names and relationships are shared in community gatherings',
                'Children learn family vocabulary through daily conversation'
            ],
            nextStepsIntro: 'Great job! You are ready to move on to:',
            nextSteps: ['Home objects vocabulary', 'Nature words', 'Basic conversations']
        });
    },

    // LEVEL 3 — Home Objects (same structure, all English)
    getHomeObjectsLesson() {
        return this.buildRichLesson({
            id: 3,
            title: '🏠 Home Objects - Guna Daily Life',
            subtitle: 'Learn words for objects in the Guna home',
            duration: 20,
            xp: 75,
            introTitle: 'Welcome to Home Vocabulary!',
            introHeading: '🏠 Home Objects',
            introText: 'Learn the words for everyday objects found in a Guna home — from the house itself to the tools used every day.',
            culturalText: 'The Guna home (Muu) is the center of family life on the islands. Traditional houses are gathering places where food is shared, stories are told, and community bonds grow.',
            highlights: [
                { icon: 'fa-home', text: 'Center of family life' },
                { icon: 'fa-utensils', text: 'Shared meals' },
                { icon: 'fa-hands-helping', text: 'Community gathering' }
            ],
            vocabTitle: 'Home Vocabulary',
            vocabHeading: 'Home Objects Vocabulary',
            vocabIntro: 'Learn the most important home words in Guna:',
            words: [
                { guna: 'Muu', es: 'Casa', en: 'House', pronunciation: 'Moo' },
                { guna: 'Nika', es: 'Mesa', en: 'Table', pronunciation: 'Nee-kah' },
                { guna: 'Misi', es: 'Plato', en: 'Plate', pronunciation: 'Mee-see' },
                { guna: 'Tapa', es: 'Cuchara', en: 'Spoon', pronunciation: 'Tah-pah' },
                { guna: 'Bii', es: 'Ropa', en: 'Clothes', pronunciation: 'Bee' }
            ],
            pronunciationTips: [
                '<strong>Muu</strong> - "moo" like the sound a cow makes, means house',
                '<strong>Nika</strong> - "nee-kah", stress on first syllable',
                '<strong>Misi</strong> - "mee-see", means plate',
                '<strong>Tapa</strong> - "tah-pah", means spoon'
            ],
            practiceIntro: 'Test your knowledge of Guna home words with these interactive exercises:',
            quizQuestions: [
                { num: 1, text: 'How do you say "House" in Guna?', options: [
                    { value: 'muu', label: 'Muu' }, { value: 'nika', label: 'Nika' },
                    { value: 'misi', label: 'Misi' }, { value: 'bii', label: 'Bii' }
                ]},
                { num: 2, text: 'What does "Misi" mean?', options: [
                    { value: 'plate', label: 'Plate' }, { value: 'table', label: 'Table' },
                    { value: 'spoon', label: 'Spoon' }, { value: 'clothes', label: 'Clothes' }
                ]},
                { num: 3, text: 'Which word means "Spoon"?', options: [
                    { value: 'tapa', label: 'Tapa' }, { value: 'nika', label: 'Nika' },
                    { value: 'muu', label: 'Muu' }, { value: 'bii', label: 'Bii' }
                ]},
                { num: 4, type: 'matching', text: 'Match each Guna word with its meaning:', pairs: [
                    { guna: 'Muu', options: [
                        { value: 'house', label: 'House' }, { value: 'table', label: 'Table' }, { value: 'plate', label: 'Plate' }
                    ]},
                    { guna: 'Nika', options: [
                        { value: 'house', label: 'House' }, { value: 'table', label: 'Table' }, { value: 'spoon', label: 'Spoon' }
                    ]},
                    { guna: 'Tapa', options: [
                        { value: 'spoon', label: 'Spoon' }, { value: 'clothes', label: 'Clothes' }, { value: 'plate', label: 'Plate' }
                    ]}
                ]}
            ],
            scenarios: [
                {
                    title: 'Scenario 1: Inviting someone home',
                    prompt: 'You want to say "Come to my house" — which word means house?',
                    choices: ['Muu', 'Nika', 'Misi'],
                    response: '<strong>Correct!</strong> Muu means House. The home is the heart of Guna family life.'
                },
                {
                    title: 'Scenario 2: Setting the table',
                    prompt: 'You need the word for "plate" to describe setting the table:',
                    choices: ['Misi', 'Tapa', 'Bii'],
                    response: '<strong>Correct!</strong> Misi means Plate. Tapa is the spoon.'
                }
            ],
            summaryWords: [
                { guna: 'Muu', en: 'House' }, { guna: 'Nika', en: 'Table' },
                { guna: 'Misi', en: 'Plate' }, { guna: 'Tapa', en: 'Spoon' },
                { guna: 'Bii', en: 'Clothes' }
            ],
            culturalNotes: [
                'The Guna home (Muu) is where families gather and share meals',
                'Traditional cooking uses simple tools like plates and spoons',
                'Clothing (Bii) often includes beautiful mola textiles'
            ],
            nextStepsIntro: 'Great job! You are ready to move on to:',
            nextSteps: ['Nature vocabulary', 'Animals of the island', 'Plants and foods']
        });
    }
};

window.GunaLevelLessons = GunaLevelLessons;
