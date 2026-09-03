/**
 * Rich lesson structure for Guna levels 1–3
 * Uses the recorded audio vocabulary (Guna — Spanish — English).
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
                <div class="quiz-question duo-exercise" data-question="${q.num}" data-prompt="Choose the correct answer">
                    <h4 class="duo-sr-only">Question ${q.num}: ${q.text}</h4>
                    <div class="duo-mascot-row">
                        <img class="duo-mascot" src="../Multimedia/Images/Soged/Newturttle.png" alt="Soggy" onerror="this.style.display='none'">
                        <div class="duo-bubble">${q.text}</div>
                    </div>
                    <div class="duo-answer-bank" aria-live="polite"></div>
                    <div class="quiz-options duo-chips">
                        ${q.options.map(o => `<button type="button" class="quiz-option duo-chip" data-answer="${o.value}">${o.label}</button>`).join('')}
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
                        </div>
                    `
                },
                {
                    type: 'pronunciation',
                    title: 'Pronunciation',
                    content: `
                        <div class="pronunciation-section">
                            <h3>🔊 Pronunciation Practice</h3>
                            <p>Say each word aloud, then review the tips below.</p>
                            <div class="pronunciation-grid">
                                ${cfg.words.map(w => `
                                    <button type="button" class="pronunciation-card" data-speak="${w.guna}">
                                        <span class="pron-icon">🔊</span>
                                        <strong>${w.guna}</strong>
                                        <small>${w.en}</small>
                                    </button>
                                `).join('')}
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
                        <div class="interactive-section" data-paged="true">
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

    getGreetingsLesson() {
        return this.buildRichLesson({
            id: 1,
            title: '👋 Island Greetings',
            subtitle: 'Learn traditional Guna welcome expressions',
            duration: 15,
            xp: 50,
            introTitle: 'Welcome to Guna Language!',
            introHeading: '👋 Island Greetings',
            introText: 'Discover the language of the Guna people, who live on the islands of Panama\'s Caribbean coast.',
            culturalText: 'The Guna people are known for their maritime culture, molas (traditional textiles), and strong community values. Greetings open every conversation.',
            highlights: [
                { icon: 'fa-water', text: 'Sea-faring people' },
                { icon: 'fa-palette', text: 'Famous for molas' },
                { icon: 'fa-users', text: 'Strong community' }
            ],
            vocabTitle: 'Essential Greetings',
            vocabHeading: 'Basic Greetings Vocabulary',
            vocabIntro: 'Learn the most important greeting words in Guna:',
            words: [
                { guna: 'Naa', es: 'Hola', en: 'Hello', pronunciation: 'Nah' },
                { guna: 'Deggidde', es: 'Cómo estás', en: 'How are you', pronunciation: 'Deh-gee-deh' },
                { guna: 'Deggimalo', es: 'Adiós', en: 'Goodbye', pronunciation: 'Deg-gee-mah-lo' },
                { guna: 'Bannemalo', es: 'Hasta mañana', en: 'See you tomorrow', pronunciation: 'Ban-neh-mah-lo' },
                { guna: 'Eye', es: 'Sí', en: 'Yes', pronunciation: 'Eh-yeh' },
                { guna: 'Suli', es: 'No', en: 'No', pronunciation: 'Soo-lee' },
                { guna: 'Nued', es: 'Gracias', en: 'Thank you', pronunciation: 'Nweh-ed' },
                { guna: 'Be', es: 'Tú', en: 'You', pronunciation: 'Beh' }
            ],
            pronunciationTips: [
                '<strong>Naa</strong> - "nah" with a long a, the everyday hello',
                '<strong>Deggidde</strong> - "deh-gee-deh", used to ask how someone is',
                '<strong>Deggimalo</strong> - "deg-gee-mah-lo", goodbye',
                '<strong>Bannemalo</strong> - "ban-neh-mah-lo", see you tomorrow'
            ],
            practiceIntro: 'Test your knowledge of Guna greetings with these interactive exercises:',
            quizQuestions: [
                { num: 1, text: 'How do you say "Hello" in Guna?', options: [
                    { value: 'naa', label: 'Naa' }, { value: 'suli', label: 'Suli' },
                    { value: 'eye', label: 'Eye' }, { value: 'be', label: 'Be' }
                ]},
                { num: 2, text: 'What does "Deggimalo" mean?', options: [
                    { value: 'hello', label: 'Hello' }, { value: 'goodbye', label: 'Goodbye' },
                    { value: 'tomorrow', label: 'See you tomorrow' }, { value: 'thanks', label: 'Thank you' }
                ]},
                { num: 3, text: 'Which phrase means "See you tomorrow"?', options: [
                    { value: 'naa', label: 'Naa' }, { value: 'deggimalo', label: 'Deggimalo' },
                    { value: 'bannemalo', label: 'Bannemalo' }, { value: 'nued', label: 'Nued' }
                ]},
                { num: 4, type: 'matching', text: 'Match each Guna word with its meaning:', pairs: [
                    { guna: 'Naa', options: [
                        { value: 'hello', label: 'Hello' }, { value: 'goodbye', label: 'Goodbye' }, { value: 'yes', label: 'Yes' }
                    ]},
                    { guna: 'Eye', options: [
                        { value: 'hello', label: 'Hello' }, { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }
                    ]},
                    { guna: 'Deggimalo', options: [
                        { value: 'goodbye', label: 'Goodbye' }, { value: 'hello', label: 'Hello' }, { value: 'tomorrow', label: 'See you tomorrow' }
                    ]}
                ]}
            ],
            scenarios: [
                {
                    title: 'Scenario 1: Meeting a Guna friend',
                    prompt: 'You want to say hello — which word do you use?',
                    choices: ['Naa', 'Suli', 'Nued'],
                    response: '<strong>Correct!</strong> Naa means Hello. You can also ask Deggidde — How are you?'
                },
                {
                    title: 'Scenario 2: Saying goodbye for the day',
                    prompt: 'You are leaving until tomorrow. Which farewell do you use?',
                    choices: ['Bannemalo', 'Deggimalo', 'Eye'],
                    response: '<strong>Correct!</strong> Bannemalo means See you tomorrow. Deggimalo is a general goodbye.'
                }
            ],
            summaryWords: [
                { guna: 'Naa', en: 'Hello' }, { guna: 'Deggidde', en: 'How are you' },
                { guna: 'Deggimalo', en: 'Goodbye' }, { guna: 'Bannemalo', en: 'See you tomorrow' },
                { guna: 'Eye', en: 'Yes' }, { guna: 'Suli', en: 'No' },
                { guna: 'Nued', en: 'Thank you' }, { guna: 'Be', en: 'You' }
            ],
            culturalNotes: [
                'Guna greetings often reflect island community life',
                'Use Naa as your everyday hello',
                'Bannemalo is the farewell when you will meet again tomorrow'
            ],
            nextStepsIntro: 'Great job! You are ready to move on to:',
            nextSteps: ['Family vocabulary', 'Home and places', 'Basic conversation skills']
        });
    },

    getFamilyLesson() {
        return this.buildRichLesson({
            id: 2,
            title: '👨‍👩‍👧 Family - Guna Family Members',
            subtitle: 'Learn family words and talk about your relatives',
            duration: 20,
            xp: 75,
            introTitle: 'Welcome to Family Vocabulary!',
            introHeading: '👨‍👩‍👧 Guna Family',
            introText: 'Family is the heart of Guna society. Learn how to name parents, grandparents, relatives and friends.',
            culturalText: 'In Guna communities, elders (Tata and Muú) pass wisdom to younger generations. Family bonds are strengthened through daily life, storytelling, and community gatherings.',
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
                { guna: 'Baba', es: 'Papá', en: 'Father', pronunciation: 'Bah-bah' },
                { guna: 'Tata', es: 'Abuelo', en: 'Grandfather', pronunciation: 'Tah-tah' },
                { guna: 'Muú', es: 'Abuela', en: 'Grandmother', pronunciation: 'Moo' },
                { guna: 'Gilor', es: 'Tío', en: 'Uncle', pronunciation: 'Gee-lor' },
                { guna: 'Ammor', es: 'Tía', en: 'Aunt', pronunciation: 'Ah-mor' },
                { guna: 'Niga', es: 'Sobrino', en: 'Nephew', pronunciation: 'Nee-gah' },
                { guna: 'Anai', es: 'Amigo', en: 'Friend', pronunciation: 'Ah-nye' },
                { guna: 'Ome', es: 'Mujer', en: 'Woman', pronunciation: 'Oh-meh' },
                { guna: 'Massered', es: 'Hombre', en: 'Man', pronunciation: 'Mah-seh-red' }
            ],
            pronunciationTips: [
                '<strong>Nana</strong> - "nah-nah", stress on first syllable',
                '<strong>Baba</strong> - "bah-bah", father',
                '<strong>Tata</strong> - "tah-tah", grandfather',
                '<strong>Muú</strong> - "moo" with a long u, grandmother'
            ],
            practiceIntro: 'Test your knowledge of Guna family words with these interactive exercises:',
            quizQuestions: [
                { num: 1, text: 'How do you say "Mother" in Guna?', options: [
                    { value: 'nana', label: 'Nana' }, { value: 'baba', label: 'Baba' },
                    { value: 'tata', label: 'Tata' }, { value: 'muu', label: 'Muú' }
                ]},
                { num: 2, text: 'What does "Baba" mean?', options: [
                    { value: 'father', label: 'Father' }, { value: 'mother', label: 'Mother' },
                    { value: 'uncle', label: 'Uncle' }, { value: 'friend', label: 'Friend' }
                ]},
                { num: 3, text: 'Which word means "Grandmother"?', options: [
                    { value: 'muu', label: 'Muú' }, { value: 'tata', label: 'Tata' },
                    { value: 'ammor', label: 'Ammor' }, { value: 'niga', label: 'Niga' }
                ]},
                { num: 4, type: 'matching', text: 'Match each Guna word with its meaning:', pairs: [
                    { guna: 'Nana', options: [
                        { value: 'mother', label: 'Mother' }, { value: 'father', label: 'Father' }, { value: 'aunt', label: 'Aunt' }
                    ]},
                    { guna: 'Baba', options: [
                        { value: 'mother', label: 'Mother' }, { value: 'father', label: 'Father' }, { value: 'uncle', label: 'Uncle' }
                    ]},
                    { guna: 'Tata', options: [
                        { value: 'grandfather', label: 'Grandfather' }, { value: 'grandmother', label: 'Grandmother' }, { value: 'nephew', label: 'Nephew' }
                    ]}
                ]}
            ],
            scenarios: [
                {
                    title: 'Scenario 1: Introducing your mother',
                    prompt: 'You want to say "This is my mother" — which word do you use?',
                    choices: ['Nana', 'Baba', 'Muú'],
                    response: '<strong>Correct!</strong> Nana means Mother. You can say: "An Nana" — My mother.'
                },
                {
                    title: 'Scenario 2: Talking about elders',
                    prompt: 'Your friend asks about your grandfather. Which word means grandfather?',
                    choices: ['Tata', 'Gilor', 'Niga'],
                    response: '<strong>Correct!</strong> Tata means Grandfather. Muú means Grandmother.'
                }
            ],
            summaryWords: [
                { guna: 'Nana', en: 'Mother' }, { guna: 'Baba', en: 'Father' },
                { guna: 'Tata', en: 'Grandfather' }, { guna: 'Muú', en: 'Grandmother' },
                { guna: 'Gilor', en: 'Uncle' }, { guna: 'Ammor', en: 'Aunt' },
                { guna: 'Niga', en: 'Nephew' }, { guna: 'Anai', en: 'Friend' }
            ],
            culturalNotes: [
                'Elders (Tata and Muú) are highly respected in Guna culture',
                'Family names and relationships are shared in community gatherings',
                'Children learn family vocabulary through daily conversation'
            ],
            nextStepsIntro: 'Great job! You are ready to move on to:',
            nextSteps: ['Home and places', 'Nature words', 'Basic conversations']
        });
    },

    getHomeObjectsLesson() {
        return this.buildRichLesson({
            id: 3,
            title: '🏠 Home & Places - Guna Daily Life',
            subtitle: 'Learn words for the house, store, school and clothing',
            duration: 20,
            xp: 75,
            introTitle: 'Welcome to Home Vocabulary!',
            introHeading: '🏠 Home & Places',
            introText: 'Learn the words for the Guna home and everyday places — house, store, school and the mola blouse.',
            culturalText: 'The Guna home (Nega) is the center of family life on the islands. Traditional houses are gathering places where food is shared, stories are told, and community bonds grow.',
            highlights: [
                { icon: 'fa-home', text: 'Center of family life' },
                { icon: 'fa-store', text: 'Community store' },
                { icon: 'fa-hands-helping', text: 'Community gathering' }
            ],
            vocabTitle: 'Home Vocabulary',
            vocabHeading: 'Home and Places Vocabulary',
            vocabIntro: 'Learn the most important home and place words in Guna:',
            words: [
                { guna: 'Nega', es: 'Casa', en: 'House', pronunciation: 'Neh-gah' },
                { guna: 'Ibya', es: 'Tienda', en: 'Store', pronunciation: 'Ee-byah' },
                { guna: 'Ibdurdaggednega', es: 'Escuela', en: 'School', pronunciation: 'Ib-dur-dag-ged-neh-gah' },
                { guna: 'Mola', es: 'Blusa de mujer', en: "Women's blouse", pronunciation: 'Moh-lah' },
                { guna: 'Moryoed', es: 'Vestirse', en: 'To get dressed', pronunciation: 'Mor-yo-ed' }
            ],
            pronunciationTips: [
                '<strong>Nega</strong> - "neh-gah", means house / home',
                '<strong>Ibya</strong> - "ee-byah", means store',
                '<strong>Mola</strong> - "moh-lah", the traditional women\'s blouse',
                '<strong>Moryoed</strong> - "mor-yo-ed", to get dressed'
            ],
            practiceIntro: 'Test your knowledge of Guna home words with these interactive exercises:',
            quizQuestions: [
                { num: 1, text: 'How do you say "House" in Guna?', options: [
                    { value: 'nega', label: 'Nega' }, { value: 'ibya', label: 'Ibya' },
                    { value: 'mola', label: 'Mola' }, { value: 'dii', label: 'Dii' }
                ]},
                { num: 2, text: 'What does "Ibya" mean?', options: [
                    { value: 'store', label: 'Store' }, { value: 'house', label: 'House' },
                    { value: 'school', label: 'School' }, { value: 'blouse', label: "Women's blouse" }
                ]},
                { num: 3, text: 'Which word means "School"?', options: [
                    { value: 'ibdurdaggednega', label: 'Ibdurdaggednega' }, { value: 'nega', label: 'Nega' },
                    { value: 'ibya', label: 'Ibya' }, { value: 'mola', label: 'Mola' }
                ]},
                { num: 4, type: 'matching', text: 'Match each Guna word with its meaning:', pairs: [
                    { guna: 'Nega', options: [
                        { value: 'house', label: 'House' }, { value: 'store', label: 'Store' }, { value: 'school', label: 'School' }
                    ]},
                    { guna: 'Ibya', options: [
                        { value: 'house', label: 'House' }, { value: 'store', label: 'Store' }, { value: 'blouse', label: "Women's blouse" }
                    ]},
                    { guna: 'Mola', options: [
                        { value: 'blouse', label: "Women's blouse" }, { value: 'house', label: 'House' }, { value: 'school', label: 'School' }
                    ]}
                ]}
            ],
            scenarios: [
                {
                    title: 'Scenario 1: Inviting someone home',
                    prompt: 'You want to say "Come to my house" — which word means house?',
                    choices: ['Nega', 'Ibya', 'Mola'],
                    response: '<strong>Correct!</strong> Nega means House. The home is the heart of Guna family life.'
                },
                {
                    title: 'Scenario 2: Going to school',
                    prompt: 'You need the word for school:',
                    choices: ['Ibdurdaggednega', 'Ibya', 'Moryoed'],
                    response: '<strong>Correct!</strong> Ibdurdaggednega means School. Ibya is the store.'
                }
            ],
            summaryWords: [
                { guna: 'Nega', en: 'House' }, { guna: 'Ibya', en: 'Store' },
                { guna: 'Ibdurdaggednega', en: 'School' }, { guna: 'Mola', en: "Women's blouse" },
                { guna: 'Moryoed', en: 'To get dressed' }
            ],
            culturalNotes: [
                'The Guna home (Nega) is where families gather and share meals',
                'The mola blouse is a symbol of Guna identity',
                'School and store are everyday community places'
            ],
            nextStepsIntro: 'Great job! You are ready to move on to:',
            nextSteps: ['Nature vocabulary', 'Animals of the island', 'Plants and foods']
        });
    }
};

window.GunaLevelLessons = GunaLevelLessons;

