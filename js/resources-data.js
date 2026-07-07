/**
 * Resources Data Configuration
 * Dynamic data structure for automated resource rendering
 */

const RESOURCES_DATA = [
    {
        id: 'guna-phrases',
        title: 'Common Guna phrases',
        category: 'vocabulary',
        description: 'Learn the most frequently used phrases and expressions in Guna language.',
        level: 'Beginner',
        time: '20 min read',
        icon: 'fa-comments',
        featured: true,
        active: true,
        theme: 'soged-earth',
        search: 'common guna phrases expressions vocabulary',
        actions: [
            { label: 'Download', icon: 'fa-download', primary: true },
            { label: 'Practice', icon: 'fa-play', primary: false }
        ]
    },
    {
        id: 'guna-dictionary',
        title: 'Guna English dictionary',
        category: 'docs',
        description: 'Complete bilingual dictionary with pronunciation guides and everyday vocabulary.',
        level: 'All Levels',
        time: 'PDF — 250 pages',
        icon: 'fa-book-open',
        featured: true,
        active: true,
        theme: 'soged-gold',
        search: 'guna english dictionary bilingual reference',
        actions: [
            { label: 'Download', icon: 'fa-download', primary: true },
            { label: 'Preview', icon: 'fa-eye', primary: false }
        ]
    },
    {
        id: 'guna-art',
        title: 'Guna art',
        category: 'culture',
        description: 'Explore Guna culture through traditional mola art, symbolism, and language.',
        level: 'All Levels',
        time: '40 min read',
        icon: 'fa-palette',
        featured: true,
        active: true,
        theme: 'soged-green',
        search: 'guna art molas traditional culture',
        actions: [
            { label: 'Explore', icon: 'fa-play', primary: true },
            { label: 'Save', icon: 'fa-heart', primary: false }
        ]
    },
    {
        id: 'guna-pronunciation',
        title: 'Guna pronunciation guide',
        category: 'audio',
        description: 'Audio lessons with native speakers teaching proper Guna pronunciation and intonation.',
        level: 'All Levels',
        time: '60 min audio',
        icon: 'fa-volume-up',
        featured: true,
        active: true,
        theme: 'soged-blue',
        search: 'guna pronunciation guide audio native speakers',
        audioFiles: [
            { name: 'Frase 1', file: 'courses/resources/guna/audio/frase1.mp3' },
            { name: 'Frase 2', file: 'courses/resources/guna/audio/frase2.mp3' },
            { name: 'Frase 3', file: 'courses/resources/guna/audio/frase3.mp3' },
            { name: 'Frase 4', file: 'courses/resources/guna/audio/frase4.mp3' }
        ],
        actions: [
            { label: 'Listen', icon: 'fa-headphones', primary: true, onClick: 'openListeningModal()' },
            { label: 'Download', icon: 'fa-download', primary: false }
        ]
    },
    {
        id: 'ngabe-vocabulary',
        title: 'Basic Ngäbe Vocabulary',
        category: 'vocabulary',
        description: 'Essential words and phrases for everyday conversations in Ngäbe language.',
        level: 'Beginner',
        time: '15 min read',
        icon: 'fa-book',
        featured: false,
        active: false,
        theme: 'soged-purple',
        search: 'ngäbe words basic vocabulary',
        actions: [
            { label: 'Download', icon: 'fa-download', primary: true },
            { label: 'Practice', icon: 'fa-play', primary: false }
        ]
    },
    {
        id: 'naso-phrases',
        title: 'Common Naso Phrases',
        category: 'vocabulary',
        description: 'Learn the most frequently used phrases and expressions in Naso language.',
        level: 'Intermediate',
        time: '20 min read',
        icon: 'fa-comments',
        featured: false,
        active: false,
        theme: 'soged-orange',
        search: 'naso phrases common expressions',
        actions: [
            { label: 'Download', icon: 'fa-download', primary: true },
            { label: 'Practice', icon: 'fa-play', primary: false }
        ]
    },
    {
        id: 'embera-grammar',
        title: 'Emberá Sentence Structure',
        category: 'grammar',
        description: 'Understanding the unique sentence patterns and word order in Emberá.',
        level: 'Intermediate',
        time: '30 min read',
        icon: 'fa-sitemap',
        featured: false,
        active: false,
        theme: 'soged-teal',
        search: 'embera sentence structure',
        actions: [
            { label: 'Download', icon: 'fa-download', primary: true },
            { label: 'Practice', icon: 'fa-play', primary: false }
        ]
    },
    {
        id: 'ngabe-pronunciation',
        title: 'Ngäbe Pronunciation Guide',
        category: 'audio',
        description: 'Audio lessons with native speakers teaching proper Ngäbe pronunciation.',
        level: 'All Levels',
        time: '60 min audio',
        icon: 'fa-volume-up',
        featured: false,
        active: false,
        theme: 'soged-indigo',
        search: 'ngäbe pronunciation audio lessons',
        actions: [
            { label: 'Listen', icon: 'fa-play', primary: true },
            { label: 'Download', icon: 'fa-download', primary: false }
        ]
    },
    {
        id: 'naso-songs',
        title: 'Traditional Naso Songs',
        category: 'audio',
        description: 'Learn Naso through traditional songs and cultural music.',
        level: 'Beginner',
        time: '45 min audio',
        icon: 'fa-music',
        featured: false,
        active: false,
        theme: 'soged-pink',
        search: 'naso songs traditional music',
        actions: [
            { label: 'Listen', icon: 'fa-play', primary: true },
            { label: 'Download', icon: 'fa-download', primary: false }
        ]
    },
    {
        id: 'ngabe-grammar-pdf',
        title: 'Complete Ngäbe Grammar PDF',
        category: 'docs',
        description: 'Comprehensive grammar reference with examples and exercises.',
        level: 'Advanced',
        time: 'PDF — 150 pages',
        icon: 'fa-file-pdf',
        featured: false,
        active: false,
        theme: 'soged-cyan',
        search: 'ngäbe grammar pdf document',
        actions: [
            { label: 'Download', icon: 'fa-download', primary: true },
            { label: 'Preview', icon: 'fa-eye', primary: false }
        ]
    },
    {
        id: 'naso-dictionary',
        title: 'Naso-English Dictionary',
        category: 'docs',
        description: 'Complete bilingual dictionary with pronunciation guides.',
        level: 'All Levels',
        time: 'PDF — 300 pages',
        icon: 'fa-book-open',
        featured: false,
        active: false,
        theme: 'soged-lime',
        search: 'naso dictionary reference',
        actions: [
            { label: 'Download', icon: 'fa-download', primary: true },
            { label: 'Preview', icon: 'fa-eye', primary: false }
        ]
    },
    {
        id: 'embera-ceremonial',
        title: 'Emberá Ceremonial Language',
        category: 'culture',
        description: 'Learn about Emberá traditions and ceremonial vocabulary.',
        level: 'Advanced',
        time: '50 min read',
        icon: 'fa-drum',
        featured: false,
        active: false,
        theme: 'soged-rose',
        search: 'embera ceremonies traditions',
        actions: [
            { label: 'Explore', icon: 'fa-play', primary: true },
            { label: 'Save', icon: 'fa-heart', primary: false }
        ]
    }
];

// Category icons mapping
const CATEGORY_ICONS = {
    all: 'fa-th-large',
    vocabulary: 'fa-book',
    grammar: 'fa-language',
    audio: 'fa-volume-up',
    video: 'fa-play-circle',
    docs: 'fa-file-alt',
    culture: 'fa-heart'
};

// Get resources by category
function getResourcesByCategory(category) {
    if (category === 'all') return RESOURCES_DATA;
    return RESOURCES_DATA.filter(resource => resource.category === category);
}

// Search resources
function searchResources(query) {
    const lowerQuery = query.toLowerCase();
    return RESOURCES_DATA.filter(resource => 
        resource.search.toLowerCase().includes(lowerQuery) ||
        resource.title.toLowerCase().includes(lowerQuery) ||
        resource.description.toLowerCase().includes(lowerQuery)
    );
}

// Get featured resources
function getFeaturedResources() {
    return RESOURCES_DATA.filter(resource => resource.featured && resource.active);
}

// Get coming soon resources
function getComingSoonResources() {
    return RESOURCES_DATA.filter(resource => !resource.active);
}
