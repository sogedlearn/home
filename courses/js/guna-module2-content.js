/**
 * Module 2 vocabulary + lesson configs (levels 8–20)
 * Extends GUNA_VOCABULARY and GUNA_LESSON_CONFIGS at load time.
 */
(function () {
    const V = window.GUNA_VOCABULARY || {};
    const C = window.GUNA_LESSON_CONFIGS || {};

    Object.assign(V, {
        weather: [
            { guna: 'Igi', es: 'Sol', en: 'Sun', icon: '☀️', example: 'Igi — Sun' },
            { guna: 'Dule', es: 'Lluvia', en: 'Rain', icon: '🌧️', example: 'Dule — Rain' },
            { guna: 'Burba', es: 'Viento', en: 'Wind', icon: '💨', example: 'Burba — Wind' },
            { guna: 'Nikka', es: 'Nube', en: 'Cloud', icon: '☁️', example: 'Nikka — Cloud' },
            { guna: 'Neggwebur', es: 'Mes', en: 'Month', icon: '🗓️', example: 'Neggwebur — Month' },
            { guna: 'Ibi', es: 'Día', en: 'Day', icon: '📅', example: 'Ibi — Day' }
        ],
        clothing: [
            { guna: 'Mola', es: 'Mola / blusa', en: 'Mola blouse', icon: '🧵', example: 'Mola — Traditional blouse' },
            { guna: 'Sabured', es: 'Falda', en: 'Skirt', icon: '👗', example: 'Sabured — Skirt' },
            { guna: 'Wini', es: 'Cuentas / chaquiras', en: 'Beads', icon: '📿', example: 'Wini — Beads' },
            { guna: 'Ulu', es: 'Sombrero', en: 'Hat', icon: '🎩', example: 'Ulu — Hat' },
            { guna: 'Nega', es: 'Collar', en: 'Necklace', icon: '💍', example: 'Nega — Necklace' },
            { guna: 'Bii', es: 'Ropa', en: 'Clothes', icon: '👕', example: 'Bii — Clothes' }
        ],
        medicine: [
            { guna: 'Ina', es: 'Medicina', en: 'Medicine', icon: '🌿', example: 'Ina — Medicine' },
            { guna: 'Inaduled', es: 'Médico tradicional', en: 'Traditional healer', icon: '🩺', example: 'Inaduled — Healer' },
            { guna: 'Naggid', es: 'Yuca (medicinal uso)', en: 'Cassava', icon: '🌱', example: 'Naggid — Cassava' },
            { guna: 'Absogedi', es: 'Curación', en: 'Healing', icon: '✨', example: 'Absogedi — Healing' },
            { guna: 'Nuga', es: 'Nombre / espíritu', en: 'Name / spirit', icon: '👻', example: 'Nuga — Spirit name' },
            { guna: 'Kantule', es: 'Cantor / sabio', en: 'Singer-sage', icon: '🎵', example: 'Kantule — Ritual singer' }
        ],
        legends: [
            { guna: 'Ibeorgun', es: 'Creador', en: 'Creator', icon: '🌟', example: 'Ibeorgun — Creator' },
            { guna: 'Baba', es: 'Padre ancestral', en: 'Ancestral father', icon: '👴', example: 'Baba — Ancestral father' },
            { guna: 'Nanaburba', es: 'Madre tierra', en: 'Mother earth', icon: '🌍', example: 'Nanaburba — Mother earth' },
            { guna: 'Paba', es: 'Dios / padre', en: 'God / father', icon: '🙏', example: 'Paba — Father deity' },
            { guna: 'Burwi', es: 'Espíritu', en: 'Spirit', icon: '💫', example: 'Burwi — Spirit' },
            { guna: 'Nuggi', es: 'Historia / relato', en: 'Story', icon: '📖', example: 'Nuggi — Story' }
        ],
        community: [
            { guna: 'Sagla', es: 'Saila / líder', en: 'Community leader', icon: '🏛️', example: 'Sagla — Leader' },
            { guna: 'Onmaked Nega', es: 'Congreso', en: 'Congress house', icon: '🏠', example: 'Onmaked Nega — Congress' },
            { guna: 'Dule', es: 'Persona / pueblo', en: 'Person / people', icon: '👥', example: 'Dule — People' },
            { guna: 'Nega', es: 'Casa comunal', en: 'Communal house', icon: '🏡', example: 'Nega — House' },
            { guna: 'Absoged', es: 'Reunión', en: 'Meeting', icon: '🗣️', example: 'Absoged — Meeting' },
            { guna: 'Guna Yala', es: 'Territorio Guna', en: 'Guna territory', icon: '🏝️', example: 'Guna Yala — Territory' }
        ],
        celebrations: [
            { guna: 'Innased', es: 'Fiesta / celebración', en: 'Celebration', icon: '🎉', example: 'Innased — Celebration' },
            { guna: 'Gammu', es: 'Flauta', en: 'Flute', icon: '🎶', example: 'Gammu — Flute' },
            { guna: 'Kantule', es: 'Cantor ceremonial', en: 'Ceremonial singer', icon: '🎤', example: 'Kantule — Singer' },
            { guna: 'Dances', es: 'Danza (préstamo)', en: 'Dance', icon: '💃', example: 'Community dance' },
            { guna: 'Nogana', es: 'Canto', en: 'Song', icon: '🎵', example: 'Nogana — Song' },
            { guna: 'Ibi dummad', es: 'Día grande', en: 'Feast day', icon: '📅', example: 'Ibi dummad — Big day' }
        ],
        idioms: [
            { guna: 'Degii', es: 'Así es', en: "That's right", icon: '👍', example: 'Degii — Affirmation' },
            { guna: 'Basuli', es: 'No importa', en: "It doesn't matter", icon: '🤷', example: 'Basuli — No problem' },
            { guna: 'Nuedi', es: 'Bueno / bien', en: 'Good / well', icon: '😊', example: 'Nuedi — Good' },
            { guna: 'Pia', es: '¿Qué?', en: 'What?', icon: '❓', example: 'Pia? — What?' },
            { guna: 'Igi anmar', es: 'Estamos bien', en: 'We are fine', icon: '🤝', example: 'Igi anmar — We are fine' },
            { guna: 'An ye', es: 'Yo digo', en: 'I say', icon: '💬', example: 'An ye — I say' }
        ],
        geography: [
            { guna: 'Guna Yala', es: 'Comarca isleña', en: 'Island comarca', icon: '🏝️', example: 'Guna Yala' },
            { guna: 'Madugandí', es: 'Comarca continental', en: 'Mainland comarca', icon: '🌳', example: 'Madugandí' },
            { guna: 'Wargandí', es: 'Comarca montañosa', en: 'Mountain comarca', icon: '⛰️', example: 'Wargandí' },
            { guna: 'Tiiwar', es: 'Río', en: 'River', icon: '🏞️', example: 'Tiiwar — River' },
            { guna: 'Yar', es: 'Mar', en: 'Sea', icon: '🌊', example: 'Yar — Sea' },
            { guna: 'Nabgwana', es: 'Madre Tierra', en: 'Mother Earth', icon: '🌍', example: 'Nabgwana' }
        ],
        crafts: [
            { guna: 'Mola', es: 'Textil', en: 'Textile art', icon: '🧵', example: 'Mola — Textile' },
            { guna: 'Karwa', es: 'Canasta', en: 'Basket', icon: '🧺', example: 'Karwa — Basket' },
            { guna: 'Ulu', es: 'Canoa', en: 'Canoe', icon: '🛶', example: 'Ulu — Canoe' },
            { guna: 'Wini', es: 'Chaquiras', en: 'Beadwork', icon: '📿', example: 'Wini — Beads' },
            { guna: 'Nuga', es: 'Diseño', en: 'Design / pattern', icon: '🎨', example: 'Nuga — Pattern' },
            { guna: 'Sabbi', es: 'Hilo', en: 'Thread', icon: '🧶', example: 'Sabbi — Thread' }
        ],
        values: [
            { guna: 'Nuedi', es: 'Bondad', en: 'Goodness', icon: '💚', example: 'Nuedi — Goodness' },
            { guna: 'Bab Igar', es: 'Camino de los abuelos', en: "Elders' path", icon: '🛤️', example: 'Bab Igar — Tradition' },
            { guna: 'Onmaked', es: 'Consejo / ley', en: 'Council / law', icon: '⚖️', example: 'Onmaked — Law' },
            { guna: 'Absogedi', es: 'Respeto mutuo', en: 'Mutual respect', icon: '🤝', example: 'Absogedi — Respect' },
            { guna: 'Dulegana', es: 'Pueblo Guna', en: 'Guna people', icon: '👥', example: 'Dulegana' },
            { guna: 'Igar', es: 'Camino / norma', en: 'Path / rule', icon: '📜', example: 'Igar — Path' }
        ],
        songs: [
            { guna: 'Nogana', es: 'Canto', en: 'Song', icon: '🎵', example: 'Nogana — Song' },
            { guna: 'Kantule', es: 'Cantor sanador', en: 'Healing singer', icon: '🎤', example: 'Kantule' },
            { guna: 'Absogedi', es: 'Curación ritual', en: 'Ritual healing', icon: '✨', example: 'Absogedi' },
            { guna: 'Gammu', es: 'Flauta', en: 'Flute', icon: '🎶', example: 'Gammu' },
            { guna: 'Igar', es: 'Camino espiritual', en: 'Spiritual path', icon: '🌀', example: 'Igar' },
            { guna: 'Nuga', es: 'Espíritu personal', en: 'Personal spirit', icon: '💫', example: 'Nuga' }
        ],
        trade: [
            { guna: 'Ogob', es: 'Coco (trueque)', en: 'Coconut (barter)', icon: '🥥', example: 'Ogob — Coconut' },
            { guna: 'Mola', es: 'Mola (intercambio)', en: 'Mola (trade)', icon: '🧵', example: 'Mola — Trade good' },
            { guna: 'Suggid', es: 'Ñame', en: 'Yam', icon: '🍠', example: 'Suggid — Yam' },
            { guna: 'Ulu', es: 'Canoa (viaje)', en: 'Canoe travel', icon: '🛶', example: 'Ulu — Travel' },
            { guna: 'Nikkagana', es: 'Mercado / trueque', en: 'Barter market', icon: '🏪', example: 'Nikkagana' },
            { guna: 'Anmar', es: 'Nosotros (comunidad)', en: 'We / community', icon: '🤝', example: 'Anmar — We' }
        ],
        mastery: [
            { guna: 'Dulegaya', es: 'Idioma Guna', en: 'Guna language', icon: '🗣️', example: 'Dulegaya' },
            { guna: 'Guna Yala', es: 'Territorio', en: 'Territory', icon: '🏝️', example: 'Guna Yala' },
            { guna: 'Mola', es: 'Arte textil', en: 'Textile art', icon: '🧵', example: 'Mola' },
            { guna: 'Sagla', es: 'Líder', en: 'Leader', icon: '🏛️', example: 'Sagla' },
            { guna: 'Ibeorgun', es: 'Creador', en: 'Creator', icon: '🌟', example: 'Ibeorgun' },
            { guna: 'Nuedi', es: 'Bien / bueno', en: 'Good', icon: '✅', example: 'Nuedi' },
            { guna: 'Ardi', es: 'Tortuga', en: 'Turtle', icon: '🐢', example: 'Ardi' },
            { guna: 'Sii', es: 'Agua', en: 'Water', icon: '💧', example: 'Sii' }
        ]
    });

    if (Array.isArray(V.CATEGORIES)) {
        const extra = [
            { id: 'weather', label: 'Weather', icon: '🌧️', words: V.weather, module: 'daily' },
            { id: 'clothing', label: 'Clothing', icon: '👗', words: V.clothing, module: 'daily' },
            { id: 'medicine', label: 'Medicine', icon: '🌿', words: V.medicine, module: 'daily' },
            { id: 'legends', label: 'Legends', icon: '📖', words: V.legends, module: 'daily' },
            { id: 'community', label: 'Community', icon: '🏛️', words: V.community, module: 'daily' },
            { id: 'celebrations', label: 'Celebrations', icon: '🎉', words: V.celebrations, module: 'daily' },
            { id: 'geography', label: 'Geography', icon: '🗺️', words: V.geography, module: 'advanced' },
            { id: 'crafts', label: 'Crafts', icon: '🧺', words: V.crafts, module: 'advanced' },
            { id: 'idioms', label: 'Idioms', icon: '💬', words: V.idioms, module: 'advanced' },
            { id: 'values', label: 'Values', icon: '⚖️', words: V.values, module: 'advanced' },
            { id: 'songs', label: 'Songs', icon: '🎵', words: V.songs, module: 'advanced' },
            { id: 'trade', label: 'Trade', icon: '🤝', words: V.trade, module: 'advanced' },
            { id: 'mastery', label: 'Mastery', icon: '👑', words: V.mastery, module: 'advanced' }
        ];
        extra.forEach((cat) => {
            if (!V.CATEGORIES.find((c) => c.id === cat.id)) V.CATEGORIES.push(cat);
        });
    }

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
        8: cfg(8, '🌤️ Weather & Seasons', 'Climate and lunar cycles', 'weather',
            'Learn words for sun, rain, wind and days in Guna.',
            'Guna life follows rain seasons, lunar cycles and the Caribbean climate of Guna Yala.',
            [
                { q: 'How do you say "Sun"?', options: [
                    { value: 'igi', label: 'Igi' }, { value: 'dule', label: 'Dule' },
                    { value: 'burba', label: 'Burba' }, { value: 'ibi', label: 'Ibi' }
                ]},
                { q: 'What does "Dule" mean here?', options: [
                    { value: 'rain', label: 'Rain' }, { value: 'sun', label: 'Sun' },
                    { value: 'wind', label: 'Wind' }, { value: 'day', label: 'Day' }
                ]},
                { q: 'Which means "Wind"?', options: [
                    { value: 'burba', label: 'Burba' }, { value: 'nikka', label: 'Nikka' },
                    { value: 'igi', label: 'Igi' }, { value: 'ibi', label: 'Ibi' }
                ]}
            ],
            ['Igi', 'Dule', 'Burba'],
            [
                { value: 'sun', label: 'Sun' }, { value: 'rain', label: 'Rain' },
                { value: 'wind', label: 'Wind' }, { value: 'day', label: 'Day' }
            ],
            [
                { guna: 'Igi', value: 'sun', label: 'Sun' },
                { guna: 'Dule', value: 'rain', label: 'Rain' },
                { guna: 'Burba', value: 'wind', label: 'Wind' }
            ], 150, 35),

        9: cfg(9, '👗 Clothing & Symbolism', 'Molas, beads and dress', 'clothing',
            'Learn vocabulary for traditional clothing and symbols.',
            'Molas and beads express identity, status and spiritual protection in Guna dress.',
            [
                { q: 'A traditional Guna blouse is a…', options: [
                    { value: 'mola', label: 'Mola' }, { value: 'ulu', label: 'Ulu' },
                    { value: 'wini', label: 'Wini' }, { value: 'nega', label: 'Nega' }
                ]},
                { q: 'What are "Wini"?', options: [
                    { value: 'beads', label: 'Beads' }, { value: 'hat', label: 'Hat' },
                    { value: 'skirt', label: 'Skirt' }, { value: 'canoe', label: 'Canoe' }
                ]},
                { q: 'Sabured means…', options: [
                    { value: 'skirt', label: 'Skirt' }, { value: 'hat', label: 'Hat' },
                    { value: 'beads', label: 'Beads' }, { value: 'thread', label: 'Thread' }
                ]}
            ],
            ['Mola', 'Wini', 'Sabured'],
            [
                { value: 'blouse', label: 'Mola blouse' }, { value: 'beads', label: 'Beads' },
                { value: 'skirt', label: 'Skirt' }, { value: 'hat', label: 'Hat' }
            ],
            [
                { guna: 'Mola', value: 'blouse', label: 'Mola blouse' },
                { guna: 'Wini', value: 'beads', label: 'Beads' },
                { guna: 'Sabured', value: 'skirt', label: 'Skirt' }
            ], 150, 35),

        10: cfg(10, '🌿 Traditional Medicine', 'Plants, healers and songs', 'medicine',
            'Discover words for healing, healers and plant medicine.',
            'Guna healing combines plants, songs (kantule) and community care.',
            [
                { q: '"Ina" means…', options: [
                    { value: 'medicine', label: 'Medicine' }, { value: 'song', label: 'Song' },
                    { value: 'leader', label: 'Leader' }, { value: 'island', label: 'Island' }
                ]},
                { q: 'A traditional healer is…', options: [
                    { value: 'inaduled', label: 'Inaduled' }, { value: 'sagla', label: 'Sagla' },
                    { value: 'ulu', label: 'Ulu' }, { value: 'mola', label: 'Mola' }
                ]},
                { q: 'Kantule is related to…', options: [
                    { value: 'songs', label: 'Healing songs / sage' }, { value: 'boats', label: 'Boats' },
                    { value: 'money', label: 'Money' }, { value: 'weather', label: 'Weather' }
                ]}
            ],
            ['Ina', 'Inaduled', 'Kantule'],
            [
                { value: 'medicine', label: 'Medicine' }, { value: 'healer', label: 'Healer' },
                { value: 'singer', label: 'Singer-sage' }, { value: 'spirit', label: 'Spirit' }
            ],
            [
                { guna: 'Ina', value: 'medicine', label: 'Medicine' },
                { guna: 'Inaduled', value: 'healer', label: 'Healer' },
                { guna: 'Kantule', value: 'singer', label: 'Singer-sage' }
            ], 175, 40),

        11: cfg(11, '📖 Stories & Legends', 'Creation myths and elders’ tales', 'legends',
            'Learn vocabulary from Guna legends and creation stories.',
            'Elders transmit cosmology through oral stories about Ibeorgun and the islands.',
            [
                { q: 'Ibeorgun is the…', options: [
                    { value: 'creator', label: 'Creator' }, { value: 'island', label: 'Island' },
                    { value: 'canoe', label: 'Canoe' }, { value: 'rain', label: 'Rain' }
                ]},
                { q: 'Nuggi means…', options: [
                    { value: 'story', label: 'Story' }, { value: 'food', label: 'Food' },
                    { value: 'cloud', label: 'Cloud' }, { value: 'beads', label: 'Beads' }
                ]},
                { q: 'Burwi refers to a…', options: [
                    { value: 'spirit', label: 'Spirit' }, { value: 'market', label: 'Market' },
                    { value: 'hat', label: 'Hat' }, { value: 'river', label: 'River' }
                ]}
            ],
            ['Ibeorgun', 'Nuggi', 'Burwi'],
            [
                { value: 'creator', label: 'Creator' }, { value: 'story', label: 'Story' },
                { value: 'spirit', label: 'Spirit' }, { value: 'earth', label: 'Mother earth' }
            ],
            [
                { guna: 'Ibeorgun', value: 'creator', label: 'Creator' },
                { guna: 'Nuggi', value: 'story', label: 'Story' },
                { guna: 'Burwi', value: 'spirit', label: 'Spirit' }
            ], 175, 40),

        12: cfg(12, '🏛️ Community Organization', 'Congress, sailas and authority', 'community',
            'Learn how Guna communities organize through congress and leaders.',
            'The General Congress and sailas (sagla) guide political and spiritual life.',
            [
                { q: 'A Sagla is a…', options: [
                    { value: 'leader', label: 'Community leader' }, { value: 'canoe', label: 'Canoe' },
                    { value: 'song', label: 'Song' }, { value: 'plant', label: 'Plant' }
                ]},
                { q: 'Onmaked Nega is the…', options: [
                    { value: 'congress', label: 'Congress house' }, { value: 'beach', label: 'Beach' },
                    { value: 'market', label: 'Market' }, { value: 'school', label: 'School only' }
                ]},
                { q: 'Dule means…', options: [
                    { value: 'people', label: 'Person / people' }, { value: 'rain', label: 'Rain' },
                    { value: 'gold', label: 'Gold' }, { value: 'fire', label: 'Fire' }
                ]}
            ],
            ['Sagla', 'Onmaked Nega', 'Dule'],
            [
                { value: 'leader', label: 'Leader' }, { value: 'congress', label: 'Congress' },
                { value: 'people', label: 'People' }, { value: 'meeting', label: 'Meeting' }
            ],
            [
                { guna: 'Sagla', value: 'leader', label: 'Leader' },
                { guna: 'Onmaked Nega', value: 'congress', label: 'Congress' },
                { guna: 'Dule', value: 'people', label: 'People' }
            ], 200, 45),

        13: cfg(13, '🎉 Celebrations & Music', 'Dances, flutes and feast days', 'celebrations',
            'Vocabulary for ceremonies, music and community celebrations.',
            'Music and dance mark life transitions, healing and community joy.',
            [
                { q: 'Gammu is a…', options: [
                    { value: 'flute', label: 'Flute' }, { value: 'boat', label: 'Boat' },
                    { value: 'house', label: 'House' }, { value: 'fish', label: 'Fish' }
                ]},
                { q: 'Nogana means…', options: [
                    { value: 'song', label: 'Song' }, { value: 'rain', label: 'Rain' },
                    { value: 'leader', label: 'Leader' }, { value: 'skirt', label: 'Skirt' }
                ]},
                { q: 'Innased refers to a…', options: [
                    { value: 'celebration', label: 'Celebration' }, { value: 'river', label: 'River' },
                    { value: 'shark', label: 'Shark' }, { value: 'cloud', label: 'Cloud' }
                ]}
            ],
            ['Gammu', 'Nogana', 'Innased'],
            [
                { value: 'flute', label: 'Flute' }, { value: 'song', label: 'Song' },
                { value: 'celebration', label: 'Celebration' }, { value: 'day', label: 'Feast day' }
            ],
            [
                { guna: 'Gammu', value: 'flute', label: 'Flute' },
                { guna: 'Nogana', value: 'song', label: 'Song' },
                { guna: 'Innased', value: 'celebration', label: 'Celebration' }
            ], 200, 45),

        14: cfg(14, '💬 Idiomatic Expressions', 'Sayings used every day', 'idioms',
            'Practice everyday idioms and natural replies in Guna.',
            'Idioms carry humor, politeness and community values in daily speech.',
            [
                { q: 'Basuli means…', options: [
                    { value: 'matter', label: "It doesn't matter" }, { value: 'hello', label: 'Hello' },
                    { value: 'water', label: 'Water' }, { value: 'mother', label: 'Mother' }
                ]},
                { q: 'Nuedi means…', options: [
                    { value: 'good', label: 'Good / well' }, { value: 'bad', label: 'Bad' },
                    { value: 'far', label: 'Far' }, { value: 'cold', label: 'Cold' }
                ]},
                { q: 'Pia? asks…', options: [
                    { value: 'what', label: 'What?' }, { value: 'who', label: 'Who?' },
                    { value: 'where', label: 'Where?' }, { value: 'when', label: 'When?' }
                ]}
            ],
            ['Basuli', 'Nuedi', 'Pia?'],
            [
                { value: 'matter', label: "Doesn't matter" }, { value: 'good', label: 'Good' },
                { value: 'what', label: 'What?' }, { value: 'right', label: "That's right" }
            ],
            [
                { guna: 'Basuli', value: 'matter', label: "Doesn't matter" },
                { guna: 'Nuedi', value: 'good', label: 'Good' },
                { guna: 'Pia?', value: 'what', label: 'What?' }
            ], 225, 50),

        15: cfg(15, '🗺️ Regional Geography', 'Comarcas and sacred places', 'geography',
            'Learn the three Guna comarcas and landscape words.',
            'Guna identity spans islands (Guna Yala), forests (Madugandí) and mountains (Wargandí).',
            [
                { q: 'The island archipelago comarca is…', options: [
                    { value: 'yala', label: 'Guna Yala' }, { value: 'madu', label: 'Madugandí' },
                    { value: 'war', label: 'Wargandí' }, { value: 'panama', label: 'Panama City' }
                ]},
                { q: 'Yar means…', options: [
                    { value: 'sea', label: 'Sea' }, { value: 'house', label: 'House' },
                    { value: 'corn', label: 'Corn' }, { value: 'song', label: 'Song' }
                ]},
                { q: 'Nabgwana refers to…', options: [
                    { value: 'earth', label: 'Mother Earth' }, { value: 'flute', label: 'Flute' },
                    { value: 'beads', label: 'Beads' }, { value: 'hat', label: 'Hat' }
                ]}
            ],
            ['Guna Yala', 'Yar', 'Nabgwana'],
            [
                { value: 'islands', label: 'Island comarca' }, { value: 'sea', label: 'Sea' },
                { value: 'earth', label: 'Mother Earth' }, { value: 'river', label: 'River' }
            ],
            [
                { guna: 'Guna Yala', value: 'islands', label: 'Island comarca' },
                { guna: 'Yar', value: 'sea', label: 'Sea' },
                { guna: 'Nabgwana', value: 'earth', label: 'Mother Earth' }
            ], 225, 50),

        16: cfg(16, '🧺 Art & Basketry', 'Textiles, baskets and canoes', 'crafts',
            'Words for crafts that sustain culture and daily life.',
            'Molas, baskets and ulu canoes are both art and practical technology.',
            [
                { q: 'Karwa is a…', options: [
                    { value: 'basket', label: 'Basket' }, { value: 'shark', label: 'Shark' },
                    { value: 'cloud', label: 'Cloud' }, { value: 'leader', label: 'Leader' }
                ]},
                { q: 'Ulu can mean…', options: [
                    { value: 'canoe', label: 'Canoe' }, { value: 'rain', label: 'Rain' },
                    { value: 'mother', label: 'Mother' }, { value: 'fire', label: 'Fire' }
                ]},
                { q: 'Sabbi means…', options: [
                    { value: 'thread', label: 'Thread' }, { value: 'ocean', label: 'Ocean' },
                    { value: 'moon', label: 'Moon' }, { value: 'corn', label: 'Corn' }
                ]}
            ],
            ['Karwa', 'Ulu', 'Sabbi'],
            [
                { value: 'basket', label: 'Basket' }, { value: 'canoe', label: 'Canoe' },
                { value: 'thread', label: 'Thread' }, { value: 'beads', label: 'Beads' }
            ],
            [
                { guna: 'Karwa', value: 'basket', label: 'Basket' },
                { guna: 'Ulu', value: 'canoe', label: 'Canoe' },
                { guna: 'Sabbi', value: 'thread', label: 'Thread' }
            ], 250, 55),

        17: cfg(17, '⚖️ Values & Community Law', 'Norms, justice and respect', 'values',
            'Learn words for community values and traditional law.',
            'Bab Igar — the path of the elders — guides respect, justice and belonging.',
            [
                { q: 'Onmaked relates to…', options: [
                    { value: 'law', label: 'Council / law' }, { value: 'fish', label: 'Fish' },
                    { value: 'hat', label: 'Hat' }, { value: 'yam', label: 'Yam' }
                ]},
                { q: 'Bab Igar means…', options: [
                    { value: 'elders', label: "Elders' path" }, { value: 'storm', label: 'Storm' },
                    { value: 'market', label: 'Market' }, { value: 'canoe', label: 'Canoe' }
                ]},
                { q: 'Igar means…', options: [
                    { value: 'path', label: 'Path / rule' }, { value: 'plate', label: 'Plate' },
                    { value: 'monkey', label: 'Monkey' }, { value: 'skirt', label: 'Skirt' }
                ]}
            ],
            ['Onmaked', 'Bab Igar', 'Igar'],
            [
                { value: 'law', label: 'Law' }, { value: 'elders', label: "Elders' path" },
                { value: 'path', label: 'Path' }, { value: 'people', label: 'People' }
            ],
            [
                { guna: 'Onmaked', value: 'law', label: 'Law' },
                { guna: 'Bab Igar', value: 'elders', label: "Elders' path" },
                { guna: 'Igar', value: 'path', label: 'Path' }
            ], 250, 55),

        18: cfg(18, '🎵 Healing Songs', 'Spiritual medicine through song', 'songs',
            'Vocabulary of ritual songs used in healing and ceremony.',
            'Kantule singers guide healing through voice, rhythm and spiritual knowledge.',
            [
                { q: 'Nogana means…', options: [
                    { value: 'song', label: 'Song' }, { value: 'house', label: 'House' },
                    { value: 'crab', label: 'Crab' }, { value: 'wind', label: 'Wind' }
                ]},
                { q: 'A Kantule is a…', options: [
                    { value: 'singer', label: 'Healing singer' }, { value: 'tourist', label: 'Tourist' },
                    { value: 'soldier', label: 'Soldier' }, { value: 'merchant', label: 'Merchant' }
                ]},
                { q: 'Gammu is a…', options: [
                    { value: 'flute', label: 'Flute' }, { value: 'spear', label: 'Spear' },
                    { value: 'plate', label: 'Plate' }, { value: 'island', label: 'Island' }
                ]}
            ],
            ['Nogana', 'Kantule', 'Gammu'],
            [
                { value: 'song', label: 'Song' }, { value: 'singer', label: 'Healing singer' },
                { value: 'flute', label: 'Flute' }, { value: 'path', label: 'Spiritual path' }
            ],
            [
                { guna: 'Nogana', value: 'song', label: 'Song' },
                { guna: 'Kantule', value: 'singer', label: 'Healing singer' },
                { guna: 'Gammu', value: 'flute', label: 'Flute' }
            ], 275, 60),

        19: cfg(19, '🤝 Traditional Exchange', 'Barter, travel and local economy', 'trade',
            'Learn words for barter, travel and community exchange.',
            'Coconuts, molas and crops circulate through reciprocity more than cash markets.',
            [
                { q: 'Ogob (in trade) often means…', options: [
                    { value: 'coconut', label: 'Coconut' }, { value: 'gold', label: 'Gold' },
                    { value: 'phone', label: 'Phone' }, { value: 'car', label: 'Car' }
                ]},
                { q: 'Ulu is used for…', options: [
                    { value: 'travel', label: 'Canoe travel' }, { value: 'cooking oil', label: 'Cooking oil' },
                    { value: 'school', label: 'School' }, { value: 'radio', label: 'Radio' }
                ]},
                { q: 'Anmar emphasizes…', options: [
                    { value: 'community', label: 'We / community' }, { value: 'alone', label: 'Being alone' },
                    { value: 'anger', label: 'Anger' }, { value: 'silence', label: 'Silence' }
                ]}
            ],
            ['Ogob', 'Ulu', 'Anmar'],
            [
                { value: 'coconut', label: 'Coconut' }, { value: 'travel', label: 'Canoe travel' },
                { value: 'community', label: 'Community' }, { value: 'mola', label: 'Mola trade' }
            ],
            [
                { guna: 'Ogob', value: 'coconut', label: 'Coconut' },
                { guna: 'Ulu', value: 'travel', label: 'Canoe travel' },
                { guna: 'Anmar', value: 'community', label: 'Community' }
            ], 275, 60),

        20: cfg(20, '👑 Linguistic Mastery', 'Final path challenge', 'mastery',
            'Prove your mastery across culture, language and territory.',
            'Completing the full path honors Dulegaya and the elders who keep it alive.',
            [
                { q: 'Dulegaya is the…', options: [
                    { value: 'language', label: 'Guna language' }, { value: 'capital', label: 'Capital city' },
                    { value: 'fruit', label: 'Fruit' }, { value: 'dance only', label: 'Dance only' }
                ]},
                { q: 'A Sagla is a…', options: [
                    { value: 'leader', label: 'Leader' }, { value: 'turtle', label: 'Turtle' },
                    { value: 'cloud', label: 'Cloud' }, { value: 'spoon', label: 'Spoon' }
                ]},
                { q: 'Ardi means…', options: [
                    { value: 'turtle', label: 'Turtle' }, { value: 'fire', label: 'Fire' },
                    { value: 'hat', label: 'Hat' }, { value: 'rain', label: 'Rain' }
                ]}
            ],
            ['Dulegaya', 'Sagla', 'Ardi'],
            [
                { value: 'language', label: 'Language' }, { value: 'leader', label: 'Leader' },
                { value: 'turtle', label: 'Turtle' }, { value: 'water', label: 'Water' }
            ],
            [
                { guna: 'Dulegaya', value: 'language', label: 'Language' },
                { guna: 'Sagla', value: 'leader', label: 'Leader' },
                { guna: 'Ardi', value: 'turtle', label: 'Turtle' }
            ], 300, 90)
    };

    Object.assign(C, module2);

    C.quizAnswers = Object.assign({}, C.quizAnswers || {}, {
        8: { 1: 'igi', 2: 'rain', 3: 'burba', 4: { 1: 'sun', 2: 'rain', 3: 'wind' } },
        9: { 1: 'mola', 2: 'beads', 3: 'skirt', 4: { 1: 'blouse', 2: 'beads', 3: 'skirt' } },
        10: { 1: 'medicine', 2: 'inaduled', 3: 'songs', 4: { 1: 'medicine', 2: 'healer', 3: 'singer' } },
        11: { 1: 'creator', 2: 'story', 3: 'spirit', 4: { 1: 'creator', 2: 'story', 3: 'spirit' } },
        12: { 1: 'leader', 2: 'congress', 3: 'people', 4: { 1: 'leader', 2: 'congress', 3: 'people' } },
        13: { 1: 'flute', 2: 'song', 3: 'celebration', 4: { 1: 'flute', 2: 'song', 3: 'celebration' } },
        14: { 1: 'matter', 2: 'good', 3: 'what', 4: { 1: 'matter', 2: 'good', 3: 'what' } },
        15: { 1: 'yala', 2: 'sea', 3: 'earth', 4: { 1: 'islands', 2: 'sea', 3: 'earth' } },
        16: { 1: 'basket', 2: 'canoe', 3: 'thread', 4: { 1: 'basket', 2: 'canoe', 3: 'thread' } },
        17: { 1: 'law', 2: 'elders', 3: 'path', 4: { 1: 'law', 2: 'elders', 3: 'path' } },
        18: { 1: 'song', 2: 'singer', 3: 'flute', 4: { 1: 'song', 2: 'singer', 3: 'flute' } },
        19: { 1: 'coconut', 2: 'travel', 3: 'community', 4: { 1: 'coconut', 2: 'travel', 3: 'community' } },
        20: { 1: 'language', 2: 'leader', 3: 'turtle', 4: { 1: 'language', 2: 'leader', 3: 'turtle' } }
    });

    window.GUNA_VOCABULARY = V;
    window.GUNA_LESSON_CONFIGS = C;
})();
