/**
 * Guna vocabulary — central data for lessons & dictionary
 * Words come from native speaker recordings in Multimedia/Audio
 * (guna word) - (Spanish translation)
 */
const GUNA_AUDIO = '../Multimedia/Audio/';
const GUNA_IMG = '../Multimedia/Images/Memory match/';

function vocabWord(guna, es, en, icon, audioFile, extra) {
    return {
        guna,
        es,
        en,
        icon,
        audio: GUNA_AUDIO + audioFile,
        example: `${guna} — ${en}`,
        ...(extra || {})
    };
}

const GUNA_VOCABULARY = {
    greetings: [
        vocabWord('Naa', 'Hola', 'Hello', '👋', 'Naa - Hola.mp3', { image: GUNA_IMG + 'anna.png' }),
        vocabWord('Be', 'Tú', 'You', '👤', 'Be - Tú.mp3', { image: GUNA_IMG + 'Be.jpg' }),
        vocabWord('Eye', 'Sí', 'Yes', '✅', 'Eye - Si.mp3', { image: GUNA_IMG + 'Eye.jpg' }),
        vocabWord('Suli', 'No', 'No', '❌', 'Suli - No.mp3'),
        vocabWord('Deggidde', 'Cómo estás', 'How are you', '🙂', 'Deggidde - Como estas.mp3', { image: GUNA_IMG + 'Degii.png' }),
        vocabWord('Deggimalo', 'Adiós', 'Goodbye', '👋', 'Deggimalo - Adios.mp3', { image: GUNA_IMG + 'degi malo.jpg' }),
        vocabWord('Bannemalo', 'Hasta mañana', 'See you tomorrow', '🌅', 'Bannemalo - Hasta Mañana.mp3', { image: GUNA_IMG + 'Banmalo.jpg' }),
        vocabWord('Nued', 'Gracias', 'Thank you', '🙏', 'Nued - Gracias.mp3')
    ],
    family: [
        vocabWord('Nana', 'Mamá', 'Mother', '👩', 'Nana - Mamá.mp3', { image: GUNA_IMG + 'Nana.jpg' }),
        vocabWord('Baba', 'Papá', 'Father', '👨', 'Baba - Papá.mp3', { image: GUNA_IMG + 'Tata.jpg' }),
        vocabWord('Tata', 'Abuelo', 'Grandfather', '👴', 'Tata - Abuelo.mp3', { image: GUNA_IMG + 'Bab.png' }),
        vocabWord('Muú', 'Abuela', 'Grandmother', '👵', 'Muú - Abuela.mp3', { image: GUNA_IMG + 'Dada.jpg' }),
        vocabWord('Gilor', 'Tío', 'Uncle', '👨', 'Gilor - Tio.mp3'),
        vocabWord('Ammor', 'Tía', 'Aunt', '👩', 'Ammor - Tia.mp3'),
        vocabWord('Niga', 'Sobrino', 'Nephew', '👦', 'Niga - Sobrino.mp3'),
        vocabWord('Anai', 'Amigo', 'Friend', '🤝', 'Anai - Amigo.mp3'),
        vocabWord('Ome', 'Mujer', 'Woman', '👩', 'Ome - Mujer.mp3'),
        vocabWord('Massered', 'Hombre', 'Man', '👨', 'Massered - Hombre.mp3')
    ],
    home: [
        vocabWord('Nega', 'Casa', 'House', '🏠', 'Nega - Casa.mp3', { image: GUNA_IMG + 'Muu.jpg' }),
        vocabWord('Ibya', 'Tienda', 'Store', '🏪', 'Ibya - Tienda.mp3'),
        vocabWord('Ibdurdaggednega', 'Escuela', 'School', '🏫', 'Ibdurdaggednega - Escuela.mp3'),
        vocabWord('Mola', 'Blusa de mujer', "Women's blouse", '🧵', 'Mola - Blusa de mujer.mp3'),
        vocabWord('Moryoed', 'Vestirse', 'To get dressed', '👕', 'Moryoed - Vestirse.mp3')
    ],
    nature: [
        vocabWord('Dii', 'Agua', 'Water', '💧', 'Dii - Agua.mp3'),
        vocabWord('Urgo', 'Madera', 'Wood', '🪵', 'Urgo - Madera.mp3'),
        vocabWord('Olli', 'Barro', 'Clay', '🏺', 'Olli - Barro.mp3'),
        vocabWord('Suwar', 'Palo', 'Stick', '🪵', 'Suwar - Palo.mp3')
    ],
    animals: [
        vocabWord('Nali', 'Tiburón', 'Shark', '🦈', 'Nali - Tiburón.mp3'),
        vocabWord('Sussua', 'Mariposa', 'Butterfly', '🦋', 'Sussua - Mariposa.mp3'),
        vocabWord('Misi', 'Gato', 'Cat', '🐱', 'Misi - Gato.mp3'),
        vocabWord('Gannir', 'Pollo', 'Chicken', '🐔', 'Gannir - Pollo.mp3'),
        vocabWord('Assu', 'Perro', 'Dog', '🐶', 'Assu - Perro.mp3'),
        vocabWord('Sulu', 'Mono', 'Monkey', '🐒', 'Sulu - Mono.mp3'),
        vocabWord('Suga', 'Cangrejo', 'Crab', '🦀', 'Suga - Cangrejo.mp3'),
        vocabWord('Yaug', 'Tortuga', 'Turtle', '🐢', 'Yaug - Tortuga.mp3')
    ],
    plants: [
        vocabWord('Oba', 'Maíz', 'Corn', '🌽', 'Oba - Maiz.mp3'),
        vocabWord('Agu', 'Cebolla', 'Onion', '🧅', 'Agu - Cebolla.mp3'),
        vocabWord('Ogob', 'Coco', 'Coconut', '🥥', 'Ogob - Coco.mp3'),
        vocabWord('Sabbidurba', 'Frutas', 'Fruits', '🍇', 'Sabbidurba - Frutas.mp3'),
        vocabWord('Masi', 'Comida', 'Food', '🍽️', 'Masi_Comida.mp3'),
        vocabWord('Masdued', 'Cocinar', 'To cook', '👨‍🍳', 'Masdued - Cocinar.mp3')
    ],
    phrases: [
        vocabWord('Bia', '¿Dónde?', 'Where?', '📍', 'Bia - Donde.mp3'),
        vocabWord('Doa', '¿Quién?', 'Who?', '❓', 'Doa - Quien.mp3'),
        vocabWord('Ingua', '¿Cuándo?', 'When?', '⏰', 'Ingua - Cuando.mp3'),
        vocabWord('Emi', 'Hoy', 'Today', '📅', 'Emi - Hoy.mp3'),
        vocabWord('Bassuli', 'No importa', "It doesn't matter", '🤷', 'Bassuli - No importa.mp3'),
        vocabWord('Baid', 'Otro', 'Other', '🔁', 'Baid - Otro.mp3'),
        vocabWord('Itosa', '¿Escuchaste?', 'Did you hear?', '👂', 'Itosa - Escuchaste.mp3'),
        vocabWord('Nueditosa', 'Se entendió', 'It was understood', '💡', 'Nueditosa - Se entendio.mp3')
    ],
    culture: [
        vocabWord('Mola', 'Blusa de mujer', "Women's blouse", '🧵', 'Mola - Blusa de mujer.mp3'),
        vocabWord('Innasuid', 'Ceremonia', 'Ceremony', '🎉', 'Innasuid - Ceremonia.mp3'),
        vocabWord('Igarduled', 'Guía', 'Guide', '🧭', 'Igarduled-Guia.mp3')
    ],
    objects: [],
    pronouns: []
};

GUNA_VOCABULARY.objects = [...GUNA_VOCABULARY.home, ...GUNA_VOCABULARY.nature];
GUNA_VOCABULARY.pronouns = GUNA_VOCABULARY.greetings.filter(w => w.guna === 'Be');

GUNA_VOCABULARY.people = [
    ...GUNA_VOCABULARY.family.filter(w => ['Ome', 'Massered', 'Anai'].includes(w.guna)),
    ...GUNA_VOCABULARY.greetings.filter(w => w.guna === 'Be')
];

GUNA_VOCABULARY.places = GUNA_VOCABULARY.home.filter(w =>
    ['Nega', 'Ibya', 'Ibdurdaggednega'].includes(w.guna)
);

GUNA_VOCABULARY.actions = [
    ...GUNA_VOCABULARY.home.filter(w => w.guna === 'Moryoed'),
    ...GUNA_VOCABULARY.plants.filter(w => w.guna === 'Masdued'),
    ...GUNA_VOCABULARY.phrases.filter(w => w.guna === 'Itosa')
];

GUNA_VOCABULARY.questions = GUNA_VOCABULARY.phrases.filter(w =>
    ['Bia', 'Doa', 'Ingua'].includes(w.guna)
);

GUNA_VOCABULARY.expressions = GUNA_VOCABULARY.phrases.filter(w =>
    ['Bassuli', 'Nueditosa', 'Baid', 'Emi'].includes(w.guna)
).concat(GUNA_VOCABULARY.greetings.filter(w => w.guna === 'Nued'));

GUNA_VOCABULARY.clothing = [
    ...GUNA_VOCABULARY.home.filter(w => ['Mola', 'Moryoed'].includes(w.guna)),
    ...GUNA_VOCABULARY.family.filter(w => w.guna === 'Ome')
];

GUNA_VOCABULARY.mastery = [
    ...GUNA_VOCABULARY.greetings.slice(0, 3),
    ...GUNA_VOCABULARY.family.slice(0, 2),
    ...GUNA_VOCABULARY.home.slice(0, 1),
    ...GUNA_VOCABULARY.animals.slice(0, 2),
    ...GUNA_VOCABULARY.plants.slice(0, 2)
];

GUNA_VOCABULARY.CATEGORIES = [
    { id: 'greetings', label: 'Greetings', icon: '👋', words: GUNA_VOCABULARY.greetings, module: 'basics' },
    { id: 'family', label: 'Family', icon: '👨‍👩‍👧', words: GUNA_VOCABULARY.family, module: 'basics' },
    { id: 'home', label: 'Everyday Objects', icon: '🏠', words: GUNA_VOCABULARY.home, module: 'basics' },
    { id: 'nature', label: 'Nature', icon: '🌊', words: GUNA_VOCABULARY.nature, module: 'basics' },
    { id: 'animals', label: 'Animals', icon: '🐢', words: GUNA_VOCABULARY.animals, module: 'basics' },
    { id: 'plants', label: 'Food', icon: '🥥', words: GUNA_VOCABULARY.plants, module: 'basics' },
    { id: 'culture', label: 'Guna Culture', icon: '🧵', words: GUNA_VOCABULARY.culture, module: 'basics' },
    { id: 'phrases', label: 'Phrases', icon: '💬', words: GUNA_VOCABULARY.phrases, module: 'basics' }
];

GUNA_VOCABULARY.MODULES = [
    {
        id: 'basics',
        label: 'Module 1 — Basics',
        subtitle: 'Greetings, family, home, nature, animals, food, phrases and culture',
        icon: '🌱',
        categoryIds: ['greetings', 'family', 'home', 'nature', 'animals', 'plants', 'phrases', 'culture']
    }
];

GUNA_VOCABULARY.getAllWords = function getAllWords() {
    const seen = new Set();
    const all = [];
    (this.CATEGORIES || []).forEach((cat) => {
        (cat.words || []).forEach((w) => {
            const key = (w.guna || '').toLowerCase();
            if (!key || seen.has(key)) return;
            seen.add(key);
            all.push(w);
        });
    });
    return all;
};

GUNA_VOCABULARY.findWord = function findWord(guna) {
    if (!guna) return null;
    const needle = String(guna).toLowerCase().replace(/[¡!¿?]/g, '').trim();
    return this.getAllWords().find((w) => {
        const name = String(w.guna || '').toLowerCase().replace(/[¡!¿?]/g, '').trim();
        return name === needle;
    }) || null;
};

GUNA_VOCABULARY.speakFallback = function speakFallback(text) {
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'es-ES';
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
};

GUNA_VOCABULARY.play = function play(guna) {
    const settings = typeof GunaUserData !== 'undefined' ? GunaUserData.getSettings() : {};
    if (settings.audioPlayback === false) return;
    const word = this.findWord(guna);
    if (word?.audio) {
        try {
            if (this._player) {
                this._player.pause();
                this._player = null;
            }
            this._player = new Audio(encodeURI(word.audio));
            this._player.play().catch(() => this.speakFallback(word.guna || guna));
            return;
        } catch {
            /* fall through */
        }
    }
    this.speakFallback(word?.guna || guna);
};

window.GUNA_VOCABULARY = GUNA_VOCABULARY;
