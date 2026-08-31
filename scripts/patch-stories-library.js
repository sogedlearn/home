const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'courses', 'components', 'stories-section.js');
let src = fs.readFileSync(file, 'utf8');

const renderStart = src.indexOf('    render() {');
const renderEnd = src.indexOf('    getCourseName()');
if (renderStart < 0 || renderEnd < 0) {
    throw new Error('Could not find render()/getCourseName() markers');
}

const newRender = `    render() {
        this.innerHTML = \`
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
                    \${this.generateStoriesForCourse()}
                </div>

                <div class="stories-shelf-strip" data-aos="fade-up">
                    <div class="stories-shelf-books">
                        \${this.generateShelfStrip()}
                    </div>
                </div>
            </div>
        \`;

        this.querySelector('#storiesBrowseBtn')?.addEventListener('click', () => {
            this.querySelector('.stories-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

`;

src = src.slice(0, renderStart) + newRender + src.slice(renderEnd);

const genStart = src.indexOf('    generateStoriesForCourse() {');
const genEnd = src.indexOf('    getStoriesData() {');
if (genStart < 0 || genEnd < 0) {
    throw new Error('Could not find generateStoriesForCourse()/getStoriesData() markers');
}

const newGen = `    generateShelfStrip() {
        return this.getStoriesData().slice(0, 8).map((story) => {
            const cover = story.molaImage || story.cover || '';
            return \`
                <button type="button" class="stories-shelf-book" onclick="readStory('\${story.id}')" aria-label="\${story.title}">
                    \${cover
                        ? \`<img src="\${cover}" alt="" loading="lazy">\`
                        : \`<span><i class="fas \${story.icon || 'fa-book'}"></i></span>\`}
                </button>
            \`;
        }).join('');
    }

    generateStoriesForCourse() {
        const stories = this.getStoriesData();
        const coverPalette = ['#11802b', '#0973a1', '#c00000', '#e3a008', '#0c5c1f', '#075a7e'];

        return stories.map((story, index) => {
            const progressPercent = this.readingProgress[story.id] || 0;
            const cover = story.molaImage || story.cover || '';
            const author = story.source || \`SOGED · \${this.getCourseName()}\`;
            const badge = story.type === 'pdf' ? 'PDF' : (progressPercent > 0 ? 'Reading' : 'Story');
            const stars = Math.max(1, Math.min(5, story.difficulty || 3));
            const starHtml = '★'.repeat(stars) + '☆'.repeat(5 - stars);
            const bg = coverPalette[index % coverPalette.length];
            const primaryLabel = story.type === 'pdf'
                ? '<i class="fas fa-eye"></i> View'
                : (progressPercent > 0 ? '<i class="fas fa-play"></i> Continue' : '<i class="fas fa-book-open"></i> Read');

            return \`
                <article class="story-card story-book-card" data-story="\${story.id}" data-category="\${story.category}">
                    <div class="story-book-cover" style="background:\${bg}">
                        \${cover
                            ? \`<img src="\${cover}" alt="\${story.title}" loading="lazy">\`
                            : \`<i class="fas \${story.icon || 'fa-book'} story-cover-icon"></i>\`}
                        <span class="story-book-badge">\${badge}</span>
                    </div>
                    <div class="story-book-body">
                        <h3 class="story-book-title">\${story.title}</h3>
                        <p class="story-book-author">\${author}</p>
                        <div class="story-book-meta">
                            <span class="story-book-stars">\${starHtml}</span>
                            <span class="story-book-price">\${story.type === 'pdf' ? (story.pages || 'PDF') : (story.duration || 10) + ' min'}</span>
                        </div>
                        <p class="story-book-desc">\${story.description}</p>
                        <div class="story-book-tags">
                            \${(story.tags || []).slice(0, 3).map((tag) => \`<span class="story-book-tag">\${tag}</span>\`).join('')}
                        </div>
                        <div class="story-book-actions">
                            <button type="button" class="story-book-btn primary" onclick="readStory('\${story.id}')">\${primaryLabel}</button>
                            \${story.type === 'pdf'
                                ? \`<button type="button" class="story-book-btn secondary" onclick="downloadStoryPdf('\${story.id}')"><i class="fas fa-download"></i></button>\`
                                : (progressPercent > 0
                                    ? \`<button type="button" class="story-book-btn secondary" onclick="reviewStory('\${story.id}')"><i class="fas fa-redo"></i></button>\`
                                    : '')}
                        </div>
                    </div>
                </article>
            \`;
        }).join('');
    }

`;

src = src.slice(0, genStart) + newGen + src.slice(genEnd);

fs.writeFileSync(file, src);
console.log('Patched stories-section.js successfully');
