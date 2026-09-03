/**
 * Guna Lesson Configs — data for learning levels 1–7
 * Vocabulary is limited to recorded audio words.
 */
const GUNA_LESSON_CONFIGS = {
    1: {
        id: 1, title: '👋 Greetings & Introductions', subtitle: 'Greetings and introductions',
        duration: 15, xp: 50,
        wordsKey: 'greetings',
        introTitle: 'Welcome', introHeading: '👋 Greetings & Introductions',
        introText: 'Learn basic greetings, yes and no, and how to greet someone in Guna.',
        culturalText: 'Guna people greet each other warmly on the islands. Respectful greetings open every conversation and ceremony.',
        vocabTitle: 'Greetings & Pronouns', vocabIntro: 'Essential words to start speaking Guna:',
        quiz: [
            { q: 'How do you say "Hello" in Guna?', options: [
                { value: 'naa', label: 'Naa' }, { value: 'suli', label: 'Suli' },
                { value: 'eye', label: 'Eye' }, { value: 'be', label: 'Be' }
            ]},
            { q: 'What does "Eye" mean?', options: [
                { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' },
                { value: 'you', label: 'You' }, { value: 'hello', label: 'Hello' }
            ]},
            { q: 'Which means "Goodbye"?', options: [
                { value: 'deggimalo', label: 'Deggimalo' }, { value: 'bannemalo', label: 'Bannemalo' },
                { value: 'bia', label: 'Bia' }, { value: 'nued', label: 'Nued' }
            ]}
        ],
        matchPairs: [{ guna: 'Naa' }, { guna: 'Eye' }, { guna: 'Deggimalo' }],
        matchOptionPool: [
            { value: 'hello', label: 'Hello' }, { value: 'yes', label: 'Yes' },
            { value: 'goodbye', label: 'Goodbye' }, { value: 'no', label: 'No' }
        ],
        dragPairs: [
            { guna: 'Naa', value: 'hello', label: 'Hello' },
            { guna: 'Eye', value: 'yes', label: 'Yes' },
            { guna: 'Deggimalo', value: 'goodbye', label: 'Goodbye' }
        ],
        completionTitle: 'Greetings mastered!', completionText: 'You can greet people and use yes and no in Guna.'
    },
    2: {
        id: 2, title: '👨‍👩‍👧 Family', subtitle: 'Family members',
        duration: 20, xp: 75,
        wordsKey: 'family',
        introTitle: 'Family', introHeading: '👨‍👩‍👧 Family',
        introText: 'Learn to name parents, grandparents, relatives and friends in Guna.',
        culturalText: 'Family is the heart of Guna society. Elders pass wisdom through oral tradition.',
        vocabTitle: 'Family Vocabulary', vocabIntro: 'Key family terms:',
        quiz: [
            { q: 'How do you say "Mother"?', options: [
                { value: 'nana', label: 'Nana' }, { value: 'baba', label: 'Baba' },
                { value: 'tata', label: 'Tata' }, { value: 'muu', label: 'Muú' }
            ]},
            { q: 'What does "Baba" mean?', options: [
                { value: 'father', label: 'Father' }, { value: 'mother', label: 'Mother' },
                { value: 'uncle', label: 'Uncle' }, { value: 'friend', label: 'Friend' }
            ]},
            { q: 'Which word means "Grandmother"?', options: [
                { value: 'muu', label: 'Muú' }, { value: 'tata', label: 'Tata' },
                { value: 'ammor', label: 'Ammor' }, { value: 'niga', label: 'Niga' }
            ]}
        ],
        matchPairs: [{ guna: 'Nana' }, { guna: 'Baba' }, { guna: 'Tata' }],
        matchOptionPool: [
            { value: 'mother', label: 'Mother' }, { value: 'father', label: 'Father' },
            { value: 'grandfather', label: 'Grandfather' }, { value: 'aunt', label: 'Aunt' }
        ],
        dragPairs: [
            { guna: 'Nana', value: 'mother', label: 'Mother' },
            { guna: 'Baba', value: 'father', label: 'Father' },
            { guna: 'Tata', value: 'grandfather', label: 'Grandfather' }
        ],
        completionTitle: 'Family words learned!', completionText: 'You can talk about your family in Guna.'
    },
    3: {
        id: 3, title: '🏠 Home & Places', subtitle: 'Home and everyday places',
        duration: 20, xp: 75,
        wordsKey: 'home',
        introTitle: 'Home', introHeading: '🏠 Home & Places',
        introText: 'Learn words for the house, the store, school and daily clothing.',
        culturalText: 'Guna homes (Nega) are gathering places for family and community on the islands.',
        vocabTitle: 'Home Vocabulary', vocabIntro: 'Places and objects from daily life:',
        quiz: [
            { q: 'How do you say "House"?', options: [
                { value: 'nega', label: 'Nega' }, { value: 'ibya', label: 'Ibya' },
                { value: 'mola', label: 'Mola' }, { value: 'dii', label: 'Dii' }
            ]},
            { q: 'What does "Ibya" mean?', options: [
                { value: 'store', label: 'Store' }, { value: 'house', label: 'House' },
                { value: 'school', label: 'School' }, { value: 'blouse', label: "Women's blouse" }
            ]},
            { q: 'Which word means "School"?', options: [
                { value: 'ibdurdaggednega', label: 'Ibdurdaggednega' }, { value: 'nega', label: 'Nega' },
                { value: 'ibya', label: 'Ibya' }, { value: 'mola', label: 'Mola' }
            ]}
        ],
        matchPairs: [{ guna: 'Nega' }, { guna: 'Ibya' }, { guna: 'Mola' }],
        matchOptionPool: [
            { value: 'house', label: 'House' }, { value: 'store', label: 'Store' },
            { value: 'blouse', label: "Women's blouse" }, { value: 'school', label: 'School' }
        ],
        dragPairs: [
            { guna: 'Nega', value: 'house', label: 'House' },
            { guna: 'Ibya', value: 'store', label: 'Store' },
            { guna: 'Mola', value: 'blouse', label: "Women's blouse" }
        ],
        completionTitle: 'Home words learned!', completionText: 'You can name places and clothing in Guna.'
    },
    4: {
        id: 4, title: '🌊 Nature', subtitle: 'Nature elements',
        duration: 25, xp: 100,
        wordsKey: 'nature',
        introTitle: 'Nature', introHeading: '🌊 Nature',
        introText: 'Learn words for water, wood, clay and stick — elements of island life.',
        culturalText: 'Water (Dii), wood and clay are part of Guna daily life, building and ceremony.',
        vocabTitle: 'Nature Vocabulary', vocabIntro: 'Natural elements:',
        quiz: [
            { q: 'How do you say "Water"?', options: [
                { value: 'dii', label: 'Dii' }, { value: 'urgo', label: 'Urgo' },
                { value: 'olli', label: 'Olli' }, { value: 'suwar', label: 'Suwar' }
            ]},
            { q: 'What does "Urgo" mean?', options: [
                { value: 'wood', label: 'Wood' }, { value: 'water', label: 'Water' },
                { value: 'clay', label: 'Clay' }, { value: 'stick', label: 'Stick' }
            ]},
            { q: 'Which word means "Clay"?', options: [
                { value: 'olli', label: 'Olli' }, { value: 'suwar', label: 'Suwar' },
                { value: 'dii', label: 'Dii' }, { value: 'urgo', label: 'Urgo' }
            ]}
        ],
        matchPairs: [{ guna: 'Dii' }, { guna: 'Urgo' }, { guna: 'Olli' }],
        matchOptionPool: [
            { value: 'water', label: 'Water' }, { value: 'wood', label: 'Wood' },
            { value: 'clay', label: 'Clay' }, { value: 'stick', label: 'Stick' }
        ],
        dragPairs: [
            { guna: 'Dii', value: 'water', label: 'Water' },
            { guna: 'Urgo', value: 'wood', label: 'Wood' },
            { guna: 'Olli', value: 'clay', label: 'Clay' }
        ],
        completionTitle: 'Nature words learned!', completionText: 'You understand Guna words for natural elements.'
    },
    5: {
        id: 5, title: '🐢 Animals', subtitle: 'Animals of land and sea',
        duration: 30, xp: 125,
        wordsKey: 'animals',
        introTitle: 'Animals', introHeading: '🐢 Animals',
        introText: 'Learn animals from the sea, forest and island.',
        culturalText: 'Turtles, sharks and butterflies appear in Guna legends and mola designs.',
        vocabTitle: 'Animal Vocabulary', vocabIntro: 'Animals of Guna territory:',
        quiz: [
            { q: 'How do you say "Turtle"?', options: [
                { value: 'yaug', label: 'Yaug' }, { value: 'suga', label: 'Suga' },
                { value: 'nali', label: 'Nali' }, { value: 'sussua', label: 'Sussua' }
            ]},
            { q: 'What does "Suga" mean?', options: [
                { value: 'crab', label: 'Crab' }, { value: 'shark', label: 'Shark' },
                { value: 'chicken', label: 'Chicken' }, { value: 'monkey', label: 'Monkey' }
            ]},
            { q: 'Which word means "Butterfly"?', options: [
                { value: 'sussua', label: 'Sussua' }, { value: 'gannir', label: 'Gannir' },
                { value: 'sulu', label: 'Sulu' }, { value: 'yaug', label: 'Yaug' }
            ]}
        ],
        matchPairs: [{ guna: 'Yaug' }, { guna: 'Nali' }, { guna: 'Sussua' }],
        matchOptionPool: [
            { value: 'turtle', label: 'Turtle' }, { value: 'shark', label: 'Shark' },
            { value: 'butterfly', label: 'Butterfly' }, { value: 'crab', label: 'Crab' }
        ],
        dragPairs: [
            { guna: 'Yaug', value: 'turtle', label: 'Turtle' },
            { guna: 'Nali', value: 'shark', label: 'Shark' },
            { guna: 'Sussua', value: 'butterfly', label: 'Butterfly' }
        ],
        completionTitle: 'Animals mastered!', completionText: 'You can name animals in Guna.'
    },
    6: {
        id: 6, title: '🥥 Plants & Food', subtitle: 'Plants and foods',
        duration: 30, xp: 125,
        wordsKey: 'plants',
        introTitle: 'Plants & Food', introHeading: '🥥 Plants & Foods',
        introText: 'Learn traditional plants and foods including the sacred coconut.',
        culturalText: 'Coconut (Ogob) is essential to Guna cuisine, crafts and daily island life.',
        vocabTitle: 'Plants & Foods', vocabIntro: 'Traditional foods and plants:',
        quiz: [
            { q: 'How do you say "Coconut"?', options: [
                { value: 'ogob', label: 'Ogob' }, { value: 'oba', label: 'Oba' },
                { value: 'agu', label: 'Agu' }, { value: 'masi', label: 'Masi' }
            ]},
            { q: 'What does "Oba" mean?', options: [
                { value: 'corn', label: 'Corn' }, { value: 'coconut', label: 'Coconut' },
                { value: 'onion', label: 'Onion' }, { value: 'food', label: 'Food' }
            ]},
            { q: 'Which word means "Food"?', options: [
                { value: 'masi', label: 'Masi' }, { value: 'masdued', label: 'Masdued' },
                { value: 'sabbidurba', label: 'Sabbidurba' }, { value: 'agu', label: 'Agu' }
            ]}
        ],
        matchPairs: [{ guna: 'Ogob' }, { guna: 'Oba' }, { guna: 'Masi' }],
        matchOptionPool: [
            { value: 'coconut', label: 'Coconut' }, { value: 'corn', label: 'Corn' },
            { value: 'food', label: 'Food' }, { value: 'onion', label: 'Onion' }
        ],
        dragPairs: [
            { guna: 'Ogob', value: 'coconut', label: 'Coconut' },
            { guna: 'Oba', value: 'corn', label: 'Corn' },
            { guna: 'Masi', value: 'food', label: 'Food' }
        ],
        completionTitle: 'Plants & foods learned!', completionText: 'You know Guna words for traditional foods.'
    },
    7: {
        id: 7, title: '💬 Basic Conversations', subtitle: 'Basic conversations',
        duration: 25, xp: 100,
        wordsKey: 'phrases',
        introTitle: 'Basic Phrases', introHeading: '💬 Basic Conversations',
        introText: 'Learn everyday questions and expressions for simple conversations.',
        culturalText: 'Oral tradition keeps the Guna language alive through daily conversations and ceremonies.',
        vocabTitle: 'Useful Phrases', vocabIntro: 'Everyday expressions:',
        quiz: [
            { q: 'How do you ask "Where?"', options: [
                { value: 'bia', label: 'Bia' }, { value: 'doa', label: 'Doa' },
                { value: 'ingua', label: 'Ingua' }, { value: 'emi', label: 'Emi' }
            ]},
            { q: 'What does "Doa" mean?', options: [
                { value: 'who', label: 'Who?' }, { value: 'where', label: 'Where?' },
                { value: 'today', label: 'Today' }, { value: 'when', label: 'When?' }
            ]},
            { q: 'Which means "It doesn\'t matter"?', options: [
                { value: 'bassuli', label: 'Bassuli' }, { value: 'baid', label: 'Baid' },
                { value: 'emi', label: 'Emi' }, { value: 'itosa', label: 'Itosa' }
            ]}
        ],
        matchPairs: [{ guna: 'Bia' }, { guna: 'Doa' }, { guna: 'Bassuli' }],
        matchOptionPool: [
            { value: 'where', label: 'Where?' }, { value: 'who', label: 'Who?' },
            { value: 'matter', label: "It doesn't matter" }, { value: 'today', label: 'Today' }
        ],
        dragPairs: [
            { guna: 'Bia', value: 'where', label: 'Where?' },
            { guna: 'Doa', value: 'who', label: 'Who?' },
            { guna: 'Bassuli', value: 'matter', label: "It doesn't matter" }
        ],
        completionTitle: 'Basic phrases learned!', completionText: 'You can use everyday Guna expressions.'
    }
};

GUNA_LESSON_CONFIGS.quizAnswers = {
    1: { 1: 'naa', 2: 'yes', 3: 'deggimalo', 4: { 1: 'hello', 2: 'yes', 3: 'goodbye' } },
    2: { 1: 'nana', 2: 'father', 3: 'muu', 4: { 1: 'mother', 2: 'father', 3: 'grandfather' } },
    3: { 1: 'nega', 2: 'store', 3: 'ibdurdaggednega', 4: { 1: 'house', 2: 'store', 3: 'blouse' } },
    4: { 1: 'dii', 2: 'wood', 3: 'olli', 4: { 1: 'water', 2: 'wood', 3: 'clay' } },
    5: { 1: 'yaug', 2: 'crab', 3: 'sussua', 4: { 1: 'turtle', 2: 'shark', 3: 'butterfly' } },
    6: { 1: 'ogob', 2: 'corn', 3: 'masi', 4: { 1: 'coconut', 2: 'corn', 3: 'food' } },
    7: { 1: 'bia', 2: 'who', 3: 'bassuli', 4: { 1: 'where', 2: 'who', 3: 'matter' } }
};

window.GUNA_LESSON_CONFIGS = GUNA_LESSON_CONFIGS;
