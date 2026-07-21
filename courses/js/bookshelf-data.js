/**
 * My Bookshelf — shared book catalog, quiz data & localStorage state
 */
const BOOKSHELF_STORAGE_KEY = 'guna_bookshelf';

const BOOKSHELF_QUIZZES = {
    'mola-history': [
        { question: "What does the word 'mola' mean in the Guna language?", options: ['Art', 'Clothing or garment', 'Colors', 'History'], correct: 1 },
        { question: 'What technique is used to create molas?', options: ['Traditional weaving', 'Reverse appliqué', 'Painting on fabric', 'Conventional embroidery'], correct: 1 },
        { question: 'What does the color red represent in molas?', options: ['The sun and prosperity', 'Blood and life', 'Spiritual protection', 'Nature'], correct: 1 },
        { question: 'In what year were molas recognized by UNESCO?', options: ['2010', '2015', '2017', '2020'], correct: 2 },
        { question: 'What do circles represent in molas?', options: ['Sacred mountains', 'The cycle of life', 'Guardian spirits', 'The sea'], correct: 1 }
    ],
    'guna-language': [
        { question: 'Which language family does Guna belong to?', options: ['Arawak', 'Chibchense', 'Caribbean', 'Quechua'], correct: 1 },
        { question: 'Approximately how many people speak Guna?', options: ['20,000', '40,000', '60,000', '80,000'], correct: 2 },
        { question: 'Where does the verb tend to be placed?', options: ['At the beginning', 'In the middle', 'At the end', 'No fixed position'], correct: 2 },
        { question: 'What specific system does Guna have for objects?', options: ['Gender system', 'Counter system', 'Case system', 'Number system'], correct: 1 },
        { question: 'What is fundamental to Guna cultural identity?', options: ['Geography', 'Economy', 'Language', 'Religion'], correct: 2 }
    ],
    'guna-territory': [
        { question: 'How many islands does Guna Yala comprise?', options: ['100', '200', '365', '500'], correct: 2 },
        { question: 'How many islands are permanently inhabited?', options: ['~20', '~49', '~100', '~200'], correct: 1 },
        { question: 'What is the highest Guna authority?', options: ['President of Panama', 'Guna General Congress', 'Council of elders', 'Local governor'], correct: 1 },
        { question: 'What sustainability challenge do the Guna face?', options: ['Overfishing', 'Climate change and tourism', 'Deforestation', 'Industrial pollution'], correct: 1 },
        { question: 'What must visitors do to visit islands?', options: ['Only pay a fee', 'Obtain permits from local authorities', 'No restrictions', 'Visit certain islands only'], correct: 1 }
    ],
    'tule-revolution': [
        { question: 'In what year did the Tule Revolution take place?', options: ['1910', '1925', '1930', '1945'], correct: 1 },
        { question: 'What did the Guna people defend during the revolution?', options: ['Tourism revenue', 'Customs, dress, language and autonomy', 'Colonial trade routes', 'Foreign education'], correct: 1 },
        { question: 'What is the Guna General Congress?', options: ['A tourist board', 'The highest traditional authority', 'A school system', 'A fishing cooperative'], correct: 1 },
        { question: 'Which island is symbolic of the Tule Revolution?', options: ['Narganá', 'Ailigandí', 'Cartí', 'Madugandí'], correct: 1 },
        { question: 'What territory did the Guna secure after the revolution?', options: ['Darién Province', 'Guna Yala autonomous comarca', 'Bocas del Toro', 'Colón'], correct: 1 }
    ]
};

const BOOKSHELF_CATALOG = [
    {
        id: 'mola-history',
        readingId: 'mola-history',
        title: 'The History of Molas',
        author: 'SOGED Cultural Team',
        cover: '../Multimedia/Images/Molas - Guna/Mola 1.jpg',
        shelf: 'read',
        context: ['readings', 'history'],
        genres: ['Culture', 'Education'],
        rating: 4.8,
        format: 'Digital Reading',
        ogodsReward: 50,
        defaultNotes: 'Molas are living archives of Guna identity — every geometric pattern carries ancestral meaning.'
    },
    {
        id: 'guna-territory',
        readingId: 'guna-territory',
        title: 'The Guna Yala Territory',
        author: 'SOGED Geography Unit',
        cover: '../Multimedia/Images/panama-guna-map.png',
        shelf: 'read',
        context: ['readings', 'history'],
        genres: ['Geography', 'Education'],
        rating: 4.6,
        format: 'Digital Reading',
        ogodsReward: 50,
        defaultNotes: 'Guna Yala spans more than 365 islands — autonomy protects both land and sea.'
    },
    {
        id: 'tule-revolution',
        readingId: 'tule-revolution',
        title: 'The 1925 Tule Revolution',
        author: 'SOGED History Archives',
        cover: '../Multimedia/Images/Molas - Guna/Comarca-Guna-Yala.jpg',
        shelf: 'read',
        context: ['history'],
        genres: ['Historical Fiction', 'Education'],
        rating: 4.9,
        format: 'Digital Reading',
        ogodsReward: 50,
        defaultNotes: 'The Tule Revolution is a cornerstone of Guna political autonomy and cultural pride.'
    },
    {
        id: 'guna-language',
        readingId: 'guna-language',
        title: 'The Guna Language: An Overview',
        author: 'SOGED Linguistics Team',
        cover: '../Multimedia/Images/Languages/Guna.png',
        shelf: 'tbr',
        context: ['readings'],
        genres: ['Language', 'Education'],
        rating: 0,
        format: 'Digital Reading',
        ogodsReward: 50,
        defaultNotes: ''
    },
    {
        id: 'guna-dictionary',
        readingId: null,
        title: 'Guna English Dictionary',
        author: 'CIEPI · UDELAS',
        cover: '../Multimedia/Images/Soged/Soged.jpg',
        shelf: 'tbr',
        context: ['readings'],
        genres: ['Language', 'Reference'],
        rating: 0,
        format: 'PDF — 250 pages',
        ogodsReward: 35,
        defaultNotes: '',
        quizId: null
    },
    {
        id: 'naso-songs',
        readingId: null,
        title: 'Traditional Naso Songs',
        author: 'SOGED Audio Library',
        cover: '../Multimedia/Images/Languages/Naso.gif',
        shelf: 'tbr',
        context: ['readings'],
        genres: ['Audio', 'Culture'],
        rating: 0,
        format: 'Audio — 45 min',
        ogodsReward: 30,
        defaultNotes: '',
        quizId: null
    },
    {
        id: 'embera-ceremonial',
        readingId: null,
        title: 'Emberá Ceremonial Language',
        author: 'SOGED Community Partners',
        cover: '../Multimedia/Images/Languages/Embera.png',
        shelf: 'dnf',
        context: ['readings', 'history'],
        genres: ['Culture', 'Advanced'],
        rating: 2.5,
        format: 'Digital Reading',
        ogodsReward: 40,
        defaultNotes: 'Paused at ceremonial vocabulary chapter — will resume after Guna readings.'
    },
    {
        id: 'ngabe-grammar',
        readingId: null,
        title: 'Complete Ngäbe Grammar PDF',
        author: 'SOGED Research Desk',
        cover: '../Multimedia/Images/Languages/Ngabe.png',
        shelf: 'dnf',
        context: ['readings'],
        genres: ['Grammar', 'Reference'],
        rating: 2.0,
        format: 'PDF — 150 pages',
        ogodsReward: 40,
        defaultNotes: 'Stopped at advanced sentence structure — needs more foundational vocabulary first.'
    }
];

const BOOKSHELF_SHELVES = [
    { id: 'read', label: 'Read', icon: '📖' },
    { id: 'tbr', label: 'TBR', subtitle: 'To Be Read', icon: '📚' },
    { id: 'dnf', label: 'DNF', subtitle: 'Did Not Finish', icon: '⏸️' }
];

function BookshelfStore_getState() {
    try {
        return JSON.parse(localStorage.getItem(BOOKSHELF_STORAGE_KEY) || '{}');
    } catch {
        return {};
    }
}

function BookshelfStore_saveState(state) {
    localStorage.setItem(BOOKSHELF_STORAGE_KEY, JSON.stringify(state));
}

function BookshelfStore_getBookNotes(bookId) {
    const state = BookshelfStore_getState();
    const book = BOOKSHELF_CATALOG.find(b => b.id === bookId);
    return state.notes?.[bookId] ?? book?.defaultNotes ?? '';
}

function BookshelfStore_setBookNotes(bookId, notes) {
    const state = BookshelfStore_getState();
    if (!state.notes) state.notes = {};
    state.notes[bookId] = notes;
    BookshelfStore_saveState(state);
}

function BookshelfStore_isQuizCompleted(bookId) {
    const state = BookshelfStore_getState();
    return !!state.quizCompleted?.[bookId];
}

function BookshelfStore_markQuizCompleted(bookId, score, total) {
    const state = BookshelfStore_getState();
    if (!state.quizCompleted) state.quizCompleted = {};
    if (!state.quizScores) state.quizScores = {};
    state.quizCompleted[bookId] = true;
    state.quizScores[bookId] = { score, total, date: new Date().toISOString() };
    BookshelfStore_saveState(state);
}

function BookshelfStore_getQuizForBook(book) {
    const key = book.readingId || book.id;
    return BOOKSHELF_QUIZZES[key] || null;
}

function BookshelfStore_getBooks(context) {
    if (!context) return BOOKSHELF_CATALOG;
    return BOOKSHELF_CATALOG.filter(b => b.context.includes(context));
}

function BookshelfStore_countByShelf(books, shelfId) {
    return books.filter(b => b.shelf === shelfId).length;
}

window.BookshelfStore = {
    getState: BookshelfStore_getState,
    saveState: BookshelfStore_saveState,
    getBookNotes: BookshelfStore_getBookNotes,
    setBookNotes: BookshelfStore_setBookNotes,
    isQuizCompleted: BookshelfStore_isQuizCompleted,
    markQuizCompleted: BookshelfStore_markQuizCompleted,
    getQuizForBook: BookshelfStore_getQuizForBook,
    getBooks: BookshelfStore_getBooks,
    countByShelf: BookshelfStore_countByShelf,
    SHELVES: BOOKSHELF_SHELVES,
    CATALOG: BOOKSHELF_CATALOG
};
