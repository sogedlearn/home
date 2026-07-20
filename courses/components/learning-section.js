/**
 * Learning Section Web Component
 * Modern component for interactive learning section
 */

class LearningSection extends HTMLElement {
    constructor() {
        super();
        this.currentCourse = this.getAttribute('course') || 'guna';
        this.userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    }

    connectedCallback() {
        this.render();
        this.initializeEventListeners();
        this.loadUserProgress();
        this.setupSidebarListener();
        this.updateProgressIndicator();
    }

    updateProgressIndicator() {
        const lessons = this.getLessonsData();
        const completed = lessons.filter(l => l.status === 'completed').length;
        const total = lessons.length;
        const el = this.querySelector('#progressText');
        if (el) el.textContent = `${completed}/${total} Lessons`;
    }

    setupSidebarListener() {
        // Listen for sidebar state changes
        document.addEventListener('sidebarStateChanged', (e) => {
            const { collapsed, width } = e.detail;
            this.adjustToSidebar(collapsed, width);
        });
    }

    adjustToSidebar(collapsed, width) {
        const section = this.querySelector('.learning-section');
        if (section) {
            // Adjust padding and spacing when sidebar is collapsed
            if (collapsed) {
                section.style.padding = '1.5rem';
                section.style.maxWidth = '100%';
            } else {
                section.style.padding = '2rem';
                section.style.maxWidth = '1200px';
            }
        }
    }

    render() {
        if (this.currentCourse !== 'guna') {
            this.innerHTML = `
                <div class="learning-section learning-section--soon">
                    <div class="learning-header" data-aos="fade-up">
                        <h2 class="section-title">🎯 ${this.getCourseName()} Learning Path</h2>
                        <p class="section-subtitle">This language course is being prepared for you</p>
                    </div>
                    <div class="coming-soon-panel">
                        <span class="coming-soon-badge-lg">Coming Soon</span>
                        <p>We're building interactive lessons for ${this.getCourseName()}. For now, explore the <strong>Guna</strong> learning path with 10 levels of culture and vocabulary.</p>
                        <button class="lesson-btn btn-primary" onclick="window.learningHub && window.learningHub.switchCourse('guna')">
                            <i class="fas fa-play"></i> Go to Guna Path
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        this.innerHTML = `
            <style>
                /* Component-specific styles */
                .learning-section {
                    padding: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .learning-header {
                    text-align: center;
                    margin-bottom: 3rem;
                    background: linear-gradient(135deg, var(--gradient-primary));
                    color: white;
                    padding: 2rem;
                    border-radius: var(--border-radius-xl);
                    position: relative;
                    overflow: hidden;
                }

                .learning-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23pattern)"/></svg>');
                    opacity: 0.3;
                }

                .section-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                    position: relative;
                    z-index: 1;
                    color: #000000;
                }

                .section-subtitle {
                    font-size: 1.2rem;
                    opacity: 0.9;
                    position: relative;
                    z-index: 1;
                }



                .learning-path {
                    position: relative;
                    padding: 2rem 0 3rem;
                    background: var(--bg-secondary);
                    border-radius: var(--border-radius-lg);
                    box-shadow: var(--shadow-md);
                    margin-bottom: 2rem;
                    overflow: visible;
                }

                .path-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0;
                    padding: 1rem 1.5rem 2rem;
                    max-width: 560px;
                    margin: 0 auto;
                    position: relative;
                }

                .path-container::before {
                    content: '';
                    position: absolute;
                    top: 40px;
                    bottom: 40px;
                    left: 50%;
                    width: 4px;
                    transform: translateX(-50%);
                    background: #22c55e;
                    border-radius: 4px;
                    z-index: 0;
                }

                .path-step {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    position: relative;
                    z-index: 1;
                    padding: 0.5rem 0;
                }

                .path-step:nth-child(odd) .lesson-node {
                    margin-right: auto;
                    margin-left: 0;
                    max-width: 92%;
                }

                .path-step:nth-child(even) .lesson-node {
                    margin-left: auto;
                    margin-right: 0;
                    max-width: 92%;
                }

                .path-step-connector {
                    width: 4px;
                    height: 20px;
                    background: var(--primary-color);
                    opacity: 0.3;
                    margin: 0 auto;
                }

                .lesson-node {
                    display: flex;
                    align-items: center;
                    padding: 1.25rem 1.5rem;
                    background: var(--bg-tertiary);
                    border-radius: var(--border-radius-lg);
                    transition: all var(--transition-fast);
                    cursor: pointer;
                    position: relative;
                    overflow: visible;
                    width: 100%;
                    box-shadow: var(--shadow-sm);
                    border: 2px solid transparent;
                }

                .lesson-node::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                    background: var(--text-light);
                    transition: all var(--transition-fast);
                }

                .lesson-node.completed::before {
                    background: var(--gradient-success);
                }

                .lesson-node.current::before {
                    background: var(--gradient-primary);
                }

                .lesson-node.locked::before {
                    background: var(--text-light);
                }

                .lesson-node:hover {
                    transform: translateY(-4px) scale(1.02);
                    box-shadow: var(--shadow-lg);
                    border-color: var(--primary-color);
                }

                .lesson-node.locked {
                    opacity: 0.75;
                }

                .lesson-node.locked:hover {
                    transform: none;
                    border-color: transparent;
                    box-shadow: var(--shadow-sm);
                }

                .lesson-level-num {
                    position: absolute;
                    top: -10px;
                    left: -10px;
                    width: 28px;
                    height: 28px;
                    background: var(--gradient-primary);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    font-weight: 700;
                    box-shadow: var(--shadow-sm);
                    z-index: 2;
                }

                .boss-node .lesson-level-num {
                    background: var(--gradient-accent);
                }

                .lesson-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    margin-right: 1.5rem;
                    flex-shrink: 0;
                }

                .lesson-node.completed .lesson-icon {
                    background: var(--gradient-success);
                    color: white;
                }

                .lesson-node.current .lesson-icon {
                    background: var(--gradient-primary);
                    color: white;
                    animation: pulse 2s infinite;
                }

                .lesson-node.locked .lesson-icon {
                    background: var(--bg-primary);
                    color: var(--text-light);
                }

                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }

                .lesson-info {
                    flex-grow: 1;
                }

                .lesson-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    color: #000000;
                }

                .lesson-description {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    margin-bottom: 0.75rem;
                }

                .lesson-stats {
                    display: flex;
                    gap: 1rem;
                    font-size: 0.85rem;
                }

                .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    color: var(--text-secondary);
                }

                .lesson-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    align-items: flex-end;
                }

                .lesson-btn {
                    padding: 0.5rem 1rem;
                    border: none;
                    border-radius: var(--border-radius);
                    font-weight: 500;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
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

                .btn-disabled {
                    background: var(--bg-primary);
                    color: var(--text-light);
                    cursor: not-allowed;
                }

                .lesson-btn:hover:not(.btn-disabled) {
                    transform: translateY(-1px);
                    box-shadow: var(--shadow-sm);
                }

                .progress-indicator {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: var(--bg-secondary);
                    padding: 0.5rem 1rem;
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow-sm);
                    font-size: 0.9rem;
                    font-weight: 600;
                }

                .boss-node {
                    background: linear-gradient(135deg, var(--gradient-accent));
                    color: white;
                    position: relative;
                }

                .boss-node::before {
                    background: var(--accent-color) !important;
                }

                .boss-badge {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: var(--gradient-accent);
                    color: white;
                    padding: 0.25rem 0.5rem;
                    border-radius: var(--border-radius);
                    font-size: 0.7rem;
                    font-weight: 700;
                    box-shadow: var(--shadow-md);
                }

                .soggy-avatar-dynamic {
                    position: absolute;
                    top: -15px;
                    right: -15px;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 3px solid var(--success-color);
                    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
                    animation: bounce 2s infinite;
                    z-index: 10;
                }

                .soggy-avatar-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }

                .opacity-60 {
                    opacity: 0.6;
                }

                .pointer-events-none {
                    pointer-events: none;
                }

                .module-header {
                    text-align: center;
                    margin: 2rem 0 1.5rem;
                    padding: 1.5rem;
                    background: linear-gradient(135deg, var(--gradient-primary));
                    border-radius: var(--border-radius-lg);
                    color: white;
                    position: relative;
                    overflow: hidden;
                }

                .module-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="module-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="6" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23module-pattern)"/></svg>');
                    opacity: 0.3;
                }

                .module-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin: 0;
                    position: relative;
                    z-index: 1;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
                }

                .module-divider {
                    height: 3px;
                    background: linear-gradient(90deg, transparent, white, transparent);
                    margin-top: 1rem;
                    border-radius: 2px;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .learning-section {
                        padding: 1rem;
                    }

                    .section-title {
                        font-size: 2rem;
                    }



                    .lesson-node {
                        flex-direction: column;
                        text-align: center;
                        padding: 1rem;
                    }

                    .lesson-icon {
                        margin-right: 0;
                        margin-bottom: 1rem;
                    }

                    .lesson-actions {
                        align-items: center;
                        margin-top: 1rem;
                    }
                }
            </style>

            <div class="learning-section">
                <div class="learning-header" data-aos="fade-up">
                    <h2 class="section-title">🎯 Interactive Learning Path</h2>
                    <p class="section-subtitle">Master ${this.getCourseName()} through gamified lessons and cultural immersion</p>
                    

                </div>

                <div class="learning-path" data-aos="fade-up" data-aos-delay="100">
                    <div class="progress-indicator" id="pathProgressIndicator">
                        Progress: <span id="progressText">0/0 Lessons</span>
                    </div>
                    
                    <div class="path-container" id="pathContainer">
                        ${this.generateLessonsForCourse()}
                    </div>
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
        return names[this.currentCourse] || 'Indigenous Language';
    }

    generateLessonsForCourse() {
        const lessons = this.getLessonsData();
        const currentLevel = this.getCurrentLevel();
        const isGuest = localStorage.getItem('isGuest') === 'true';
        const guestAccessLevel = parseInt(localStorage.getItem('guestAccessLevel') || '2', 10);
        
        let html = '';
        let currentModule = 0;

        lessons.forEach((lesson, index) => {
            // Check if guest mode and level is beyond access
            if (isGuest && lesson.id > guestAccessLevel) {
                lesson.status = 'locked';
                lesson.isLockedForGuest = true;
            }

            // Add module header when module changes
            if (lesson.module && lesson.module !== currentModule) {
                currentModule = lesson.module;
                html += this.generateModuleHeader(currentModule);
            }

            html += `
            <div class="path-step">
                <div class="lesson-node ${lesson.status} ${lesson.type === 'boss' ? 'boss-node' : ''} ${lesson.status === 'locked' ? 'opacity-60 pointer-events-none' : ''}" data-lesson="${lesson.id}">
                    ${lesson.type === 'boss' ? '<div class="boss-badge">BOSS</div>' : ''}
                    ${lesson.isLockedForGuest ? '<div class="lock-overlay"><i class="fas fa-lock"></i><span>Register to unlock</span></div>' : ''}
                    <div class="lesson-level-num">${lesson.id}</div>
                    ${lesson.id === currentLevel ? this.generateSoggyAvatar() : ''}
                    <div class="lesson-icon">
                        <i class="fas ${this.getLessonIcon(lesson.status, lesson.type)}"></i>
                    </div>
                    <div class="lesson-info">
                        <h3 class="lesson-title">${lesson.title}</h3>
                        <p class="lesson-description">${lesson.description}</p>
                        <div class="lesson-stats">
                            <span class="stat-item"><i class="fas fa-star"></i> +${lesson.xp} XP</span>
                            <span class="stat-item"><i class="fas fa-clock"></i> ${lesson.duration} min</span>
                            <span class="stat-item"><i class="fas fa-layer-group"></i> ${lesson.exercises} exercises</span>
                        </div>
                    </div>
                    <div class="lesson-actions">
                        ${this.getLessonButton(lesson)}
                    </div>
                </div>
            </div>
            `;
        });

        return html;
    }

    generateModuleHeader(moduleNumber) {
        const moduleTitles = {
            1: 'MODULE 1: Roots and Community Environment',
            2: 'MODULE 2: Cosmovision and Advanced Identity'
        };

        return `
            <div class="module-header">
                <h3 class="module-title" style="color: #000000;">${moduleTitles[moduleNumber] || `MODULE ${moduleNumber}`}</h3>
                <div class="module-divider"></div>
            </div>
        `;
    }

    getCurrentLevel() {
        const lessons = this.getLessonsData();
        const currentLesson = lessons.find(l => l.status === 'current');
        return currentLesson ? currentLesson.id : 1;
    }

    generateSoggyAvatar() {
        return `
            <div class="soggy-avatar-dynamic">
                <img src="../Multimedia/Images/Soged/Newturttle.png" alt="Soggy" class="soggy-avatar-img">
            </div>
        `;
    }

    getLessonsData() {
        // Course-specific data
        const courseLessons = {
            'ngabe': [
                { id: 1, title: 'Basic Greetings', description: 'Learn essential greetings and polite expressions', status: 'completed', xp: 50, duration: 15, exercises: 8, type: 'normal' },
                { id: 2, title: 'Numbers 1-10', description: 'Master counting and basic numbers', status: 'completed', xp: 75, duration: 20, exercises: 12, type: 'normal' },
                { id: 3, title: 'Family Members', description: 'Identify family relationships and roles', status: 'current', xp: 100, duration: 25, exercises: 15, type: 'normal' },
                { id: 4, title: 'Colors & Nature', description: 'Describe the natural world around you', status: 'locked', xp: 125, duration: 30, exercises: 18, type: 'normal' },
                { id: 5, title: 'Level 1 Assessment', description: 'Test your knowledge with cultural scenarios', status: 'locked', xp: 200, duration: 45, exercises: 25, type: 'boss' }
            ],
            'guna': [
                // MODULE 1: "Roots and Community Environment" (Levels 1-10)
                { id: 1, title: 'Greetings and Introductions', description: 'Greetings, pronouns and introductions', status: 'completed', xp: 50, duration: 15, exercises: 8, type: 'normal', module: 1 },
                { id: 2, title: 'Family', description: 'Mother, father, siblings and grandparents', status: 'completed', xp: 75, duration: 20, exercises: 10, type: 'normal', module: 1 },
                { id: 3, title: 'Household Objects', description: 'House, table, plate and daily objects', status: 'completed', xp: 75, duration: 20, exercises: 10, type: 'normal', module: 1 },
                { id: 4, title: 'Nature', description: 'Rivers, seas, mountains and local flora', status: 'current', xp: 100, duration: 25, exercises: 12, type: 'normal', module: 1 },
                { id: 5, title: 'Sacred Animals', description: 'Panama fauna, birds, jaguars and marine animals', status: 'locked', xp: 125, duration: 30, exercises: 14, type: 'normal', module: 1 },
                { id: 6, title: 'Numbers and Counting', description: 'Traditional number system and quantities', status: 'locked', xp: 125, duration: 30, exercises: 14, type: 'normal', module: 1 },
                { id: 7, title: 'Food and Cooking', description: 'Traditional foods, crops and utensils', status: 'locked', xp: 125, duration: 30, exercises: 14, type: 'normal', module: 1 },
                { id: 8, title: 'Weather and Seasons', description: 'Months, days, climate and lunar cycles', status: 'locked', xp: 150, duration: 35, exercises: 16, type: 'normal', module: 1 },
                { id: 9, title: 'Clothing and Symbolism', description: 'Molas, beads, textiles and traditional crafts', status: 'locked', xp: 150, duration: 35, exercises: 16, type: 'normal', module: 1 },
                { id: 10, title: 'Traditional Medicine', description: 'Medicinal plants, healing songs and botany', status: 'locked', xp: 175, duration: 40, exercises: 18, type: 'normal', module: 1 },
                // MODULE 2: "Worldview and Advanced Identity" (Levels 11-20)
                { id: 11, title: 'Stories and Legends', description: 'Creation myths and grandparents narrations', status: 'locked', xp: 175, duration: 40, exercises: 18, type: 'normal', module: 2 },
                { id: 12, title: 'Community Organization', description: 'The Congress, comarcas and traditional authorities', status: 'locked', xp: 200, duration: 45, exercises: 20, type: 'normal', module: 2 },
                { id: 13, title: 'Celebrations and Music', description: 'Traditional dances, ceremonies and music', status: 'locked', xp: 200, duration: 45, exercises: 20, type: 'normal', module: 2 },
                { id: 14, title: 'Idiomatic Expressions', description: 'Idioms and traditional sayings', status: 'locked', xp: 225, duration: 50, exercises: 22, type: 'normal', module: 2 },
                { id: 15, title: 'Regional Geography', description: 'Territories, rivers and sacred places', status: 'locked', xp: 225, duration: 50, exercises: 22, type: 'normal', module: 2 },
                { id: 16, title: 'Art and Basketry', description: 'Textiles, baskets and craft techniques', status: 'locked', xp: 250, duration: 55, exercises: 24, type: 'normal', module: 2 },
                { id: 17, title: 'Values and Community Law', description: 'Norms, justice and traditional values', status: 'locked', xp: 250, duration: 55, exercises: 24, type: 'normal', module: 2 },
                { id: 18, title: 'Healing Songs', description: 'Spiritual medicine and traditional songs', status: 'locked', xp: 275, duration: 60, exercises: 26, type: 'normal', module: 2 },
                { id: 19, title: 'Traditional Exchange', description: 'Trade, barter and local economy', status: 'locked', xp: 275, duration: 60, exercises: 26, type: 'normal', module: 2 },
                { id: 20, title: 'Linguistic Mastery', description: 'Final exam and mastery certification', status: 'locked', xp: 300, duration: 90, exercises: 30, type: 'boss', module: 2 }
            ],
            'embera': [
                { id: 1, title: 'River Greetings', description: 'Welcome expressions from the rainforest', status: 'completed', xp: 50, duration: 15, exercises: 8, type: 'normal' },
                { id: 2, title: 'Jungle Numbers', description: 'Counting in the forest way', status: 'current', xp: 75, duration: 20, exercises: 12, type: 'normal' },
                { id: 3, title: 'Craft Vocabulary', description: 'Basket weaving and traditional arts', status: 'locked', xp: 100, duration: 25, exercises: 15, type: 'normal' },
                { id: 4, title: 'Rainforest Life', description: 'Plants, animals, and survival', status: 'locked', xp: 125, duration: 30, exercises: 18, type: 'normal' },
                { id: 5, title: 'Shamanic Stories', description: 'Spiritual traditions and healing', status: 'locked', xp: 200, duration: 45, exercises: 25, type: 'boss' }
            ],
            'naso': [
                { id: 1, title: 'Royal Greetings', description: 'Formal expressions of the kingdom', status: 'completed', xp: 50, duration: 15, exercises: 8, type: 'normal' },
                { id: 2, title: 'Sacred Numbers', description: 'Counting in the traditional way', status: 'current', xp: 75, duration: 20, exercises: 12, type: 'normal' },
                { id: 3, title: 'Royal Family', description: 'Titles and hierarchy vocabulary', status: 'locked', xp: 100, duration: 25, exercises: 15, type: 'normal' },
                { id: 4, title: 'Mountain Spirits', description: 'Spiritual and nature vocabulary', status: 'locked', xp: 125, duration: 30, exercises: 18, type: 'normal' },
                { id: 5, title: 'Kingdom Legends', description: 'Historical stories and traditions', status: 'locked', xp: 200, duration: 45, exercises: 25, type: 'boss' }
            ]
        };

        const base = courseLessons[this.currentCourse] || courseLessons['guna'];
        if (this.currentCourse === 'guna' && typeof GunaProgress !== 'undefined') {
            return GunaProgress.getLessonsWithStatus(base);
        }
        return base;
    }

    getLessonIcon(status, type) {
        if (type === 'boss') return 'fa-crown';
        
        switch(status) {
            case 'completed': return 'fa-check-circle';
            case 'current': return 'fa-play-circle';
            case 'locked': return 'fa-lock';
            default: return 'fa-circle';
        }
    }

    getLessonButton(lesson) {
        const session = typeof GunaProgress !== 'undefined' ? GunaProgress.getLessonSession(lesson.id) : null;
        const statusEmoji = { completed: '✅', current: '🔄', locked: '🔒' };
        const badge = `<span class="lesson-status-badge">${statusEmoji[lesson.status] || ''}</span>`;

        switch(lesson.status) {
            case 'completed':
                return `${badge}
                    <button class="lesson-btn btn-secondary" onclick="event.stopPropagation(); reviewLesson(${lesson.id})">
                        <i class="fas fa-redo"></i>
                        Review
                    </button>
                `;
            case 'current':
                return `${badge}
                    <button class="lesson-btn btn-primary" onclick="event.stopPropagation(); startLesson(${lesson.id})">
                        <i class="fas fa-play"></i>
                        ${session ? 'Continue' : 'Start Lesson'}
                    </button>
                `;
            case 'locked':
                return `${badge}
                    <button class="lesson-btn btn-disabled" disabled>
                        <i class="fas fa-lock"></i>
                        Locked
                    </button>
                `;
            default:
                return '';
        }
    }

    initializeEventListeners() {
        // Lesson nodes
        this.querySelectorAll('.lesson-node').forEach(node => {
            node.addEventListener('click', (e) => {
                if (!node.classList.contains('locked')) {
                    const lessonId = node.getAttribute('data-lesson');
                    this.selectLesson(lessonId);
                }
            });
        });
    }

    switchCourse(course) {
        if (this.currentCourse !== course) {
            this.currentCourse = course;
            this.setAttribute('course', course);
            
            // Update URL
            const url = new URL(window.location);
            url.searchParams.set('course', course);
            window.history.pushState({}, '', url);
            
            // Re-render with new course
            this.render();
            this.initializeEventListeners();
            
            // Trigger custom event
            this.dispatchEvent(new CustomEvent('courseChanged', {
                detail: { course: course },
                bubbles: true
            }));
        }
    }

    selectLesson(lessonId) {
        // Highlight selected lesson
        this.querySelectorAll('.lesson-node').forEach(node => {
            node.classList.remove('selected');
        });
        
        const selectedNode = this.querySelector(`[data-lesson="${lessonId}"]`);
        if (selectedNode) {
            selectedNode.classList.add('selected');
        }

        // Trigger lesson selection event
        this.dispatchEvent(new CustomEvent('lessonSelected', {
            detail: { lessonId: lessonId, course: this.currentCourse },
            bubbles: true
        }));
    }

    loadUserProgress() {
        // Load user progress from localStorage or API
        const progress = JSON.parse(localStorage.getItem(`progress_${this.currentCourse}`) || '{}');
        // Update UI based on progress
    }

    saveUserProgress() {
        // Save progress to localStorage or API
        localStorage.setItem(`progress_${this.currentCourse}`, JSON.stringify(this.userProgress));
    }
}

// Register the custom element
customElements.define('learning-section', LearningSection);

// Helper: resolve active course even when learning-section is not in DOM
function getActiveCourse() {
    if (window.learningHub?.currentCourse) return window.learningHub.currentCourse;
    const stored = localStorage.getItem('currentCourse');
    if (stored) return stored;
    const section = document.querySelector('learning-section');
    if (section) return section.getAttribute('course') || 'guna';
    return 'guna';
}

function openGunaLessonViewer(lessonId, review = false) {
    const id = parseInt(lessonId, 10);
    if (typeof GunaProgress !== 'undefined') {
        if (!GunaProgress.canAccessLesson(id, review)) {
            showNotification('🔒 Completa la lección anterior para desbloquear este nivel.', 'info');
            return;
        }
        if (!review && typeof GunaLives !== 'undefined' && !GunaLives.canPlay()) {
            const session = GunaProgress.getLessonSession(id);
            if (!session) {
                showNotification(typeof GunaI18n !== 'undefined' ? GunaI18n.t('noLives') : 'No lives left! Visit the store.', 'error');
                return;
            }
        }
    }

    const contentContainer = document.getElementById('contentContainer');
    if (!contentContainer) return;

    const reviewAttr = review ? ' review="true"' : '';
    contentContainer.innerHTML = `<guna-lesson-viewer lesson-id="${id}"${reviewAttr}></guna-lesson-viewer>`;

    const viewer = contentContainer.querySelector('guna-lesson-viewer');
    if (viewer) {
        viewer.addEventListener('lessonCompleted', (e) => {
            const completedId = e.detail.lessonId;
            showNotification(`🎉 Lesson ${completedId} completed! +25 cocos`, 'success');
            setTimeout(() => {
                if (window.learningHub) {
                    window.learningHub.loadSection('learn', true);
                }
            }, 1500);
        }, { once: true });
    }
}

// Global functions for lesson interaction
window.startLesson = function(lessonId) {
    const currentCourse = getActiveCourse();
    if (currentCourse !== 'guna') {
        showNotification('This course is coming soon!', 'info');
        return;
    }
    const id = parseInt(lessonId, 10);
    if (typeof GunaProgress !== 'undefined') {
        if (!GunaProgress.canAccessLesson(id, false)) {
            showNotification('🔒 Esta lección está bloqueada.', 'info');
            return;
        }
        const completed = GunaProgress.getProgress().completed;
        let currentId = 1;
        for (let i = 1; i <= GunaProgress.TOTAL_LESSONS; i++) {
            if (!completed.includes(i)) { currentId = i; break; }
        }
        if (id !== currentId) {
            showNotification('Solo puedes iniciar la lección actual del camino.', 'info');
            return;
        }
    }
    openGunaLessonViewer(id, false);
};

window.reviewLesson = function(lessonId) {
    const currentCourse = getActiveCourse();
    if (currentCourse !== 'guna') {
        showNotification('This course is coming soon!', 'info');
        return;
    }
    const id = parseInt(lessonId, 10);
    if (typeof GunaProgress !== 'undefined' && !GunaProgress.isCompleted(id)) {
        showNotification('Solo puedes repasar lecciones completadas.', 'info');
        return;
    }
    openGunaLessonViewer(id, true);
};

// Utility function for notifications
window.showNotification = function(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#2ECC71' : '#00A3E0',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
};
