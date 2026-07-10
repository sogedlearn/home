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
            <style>
                /* Stories Section Styles */
                .stories-section {
                    padding: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .stories-header {
                    text-align: center;
                    margin-bottom: 3rem;
                    background: linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%);
                    color: white;
                    padding: 3rem 2rem;
                    border-radius: var(--border-radius-xl);
                    position: relative;
                    overflow: hidden;
                }

                .stories-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="stars" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="0.5" fill="rgba(255,255,255,0.3)"/></pattern></defs><rect width="100" height="100" fill="url(%23stars)"/></svg>');
                    opacity: 0.4;
                }

                .section-title {
                    font-size: 2.8rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                    position: relative;
                    z-index: 1;
                }

                .section-subtitle {
                    font-size: 1.3rem;
                    opacity: 0.9;
                    position: relative;
                    z-index: 1;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .cultural-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(255, 255, 255, 0.2);
                    padding: 0.75rem 1.5rem;
                    border-radius: var(--border-radius-lg);
                    margin-top: 1.5rem;
                    backdrop-filter: blur(10px);
                    position: relative;
                    z-index: 1;
                    font-weight: 600;
                }

                .stories-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 2rem;
                    margin-bottom: 3rem;
                }

                .story-card {
                    background: var(--bg-secondary);
                    border-radius: var(--border-radius-lg);
                    overflow: hidden;
                    box-shadow: var(--shadow-md);
                    transition: all var(--transition-fast);
                    cursor: pointer;
                    position: relative;
                    border: 2px solid transparent;
                }

                .story-card:hover {
                    transform: translateY(-8px);
                    box-shadow: var(--shadow-xl);
                    border-color: var(--primary-color);
                }

                .story-image {
                    width: 100%;
                    height: 200px;
                    background: linear-gradient(135deg, var(--gradient-primary));
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                    color: white;
                    overflow: hidden;
                }

                .story-image::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: radial-gradient(circle at center, rgba(255,255,255,0.1) 20%, transparent 70%);
                }

                .story-content {
                    padding: 2rem;
                }

                .story-title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                    color: var(--text-primary);
                    line-height: 1.3;
                }

                .story-description {
                    color: var(--text-secondary);
                    margin-bottom: 1.5rem;
                    line-height: 1.6;
                }

                .story-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    padding: 1rem;
                    background: var(--bg-tertiary);
                    border-radius: var(--border-radius);
                }

                .story-difficulty {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .difficulty-dots {
                    display: flex;
                    gap: 0.25rem;
                }

                .difficulty-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--text-light);
                }

                .difficulty-dot.active {
                    background: var(--primary-color);
                }

                .story-duration {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                }

                .story-progress {
                    width: 100%;
                    height: 4px;
                    background: var(--bg-primary);
                    border-radius: 2px;
                    margin-bottom: 1rem;
                    overflow: hidden;
                }

                .story-progress-bar {
                    height: 100%;
                    background: var(--gradient-primary);
                    border-radius: 2px;
                    transition: width var(--transition-slow);
                }

                .story-actions {
                    display: flex;
                    gap: 1rem;
                }

                .story-button {
                    flex: 1;
                    padding: 1rem;
                    border: none;
                    border-radius: var(--border-radius);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }

                .btn-primary {
                    background: var(--gradient-primary);
                    color: white;
                }

                .btn-secondary {
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    border: 1px solid var(--text-light);
                }

                .story-button:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-sm);
                }

                .story-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-top: 1rem;
                }

                .story-tag {
                    padding: 0.25rem 0.75rem;
                    background: var(--gradient-secondary);
                    color: white;
                    border-radius: var(--border-radius);
                    font-size: 0.8rem;
                    font-weight: 500;
                }

                .featured-story {
                    grid-column: 1 / -1;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.1));
                    border: 2px solid rgba(245, 158, 11, 0.2);
                }

                .featured-story .story-image {
                    height: 300px;
                    background: linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%);
                }

                .reading-stats {
                    background: var(--bg-secondary);
                    border-radius: var(--border-radius-lg);
                    padding: 2rem;
                    box-shadow: var(--shadow-md);
                    margin-bottom: 2rem;
                }

                .stats-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 2rem;
                }

                .stats-title {
                    font-size: 1.8rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                }

                .stat-item {
                    text-align: center;
                    padding: 1.5rem;
                    background: var(--bg-tertiary);
                    border-radius: var(--border-radius);
                    transition: all var(--transition-fast);
                }

                .stat-item:hover {
                    background: var(--bg-primary);
                    transform: translateY(-4px);
                }

                .stat-number {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: var(--primary-color);
                    display: block;
                    margin-bottom: 0.5rem;
                }

                .stat-label {
                    color: var(--text-secondary);
                    font-weight: 500;
                }

                .story-categories {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                }

                .category-filter {
                    padding: 0.75rem 1.5rem;
                    border: 2px solid var(--text-light);
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    border-radius: var(--border-radius-lg);
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .category-filter:hover {
                    border-color: var(--primary-color);
                    background: var(--primary-color);
                    color: white;
                }

                    .category-filter.active {
                        background: var(--gradient-primary);
                        border-color: var(--primary-color);
                        color: white;
                    }

                .story-card.pdf-resource .story-image {
                    background: none;
                }

                .story-image-mola {
                    position: relative;
                    padding: 0 !important;
                }

                .story-image-mola img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }

                .story-image-mola::before {
                    display: none;
                }

                .story-pdf-label {
                    position: absolute;
                    bottom: 0.75rem;
                    right: 0.75rem;
                    background: rgba(0, 0, 0, 0.65);
                    color: white;
                    padding: 0.35rem 0.65rem;
                    border-radius: 8px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.35rem;
                }

                .story-card.pdf-resource {
                    border: 2px solid rgba(40, 167, 69, 0.15);
                }

                .story-card.pdf-resource:hover {
                    border-color: var(--primary-color);
                }

                .story-badge {
                    display: inline-block;
                    padding: 0.25rem 0.65rem;
                    border-radius: 20px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.4px;
                    margin-bottom: 0.75rem;
                }

                .story-badge.pdf { background: rgba(231, 76, 60, 0.12); color: #C0392B; }
                .story-badge.reference { background: rgba(0, 163, 224, 0.12); color: #0077A3; }
                .story-badge.culture { background: rgba(40, 167, 69, 0.12); color: #218838; }

                .story-source {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    margin-bottom: 1rem;
                    font-style: italic;
                }

                .pdf-actions {
                    display: flex;
                    gap: 0.75rem;
                    flex-wrap: wrap;
                }

                .pdf-actions .story-button {
                    flex: 1;
                    min-width: 120px;
                }

                /* PDF Viewer Modal */
                .pdf-viewer-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.75);
                    z-index: 10050;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }

                .pdf-viewer-overlay.show {
                    opacity: 1;
                    visibility: visible;
                }

                .pdf-viewer-modal {
                    background: white;
                    border-radius: 16px;
                    width: min(1100px, 100%);
                    height: min(90vh, 900px);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    box-shadow: 0 24px 64px rgba(0,0,0,0.35);
                }

                .pdf-viewer-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    padding: 1rem 1.5rem;
                    background: var(--gradient-primary);
                    color: white;
                    flex-shrink: 0;
                }

                .pdf-viewer-title {
                    font-size: 1.1rem;
                    font-weight: 600;
                }

                .pdf-viewer-actions {
                    display: flex;
                    gap: 0.5rem;
                }

                .pdf-viewer-btn {
                    padding: 0.5rem 1rem;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-family: inherit;
                    font-weight: 600;
                    font-size: 0.85rem;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    transition: all 0.2s ease;
                }

                .pdf-viewer-btn.download {
                    background: rgba(255,255,255,0.2);
                    color: white;
                }

                .pdf-viewer-btn.close {
                    background: white;
                    color: var(--text-primary);
                }

                .pdf-viewer-body {
                    flex: 1;
                    background: #525659;
                }

                .pdf-viewer-body iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                }

                .documents-section-title {
                    grid-column: 1 / -1;
                    font-size: 1.35rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin: 0.5rem 0 0;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .stories-section {
                        padding: 1rem;
                    }

                    .section-title {
                        font-size: 2.2rem;
                    }

                    .stories-grid {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }

                    .featured-story {
                        grid-template-columns: 1fr;
                    }

                    .story-content {
                        padding: 1.5rem;
                    }

                    .story-actions {
                        flex-direction: column;
                    }

                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1rem;
                    }

                    .story-categories {
                        gap: 0.5rem;
                    }

                    .category-filter {
                        padding: 0.5rem 1rem;
                        font-size: 0.9rem;
                    }
                }
            </style>

            <div class="stories-section">
                <div class="stories-header" data-aos="fade-up">
                    <h2 class="section-title">📖 Cultural Stories</h2>
                    <p class="section-subtitle">Immerse yourself in the rich traditions and wisdom of ${this.getCourseName()} culture through interactive storytelling</p>
                    
                    <div class="cultural-badge">
                        <i class="fas fa-mountain"></i>
                        <span>Authentic ${this.getCourseName()} Heritage</span>
                    </div>
                </div>

                <div class="story-categories" data-aos="fade-up" data-aos-delay="100">
                    <button class="category-filter active" data-category="all">
                        <i class="fas fa-globe"></i>
                        All Stories
                    </button>
                    <button class="category-filter" data-category="documents">
                        <i class="fas fa-file-pdf"></i>
                        Documents
                    </button>
                    <button class="category-filter" data-category="legends">
                        <i class="fas fa-dragon"></i>
                        Legends
                    </button>
                    <button class="category-filter" data-category="wisdom">
                        <i class="fas fa-lightbulb"></i>
                        Wisdom
                    </button>
                    <button class="category-filter" data-category="nature">
                        <i class="fas fa-leaf"></i>
                        Nature
                    </button>
                    <button class="category-filter" data-category="family">
                        <i class="fas fa-heart"></i>
                        Family
                    </button>
                </div>

                <div class="reading-stats" data-aos="fade-up" data-aos-delay="150">
                    <div class="stats-header">
                        <h3 class="stats-title">
                            <i class="fas fa-chart-line"></i>
                            Your Reading Journey
                        </h3>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-number">7</span>
                            <span class="stat-label">Stories Completed</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">45</span>
                            <span class="stat-label">Minutes Reading</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">156</span>
                            <span class="stat-label">New Words Learned</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">89%</span>
                            <span class="stat-label">Comprehension Rate</span>
                        </div>
                    </div>
                </div>

                <div class="stories-grid" data-aos="fade-up" data-aos-delay="200">
                    ${this.generateStoriesForCourse()}
                </div>
            </div>
        `;
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

    generateStoriesForCourse() {
        const stories = this.getStoriesData();
        const pdfs = stories.filter(s => s.type === 'pdf');
        const regular = stories.filter(s => s.type !== 'pdf');

        const renderCard = (story, index) => {
            const isFeatured = index === 0 && story.type !== 'pdf';
            const progressPercent = this.readingProgress[story.id] || 0;

            if (story.type === 'pdf') {
                return `
                    <div class="story-card pdf-resource" data-story="${story.id}" data-category="${story.category}">
                        <div class="story-image story-image-mola">
                            <img src="${story.molaImage}" alt="${story.title}" loading="lazy">
                            <span class="story-pdf-label"><i class="fas fa-file-pdf"></i> PDF</span>
                        </div>
                        <div class="story-content">
                            <span class="story-badge pdf">📄 PDF Document</span>
                            <h3 class="story-title">${story.title}</h3>
                            <p class="story-source">${story.source}</p>
                            <p class="story-description">${story.description}</p>
                            <div class="story-meta">
                                <div class="story-duration">
                                    <i class="fas fa-file-alt"></i>
                                    <span>${story.pages || 'Reference'}</span>
                                </div>
                            </div>
                            <div class="pdf-actions">
                                <button class="story-button btn-primary" onclick="readStory('${story.id}')">
                                    <i class="fas fa-eye"></i> View PDF
                                </button>
                                <button class="story-button btn-secondary" onclick="downloadStoryPdf('${story.id}')">
                                    <i class="fas fa-download"></i> Download
                                </button>
                            </div>
                            <div class="story-tags">
                                ${story.tags.map(tag => `<span class="story-tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                `;
            }

            return `
                <div class="story-card ${isFeatured ? 'featured-story' : ''}" data-story="${story.id}" data-category="${story.category}">
                    <div class="story-image">
                        <i class="fas ${story.icon}"></i>
                    </div>
                    <div class="story-content">
                        <h3 class="story-title">${story.title}</h3>
                        <p class="story-description">${story.description}</p>
                        <div class="story-meta">
                            <div class="story-difficulty">
                                <span>Difficulty:</span>
                                <div class="difficulty-dots">
                                    ${this.generateDifficultyDots(story.difficulty)}
                                </div>
                            </div>
                            <div class="story-duration">
                                <i class="fas fa-clock"></i>
                                <span>${story.duration} min</span>
                            </div>
                        </div>
                        <div class="story-progress">
                            <div class="story-progress-bar" style="width: ${progressPercent}%"></div>
                        </div>
                        <div class="story-actions">
                            <button class="story-button btn-primary" onclick="readStory('${story.id}')">
                                <i class="fas ${progressPercent > 0 ? 'fa-play' : 'fa-book-open'}"></i>
                                ${progressPercent > 0 ? 'Continue' : 'Start Reading'}
                            </button>
                            ${progressPercent > 0 ? `
                                <button class="story-button btn-secondary" onclick="reviewStory('${story.id}')">
                                    <i class="fas fa-redo"></i> Review
                                </button>
                            ` : ''}
                        </div>
                        <div class="story-tags">
                            ${story.tags.map(tag => `<span class="story-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        };

        let html = '';
        if (pdfs.length > 0) {
            html += `<h3 class="documents-section-title"><i class="fas fa-folder-open"></i> Guna Reference Documents</h3>`;
            html += pdfs.map((s, i) => renderCard(s, i)).join('');
            html += `<h3 class="documents-section-title" style="margin-top: 2rem;"><i class="fas fa-book-open"></i> Cultural Stories</h3>`;
        }
        html += regular.map((s, i) => renderCard(s, i)).join('');
        return html;
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
                    molaImage: '../Images/Molas - Guna/Mola 1.jpg',
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
                    molaImage: '../Images/Molas - Guna/Mola 4.jpg',
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
                    molaImage: '../Images/Molas - Guna/Mola 3.jpg',
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
                    category: 'legends'
                },
                {
                    id: 'mola-patterns',
                    title: 'Sacred Mola Patterns',
                    description: 'The spiritual significance behind traditional Guna textile designs.',
                    icon: 'fa-palette',
                    difficulty: 1,
                    duration: 8,
                    tags: ['Art', 'Textiles', 'Symbols'],
                    category: 'wisdom'
                },
                {
                    id: 'sea-turtle',
                    title: 'The Great Sea Turtle',
                    description: 'A legend about the turtle that carries the islands on its shell.',
                    icon: 'fa-turtle',
                    difficulty: 2,
                    duration: 14,
                    tags: ['Legend', 'Sea', 'Protection'],
                    category: 'legends'
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
        if (typeof showNotification === 'function') {
            showNotification(`Opening story: ${story.title}`, 'info');
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
