/**
 * Guna vocabulary — central data for lessons & dictionary
 */
const GUNA_VOCABULARY = {
    greetings: [
        { guna: 'Na', es: 'Yo', en: 'I', icon: '👤', image: '../Images/Memory match/Na.png', example: 'Na an mar — I am here' },
        { guna: 'Be', es: 'Tú', en: 'You', icon: '👋', image: '../Images/Memory match/Be.jpg', example: 'Be an mar? — Are you here?' },
        { guna: 'Eye', es: 'Sí', en: 'Yes', icon: '✅', image: '../Images/Memory match/Eye.jpg', example: 'Eye, degii — Yes, that is right' },
        { guna: 'Degii', es: 'Así es', en: "That's right", icon: '👍', image: '../Images/Memory match/Degii.png', example: 'Degii, anna — That is right, hello' },
        { guna: '¡ anna !', es: 'Hola', en: 'Hello', icon: '🏝️', image: '../Images/Memory match/anna.png', example: '¡ anna ! — Hello!' },
        { guna: 'degi malo', es: 'Adiós', en: 'Goodbye', icon: '👋', image: '../Images/Memory match/degi malo.jpg', example: 'degi malo — Goodbye' },
        { guna: 'Banmalo', es: 'Hasta mañana', en: 'See you tomorrow', icon: '🌅', image: '../Images/Memory match/Banmalo.jpg', example: 'Banmalo — See you tomorrow' }
    ],
    family: [
        { guna: 'Nana', es: 'Mamá', en: 'Mother', icon: '👩', image: '../Images/Memory match/Nana.jpg', example: 'Nana an mar — Mother is here' },
        { guna: 'Tata', es: 'Papá', en: 'Father', icon: '👨', image: '../Images/Memory match/Tata.jpg', example: 'Tata — Father' },
        { guna: 'Dummad', es: 'Hermano', en: 'Brother', icon: '👦', image: '../Images/Memory match/Dummad.jpg', example: 'Dummad — Brother' },
        { guna: 'Nueded', es: 'Hermana', en: 'Sister', icon: '👧', image: '../Images/Memory match/Nueded.jpg', example: 'Nueded — Sister' },
        { guna: 'Bab', es: 'Abuelo', en: 'Grandfather', icon: '👴', image: '../Images/Memory match/Bab.png', example: 'Bab — Grandfather' },
        { guna: 'Dada', es: 'Abuela', en: 'Grandmother', icon: '👵', image: '../Images/Memory match/Dada.jpg', example: 'Dada — Grandmother' }
    ],
    home: [
        { guna: 'Muu', es: 'Casa', en: 'House', icon: '🏠', image: '../Images/Memory match/Muu.jpg', example: 'Muu — House / home' },
        { guna: 'Nika', es: 'Mesa', en: 'Table', icon: '🪑', image: '../Images/Memory match/Nika.jpg', example: 'Nika — Table' },
        { guna: 'Misi', es: 'Plato', en: 'Plate', icon: '🍽️', image: '../Images/Memory match/Misi.jpg', example: 'Misi — Plate' },
        { guna: 'Tapa', es: 'Cuchara', en: 'Spoon', icon: '🥄', image: '../Images/Memory match/Tapa.jpg', example: 'Tapa — Spoon' },
        { guna: 'Bii', es: 'Ropa', en: 'Clothes', icon: '👕', image: '../Images/Memory match/Bii.jpg', example: 'Bii — Clothes' }
    ],
    nature: [
        { guna: 'Sii', es: 'Agua', en: 'Water', icon: '💧', example: 'Sii — Water' },
        { guna: 'Dii', es: 'Fuego', en: 'Fire', icon: '🔥', example: 'Dii — Fire' },
        { guna: 'Kalu', es: 'Madera', en: 'Wood', icon: '🪵', example: 'Kalu — Wood' },
        { guna: 'Tii', es: 'Barro', en: 'Clay', icon: '🏺', example: 'Tii — Clay' }
    ],
    animals: [
        { guna: 'Malú', es: 'Pollo', en: 'Chicken', icon: '🐔', example: 'Malú — Chicken' },
        { guna: 'Suu', es: 'Mono', en: 'Monkey', icon: '🐒', example: 'Suu — Monkey' },
        { guna: 'Uli', es: 'Cangrejo', en: 'Crab', icon: '🦀', example: 'Uli — Crab' },
        { guna: 'Ibeler', es: 'Tiburón', en: 'Shark', icon: '🦈', example: 'Ibeler — Shark' },
        { guna: 'Ardi', es: 'Tortuga', en: 'Turtle', icon: '🐢', example: 'Ardi — Turtle' },
        { guna: 'Wala', es: 'Mariposa', en: 'Butterfly', icon: '🦋', example: 'Wala — Butterfly' }
    ],
    plants: [
        { guna: 'Ogob', es: 'Maíz', en: 'Corn', icon: '🌽', example: 'Ogob — Corn' },
        { guna: 'Gwad', es: 'Coco', en: 'Coconut', icon: '🥥', example: 'Gwad — Coconut' },
        { guna: 'Naggid', es: 'Yuca', en: 'Cassava', icon: '🌿', example: 'Naggid — Cassava' },
        { guna: 'Suggid', es: 'Ñame', en: 'Yam', icon: '🍠', example: 'Suggid — Yam' },
        { guna: 'Suwad', es: 'Tomate', en: 'Tomato', icon: '🍅', example: 'Suwad — Tomato' },
        { guna: 'Bagar', es: 'Cebolla', en: 'Onion', icon: '🧅', example: 'Bagar — Onion' }
    ],
    phrases: [
        { guna: 'Bia?', es: '¿Dónde?', en: 'Where?', icon: '📍', example: 'Bia an mar? — Where are you?' },
        { guna: 'Doa?', es: '¿Quién?', en: 'Who?', icon: '❓', example: 'Doa? — Who?' },
        { guna: 'Basuli', es: 'No importa', en: "It doesn't matter", icon: '🤷', example: 'Basuli — It does not matter' },
        { guna: 'Banmalo', es: 'Hasta mañana', en: 'See you tomorrow', icon: '🌅', example: 'Banmalo — See you tomorrow' },
        { guna: 'Emi', es: 'Hoy', en: 'Today', icon: '📅', example: 'Emi — Today' }
    ],
    culture: [
        { guna: 'Mola', es: 'Textil tradicional Guna', en: 'Traditional Guna textile', icon: '🧵', example: 'Mola — Sacred textile art' },
        { guna: 'Sagla', es: 'Líder tradicional', en: 'Traditional leader', icon: '🏛️', example: 'Sagla — Community leader' },
        { guna: 'Ibeorgun', es: 'Creador', en: 'Creator', icon: '🌟', example: 'Ibeorgun — Creator deity' },
        { guna: 'Kantule', es: 'Sabio ancestral', en: 'Ancestral sage', icon: '📜', example: 'Kantule — Ancestral sage' },
        { guna: 'Dulegaya', es: 'Idioma Guna', en: 'Guna language', icon: '🗣️', example: 'Dulegaya — Guna language' },
        { guna: 'Guna Yala', es: 'Comarca autónoma', en: 'Autonomous territory', icon: '🏝️', example: 'Guna Yala — Guna territory' }
    ],
    // Legacy aliases for compatibility
    objects: [],
    pronouns: []
};

GUNA_VOCABULARY.objects = [...GUNA_VOCABULARY.home, ...GUNA_VOCABULARY.nature];
GUNA_VOCABULARY.pronouns = GUNA_VOCABULARY.greetings.filter(w => ['Na', 'Be'].includes(w.guna));

GUNA_VOCABULARY.CATEGORIES = [
    { id: 'greetings', label: 'Greetings', icon: '👋', words: GUNA_VOCABULARY.greetings },
    { id: 'family', label: 'Family', icon: '👨‍👩‍👧', words: GUNA_VOCABULARY.family },
    { id: 'home', label: 'Everyday Objects', icon: '🏠', words: GUNA_VOCABULARY.home },
    { id: 'nature', label: 'Nature', icon: '🌊', words: GUNA_VOCABULARY.nature },
    { id: 'animals', label: 'Animals', icon: '🐢', words: GUNA_VOCABULARY.animals },
    { id: 'plants', label: 'Food', icon: '🥥', words: GUNA_VOCABULARY.plants },
    { id: 'culture', label: 'Guna Culture', icon: '🧵', words: GUNA_VOCABULARY.culture },
    { id: 'phrases', label: 'Phrases', icon: '💬', words: GUNA_VOCABULARY.phrases }
];

window.GUNA_VOCABULARY = GUNA_VOCABULARY;
