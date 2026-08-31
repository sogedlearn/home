/**
 * Stories Section Web Component
 * Component for interactive cultural stories
 */

class StoriesSection extends HTMLElement {
    constructor() {
        super();
        this.currentCourse = this.getAttribute('course') || 'ngabe';
        this.selectedStory = null;
        this.readingProgress = JSON.parse(localStorage.getItem('storyProgress') || '{}');
    }

    connectedCallback() {
        this.render();
        this.initializeEventListeners();
        this.loadStoryProgress();
    }

    render() {
        this.innerHTML = `
            <div class="stories-section stories-library">
                <section class="stories-hero" data-aos="fade-up">
                    <div class="stories-hero-copy">
                        <h2>📖 Cultural Library</h2>
                        <p>Explore stories, legends and reference books in a warm library layout — tap a cover to start reading.</p>
                        <button type="button" class="stories-hero-cta" id="storiesBrowseBtn">
                            <i class="fas fa-book-open"></i> Browse collection
                        </button>
                    </div>
                    <div class="stories-hero-visual" aria-hidden="true"></div>
                </section>

                <div class="stories-perks" data-aos="fade-up">
                    <div class="stories-perk"><i class="fas fa-leaf"></i><div><strong>Living culture</strong><span>Stories rooted in indigenous territory</span></div></div>
                    <div class="stories-perk"><i class="fas fa-graduation-cap"></i><div><strong>Learn by reading</strong><span>Build vocabulary through narrative</span></div></div>
                    <div class="stories-perk"><i class="fas fa-book"></i><div><strong>Documents & PDFs</strong><span>Dictionaries and cultural guides</span></div></div>
                </div>

                <div class="story-categories" data-aos="fade-up">
                    <button class="category-filter active" data-category="all"><i class="fas fa-globe"></i> All</button>
                    <button class="category-filter" data-category="documents"><i class="fas fa-file-pdf"></i> Documents</button>
                    <button class="category-filter" data-category="legends"><i class="fas fa-dragon"></i> Legends</button>
                    <button class="category-filter" data-category="wisdom"><i class="fas fa-lightbulb"></i> Wisdom</button>
                    <button class="category-filter" data-category="nature"><i class="fas fa-leaf"></i> Nature</button>
                    <button class="category-filter" data-category="family"><i class="fas fa-heart"></i> Family</button>
                </div>

                <div class="stories-section-title"><h3>Popular Books</h3></div>
                <div class="stories-grid" data-aos="fade-up">
                    ${this.generateStoriesForCourse()}
                </div>

                <div class="stories-shelf-strip" data-aos="fade-up">
                    <div class="stories-shelf-books">
                        ${this.generateShelfStrip()}
                    </div>
                </div>
            </div>
        `;

        this.querySelector('#storiesBrowseBtn')?.addEventListener('click', () => {
            this.querySelector('.stories-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    getCourseName() {
        const names = {
            'ngabe': 'Ngäbe',
            'guna': 'Guna',
            'embera': 'Emberá',
            'naso': 'Naso'
        };
        return names[this.currentCourse] || 'Indigenous';
    }

    generateShelfStrip() {
        return this.getStoriesData().slice(0, 8).map((story) => {
            const cover = story.molaImage || story.cover || '';
            return `
                <button type="button" class="stories-shelf-book" onclick="readStory('${story.id}')" aria-label="${story.title}">
                    ${cover
                        ? `<img src="${cover}" alt="" loading="lazy">`
                        : `<span><i class="fas ${story.icon || 'fa-book'}"></i></span>`}
                </button>
            `;
        }).join('');
    }

    generateStoriesForCourse() {
        const stories = this.getStoriesData();
        const coverPalette = ['#11802b', '#0973a1', '#c00000', '#e3a008', '#0c5c1f', '#075a7e'];

        return stories.map((story, index) => {
            const progressPercent = this.readingProgress[story.id] || 0;
            const cover = story.molaImage || story.cover || '';
            const author = story.source || `SOGED · ${this.getCourseName()}`;
            const badge = story.type === 'pdf' ? 'PDF' : (progressPercent > 0 ? 'Reading' : 'Story');
            const stars = Math.max(1, Math.min(5, story.difficulty || 3));
            const starHtml = '★'.repeat(stars) + '☆'.repeat(5 - stars);
            const bg = coverPalette[index % coverPalette.length];
            const primaryLabel = story.type === 'pdf'
                ? '<i class="fas fa-eye"></i> View'
                : (progressPercent > 0 ? '<i class="fas fa-play"></i> Continue' : '<i class="fas fa-book-open"></i> Read');

            return `
                <article class="story-card story-book-card" data-story="${story.id}" data-category="${story.category}">
                    <div class="story-book-cover" style="background:${bg}">
                        ${cover
                            ? `<img src="${cover}" alt="${story.title}" loading="lazy">`
                            : `<i class="fas ${story.icon || 'fa-book'} story-cover-icon"></i>`}
                        <span class="story-book-badge">${badge}</span>
                    </div>
                    <div class="story-book-body">
                        <h3 class="story-book-title">${story.title}</h3>
                        <p class="story-book-author">${author}</p>
                        <div class="story-book-meta">
                            <span class="story-book-stars">${starHtml}</span>
                            <span class="story-book-price">${story.type === 'pdf' ? (story.pages || 'PDF') : (story.duration || 10) + ' min'}</span>
                        </div>
                        <p class="story-book-desc">${story.description}</p>
                        <div class="story-book-tags">
                            ${(story.tags || []).slice(0, 3).map((tag) => `<span class="story-book-tag">${tag}</span>`).join('')}
                        </div>
                        <div class="story-book-actions">
                            <button type="button" class="story-book-btn primary" onclick="readStory('${story.id}')">${primaryLabel}</button>
                            ${story.type === 'pdf'
                                ? `<button type="button" class="story-book-btn secondary" onclick="downloadStoryPdf('${story.id}')"><i class="fas fa-download"></i></button>`
                                : (progressPercent > 0
                                    ? `<button type="button" class="story-book-btn secondary" onclick="reviewStory('${story.id}')"><i class="fas fa-redo"></i></button>`
                                    : '')}
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    }

    getStoriesData() {
        const courseStories = {
            'ngabe': [
                {
                    id: 'river-of-life',
                    title: 'The River of Life',
                    description: 'A sacred story about the origins of the Ngäbe people and their connection to the mountain rivers.',
                    icon: 'fa-water',
                    difficulty: 2,
                    duration: 15,
                    tags: ['Origin', 'Sacred', 'Nature'],
                    category: 'legends'
                },
                {
                    id: 'wise-grandmother',
                    title: 'The Wise Grandmother',
                    description: 'Traditional teachings about respect for elders and the wisdom they carry.',
                    icon: 'fa-female',
                    difficulty: 1,
                    duration: 10,
                    tags: ['Family', 'Wisdom', 'Tradition'],
                    category: 'wisdom'
                },
                {
                    id: 'mountain-spirits',
                    title: 'Mountain Spirits',
                    description: 'Learn about the spiritual guardians of the Ngäbe territory.',
                    icon: 'fa-mountain',
                    difficulty: 3,
                    duration: 20,
                    tags: ['Spiritual', 'Mountains', 'Guardians'],
                    category: 'legends'
                },
                {
                    id: 'corn-ceremony',
                    title: 'The Sacred Corn Ceremony',
                    description: 'Understanding the importance of corn in Ngäbe culture and rituals.',
                    icon: 'fa-seedling',
                    difficulty: 2,
                    duration: 12,
                    tags: ['Ceremony', 'Agriculture', 'Sacred'],
                    category: 'nature'
                }
            ],
            'guna': [
                {
                    id: 'pdf-diccionario-escolar',
                    title: 'School Dictionary (Gunagaya–Spanish)',
                    source: 'gayamar sabga — Reuter Orán & Aiban Wagua',
                    description: 'Official Guna-Yala bilingual school dictionary from the Intercultural Bilingual Education (EBI) project. 224 pages of Gunagaya vocabulary with Spanish definitions.',
                    type: 'pdf',
                    pdfFile: 'resources/guna/diccionario-gunagaya-espanol.pdf',
                    downloadName: 'diccionario-gunagaya-espanol.pdf',
                    molaImage: '../Multimedia/Images/Molas - Guna/Mola 1.jpg',
                    pages: '224 pages',
                    icon: 'fa-book',
                    difficulty: 3,
                    duration: 60,
                    tags: ['Dictionary', 'Gunagaya', 'School', 'Reference'],
                    category: 'documents'
                },
                {
                    id: 'pdf-cultura-completa',
                    title: 'Complete Guna Culture Guide',
                    source: 'Cultura Guna Completa — History, molas, food & language',
                    description: 'Comprehensive guide covering Guna history, the 1925 Tule Revolution, molas, traditional food, social organization, spiritual beliefs and a trilingual vocabulary section.',
                    type: 'pdf',
                    pdfFile: 'resources/guna/cultura-guna-completa.pdf',
                    downloadName: 'cultura-guna-completa.pdf',
                    molaImage: '../Multimedia/Images/Molas - Guna/Mola 4.jpg',
                    pages: 'Study guide',
                    icon: 'fa-landmark',
                    difficulty: 1,
                    duration: 25,
                    tags: ['Culture', 'History', 'Molas', 'Trilingual'],
                    category: 'documents'
                },
                {
                    id: 'pdf-diccionario-trilingue',
                    title: 'Trilingual Dictionary (Guna–Spanish–English)',
                    source: 'Diccionario Guna Español Inglés — Study edition',
                    description: 'Organized trilingual vocabulary for study and presentation. Includes objects, family, animals, plants, pronouns and everyday phrases.',
                    type: 'pdf',
                    pdfFile: 'resources/guna/diccionario-guna-espanol-ingles.pdf',
                    downloadName: 'diccionario-guna-espanol-ingles.pdf',
                    molaImage: '../Multimedia/Images/Molas - Guna/Mola 3.jpg',
                    pages: 'Quick reference',
                    icon: 'fa-language',
                    difficulty: 1,
                    duration: 15,
                    tags: ['Dictionary', 'Trilingual', 'Study', 'Vocabulary'],
                    category: 'documents'
                },
                {
                    id: 'golden-islands',
                    title: 'The Golden Islands',
                    description: 'The creation story of the San Blas Islands and the Guna people.',
                    icon: 'fa-island-tropical',
                    difficulty: 2,
                    duration: 18,
                    tags: ['Creation', 'Islands', 'Ocean'],
                    category: 'legends',
                    molaImage: '../Multimedia/Images/Molas - Guna/Mola 2.jpg',
                    content: `
                        <h2>The Golden Islands</h2>
                        <p>Long before the islands were called San Blas, the Guna people told of a time when the Caribbean was a living mirror of the sky. Ibeorgun shaped pathways of coral and sand so that families could live close to the sea and still hear the voice of Nabgwana, Mother Earth.</p>
                        <h3>Why the islands matter</h3>
                        <p>Each inhabited island became a classroom of balance: fishing without greed, sharing coconut and cassava, and gathering in the congress house to decide together.</p>
                        <h3>Language note</h3>
                        <p>Words like <strong>Yar</strong> (sea) and <strong>Guna Yala</strong> remind learners that territory and speech travel together.</p>
                    `
                },
                {
                    id: 'mola-patterns',
                    title: 'Sacred Mola Patterns',
                    description: 'The spiritual significance behind traditional Guna textile designs.',
                    icon: 'fa-palette',
                    difficulty: 1,
                    duration: 8,
                    tags: ['Art', 'Textiles', 'Symbols'],
                    category: 'wisdom',
                    molaImage: '../Multimedia/Images/Molas - Guna/Mola 5.jpg',
                    content: `
                        <h2>Sacred Mola Patterns</h2>
                        <p>A mola is never only decoration. Layers of cloth hide and reveal colors the way stories hide and reveal meaning.</p>
                        <h3>Made by hand, kept by community</h3>
                        <p>Women stitch identity into everyday dress. Saying <strong>Mola</strong> names a living archive of Guna creativity.</p>
                    `
                },
                {
                    id: 'sea-turtle',
                    title: 'The Great Sea Turtle',
                    description: 'A legend about the turtle that carries the islands on its shell.',
                    icon: 'fa-turtle',
                    difficulty: 2,
                    duration: 14,
                    tags: ['Legend', 'Sea', 'Protection'],
                    category: 'legends',
                    content: `
                        <h2>The Great Sea Turtle</h2>
                        <p>Some elders say a great turtle, <strong>Ardi</strong>, carries the memory of the islands on its shell. When storms rise, the turtle teaches patience: move with the tide, protect the nest, return home.</p>
                        <p>For SOGED learners, the turtle is also a reminder that language grows slowly — one careful word at a time.</p>
                    `
                },
                {
                    id: 'coconut-wisdom',
                    title: 'Wisdom of the Coconut',
                    description: 'How the coconut palm teaches us about resilience and giving.',
                    icon: 'fa-tree',
                    difficulty: 1,
                    duration: 10,
                    tags: ['Nature', 'Wisdom', 'Trees'],
                    category: 'nature'
                }
            ],
            'embera': [
                {
                    id: 'jaguar-spirit',
                    title: 'The Jaguar Spirit',
                    description: 'Ancient story of the jaguar as protector and guide of the Emberá people.',
                    icon: 'fa-cat',
                    difficulty: 3,
                    duration: 22,
                    tags: ['Spiritual', 'Animals', 'Protection'],
                    category: 'legends'
                },
                {
                    id: 'basket-weaving',
                    title: 'The Art of Basket Weaving',
                    description: 'Traditional techniques and the cultural significance of Emberá baskets.',
                    icon: 'fa-shopping-basket',
                    difficulty: 2,
                    duration: 16,
                    tags: ['Crafts', 'Tradition', 'Art'],
                    category: 'wisdom'
                },
                {
                    id: 'rainforest-medicine',
                    title: 'Rainforest Medicine',
                    description: 'Ancient healing practices using plants from the Amazon rainforest.',
                    icon: 'fa-leaf',
                    difficulty: 3,
                    duration: 25,
                    tags: ['Healing', 'Plants', 'Medicine'],
                    category: 'nature'
                },
                {
                    id: 'river-children',
                    title: 'Children of the River',
                    description: 'How Emberá families teach children to respect and live with nature.',
                    icon: 'fa-child',
                    difficulty: 1,
                    duration: 12,
                    tags: ['Family', 'Nature', 'Teaching'],
                    category: 'family'
                }
            ],
            'naso': [
                {
                    id: 'royal-crown',
                    title: 'The Royal Crown',
                    description: 'The story of the Naso kingdom and the significance of their royal traditions.',
                    icon: 'fa-crown',
                    difficulty: 2,
                    duration: 20,
                    tags: ['Royalty', 'Tradition', 'Kingdom'],
                    category: 'legends'
                },
                {
                    id: 'butterfly-messenger',
                    title: 'The Butterfly Messenger',
                    description: 'A beautiful tale about butterflies carrying messages between worlds.',
                    icon: 'fa-butterfly',
                    difficulty: 1,
                    duration: 14,
                    tags: ['Nature', 'Spiritual', 'Messages'],
                    category: 'legends'
                },
                {
                    id: 'forest-council',
                    title: 'The Forest Council',
                    description: 'Traditional governance and decision-making in Naso communities.',
                    icon: 'fa-users',
                    difficulty: 2,
                    duration: 18,
                    tags: ['Governance', 'Community', 'Tradition'],
                    category: 'wisdom'
                },
                {
                    id: 'sacred-cecropia',
                    title: 'The Sacred Cecropia Tree',
                    description: 'The spiritual importance of the Cecropia tree in Naso culture.',
                    icon: 'fa-tree',
                    difficulty: 2,
                    duration: 16,
                    tags: ['Sacred', 'Trees', 'Spiritual'],
                    category: 'nature'
                }
            ]
        };

        return courseStories[this.currentCourse] || courseStories['ngabe'];
    }

    generateDifficultyDots(difficulty) {
        const dots = [];
        for (let i = 1; i <= 3; i++) {
            dots.push(`<div class="difficulty-dot ${i <= difficulty ? 'active' : ''}"></div>`);
        }
        return dots.join('');
    }

    initializeEventListeners() {
        // Category filters
        this.querySelectorAll('.category-filter').forEach(filter => {
            filter.addEventListener('click', (e) => {
                this.filterStories(e.currentTarget.getAttribute('data-category'));
            });
        });

        // Story cards
        this.querySelectorAll('.story-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.story-button')) {
                    const storyId = card.getAttribute('data-story');
                    this.selectStory(storyId);
                }
            });
        });
    }

    filterStories(category) {
        // Update active filter
        this.querySelectorAll('.category-filter').forEach(filter => {
            filter.classList.remove('active');
        });
        this.querySelector(`[data-category="${category}"]`).classList.add('active');

        // Filter story cards
        this.querySelectorAll('.story-card').forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const sectionTitle = card.classList.contains('documents-section-title');
            if (sectionTitle) return;

            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        this.querySelectorAll('.documents-section-title').forEach(title => {
            if (category === 'all' || category === 'documents') {
                title.style.display = category === 'documents' || category === 'all' ? 'flex' : 'none';
            } else {
                title.style.display = title.textContent.includes('Reference') ? 'none' : 'flex';
            }
        });
    }

    selectStory(storyId) {
        this.selectedStory = storyId;
        this.dispatchEvent(new CustomEvent('storySelected', {
            detail: { storyId, course: this.currentCourse },
            bubbles: true
        }));
    }

    getStoryById(storyId) {
        return this.getStoriesData().find(s => s.id === storyId);
    }

    openStory(storyId) {
        const story = this.getStoryById(storyId);
        if (!story) return;

        if (story.type === 'pdf') {
            this.openPdfViewer(story);
            this.saveStoryProgress(storyId, 100);
            return;
        }

        this.selectStory(storyId);
        this.openStoryReader(story);
        this.saveStoryProgress(storyId, Math.max(this.readingProgress[storyId] || 0, 40));
    }

    getStoryBody(story) {
        if (story.content) return story.content;
        return `
            <h2>${story.title}</h2>
            <p>${story.description || ''}</p>
            <p>This story is part of the ${this.getCourseName()} cultural library. Elders teach that listening carefully keeps language and memory alive.</p>
            <h3>What to notice</h3>
            <ul>
                ${(story.tags || []).map((t) => `<li>${t}</li>`).join('') || '<li>Community values</li><li>Connection to territory</li>'}
            </ul>
            <p><em>Tip: After reading, revisit Vocabulary and Games to practice related words.</em></p>
        `;
    }

    openStoryReader(story) {
        let overlay = document.getElementById('storyReaderOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'storyReaderOverlay';
            overlay.className = 'pdf-viewer-overlay story-reader-overlay';
            overlay.innerHTML = `
                <div class="pdf-viewer-modal story-reader-modal" role="dialog" aria-modal="true" aria-label="Story reader">
                    <div class="pdf-viewer-header">
                        <div>
                            <div class="pdf-viewer-title" id="storyReaderTitle"></div>
                            <small id="storyReaderMeta" style="opacity:0.85"></small>
                        </div>
                        <div class="pdf-viewer-actions">
                            <button class="pdf-viewer-btn close" id="storyReaderClose" type="button">
                                <i class="fas fa-times"></i> Close
                            </button>
                        </div>
                    </div>
                    <div class="pdf-viewer-body story-reader-body">
                        <article class="story-reader-article" id="storyReaderArticle"></article>
                        <div class="story-reader-actions">
                            <button type="button" class="hub-btn hub-btn-primary" id="storyReaderDone">
                                <i class="fas fa-check"></i> Mark as read
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) this.closeStoryReader();
            });
            document.getElementById('storyReaderClose').addEventListener('click', () => this.closeStoryReader());
            document.getElementById('storyReaderDone').addEventListener('click', () => {
                if (this.selectedStory) this.saveStoryProgress(this.selectedStory, 100);
                if (typeof showNotification === 'function') {
                    showNotification('Story marked as read. Nice work!', 'success');
                }
                this.closeStoryReader();
                this.render();
                this.initializeEventListeners();
            });
        }

        document.getElementById('storyReaderTitle').textContent = story.title;
        document.getElementById('storyReaderMeta').textContent =
            `${story.source || this.getCourseName()} · ${story.duration || 10} min · ${story.category || 'story'}`;
        document.getElementById('storyReaderArticle').innerHTML = this.getStoryBody(story);
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeStoryReader() {
        const overlay = document.getElementById('storyReaderOverlay');
        if (overlay) {
            overlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    openPdfViewer(story) {
        let overlay = document.getElementById('pdfViewerOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'pdfViewerOverlay';
            overlay.className = 'pdf-viewer-overlay';
            overlay.innerHTML = `
                <div class="pdf-viewer-modal" role="dialog" aria-modal="true" aria-label="PDF Viewer">
                    <div class="pdf-viewer-header">
                        <div>
                            <div class="pdf-viewer-title" id="pdfViewerTitle"></div>
                            <small id="pdfViewerSource" style="opacity:0.85"></small>
                        </div>
                        <div class="pdf-viewer-actions">
                            <a class="pdf-viewer-btn download" id="pdfViewerDownload" download>
                                <i class="fas fa-download"></i> Download
                            </a>
                            <button class="pdf-viewer-btn close" id="pdfViewerClose">
                                <i class="fas fa-times"></i> Close
                            </button>
                        </div>
                    </div>
                    <div class="pdf-viewer-body">
                        <iframe id="pdfViewerFrame" title="PDF document viewer"></iframe>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) this.closePdfViewer();
            });
            document.getElementById('pdfViewerClose').addEventListener('click', () => this.closePdfViewer());
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.closePdfViewer();
            });
        }

        const pdfUrl = story.pdfFile;
        document.getElementById('pdfViewerTitle').textContent = story.title;
        document.getElementById('pdfViewerSource').textContent = story.source || '';
        document.getElementById('pdfViewerFrame').src = pdfUrl;
        const dl = document.getElementById('pdfViewerDownload');
        dl.href = pdfUrl;
        dl.download = story.downloadName || 'document.pdf';
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        localStorage.setItem('guna_story_read', '1');
    }

    closePdfViewer() {
        const overlay = document.getElementById('pdfViewerOverlay');
        if (overlay) {
            overlay.classList.remove('show');
            const frame = document.getElementById('pdfViewerFrame');
            if (frame) frame.src = '';
            document.body.style.overflow = '';
        }
    }

    downloadPdf(storyId) {
        const story = this.getStoryById(storyId);
        if (!story || story.type !== 'pdf') return;
        const link = document.createElement('a');
        link.href = story.pdfFile;
        link.download = story.downloadName || 'document.pdf';
        link.click();
        this.saveStoryProgress(storyId, 100);
    }

    loadStoryProgress() {
        this.readingProgress = JSON.parse(localStorage.getItem(`stories_${this.currentCourse}`) || '{}');
    }

    saveStoryProgress(storyId, progress) {
        this.readingProgress[storyId] = progress;
        localStorage.setItem(`stories_${this.currentCourse}`, JSON.stringify(this.readingProgress));
    }
}

// Register the custom element
customElements.define('stories-section', StoriesSection);

// Global functions for story interaction
window.readStory = function(storyId) {
    const section = document.querySelector('stories-section');
    if (section) {
        section.openStory(storyId);
    }
};

window.downloadStoryPdf = function(storyId) {
    const section = document.querySelector('stories-section');
    if (section) {
        section.downloadPdf(storyId);
    }
};

window.reviewStory = function(storyId) {
    window.readStory(storyId);
};
