/**
 * Later-path lesson configs (levels 8–20)
 * Uses only recorded audio vocabulary — reviews and mixed practice.
 */
(function () {
    const C = window.GUNA_LESSON_CONFIGS || {};

    function cfg(id, title, subtitle, wordsKey, intro, cultural, quiz, matches, pool, drag, xp, duration) {
        return {
            id, title, subtitle, duration: duration || 35, xp: xp || 175,
            wordsKey,
            introTitle: title.replace(/^[^\s]+\s/, ''),
            introHeading: title,
            introText: intro,
            culturalText: cultural,
            vocabTitle: 'Vocabulary',
            vocabIntro: 'Key words for this level:',
            quiz,
            matchPairs: matches.map((guna) => ({ guna })),
            matchOptionPool: pool,
            dragPairs: drag,
            completionTitle: 'Level complete!',
            completionText: `You finished: ${title.replace(/^[^\s]+\s/, '')}`,
            memoryDifficulty: id >= 15 ? 'hard' : 'medium'
        };
    }

    const module2 = {
        8: cfg(8, '👥 People', 'Woman, man and friends', 'people',
            'Practice words for the people you meet every day.',
            'Community life in Guna Yala is built around family, friends and neighbors.',
            [
                { q: 'How do you say "Woman"?', options: [
                    { value: 'ome', label: 'Ome' }, { value: 'massered', label: 'Massered' },
                    { value: 'anai', label: 'Anai' }, { value: 'be', label: 'Be' }
                ]},
                { q: 'What does "Massered" mean?', options: [
                    { value: 'man', label: 'Man' }, { value: 'woman', label: 'Woman' },
                    { value: 'friend', label: 'Friend' }, { value: 'you', label: 'You' }
                ]},
                { q: 'Anai means…', options: [
                    { value: 'friend', label: 'Friend' }, { value: 'man', label: 'Man' },
                    { value: 'house', label: 'House' }, { value: 'today', label: 'Today' }
                ]}
            ],
            ['Ome', 'Massered', 'Anai'],
            [
                { value: 'woman', label: 'Woman' }, { value: 'man', label: 'Man' },
                { value: 'friend', label: 'Friend' }, { value: 'you', label: 'You' }
            ],
            [
                { guna: 'Ome', value: 'woman', label: 'Woman' },
                { guna: 'Massered', value: 'man', label: 'Man' },
                { guna: 'Anai', value: 'friend', label: 'Friend' }
            ], 150, 35),

        9: cfg(9, '👗 Clothing', 'Mola and getting dressed', 'clothing',
            'Learn the mola blouse and the verb for getting dressed.',
            'The mola is a traditional Guna blouse and a symbol of identity.',
            [
                { q: 'A traditional Guna blouse is a…', options: [
                    { value: 'mola', label: 'Mola' }, { value: 'nega', label: 'Nega' },
                    { value: 'dii', label: 'Dii' }, { value: 'anai', label: 'Anai' }
                ]},
                { q: 'Moryoed means…', options: [
                    { value: 'dress', label: 'To get dressed' }, { value: 'cook', label: 'To cook' },
                    { value: 'hear', label: 'Did you hear?' }, { value: 'house', label: 'House' }
                ]},
                { q: 'Mola means…', options: [
                    { value: 'blouse', label: "Women's blouse" }, { value: 'school', label: 'School' },
                    { value: 'coconut', label: 'Coconut' }, { value: 'shark', label: 'Shark' }
                ]}
            ],
            ['Mola', 'Moryoed', 'Ome'],
            [
                { value: 'blouse', label: "Women's blouse" }, { value: 'dress', label: 'To get dressed' },
                { value: 'woman', label: 'Woman' }, { value: 'house', label: 'House' }
            ],
            [
                { guna: 'Mola', value: 'blouse', label: "Women's blouse" },
                { guna: 'Moryoed', value: 'dress', label: 'To get dressed' },
                { guna: 'Ome', value: 'woman', label: 'Woman' }
            ], 150, 35),

        10: cfg(10, '🏫 Places', 'House, store and school', 'places',
            'Review the main places of daily community life.',
            'The house (Nega), the store and the school are everyday meeting points.',
            [
                { q: '"Nega" means…', options: [
                    { value: 'house', label: 'House' }, { value: 'store', label: 'Store' },
                    { value: 'school', label: 'School' }, { value: 'water', label: 'Water' }
                ]},
                { q: 'A store is…', options: [
                    { value: 'ibya', label: 'Ibya' }, { value: 'nega', label: 'Nega' },
                    { value: 'mola', label: 'Mola' }, { value: 'dii', label: 'Dii' }
                ]},
                { q: 'Ibdurdaggednega is a…', options: [
                    { value: 'school', label: 'School' }, { value: 'house', label: 'House' },
                    { value: 'store', label: 'Store' }, { value: 'ceremony', label: 'Ceremony' }
                ]}
            ],
            ['Nega', 'Ibya', 'Ibdurdaggednega'],
            [
                { value: 'house', label: 'House' }, { value: 'store', label: 'Store' },
                { value: 'school', label: 'School' }, { value: 'blouse', label: 'Blouse' }
            ],
            [
                { guna: 'Nega', value: 'house', label: 'House' },
                { guna: 'Ibya', value: 'store', label: 'Store' },
                { guna: 'Ibdurdaggednega', value: 'school', label: 'School' }
            ], 175, 40),

        11: cfg(11, '❓ Questions', 'Where, who and when', 'questions',
            'Practice the core question words of conversation.',
            'Asking where, who and when keeps oral tradition and daily talk alive.',
            [
                { q: 'Bia asks…', options: [
                    { value: 'where', label: 'Where?' }, { value: 'who', label: 'Who?' },
                    { value: 'when', label: 'When?' }, { value: 'today', label: 'Today' }
                ]},
                { q: 'Doa means…', options: [
                    { value: 'who', label: 'Who?' }, { value: 'where', label: 'Where?' },
                    { value: 'food', label: 'Food' }, { value: 'yes', label: 'Yes' }
                ]},
                { q: 'Ingua asks…', options: [
                    { value: 'when', label: 'When?' }, { value: 'who', label: 'Who?' },
                    { value: 'where', label: 'Where?' }, { value: 'other', label: 'Other' }
                ]}
            ],
            ['Bia', 'Doa', 'Ingua'],
            [
                { value: 'where', label: 'Where?' }, { value: 'who', label: 'Who?' },
                { value: 'when', label: 'When?' }, { value: 'today', label: 'Today' }
            ],
            [
                { guna: 'Bia', value: 'where', label: 'Where?' },
                { guna: 'Doa', value: 'who', label: 'Who?' },
                { guna: 'Ingua', value: 'when', label: 'When?' }
            ], 175, 40),

        12: cfg(12, '👨‍👩‍👧 Family Review', 'Parents, elders and relatives', 'family',
            'Review family words: parents, elders, uncle, aunt and nephew.',
            'Elders (Tata and Muú) pass language and stories to younger generations.',
            [
                { q: 'A uncle is…', options: [
                    { value: 'gilor', label: 'Gilor' }, { value: 'ammor', label: 'Ammor' },
                    { value: 'niga', label: 'Niga' }, { value: 'baba', label: 'Baba' }
                ]},
                { q: 'Ammor means…', options: [
                    { value: 'aunt', label: 'Aunt' }, { value: 'uncle', label: 'Uncle' },
                    { value: 'nephew', label: 'Nephew' }, { value: 'friend', label: 'Friend' }
                ]},
                { q: 'Niga means…', options: [
                    { value: 'nephew', label: 'Nephew' }, { value: 'mother', label: 'Mother' },
                    { value: 'man', label: 'Man' }, { value: 'guide', label: 'Guide' }
                ]}
            ],
            ['Gilor', 'Ammor', 'Niga'],
            [
                { value: 'uncle', label: 'Uncle' }, { value: 'aunt', label: 'Aunt' },
                { value: 'nephew', label: 'Nephew' }, { value: 'father', label: 'Father' }
            ],
            [
                { guna: 'Gilor', value: 'uncle', label: 'Uncle' },
                { guna: 'Ammor', value: 'aunt', label: 'Aunt' },
                { guna: 'Niga', value: 'nephew', label: 'Nephew' }
            ], 200, 45),

        13: cfg(13, '🍽️ Food & Cooking', 'Coconut, corn and cooking', 'plants',
            'Review food words and the verb for cooking.',
            'Shared meals and coconut cooking are central to island life.',
            [
                { q: 'Masdued means…', options: [
                    { value: 'cook', label: 'To cook' }, { value: 'food', label: 'Food' },
                    { value: 'fruits', label: 'Fruits' }, { value: 'onion', label: 'Onion' }
                ]},
                { q: 'Sabbidurba means…', options: [
                    { value: 'fruits', label: 'Fruits' }, { value: 'corn', label: 'Corn' },
                    { value: 'coconut', label: 'Coconut' }, { value: 'water', label: 'Water' }
                ]},
                { q: 'Agu is…', options: [
                    { value: 'onion', label: 'Onion' }, { value: 'corn', label: 'Corn' },
                    { value: 'cat', label: 'Cat' }, { value: 'clay', label: 'Clay' }
                ]}
            ],
            ['Masdued', 'Sabbidurba', 'Agu'],
            [
                { value: 'cook', label: 'To cook' }, { value: 'fruits', label: 'Fruits' },
                { value: 'onion', label: 'Onion' }, { value: 'food', label: 'Food' }
            ],
            [
                { guna: 'Masdued', value: 'cook', label: 'To cook' },
                { guna: 'Sabbidurba', value: 'fruits', label: 'Fruits' },
                { guna: 'Agu', value: 'onion', label: 'Onion' }
            ], 200, 45),

        14: cfg(14, '💬 Everyday Expressions', 'Useful replies and time words', 'expressions',
            'Practice everyday replies: thank you, today, other, and more.',
            'Short expressions keep conversations polite and natural.',
            [
                { q: 'Nued means…', options: [
                    { value: 'thanks', label: 'Thank you' }, { value: 'hello', label: 'Hello' },
                    { value: 'no', label: 'No' }, { value: 'today', label: 'Today' }
                ]},
                { q: 'Emi means…', options: [
                    { value: 'today', label: 'Today' }, { value: 'other', label: 'Other' },
                    { value: 'when', label: 'When?' }, { value: 'yes', label: 'Yes' }
                ]},
                { q: 'Baid means…', options: [
                    { value: 'other', label: 'Other' }, { value: 'today', label: 'Today' },
                    { value: 'who', label: 'Who?' }, { value: 'food', label: 'Food' }
                ]}
            ],
            ['Nued', 'Emi', 'Baid'],
            [
                { value: 'thanks', label: 'Thank you' }, { value: 'today', label: 'Today' },
                { value: 'other', label: 'Other' }, { value: 'matter', label: "Doesn't matter" }
            ],
            [
                { guna: 'Nued', value: 'thanks', label: 'Thank you' },
                { guna: 'Emi', value: 'today', label: 'Today' },
                { guna: 'Baid', value: 'other', label: 'Other' }
            ], 225, 50),

        15: cfg(15, '🐶 Animals Review', 'Pets and island animals', 'animals',
            'Review cats, dogs, monkeys, chickens and sea animals.',
            'Household animals and sea life appear together in daily Guna stories.',
            [
                { q: 'Misi means…', options: [
                    { value: 'cat', label: 'Cat' }, { value: 'dog', label: 'Dog' },
                    { value: 'monkey', label: 'Monkey' }, { value: 'chicken', label: 'Chicken' }
                ]},
                { q: 'Assu means…', options: [
                    { value: 'dog', label: 'Dog' }, { value: 'cat', label: 'Cat' },
                    { value: 'crab', label: 'Crab' }, { value: 'turtle', label: 'Turtle' }
                ]},
                { q: 'Gannir is a…', options: [
                    { value: 'chicken', label: 'Chicken' }, { value: 'monkey', label: 'Monkey' },
                    { value: 'shark', label: 'Shark' }, { value: 'butterfly', label: 'Butterfly' }
                ]}
            ],
            ['Misi', 'Assu', 'Gannir'],
            [
                { value: 'cat', label: 'Cat' }, { value: 'dog', label: 'Dog' },
                { value: 'chicken', label: 'Chicken' }, { value: 'monkey', label: 'Monkey' }
            ],
            [
                { guna: 'Misi', value: 'cat', label: 'Cat' },
                { guna: 'Assu', value: 'dog', label: 'Dog' },
                { guna: 'Gannir', value: 'chicken', label: 'Chicken' }
            ], 225, 50),

        16: cfg(16, '🪵 Nature & Materials', 'Water, wood, clay and stick', 'nature',
            'Review natural materials used in building and crafts.',
            'Wood, clay and water support houses, canoes and daily work.',
            [
                { q: 'Suwar means…', options: [
                    { value: 'stick', label: 'Stick' }, { value: 'wood', label: 'Wood' },
                    { value: 'clay', label: 'Clay' }, { value: 'water', label: 'Water' }
                ]},
                { q: 'Olli means…', options: [
                    { value: 'clay', label: 'Clay' }, { value: 'stick', label: 'Stick' },
                    { value: 'house', label: 'House' }, { value: 'onion', label: 'Onion' }
                ]},
                { q: 'Dii means…', options: [
                    { value: 'water', label: 'Water' }, { value: 'wood', label: 'Wood' },
                    { value: 'food', label: 'Food' }, { value: 'yes', label: 'Yes' }
                ]}
            ],
            ['Suwar', 'Olli', 'Dii'],
            [
                { value: 'stick', label: 'Stick' }, { value: 'clay', label: 'Clay' },
                { value: 'water', label: 'Water' }, { value: 'wood', label: 'Wood' }
            ],
            [
                { guna: 'Suwar', value: 'stick', label: 'Stick' },
                { guna: 'Olli', value: 'clay', label: 'Clay' },
                { guna: 'Dii', value: 'water', label: 'Water' }
            ], 250, 55),

        17: cfg(17, '🎉 Guna Culture', 'Ceremony, guide and mola', 'culture',
            'Learn cultural words: ceremony, guide and the mola blouse.',
            'Ceremonies and molas express Guna identity, memory and community.',
            [
                { q: 'Innasuid means…', options: [
                    { value: 'ceremony', label: 'Ceremony' }, { value: 'guide', label: 'Guide' },
                    { value: 'blouse', label: 'Blouse' }, { value: 'friend', label: 'Friend' }
                ]},
                { q: 'Igarduled is a…', options: [
                    { value: 'guide', label: 'Guide' }, { value: 'ceremony', label: 'Ceremony' },
                    { value: 'school', label: 'School' }, { value: 'shark', label: 'Shark' }
                ]},
                { q: 'Mola is a…', options: [
                    { value: 'blouse', label: "Women's blouse" }, { value: 'house', label: 'House' },
                    { value: 'water', label: 'Water' }, { value: 'dog', label: 'Dog' }
                ]}
            ],
            ['Innasuid', 'Igarduled', 'Mola'],
            [
                { value: 'ceremony', label: 'Ceremony' }, { value: 'guide', label: 'Guide' },
                { value: 'blouse', label: "Women's blouse" }, { value: 'today', label: 'Today' }
            ],
            [
                { guna: 'Innasuid', value: 'ceremony', label: 'Ceremony' },
                { guna: 'Igarduled', value: 'guide', label: 'Guide' },
                { guna: 'Mola', value: 'blouse', label: "Women's blouse" }
            ], 250, 55),

        18: cfg(18, '👋 Greetings Review', 'Hello, thanks and farewells', 'greetings',
            'Review greetings, thanks, yes, no and farewells.',
            'A clear greeting and farewell show respect in every island visit.',
            [
                { q: 'Deggidde means…', options: [
                    { value: 'how', label: 'How are you' }, { value: 'hello', label: 'Hello' },
                    { value: 'goodbye', label: 'Goodbye' }, { value: 'thanks', label: 'Thank you' }
                ]},
                { q: 'Suli means…', options: [
                    { value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' },
                    { value: 'you', label: 'You' }, { value: 'today', label: 'Today' }
                ]},
                { q: 'Bannemalo means…', options: [
                    { value: 'tomorrow', label: 'See you tomorrow' }, { value: 'goodbye', label: 'Goodbye' },
                    { value: 'hello', label: 'Hello' }, { value: 'thanks', label: 'Thank you' }
                ]}
            ],
            ['Deggidde', 'Suli', 'Bannemalo'],
            [
                { value: 'how', label: 'How are you' }, { value: 'no', label: 'No' },
                { value: 'tomorrow', label: 'See you tomorrow' }, { value: 'yes', label: 'Yes' }
            ],
            [
                { guna: 'Deggidde', value: 'how', label: 'How are you' },
                { guna: 'Suli', value: 'no', label: 'No' },
                { guna: 'Bannemalo', value: 'tomorrow', label: 'See you tomorrow' }
            ], 275, 60),

        19: cfg(19, '🏝️ Daily Life Mix', 'Actions and listening', 'actions',
            'Practice action words: cook, get dressed and listen.',
            'Daily verbs help you talk about cooking, dressing and paying attention.',
            [
                { q: 'Masdued means…', options: [
                    { value: 'cook', label: 'To cook' }, { value: 'dress', label: 'To get dressed' },
                    { value: 'hear', label: 'Did you hear?' }, { value: 'house', label: 'House' }
                ]},
                { q: 'Moryoed means…', options: [
                    { value: 'dress', label: 'To get dressed' }, { value: 'cook', label: 'To cook' },
                    { value: 'water', label: 'Water' }, { value: 'friend', label: 'Friend' }
                ]},
                { q: 'Itosa asks…', options: [
                    { value: 'hear', label: 'Did you hear?' }, { value: 'where', label: 'Where?' },
                    { value: 'who', label: 'Who?' }, { value: 'when', label: 'When?' }
                ]}
            ],
            ['Masdued', 'Moryoed', 'Itosa'],
            [
                { value: 'cook', label: 'To cook' }, { value: 'dress', label: 'To get dressed' },
                { value: 'hear', label: 'Did you hear?' }, { value: 'food', label: 'Food' }
            ],
            [
                { guna: 'Masdued', value: 'cook', label: 'To cook' },
                { guna: 'Moryoed', value: 'dress', label: 'To get dressed' },
                { guna: 'Itosa', value: 'hear', label: 'Did you hear?' }
            ], 275, 60),

        20: cfg(20, '👑 Linguistic Mastery', 'Final path challenge', 'mastery',
            'Prove your mastery across greetings, family, food and animals.',
            'Completing the full path honors Dulegaya and the elders who keep it alive.',
            [
                { q: 'Naa means…', options: [
                    { value: 'hello', label: 'Hello' }, { value: 'goodbye', label: 'Goodbye' },
                    { value: 'yes', label: 'Yes' }, { value: 'food', label: 'Food' }
                ]},
                { q: 'Yaug is a…', options: [
                    { value: 'turtle', label: 'Turtle' }, { value: 'shark', label: 'Shark' },
                    { value: 'cat', label: 'Cat' }, { value: 'coconut', label: 'Coconut' }
                ]},
                { q: 'Ogob means…', options: [
                    { value: 'coconut', label: 'Coconut' }, { value: 'corn', label: 'Corn' },
                    { value: 'water', label: 'Water' }, { value: 'house', label: 'House' }
                ]}
            ],
            ['Naa', 'Yaug', 'Ogob'],
            [
                { value: 'hello', label: 'Hello' }, { value: 'turtle', label: 'Turtle' },
                { value: 'coconut', label: 'Coconut' }, { value: 'mother', label: 'Mother' }
            ],
            [
                { guna: 'Naa', value: 'hello', label: 'Hello' },
                { guna: 'Yaug', value: 'turtle', label: 'Turtle' },
                { guna: 'Ogob', value: 'coconut', label: 'Coconut' }
            ], 300, 90)
    };

    Object.assign(C, module2);

    C.quizAnswers = Object.assign({}, C.quizAnswers || {}, {
        8: { 1: 'ome', 2: 'man', 3: 'friend', 4: { 1: 'woman', 2: 'man', 3: 'friend' } },
        9: { 1: 'mola', 2: 'dress', 3: 'blouse', 4: { 1: 'blouse', 2: 'dress', 3: 'woman' } },
        10: { 1: 'house', 2: 'ibya', 3: 'school', 4: { 1: 'house', 2: 'store', 3: 'school' } },
        11: { 1: 'where', 2: 'who', 3: 'when', 4: { 1: 'where', 2: 'who', 3: 'when' } },
        12: { 1: 'gilor', 2: 'aunt', 3: 'nephew', 4: { 1: 'uncle', 2: 'aunt', 3: 'nephew' } },
        13: { 1: 'cook', 2: 'fruits', 3: 'onion', 4: { 1: 'cook', 2: 'fruits', 3: 'onion' } },
        14: { 1: 'thanks', 2: 'today', 3: 'other', 4: { 1: 'thanks', 2: 'today', 3: 'other' } },
        15: { 1: 'cat', 2: 'dog', 3: 'chicken', 4: { 1: 'cat', 2: 'dog', 3: 'chicken' } },
        16: { 1: 'stick', 2: 'clay', 3: 'water', 4: { 1: 'stick', 2: 'clay', 3: 'water' } },
        17: { 1: 'ceremony', 2: 'guide', 3: 'blouse', 4: { 1: 'ceremony', 2: 'guide', 3: 'blouse' } },
        18: { 1: 'how', 2: 'no', 3: 'tomorrow', 4: { 1: 'how', 2: 'no', 3: 'tomorrow' } },
        19: { 1: 'cook', 2: 'dress', 3: 'hear', 4: { 1: 'cook', 2: 'dress', 3: 'hear' } },
        20: { 1: 'hello', 2: 'turtle', 3: 'coconut', 4: { 1: 'hello', 2: 'turtle', 3: 'coconut' } }
    });

    window.GUNA_LESSON_CONFIGS = C;
})();
