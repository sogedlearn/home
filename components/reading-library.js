/**
 * Interactive Reading Library Component
 * Organizes educational documents into reading sections
 */
class ReadingLibrary extends HTMLElement {
    connectedCallback() {
        this.currentSection = 'initial';
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="reading-library-container">
                <div class="library-header">
                    <h2>📚 Guna Educational Library</h2>
                    <p>Explore our collection of indigenous educational materials</p>
                </div>

                <div class="library-navigation">
                    <button class="nav-btn ${this.currentSection === 'initial' ? 'active' : ''}" data-section="initial">
                        <i class="fas fa-child"></i>
                        <span>Initial (4-5 Years)</span>
                    </button>
                    <button class="nav-btn ${this.currentSection === 'first' ? 'active' : ''}" data-section="first">
                        <i class="fas fa-graduation-cap"></i>
                        <span>1st Grade</span>
                    </button>
                    <button class="nav-btn ${this.currentSection === 'second' ? 'active' : ''}" data-section="second">
                        <i class="fas fa-book-reader"></i>
                        <span>2nd Grade</span>
                    </button>
                    <button class="nav-btn ${this.currentSection === 'third' ? 'active' : ''}" data-section="third">
                        <i class="fas fa-university"></i>
                        <span>3rd Grade</span>
                    </button>
                </div>

                <div class="library-content" id="libraryContent">
                    ${this.generateSectionContent(this.currentSection)}
                </div>
            </div>
        `;
    }

    generateSectionContent(section) {
        const sections = {
            initial: {
                title: 'Initial Education (4-5 Years)',
                description: 'Foundational learning materials for young Guna children',
                readings: this.getInitialReadings()
            },
            first: {
                title: '1st Grade',
                description: 'Primary education materials covering mathematics, spirituality, and language',
                readings: this.getFirstGradeReadings()
            },
            second: {
                title: '2nd Grade',
                description: 'Advanced primary education with expanded curriculum',
                readings: this.getSecondGradeReadings()
            },
            third: {
                title: '3rd Grade',
                description: 'Upper primary education with comprehensive subjects',
                readings: this.getThirdGradeReadings()
            }
        };

        const current = sections[section];
        return `
            <div class="section-header">
                <h3>${current.title}</h3>
                <p>${current.description}</p>
            </div>
            <div class="readings-grid">
                ${current.readings.map((reading, index) => `
                    <div class="reading-card" data-reading="${index}">
                        <div class="reading-icon">
                            <i class="fas ${reading.icon}"></i>
                        </div>
                        <div class="reading-info">
                            <h4>${reading.title}</h4>
                            <p class="reading-description">${reading.description}</p>
                            <div class="reading-meta">
                                <span class="reading-type">${reading.type}</span>
                                <span class="reading-pages">${reading.pages}</span>
                            </div>
                        </div>
                        <button class="reading-btn" onclick="this.closest('.reading-card').classList.toggle('expanded')">
                            <i class="fas fa-book-open"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getInitialReadings() {
        return [
            {
                title: 'Introduction to Guna Culture',
                description: 'Learn about the rich traditions and customs of the Guna people',
                icon: 'fa-home',
                type: 'Cultural Studies',
                pages: '12 pages'
            },
            {
                title: 'Numbers and Counting',
                description: 'Basic numeracy skills using Guna examples',
                icon: 'fa-calculator',
                type: 'Mathematics',
                pages: '15 pages'
            },
            {
                title: 'Colors in Nature',
                description: 'Discover the vibrant colors of the Guna environment',
                icon: 'fa-palette',
                type: 'Art & Nature',
                pages: '10 pages'
            },
            {
                title: 'Family and Community',
                description: 'Understanding the importance of family in Guna society',
                icon: 'fa-users',
                type: 'Social Studies',
                pages: '14 pages'
            },
            {
                title: 'Animals of the Comarca',
                description: 'Learn about native animals and their significance',
                icon: 'fa-paw',
                type: 'Science',
                pages: '16 pages'
            },
            {
                title: 'Basic Guna Words',
                description: 'First words and phrases in the Guna language',
                icon: 'fa-language',
                type: 'Language',
                pages: '18 pages'
            },
            {
                title: 'Shapes and Patterns',
                description: 'Recognizing geometric shapes in traditional art',
                icon: 'fa-shapes',
                type: 'Mathematics',
                pages: '11 pages'
            },
            {
                title: 'Daily Routines',
                description: 'A day in the life of a Guna child',
                icon: 'fa-sun',
                type: 'Life Skills',
                pages: '13 pages'
            },
            {
                title: 'Traditional Games',
                description: 'Games played by Guna children for generations',
                icon: 'fa-gamepad',
                type: 'Physical Education',
                pages: '9 pages'
            },
            {
                title: 'Respect for Elders',
                description: 'Learning the value of respecting elders in the community',
                icon: 'fa-hands-helping',
                type: 'Values',
                pages: '12 pages'
            }
        ];
    }

    getFirstGradeReadings() {
        return [
            {
                title: 'Mathematical Foundations',
                description: 'Building strong math skills for first graders',
                icon: 'fa-square-root-alt',
                type: 'Mathematics',
                pages: '45 pages'
            },
            {
                title: 'Spiritual Wisdom',
                description: 'Guna spiritual teachings and practices',
                icon: 'fa-praying-hands',
                type: 'Spirituality',
                pages: '38 pages'
            },
            {
                title: 'Spanish as Second Language',
                description: 'Learning Spanish while preserving Guna identity',
                icon: 'fa-comments',
                type: 'Language',
                pages: '42 pages'
            },
            {
                title: 'Native Language Mastery',
                description: 'Deepening understanding of the Guna language',
                icon: 'fa-book',
                type: 'Language',
                pages: '50 pages'
            },
            {
                title: 'Addition and Subtraction',
                description: 'Basic arithmetic operations with practical examples',
                icon: 'fa-plus-minus',
                type: 'Mathematics',
                pages: '35 pages'
            },
            {
                title: 'Guna Creation Stories',
                description: 'Traditional stories about the origin of the Guna people',
                icon: 'fa-landmark',
                type: 'Culture',
                pages: '28 pages'
            },
            {
                title: 'Reading Comprehension',
                description: 'Developing reading skills in both languages',
                icon: 'fa-glasses',
                type: 'Language Arts',
                pages: '40 pages'
            },
            {
                title: 'Nature and Environment',
                description: 'Understanding the natural world and conservation',
                icon: 'fa-leaf',
                type: 'Science',
                pages: '32 pages'
            },
            {
                title: 'Community Values',
                description: 'Core values that strengthen Guna communities',
                icon: 'fa-heart',
                type: 'Values',
                pages: '25 pages'
            },
            {
                title: 'Traditional Crafts',
                description: 'Learning about molas and other traditional arts',
                icon: 'fa-paint-brush',
                type: 'Art',
                pages: '30 pages'
            }
        ];
    }

    getSecondGradeReadings() {
        return [
            {
                title: 'Advanced Mathematics',
                description: 'Multiplication, division, and problem-solving',
                icon: 'fa-divide',
                type: 'Mathematics',
                pages: '55 pages'
            },
            {
                title: 'Spiritual Practices',
                description: 'Deeper exploration of Guna spiritual traditions',
                icon: 'fa-om',
                type: 'Spirituality',
                pages: '48 pages'
            },
            {
                title: 'Spanish Language Skills',
                description: 'Enhancing Spanish communication abilities',
                icon: 'fa-language',
                type: 'Language',
                pages: '52 pages'
            },
            {
                title: 'Guna Literature',
                description: 'Reading traditional Guna stories and texts',
                icon: 'fa-scroll',
                type: 'Literature',
                pages: '60 pages'
            },
            {
                title: 'Geometry and Measurement',
                description: 'Practical applications of geometry',
                icon: 'fa-ruler-combined',
                type: 'Mathematics',
                pages: '42 pages'
            },
            {
                title: 'Environmental Stewardship',
                description: 'Protecting the Guna Yala environment',
                icon: 'fa-tree',
                type: 'Science',
                pages: '38 pages'
            },
            {
                title: 'Guna History',
                description: 'Important events in Guna history',
                icon: 'fa-history',
                type: 'History',
                pages: '45 pages'
            },
            {
                title: 'Creative Writing',
                description: 'Expressing ideas through writing',
                icon: 'fa-pen-fancy',
                type: 'Language Arts',
                pages: '35 pages'
            },
            {
                title: 'Maritime Culture',
                description: 'The Guna relationship with the sea',
                icon: 'fa-ship',
                type: 'Culture',
                pages: '40 pages'
            },
            {
                title: 'Health and Wellness',
                description: 'Traditional and modern health practices',
                icon: 'fa-heartbeat',
                type: 'Health',
                pages: '32 pages'
            }
        ];
    }

    getThirdGradeReadings() {
        return [
            {
                title: 'Complex Mathematics',
                description: 'Fractions, decimals, and advanced operations',
                icon: 'fa-percentage',
                type: 'Mathematics',
                pages: '65 pages'
            },
            {
                title: 'Spiritual Philosophy',
                description: 'Philosophical aspects of Guna spirituality',
                icon: 'fa-brain',
                type: 'Spirituality',
                pages: '55 pages'
            },
            {
                title: 'Bilingual Excellence',
                description: 'Mastering both Spanish and Guna languages',
                icon: 'fa-globe',
                type: 'Language',
                pages: '58 pages'
            },
            {
                title: 'Native Language Studies',
                description: 'Advanced Guna language and grammar',
                icon: 'fa-book-open',
                type: 'Language',
                pages: '70 pages'
            },
            {
                title: 'Algebra Introduction',
                description: 'Introduction to algebraic thinking',
                icon: 'fa-superscript',
                type: 'Mathematics',
                pages: '50 pages'
            },
            {
                title: 'Cultural Preservation',
                description: 'Methods for preserving Guna culture',
                icon: 'fa-archive',
                type: 'Culture',
                pages: '42 pages'
            },
            {
                title: 'Scientific Inquiry',
                description: 'Introduction to scientific method',
                icon: 'fa-flask',
                type: 'Science',
                pages: '48 pages'
            },
            {
                title: 'Guna Governance',
                description: 'Understanding the Guna political system',
                icon: 'fa-balance-scale',
                type: 'Civics',
                pages: '38 pages'
            },
            {
                title: 'Traditional Medicine',
                description: 'Healing practices and medicinal plants',
                icon: 'fa-seedling',
                type: 'Health',
                pages: '45 pages'
            },
            {
                title: 'Global Awareness',
                description: 'Guna people in the modern world',
                icon: 'fa-earth-americas',
                type: 'Social Studies',
                pages: '40 pages'
            }
        ];
    }

    setupEventListeners() {
        const navBtns = this.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentSection = btn.dataset.section;
                this.render();
                this.setupEventListeners();
            });
        });
    }
}

customElements.define('reading-library', ReadingLibrary);
