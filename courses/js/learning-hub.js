/**
 * Simple Learning Hub
 * Clean & Focused Learning Experience
 */

class SimpleLearningHub {
    constructor() {
        this.currentSection = '';
        this.currentCourse = this.getCurrentCourse();
        this.pendingGame = '';
        this.sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        this.currentUser = this.getCurrentUser();
        
        this.init();
    }

    async init() {
        // Check authentication first
        const isAuthenticated = await this.checkAuthentication();
        if (!isAuthenticated) {
            return;
        }
        
        this.hideLoadingScreen();
        this.syncCourseDisplay();
        this.setupSidebar();
        this.setupNavigation();
        this.setupCourseSelector();
        this.setupMobileMenu();
        this.setupUserMenu();
        this.setupModals();
        this.setupProfileAndSettings();
        this.loadInitialSection();
        this.setupResponsiveBehavior();
        this.updateUserInfo();
        this.setupHashRouting();
        this.setupThemeToggle();
        if (typeof GunaGamification !== 'undefined') {
            GunaGamification.updateDisplays();
            GunaGamification.checkAllBadges();
        }
        if (typeof GunaLives !== 'undefined') GunaLives.updateDisplays();
        if (typeof GunaUserData !== 'undefined') {
            GunaUserData.applyProfileToUI();
            GunaUserData.applySettingsToForm();
            GunaUserData.saveSettings(GunaUserData.getSettings());
        }
        if (typeof GunaI18n !== 'undefined') GunaI18n.apply();
        if (typeof GameRewards !== 'undefined') GameRewards.syncFromServer();
        
        // Apply saved sidebar state
        if (this.sidebarCollapsed) {
            this.collapseSidebar();
        }
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }
        }, 1500);
    }

    setupSidebar() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                // Only allow sidebar toggle on desktop (width > 1024px)
                if (window.innerWidth > 1024) {
                    this.toggleSidebar();
                }
            });
        }
    }

    toggleSidebar() {
        // Only allow sidebar toggle on desktop
        if (window.innerWidth <= 1024) {
            return;
        }
        
        const sidebar = document.getElementById('sidebar');
        const isCollapsed = sidebar.classList.contains('collapsed');
        
        if (isCollapsed) {
            this.expandSidebar();
        } else {
            this.collapseSidebar();
        }
    }

    collapseSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.add('collapsed');
        this.sidebarCollapsed = true;
        localStorage.setItem('sidebarCollapsed', 'true');
        
        // Trigger custom event for components to adjust
        this.dispatchSidebarEvent('collapsed');
    }

    expandSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('collapsed');
        this.sidebarCollapsed = false;
        localStorage.setItem('sidebarCollapsed', 'false');
        
        // Trigger custom event for components to adjust
        this.dispatchSidebarEvent('expanded');
    }

    dispatchSidebarEvent(state) {
        const event = new CustomEvent('sidebarStateChanged', {
            detail: { 
                collapsed: state === 'collapsed',
                width: state === 'collapsed' ? 70 : 280
            }
        });
        document.dispatchEvent(event);
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                const game = item.getAttribute('data-game') || '';
                if (section) {
                    this.pendingGame = game;
                    this.loadSection(section);
                }
            });
        });
    }

    setupCourseSelector() {
        const courseDropdownBtn = document.getElementById('courseDropdownBtn');
        const courseDropdown = document.getElementById('courseDropdown');
        const courseOptions = document.querySelectorAll('.course-option');

        // Toggle dropdown
        if (courseDropdownBtn) {
            courseDropdownBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                courseDropdown.classList.toggle('show');
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.course-selector')) {
                courseDropdown.classList.remove('show');
            }
        });

        // Course selection
        courseOptions.forEach(option => {
            option.addEventListener('click', () => {
                if (option.dataset.soon === 'true') {
                    this.showNotification('Coming Soon — Guna is available now!', 'info');
                    courseDropdown.classList.remove('show');
                    return;
                }
                const courseId = option.getAttribute('data-course');
                this.switchCourse(courseId);
            });
        });

        // Keyboard shortcuts for course switching
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                switch(e.key) {
                    case '1': this.switchCourse('ngabe'); e.preventDefault(); break;
                    case '2': this.switchCourse('guna'); e.preventDefault(); break;
                    case '3': this.switchCourse('embera'); e.preventDefault(); break;
                    case '4': this.switchCourse('naso'); e.preventDefault(); break;
                    case 's': this.toggleSidebar(); e.preventDefault(); break;
                }
            }
        });
    }

    setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                sidebar.classList.add('open');
                sidebarOverlay.classList.add('show');
                // Prevent body scroll when mobile menu is open
                document.body.style.overflow = 'hidden';
            });
        }

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Close mobile menu when selecting navigation item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 1024) {
                    this.closeMobileMenu();
                }
            });
        });

        // Close mobile menu with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && window.innerWidth <= 1024) {
                this.closeMobileMenu();
            }
        });
    }

    closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        if (sidebar) {
            sidebar.classList.remove('open');
        }
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove('show');
        }
        // Restore body scroll
        document.body.style.overflow = '';
    }

    setupResponsiveBehavior() {
        // Handle window resize to manage sidebar behavior
        window.addEventListener('resize', () => {
            const sidebar = document.getElementById('sidebar');
            const sidebarOverlay = document.getElementById('sidebarOverlay');
            
            if (window.innerWidth > 1024) {
                // Desktop: Remove mobile-specific classes and restore desktop behavior
                sidebar.classList.remove('open');
                if (sidebarOverlay) {
                    sidebarOverlay.classList.remove('show');
                }
                // Restore body scroll on desktop
                document.body.style.overflow = '';
                
                // Restore saved sidebar state on desktop
                if (this.sidebarCollapsed) {
                    this.collapseSidebar();
                } else {
                    this.expandSidebar();
                }
            } else {
                // Mobile/Tablet: Ensure sidebar is hidden and remove collapsed state
                sidebar.classList.remove('open');
                sidebar.classList.remove('collapsed');
                if (sidebarOverlay) {
                    sidebarOverlay.classList.remove('show');
                }
                // Restore body scroll on mobile/tablet
                document.body.style.overflow = '';
            }
        });
    }

    setupHashRouting() {
        window.addEventListener('hashchange', () => {
            const section = this.resolveSectionFromUrl();
            if (section && section !== this.currentSection) {
                this.loadSection(section, true);
            }
        });
    }

    resolveSectionFromUrl() {
        const path = window.location.pathname;
        const hash = window.location.hash.replace('#', '');
        if (path.includes('/store') || hash === 'store') return 'store';
        if (path.includes('/learning-path') || hash === 'learning-path' || hash === 'learn') return 'learn';
        if (hash.startsWith('games/')) {
            const game = hash.split('/')[1];
            this.pendingGame = game || '';
            return 'games';
        }
        if (hash === 'memory' || hash === 'puzzle') {
            this.pendingGame = hash === 'memory' ? 'memory' : 'puzzle';
            return 'games';
        }
        if (hash === 'cultural' || hash === 'readings') return 'cultural';
        const valid = ['overview', 'learn', 'vocabulary', 'memory', 'games', 'cultural', 'community', 'territory', 'store', 'stories', 'chat', 'leaderboard', 'achievements', 'puzzle'];
        if (hash && valid.includes(hash)) {
            if (hash === 'games') this.pendingGame = '';
            return hash;
        }
        return 'overview';
    }

    navigateToSection(section, game = '') {
        const hashMap = { learn: 'learning-path', store: 'store', overview: 'overview' };
        let hash = hashMap[section] || section;
        if (section === 'games' && game) hash = `games/${game}`;
        this.pendingGame = game;
        if (window.location.hash !== `#${hash}`) {
            window.location.hash = hash;
        }
        this.loadSection(section, true);
    }

    loadSection(section, force = false) {
        if (!force && section === this.currentSection) return;

        // Update navigation active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        const activeItem = document.querySelector(`[data-section="${section}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }

        // Update breadcrumb
        this.updateBreadcrumb(section);

        // Load section content
        this.loadSectionContent(section);
        
        this.currentSection = section;
    }

    loadSectionContent(section) {
        const contentContainer = document.getElementById('contentContainer');
        
        // Show loading state
        contentContainer.innerHTML = `
            <div class="section-loading" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; text-align: center; padding: 4rem 2rem;">
                <div class="spinner" style="margin: 0 auto 2rem;"></div>
                                  <h3 style="color: var(--text-secondary); font-weight: 500; margin: 0;">Loading ${this.getSectionTitle(section)}...</h3>
                                        <p style="color: var(--text-light); margin-top: 0.5rem; font-size: 0.9rem;">Preparing your learning experience</p>
            </div>
        `;

        // Load appropriate content
        setTimeout(() => {
            let content = '';
            
            switch(section) {
                case 'overview':
                    content = this.generateOverviewContent();
                    break;
                case 'learn':
                    content = `<learning-section course="${this.currentCourse}"></learning-section>`;
                    break;
                case 'vocabulary':
                    content = `<guna-vocabulary-section></guna-vocabulary-section>`;
                    break;
                case 'memory':
                case 'games':
                    content = `<games-hub game="${this.pendingGame || ''}"></games-hub>`;
                    break;
                case 'cultural':
                    content = `<cultural-readings></cultural-readings>`;
                    break;
                case 'puzzle':
                    content = `<games-hub></games-hub>`;
                    break;
                case 'community':
                    content = `<guna-community-section></guna-community-section>`;
                    break;
                case 'territory':
                    content = `<guna-territory-section></guna-territory-section>`;
                    break;
                case 'stories':
                    content = `<stories-section course="${this.currentCourse}"></stories-section>`;
                    break;
                case 'chat':
                    content = `<guna-ai-tutor course="${this.currentCourse}"></guna-ai-tutor>`;
                    break;
                case 'leaderboard':
                    content = this.generateLeaderboardContent();
                    break;
                case 'achievements':
                    content = this.generateAchievementsContent();
                    break;
                case 'store':
                    content = `<guna-store></guna-store>`;
                    break;
                default:
                    content = `
                        <div style="text-align: center; padding: 4rem 2rem;">
                            <i class="fas fa-construction" style="font-size: 4rem; color: var(--text-light); margin-bottom: 2rem;"></i>
                            <h2 style="color: var(--text-primary); margin-bottom: 1rem;">${this.getSectionTitle(section)}</h2>
                            <p style="color: var(--text-secondary); max-width: 400px; margin: 0 auto;">This section is being developed. Check back soon for exciting new features!</p>
                        </div>
                    `;
            }
            
            contentContainer.innerHTML = content;
            
            if (section === 'overview') {
                this.setupOverviewInteractions();
            }
            if (section === 'store') {
                localStorage.setItem('guna_store_visited', '1');
            }
            if (section === 'community') {
                const visits = parseInt(localStorage.getItem('guna_community_visits') || '0', 10);
                localStorage.setItem('guna_community_visits', String(visits + 1));
                if (typeof GunaGamification !== 'undefined') GunaGamification.checkAllBadges();
            }
            if (section === 'leaderboard') {
                this.setupLeaderboardInteractions();
            }
            if (section === 'achievements') {
                if (typeof GunaGamification !== 'undefined') GunaGamification.checkAllBadges();
                this.setupAchievementsInteractions();
            }
            if (section === 'chat') {
                localStorage.setItem('guna_ai_used', '1');
            }
            
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
            
            if (typeof CocosEconomy !== 'undefined') {
                CocosEconomy.updateAllDisplays();
            }
            if (typeof GunaGamification !== 'undefined') {
                GunaGamification.updateDisplays();
            }
            this.updatePathProgressUI();
        }, 600);
    }

    generateChatContent() {
        return `
            <div class="chat-section" style="max-width: 1000px; margin: 0 auto;">
                <div class="chat-header" style="text-align: center; margin-bottom: 3rem; padding: 2rem; background: linear-gradient(135deg, #00A3E0, #29B6F6); color: white; border-radius: 16px;">
                    <h2 style="font-size: 2.5rem; margin-bottom: 0.5rem;">🤖 AI Tutor</h2>
                    <p style="font-size: 1.2rem; opacity: 0.9;">Your personal ${this.getCourseName()} language assistant</p>
                    <div style="margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: rgba(255,255,255,0.2); border-radius: 12px; display: inline-block;">
                        <i class="fas fa-circle" style="color: #2ECC71; margin-right: 0.5rem; animation: pulse 2s infinite;"></i>
                        <span style="font-weight: 500;">Ready to help you learn</span>
                    </div>
                </div>

                <div class="chat-container" style="background: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
                    <div class="chat-messages" style="height: 500px; padding: 2rem; overflow-y: auto; background: #FAFBFC;">
                        <div class="ai-message" style="display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 2rem;">
                            <div class="message-avatar" style="width: 40px; height: 40px; background: linear-gradient(135deg, #00A3E0, #29B6F6); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem; flex-shrink: 0;">
                                🤖
                            </div>
                            <div class="message-content" style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); max-width: 80%;">
                                <p style="margin-bottom: 1rem; color: var(--text-primary);">Hello! I'm your ${this.getCourseName()} AI tutor. I'm here to help you learn through conversation.</p>
                                <p style="margin-bottom: 1rem; color: var(--text-primary);">I can help you with:</p>
                                <ul style="list-style: none; padding: 0; margin: 0;">
                                    <li style="padding: 0.5rem 0; color: var(--text-secondary);"><i class="fas fa-check" style="color: var(--success-color); margin-right: 0.5rem;"></i>Practice conversations</li>
                                    <li style="padding: 0.5rem 0; color: var(--text-secondary);"><i class="fas fa-check" style="color: var(--success-color); margin-right: 0.5rem;"></i>Pronunciation guidance</li>
                                    <li style="padding: 0.5rem 0; color: var(--text-secondary);"><i class="fas fa-check" style="color: var(--success-color); margin-right: 0.5rem;"></i>Cultural context</li>
                                    <li style="padding: 0.5rem 0; color: var(--text-secondary);"><i class="fas fa-check" style="color: var(--success-color); margin-right: 0.5rem;"></i>Grammar explanations</li>
                                </ul>
                                <p style="margin-top: 1rem; color: var(--text-primary); font-weight: 500;">What would you like to practice today?</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chat-input" style="padding: 1.5rem; background: white; border-top: 1px solid #E9ECEF;">
                        <div style="display: flex; gap: 1rem; align-items: flex-end;">
                            <div style="flex: 1; position: relative;">
                                <textarea placeholder="Type your message in ${this.getCourseName()} or English..." style="width: 100%; min-height: 50px; max-height: 120px; padding: 1rem; border: 2px solid #E9ECEF; border-radius: 12px; font-family: inherit; font-size: 1rem; resize: vertical; outline: none; transition: border-color 0.2s;" onFocus="this.style.borderColor='var(--primary-color)'" onBlur="this.style.borderColor='#E9ECEF'"></textarea>
                            </div>
                            <button style="background: linear-gradient(135deg, var(--primary-color), #20C997); color: white; border: none; border-radius: 12px; padding: 1rem 1.5rem; cursor: pointer; font-weight: 500; transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem;" onMouseOver="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(40,167,69,0.3)'" onMouseOut="this.style.transform='none'; this.style.boxShadow='none'">
                                <i class="fas fa-paper-plane"></i>
                                Send
                            </button>
                        </div>
                        <div style="display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
                            <button class="suggestion-btn" style="padding: 0.5rem 1rem; background: var(--bg-tertiary); border: none; border-radius: 20px; font-size: 0.9rem; cursor: pointer; transition: all 0.2s;" onMouseOver="this.style.background='var(--primary-color)'; this.style.color='white'" onMouseOut="this.style.background='var(--bg-tertiary)'; this.style.color='inherit'">How do I say "hello"?</button>
                            <button class="suggestion-btn" style="padding: 0.5rem 1rem; background: var(--bg-tertiary); border: none; border-radius: 20px; font-size: 0.9rem; cursor: pointer; transition: all 0.2s;" onMouseOver="this.style.background='var(--primary-color)'; this.style.color='white'" onMouseOut="this.style.background='var(--bg-tertiary)'; this.style.color='inherit'">Tell me about ${this.getCourseName()} culture</button>
                            <button class="suggestion-btn" style="padding: 0.5rem 1rem; background: var(--bg-tertiary); border: none; border-radius: 20px; font-size: 0.9rem; cursor: pointer; transition: all 0.2s;" onMouseOver="this.style.background='var(--primary-color)'; this.style.color='white'" onMouseOut="this.style.background='var(--bg-tertiary)'; this.style.color='inherit'">Practice numbers</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateLeaderboardContent() {
        const period = this.leaderboardPeriod || 'week';
        const sortBy = this.leaderboardSort || 'xp';
        const rankings = typeof GunaLeaderboard !== 'undefined'
            ? GunaLeaderboard.getRankings(period, sortBy)
            : [];
        const userStats = typeof GunaLeaderboard !== 'undefined' ? GunaLeaderboard.getUserStats() : {};

        return `
            <div class="leaderboard-section lb-modern">
                <header class="lb-header">
                    <h2>🏆 Leaderboard</h2>
                    <p>Compete with other ${this.getCourseName()} students</p>
                </header>

                <div class="lb-user-stats" aria-label="Your statistics">
                    <div class="lb-stat-card"><span class="lb-stat-val">${userStats.xp || 0}</span><span class="lb-stat-lbl">Total XP</span></div>
                    <div class="lb-stat-card"><span class="lb-stat-val">${userStats.lessons || 0}</span><span class="lb-stat-lbl">Lessons</span></div>
                    <div class="lb-stat-card"><span class="lb-stat-val">${userStats.vocab || 0}</span><span class="lb-stat-lbl">Vocabulary</span></div>
                    <div class="lb-stat-card"><span class="lb-stat-val">${userStats.streak || 0}</span><span class="lb-stat-lbl"><img src="../Images/Soged/Streak.png" alt="" class="lb-streak-icon" aria-hidden="true"> Streak</span></div>
                    <div class="lb-stat-card"><span class="lb-stat-val">${userStats.badges || 0}</span><span class="lb-stat-lbl">Badges</span></div>
                    <div class="lb-stat-card"><span class="lb-stat-val">${userStats.community || 0}</span><span class="lb-stat-lbl">Community</span></div>
                </div>

                <div class="lb-tabs" role="tablist">
                    <button type="button" class="lb-tab ${period === 'week' ? 'active' : ''}" data-period="week" role="tab">This Week</button>
                    <button type="button" class="lb-tab ${period === 'month' ? 'active' : ''}" data-period="month" role="tab">This Month</button>
                    <button type="button" class="lb-tab ${period === 'all' ? 'active' : ''}" data-period="all" role="tab">All Time</button>
                </div>

                <div class="lb-sort" role="group" aria-label="Sort by">
                    <button type="button" class="lb-sort-btn ${sortBy === 'xp' ? 'active' : ''}" data-sort="xp">XP</button>
                    <button type="button" class="lb-sort-btn ${sortBy === 'lessons' ? 'active' : ''}" data-sort="lessons">Lessons</button>
                    <button type="button" class="lb-sort-btn ${sortBy === 'vocab' ? 'active' : ''}" data-sort="vocab">Vocabulary</button>
                </div>

                <div class="lb-rewards-note">
                    <i class="fas fa-gift"></i> Top weekly players earn +25 cocos and an exclusive badge!
                </div>

                <div class="leaderboard-list lb-list">
                    ${this.generateLeaderboardItems(rankings, sortBy)}
                </div>
            </div>
        `;
    }

    generateLeaderboardItems(rankings, sortBy = 'xp') {
        if (!rankings?.length) return '<p class="lb-empty">No rankings available.</p>';

        return rankings.map(user => {
            const rankIcon = user.rank <= 3 ? ['🥇', '🥈', '🥉'][user.rank - 1] : `#${user.rank}`;
            const value = user[sortBy] ?? user.xp;
            const valueLabel = sortBy === 'lessons' ? 'lessons' : sortBy === 'vocab' ? 'words' : 'XP';
            const avatarHtml = user.avatarImg
                ? `<img src="${user.avatarImg}" alt="" class="lb-avatar-img">`
                : (user.avatar || '🐢');

            return `
                <div class="leaderboard-item lb-item ${user.isCurrentUser ? 'current-user' : ''}" role="listitem">
                    <div class="rank-display">${rankIcon}</div>
                    <div class="user-avatar lb-avatar">${avatarHtml}</div>
                    <div class="user-info">
                        <div class="user-name">${user.name} ${user.isCurrentUser ? '(You)' : ''}</div>
                        <div class="user-stats">
                            <span><img src="../Images/Soged/Streak.png" alt="" class="inline-streak-icon" aria-hidden="true"> ${user.streak} day Streak</span>
                            <span><i class="fas fa-book"></i> ${user.lessons} lessons</span>
                        </div>
                    </div>
                    <div class="user-xp">
                        <div class="lb-value">${value.toLocaleString()}</div>
                        <div class="lb-value-lbl">${valueLabel}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    setupLeaderboardInteractions() {
        document.querySelectorAll('.lb-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                this.leaderboardPeriod = btn.dataset.period;
                const container = document.getElementById('contentContainer');
                if (container) {
                    container.innerHTML = this.generateLeaderboardContent();
                    this.setupLeaderboardInteractions();
                }
            });
        });
        document.querySelectorAll('.lb-sort-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.leaderboardSort = btn.dataset.sort;
                const container = document.getElementById('contentContainer');
                if (container) {
                    container.innerHTML = this.generateLeaderboardContent();
                    this.setupLeaderboardInteractions();
                }
            });
        });
    }

    generateAchievementsContent() {
        const badges = typeof GunaGamification !== 'undefined'
            ? GunaGamification.getBadgesForUI(this.achievementCategory || 'all')
            : [];
        const unlocked = badges.filter(b => b.status === 'unlocked').length;
        const locked = badges.length - unlocked;

        return `
            <div class="achievements-section ach-modern">
                <header class="ach-header">
                    <h2>🏅 Achievements</h2>
                    <p>Celebrate your milestones learning ${this.getCourseName()}</p>
                    <div class="ach-summary">
                        <div><strong>${unlocked}</strong><span>Unlocked</span></div>
                        <div><strong>${locked}</strong><span>To Unlock</span></div>
                    </div>
                </header>

                <div class="ach-categories" role="tablist">
                    ${['all', 'vocabulary', 'learning', 'community', 'streak', 'special'].map(cat => `
                        <button type="button" class="ach-cat-btn ${(this.achievementCategory || 'all') === cat ? 'active' : ''}" data-cat="${cat}">
                            ${cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    `).join('')}
                </div>

                <div class="achievements-grid">
                    ${this.generateAchievementItems(badges)}
                </div>
            </div>
        `;
    }

    setupAchievementsInteractions() {
        document.querySelectorAll('.ach-cat-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.achievementCategory = btn.dataset.cat;
                const container = document.getElementById('contentContainer');
                if (container) {
                    container.innerHTML = this.generateAchievementsContent();
                    this.setupAchievementsInteractions();
                }
            });
        });
    }

    generateAchievementItems(badges) {
        if (!badges?.length) return '<p class="ach-empty">No achievements in this category yet.</p>';

        return badges.map(achievement => {
            const statusClass = achievement.status;
            const statusIcon = achievement.status === 'unlocked' ? '✅' : '🔒';
            const statusText = achievement.status === 'unlocked' ? 'Unlocked' : 'Locked';

            return `
                <article class="achievement-card ach-card ${statusClass}" aria-label="${achievement.title}">
                    <div class="ach-card-top ${statusClass}"></div>
                    <div class="ach-card-body">
                        <div class="ach-icon">${achievement.icon}</div>
                        <div>
                            <h3>${achievement.title}</h3>
                            <p>${achievement.description}</p>
                        </div>
                    </div>
                    <div class="ach-card-footer">
                        <span>${statusIcon} ${statusText}</span>
                        <span>${achievement.reward}</span>
                    </div>
                </article>
            `;
        }).join('');
    }

    generateProgressContent() {
        return `
            <div class="progress-section" style="max-width: 1000px; margin: 0 auto;">
                <div class="progress-header" style="text-align: center; margin-bottom: 3rem; padding: 2rem; background: linear-gradient(135deg, #8B5CF6, #A78BFA); color: white; border-radius: 16px;">
                    <h2 style="font-size: 2.5rem; margin-bottom: 0.5rem;">🏆 Your Achievements</h2>
                    <p style="font-size: 1.2rem; opacity: 0.9;">Track your ${this.getCourseName()} learning journey</p>
                </div>

                <div class="achievements-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
                    <div class="achievement-card unlocked" style="background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: all 0.3s; cursor: pointer; border: 2px solid transparent; position: relative; overflow: hidden;" onMouseOver="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.12)'; this.style.borderColor='var(--success-color)'" onMouseOut="this.style.transform='none'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)'; this.style.borderColor='transparent'">
                        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(90deg, var(--success-color), #27AE60);"></div>
                        <div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1rem;">
                            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, var(--success-color), #27AE60); border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: 0.75rem;">
                                <img src="../Images/Soged/Streak.png" alt="" style="width: 36px; height: 36px; object-fit: contain;" aria-hidden="true">
                            </div>
                            <div>
                                <h3 style="font-size: 1.3rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">Fire Streak</h3>
                                <p style="color: var(--text-secondary); margin: 0;">7-day learning Streak</p>
                            </div>
                        </div>
                        <div style="background: var(--bg-tertiary); padding: 0.75rem 1rem; border-radius: 8px; text-align: center;">
                            <span style="color: var(--success-color); font-weight: 600;">Unlocked 2 hours ago</span>
                        </div>
                    </div>

                    <div class="achievement-card unlocked" style="background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: all 0.3s; cursor: pointer; border: 2px solid transparent; position: relative; overflow: hidden;" onMouseOver="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.12)'; this.style.borderColor='var(--primary-color)'" onMouseOut="this.style.transform='none'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)'; this.style.borderColor='transparent'">
                        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(90deg, var(--primary-color), #20C997);"></div>
                        <div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1rem;">
                            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, var(--primary-color), #20C997); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
                                📚
                            </div>
                            <div>
                                <h3 style="font-size: 1.3rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">Student</h3>
                                <p style="color: var(--text-secondary); margin: 0;">Complete 10 lessons</p>
                            </div>
                        </div>
                        <div style="background: var(--bg-tertiary); padding: 0.75rem 1rem; border-radius: 8px; text-align: center;">
                            <span style="color: var(--primary-color); font-weight: 600;">Unlocked yesterday</span>
                        </div>
                    </div>

                    <div class="achievement-card locked" style="background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: all 0.3s; cursor: pointer; border: 2px solid transparent; position: relative; overflow: hidden; opacity: 0.6;" onMouseOver="this.style.opacity='0.8'" onMouseOut="this.style.opacity='0.6'">
                        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: var(--text-light);"></div>
                        <div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1rem;">
                            <div style="width: 60px; height: 60px; background: var(--text-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
                                🏆
                            </div>
                            <div>
                                <h3 style="font-size: 1.3rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">Master</h3>
                                <p style="color: var(--text-secondary); margin: 0;">Complete all lessons</p>
                            </div>
                        </div>
                        <div style="background: var(--bg-tertiary); padding: 0.75rem 1rem; border-radius: 8px; text-align: center;">
                            <span style="color: var(--text-light); font-weight: 600;">Complete 38 more lessons</span>
                        </div>
                    </div>
                </div>

                <div style="background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                    <h3 style="font-size: 1.5rem; font-weight: 600; color: var(--text-primary); margin-bottom: 2rem; text-align: center;">Learning Statistics</h3>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
                        <div style="text-align: center; padding: 1.5rem; background: var(--bg-tertiary); border-radius: 12px;">
                            <div style="font-size: 2.5rem; font-weight: 700; color: var(--primary-color); margin-bottom: 0.5rem;">12</div>
                            <div style="color: var(--text-secondary); font-weight: 500;">Lessons Completed</div>
                        </div>
                        <div style="text-align: center; padding: 1.5rem; background: var(--bg-tertiary); border-radius: 12px;">
                            <div style="font-size: 2.5rem; font-weight: 700; color: var(--accent-color); margin-bottom: 0.5rem;">7</div>
                            <div style="color: var(--text-secondary); font-weight: 500;">Day Streak</div>
                        </div>
                        <div style="text-align: center; padding: 1.5rem; background: var(--bg-tertiary); border-radius: 12px;">
                            <div style="font-size: 2.5rem; font-weight: 700; color: var(--secondary-color); margin-bottom: 0.5rem;">1,250</div>
                            <div style="color: var(--text-secondary); font-weight: 500;">Total XP</div>
                        </div>
                        <div style="text-align: center; padding: 1.5rem; background: var(--bg-tertiary); border-radius: 12px;">
                            <div style="font-size: 2.5rem; font-weight: 700; color: var(--info-color); margin-bottom: 0.5rem;">2h 15m</div>
                            <div style="color: var(--text-secondary); font-weight: 500;">Study Time</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    updateBreadcrumb(section) {
        const breadcrumbItem = document.querySelector('.breadcrumb-item');
        if (breadcrumbItem) {
            breadcrumbItem.textContent = this.getSectionTitle(section);
        }
    }

    getUserStats() {
        const gunaState = typeof GunaGamification !== 'undefined' ? GunaGamification.getState() : {};
        const progress = JSON.parse(localStorage.getItem('userProgress') || '{}');
        const gunaCompleted = typeof GunaProgress !== 'undefined' ? GunaProgress.getCompletedCount() : 3;
        const pathProgress = Math.round((gunaCompleted / 10) * 100);
        return {
            level: gunaState.level || progress.level || 5,
            xp: gunaState.xp || progress.xp || 1250,
            xpNext: typeof GunaGamification !== 'undefined' ? GunaGamification.xpForLevel(gunaState.level || 1) : (progress.xpNext || 2000),
            streak: gunaState.streak || progress.streak || 7,
            lessons: gunaCompleted,
            cocos: typeof CocosEconomy !== 'undefined' ? CocosEconomy.getBalance() : 1250,
            lives: typeof GunaLives !== 'undefined' ? GunaLives.getLives() : 5,
            pathProgress: pathProgress || progress.pathProgress || 30
        };
    }

    setupThemeToggle() {
        const btn = document.getElementById('themeToggleBtn');
        const saved = localStorage.getItem('gunaTheme');
        if (saved === 'dark') document.body.classList.add('dark-mode');
        if (btn) {
            btn.innerHTML = document.body.classList.contains('dark-mode')
                ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            btn.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                const dark = document.body.classList.contains('dark-mode');
                localStorage.setItem('gunaTheme', dark ? 'dark' : 'light');
                btn.innerHTML = dark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            });
        }
    }

    updatePathProgressUI() {
        const completed = typeof GunaProgress !== 'undefined' ? GunaProgress.getCompletedCount() : 0;
        const pct = Math.round((completed / 10) * 100);
        document.querySelectorAll('[data-path-progress]').forEach(el => { el.style.width = `${pct}%`; });
        document.querySelectorAll('[data-path-percent]').forEach(el => { el.textContent = `${pct}% complete`; });
    }

    getDisplayUsername() {
        if (!this.currentUser) return 'Explorador';
        return this.currentUser.username
            || (this.currentUser.email ? this.currentUser.email.split('@')[0] : null)
            || this.currentUser.name
            || 'Explorador';
    }

    getWeekCalendar() {
        const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
        const today = new Date().getDay();
        const todayIndex = today === 0 ? 6 : today - 1;
        const streak = this.getUserStats().streak;

        return days.map((label, i) => {
            let cls = 'week-day';
            const isCompleted = streak >= 7 || (i > todayIndex - streak && i <= todayIndex);
            if (isCompleted) cls += ' completed';
            if (i === todayIndex) cls += ' today';
            return `<div class="${cls}" aria-label="Día ${label}${i === todayIndex ? ', hoy' : isCompleted ? ', completado' : ''}"><span class="week-day-label">${label}</span><span class="week-day-dot"></span></div>`;
        }).join('');
    }

    setupOverviewInteractions() {
        const courseCard = document.getElementById('mainCourseCard');
        if (courseCard) {
            courseCard.addEventListener('click', () => this.navigateToSection('learn'));
            courseCard.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.navigateToSection('learn');
                }
            });
        }
    }

    getCourseIcon(courseData) {
        if (this.currentCourse === 'guna') {
            return `<img src="../Images/Soged/mola-icon.png" alt="Cultura ${courseData.name}" class="main-course-icon-img" data-no-mola-attribution="true">`;
        }
        return `<span class="main-course-emoji">${courseData.flag}</span>`;
    }

    generateOverviewContent() {
        const courseData = this.getCourseData();
        const otherCourses = this.getOtherCourses();
        const stats = this.getUserStats();
        const username = this.getDisplayUsername();
        const xpPercent = Math.round((stats.xp / stats.xpNext) * 100);

        return `
            <div class="overview-dashboard overview-gamified overview-mola-bg">
                <section class="hero-section" data-aos="fade-up">
                    <div class="hero-greeting">
                        <h1 class="hero-title">Welcome back, <span class="hero-username">${username}</span>!</h1>
                        <p class="hero-subtitle">Keep strengthening your knowledge of Guna culture and language.</p>
                    </div>
                    <div class="hero-stats-row">
                        <div class="hero-stat-pill level">
                            <i class="fas fa-star"></i>
                            <div>
                                <span class="hero-stat-value">Level ${stats.level}</span>
                                <span class="hero-stat-label">Current</span>
                            </div>
                        </div>
                        <div class="hero-stat-pill xp">
                            <i class="fas fa-bolt"></i>
                            <div>
                                <span class="hero-stat-value">${stats.xp.toLocaleString('en-US')} XP</span>
                                <span class="hero-stat-label">Earned</span>
                            </div>
                        </div>
                        <div class="hero-stat-pill streak">
                            <img src="../Images/Soged/Streak.png" alt="" class="hero-streak-icon" aria-hidden="true">
                            <div>
                                <span class="hero-stat-value">${stats.streak} days</span>
                                <span class="hero-stat-label">Streak</span>
                            </div>
                        </div>
                    </div>
                </section>

                <button type="button" class="main-course-card" id="mainCourseCard"
                        aria-label="Continue learning ${courseData.name} - ${courseData.description}"
                        data-aos="fade-up" data-aos-delay="50">
                    <div class="main-course-icon">${this.getCourseIcon(courseData)}</div>
                    <div class="main-course-content">
                        <h2 class="main-course-name">${courseData.name}</h2>
                        <p class="main-course-desc">${courseData.description}</p>
                        <span class="main-course-cta">Continue Learning <i class="fas fa-arrow-right"></i></span>
                    </div>
                    <div class="main-course-glow" aria-hidden="true"></div>
                </button>

                <section class="mini-stats-grid" data-aos="fade-up" data-aos-delay="100" aria-label="Progress statistics">
                    <div class="mini-stat-card lessons">
                        <span class="mini-stat-emoji" aria-hidden="true">📚</span>
                        <span class="mini-stat-number">${stats.lessons}</span>
                        <span class="mini-stat-label">Lessons completed</span>
                    </div>
                    <div class="mini-stat-card xp-total">
                        <span class="mini-stat-emoji" aria-hidden="true">⭐</span>
                        <span class="mini-stat-number">${stats.xp.toLocaleString('en-US')}</span>
                        <span class="mini-stat-label">Total XP</span>
                    </div>
                    <div class="mini-stat-card oggob-earned oggob-counter">
                        <img src="../Images/Soged/oggob.png" alt="" class="mini-stat-oggob-img" aria-hidden="true">
                        <span class="mini-stat-number" data-oggob-balance>${stats.cocos.toLocaleString('en-US')}</span>
                        <span class="mini-stat-label">Oggob earned</span>
                    </div>
                    <div class="mini-stat-card burba-current">
                        <img src="../Images/Soged/Burba.png" alt="" class="mini-stat-burba-img" aria-hidden="true">
                        <span class="mini-stat-number" data-lives-count>${stats.lives}</span>
                        <span class="mini-stat-label">Burba remaining</span>
                    </div>
                    <div class="mini-stat-card streak-current">
                        <img src="../Images/Soged/Streak.png" alt="" class="mini-stat-streak-img" aria-hidden="true">
                        <span class="mini-stat-number">${stats.streak}</span>
                        <span class="mini-stat-label">Current Streak</span>
                    </div>
                </section>

                <div class="dashboard-grid" data-aos="fade-up" data-aos-delay="150">
                    <div class="dashboard-card progress-card-modern">
                        <div class="card-header">
                            <div class="card-icon progress">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <div>
                                <h3 class="card-title">Your Progress</h3>
                                <p class="card-subtitle">Guna Learning Path</p>
                            </div>
                        </div>
                        <div class="overall-progress">
                            <div class="progress-label">
                                <span>Overall progress</span>
                                <span>${stats.pathProgress}%</span>
                            </div>
                            <div class="progress-track progress-track-lg">
                                <div class="progress-fill progress-fill-animated" style="width: ${stats.pathProgress}%"></div>
                            </div>
                        </div>
                        <div class="progress-xp-bar">
                            <div class="progress-label">
                                <span>XP to next level</span>
                                <span>${xpPercent}%</span>
                            </div>
                            <div class="progress-track">
                                <div class="progress-fill progress-fill-xp" style="width: ${xpPercent}%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="dashboard-card streak-card-modern">
                        <div class="card-header">
                            <div class="card-icon streak">
                                <img src="../Images/Soged/Streak.png" alt="" class="streak-card-icon" aria-hidden="true">
                            </div>
                            <div>
                                <h3 class="card-title">Learning Streak</h3>
                                <p class="card-subtitle streak-highlight"><img src="../Images/Soged/Streak.png" alt="" class="inline-streak-icon" aria-hidden="true"> ${stats.streak} consecutive days</p>
                            </div>
                        </div>
                        <div class="week-calendar" role="group" aria-label="Weekly Streak calendar">
                            ${this.getWeekCalendar()}
                        </div>
                    </div>
                </div>

                <div class="store-promo-banner" data-aos="fade-up" data-aos-delay="200">
                    <img src="../Images/Molas - Guna/Mola 2.jpg" alt="" class="store-promo-mola" data-no-mola-attribution="true" aria-hidden="true">
                    <div class="store-promo-content">
                        <span class="store-promo-icon">🛒</span>
                        <div>
                            <h3>Visit the Guna Store</h3>
                            <p>Spend your <img src="../Images/Soged/oggob.png" alt="" class="inline-oggob-icon" aria-hidden="true"> Oggob to recover <img src="../Images/Soged/Burba.png" alt="" class="inline-burba-icon" aria-hidden="true"> Burba and unlock cultural rewards.</p>
                        </div>
                    </div>
                    <button type="button" class="store-promo-btn" onclick="window.learningHub.navigateToSection('store')">
                        Go to Store <i class="fas fa-arrow-right"></i>
                    </button>
                </div>

                <div class="other-courses" data-aos="fade-up" data-aos-delay="250">
                    <div class="section-header">
                        <h2 class="section-title">Other Languages</h2>
                        <p class="section-subtitle">Explore more indigenous cultures of Panama</p>
                    </div>
                    <div class="courses-grid">
                        ${otherCourses.map(course => `
                            <div class="course-card course-card--soon" aria-disabled="true">
                                <span class="coming-soon-badge">Coming Soon</span>
                                <div class="course-flag"><img src="${course.flag}" alt="${course.name}" class="course-flag-img"></div>
                                <h3 class="course-name">${course.name}</h3>
                                <p class="course-description">${course.description}</p>
                                <div class="course-progress">
                                    <div class="course-progress-label">Not available yet</div>
                                    <div class="course-progress-bar">
                                        <div class="course-progress-fill" style="width: 0%"></div>
                                    </div>
                                </div>
                                <button class="course-button course-button--disabled" disabled>
                                    Coming Soon
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    getCourseData() {
        const courses = {
            'ngabe': { name: 'Ngäbe', flag: '🏔️', description: 'Mountain People' },
            'guna': { name: 'Guna', flag: '🏝️', description: 'Island Culture' },
            'embera': { name: 'Emberá', flag: '🌊', description: 'River Dwellers' },
            'naso': { name: 'Naso', flag: '🦋', description: 'Ancient Kingdom' }
        };
        return courses[this.currentCourse] || courses['ngabe'];
    }

    getOtherCourses() {
        const allCourses = [
            { id: 'ngabe', name: 'Ngäbe', flag: '../Images/Languages/Ngabe.png', description: 'Mountain People' },
            { id: 'embera', name: 'Emberá', flag: '../Images/Languages/Embera.png', description: 'River Dwellers' },
            { id: 'naso', name: 'Naso', flag: '../Images/Languages/Naso.gif', description: 'Ancient Kingdom' }
        ];
        return allCourses;
    }

    getSectionTitle(section) {
        const titles = {
            overview: 'Dashboard',
            learn: 'Learning Path',
            vocabulary: 'Vocabulary',
            memory: 'Memory Match',
            games: 'Games Hub',
            cultural: 'Cultural Readings',
            puzzle: 'Mola Puzzle',
            community: 'Culture Center',
            territory: 'Guna Territory',
            store: 'Guna Store',
            stories: 'Cultural Stories',
            chat: 'AI Tutor',
            leaderboard: 'Leaderboard',
            achievements: 'Achievements'
        };
        return titles[section] || section.charAt(0).toUpperCase() + section.slice(1);
    }

    getCurrentCourse() {
        const urlParams = new URLSearchParams(window.location.search);
        const courseFromUrl = urlParams.get('course');
        
        if (courseFromUrl) {
            localStorage.setItem('currentCourse', courseFromUrl);
            return courseFromUrl;
        }
        
        return localStorage.getItem('currentCourse') || 'guna';
    }

    syncCourseDisplay() {
        if (this.currentCourse !== 'guna') {
            this.currentCourse = 'guna';
            localStorage.setItem('currentCourse', 'guna');
        }
        const course = this.getCourseData();
        this.updateCourseDisplay({
            name: course.name,
            flag: course.flag,
            desc: course.description
        });
    }

    getCurrentUser() {
        // First try to get data in Soged format
        const token = localStorage.getItem('soged_token');
        const userData = localStorage.getItem('soged_user');
        
        if (token && userData) {
            try {
                return JSON.parse(userData);
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
        
        // Fallback to legacy format if Soged format not found
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userEmail = localStorage.getItem('userEmail');
        const userName = localStorage.getItem('userName');
        const username = localStorage.getItem('username');
        
        if (isLoggedIn === 'true' && userEmail && userName) {
            // Convert legacy format to Soged format and save it
            const userData = {
                name: userName,
                email: userEmail,
                username: username || userEmail.split('@')[0] || 'usuario',
                role: 'user',
                subscription: 'basic'
            };
            
            // Save in Soged format for future use
            localStorage.setItem('soged_token', 'dummy_token_' + Date.now());
            localStorage.setItem('soged_user', JSON.stringify(userData));
            
            return userData;
        }
        
        return null;
    }

    async checkAuthentication() {
        // Check Supabase session instead of currentUser
        if (typeof supabaseClient !== 'undefined') {
            try {
                const { data: { session } } = await supabaseClient.auth.getSession();
                if (!session) {
                    // Allow guest mode - set guest user data
                    const guestData = {
                        name: 'Explorer',
                        username: 'Explorer',
                        email: 'guest@soged.org',
                        role: 'guest',
                        subscription: 'basic'
                    };
                    localStorage.setItem('soged_token', 'guest_token');
                    localStorage.setItem('soged_user', JSON.stringify(guestData));
                    this.currentUser = guestData;
                    return true;
                }
                return true;
            } catch (error) {
                console.error('Error checking authentication:', error);
                // Allow guest mode on error
                const guestData = {
                    name: 'Explorer',
                    username: 'Explorer',
                    email: 'guest@soged.org',
                    role: 'guest',
                    subscription: 'basic'
                };
                localStorage.setItem('soged_token', 'guest_token');
                localStorage.setItem('soged_user', JSON.stringify(guestData));
                this.currentUser = guestData;
                return true;
            }
        } else {
            // Allow guest mode if Supabase not available
            const guestData = {
                name: 'Explorer',
                username: 'Explorer',
                email: 'guest@soged.org',
                role: 'guest',
                subscription: 'basic'
            };
            localStorage.setItem('soged_token', 'guest_token');
            localStorage.setItem('soged_user', JSON.stringify(guestData));
            this.currentUser = guestData;
            return true;
        }
    }

    updateUserInfo() {
        if (typeof GunaUserData !== 'undefined') {
            GunaUserData.applyProfileToUI();
        } else if (this.currentUser) {
            const displayName = this.getDisplayUsername();

            const usernameElement = document.querySelector('.username');
            if (usernameElement) {
                usernameElement.textContent = displayName;
            }

            const dropdownUsername = document.querySelector('.dropdown-username');
            if (dropdownUsername) {
                dropdownUsername.textContent = displayName;
            }

            const profileUsername = document.querySelector('.profile-username');
            if (profileUsername) {
                profileUsername.textContent = this.currentUser.name || displayName;
            }

            const usernameInput = document.getElementById('username');
            if (usernameInput) {
                usernameInput.value = this.currentUser.name || displayName;
            }

            const emailElement = document.querySelector('.profile-email');
            if (emailElement && this.currentUser.email) {
                emailElement.textContent = this.currentUser.email;
            }
        }

        const stats = this.getUserStats();
        const pathBar = document.querySelector('[data-path-progress]');
        const pathPercent = document.querySelector('[data-path-percent]');
        if (pathBar) pathBar.style.width = `${stats.pathProgress}%`;
        if (pathPercent) pathPercent.textContent = `${stats.pathProgress}% complete`;

        if (typeof CocosEconomy !== 'undefined') {
            CocosEconomy.updateAllDisplays();
        }
        if (typeof GunaLives !== 'undefined') {
            GunaLives.updateDisplays();
        }
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

    switchCourse(courseId) {
        if (courseId !== 'guna') {
            this.showNotification('Coming Soon — only Guna is available right now!', 'info');
            document.getElementById('courseDropdown')?.classList.remove('show');
            return;
        }
        if (courseId === this.currentCourse) return;

        const courses = {
            'guna': { name: 'Guna', flag: '🏝️', desc: 'Island Culture' }
        };

        const course = courses[courseId];
        if (!course) return;

        this.currentCourse = courseId;
        localStorage.setItem('currentCourse', courseId);

        const url = new URL(window.location);
        url.searchParams.set('course', courseId);
        window.history.pushState({}, '', url);

        this.updateCourseDisplay(course);
        document.getElementById('courseDropdown')?.classList.remove('show');

        if (['learn', 'stories'].includes(this.currentSection)) {
            this.loadSection(this.currentSection);
        }

        this.showNotification(`Switched to ${course.name}! 🎯`, 'success');
    }

    updateCourseDisplay(course) {
        const flagEl = document.querySelector('.course-flag');
        if (flagEl) {
            if (this.currentCourse === 'guna') {
                flagEl.innerHTML = '<img src="../Images/Soged/mola-icon.png" alt="Guna" class="course-flag-img" data-no-mola-attribution="true">';
                flagEl.classList.add('course-flag-img-wrap');
            } else {
                flagEl.classList.remove('course-flag-img-wrap');
                flagEl.textContent = course.flag || '';
            }
        }
        const nameEl = document.querySelector('.course-name');
        if (nameEl) nameEl.textContent = course.name;
        const descEl = document.querySelector('.course-desc');
        if (descEl) descEl.textContent = course.desc || course.description || '';

        document.querySelectorAll('.course-option').forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-course') === this.currentCourse) {
                option.classList.add('active');
            }
        });
    }

    setupUserMenu() {
        const userAvatarBtn = document.getElementById('userAvatarBtn');
        const userDropdown = document.getElementById('userDropdown');

        if (userAvatarBtn) {
            userAvatarBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu-container')) {
                userDropdown.classList.remove('show');
            }
        });

        // Handle dropdown actions
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.getAttribute('data-action');
                this.handleUserAction(action);
                userDropdown.classList.remove('show');
            });
        });
    }

    setupModals() {
        // Setup modal close buttons
        document.querySelectorAll('.modal-close, [data-modal]').forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.getAttribute('data-modal');
                if (modalId) {
                    this.closeModal(modalId);
                }
            });
        });

        // Close modal when clicking overlay
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('show');
                }
            });
        });
    }

    setupProfileAndSettings() {
        if (typeof GunaUserData === 'undefined') return;

        let selectedAvatar = GunaUserData.getProfile().avatar;

        const avatarGrid = document.getElementById('avatarPickerGrid');
        if (avatarGrid) {
            avatarGrid.innerHTML = GunaUserData.AVATARS.map(src => `
                <button type="button" class="avatar-option ${src === selectedAvatar ? 'selected' : ''}" data-avatar="${src}">
                    <img src="${src}" alt="Avatar option">
                </button>
            `).join('');
            avatarGrid.querySelectorAll('.avatar-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    selectedAvatar = btn.dataset.avatar;
                    avatarGrid.querySelectorAll('.avatar-option').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    document.querySelectorAll('.profile-avatar-img').forEach(img => { img.src = selectedAvatar; });
                });
            });
        }

        document.querySelector('.change-avatar-btn')?.addEventListener('click', () => {
            const picker = document.getElementById('avatarPicker');
            if (picker) picker.hidden = !picker.hidden;
        });

        document.getElementById('saveProfileBtn')?.addEventListener('click', () => {
            const profile = GunaUserData.saveProfile({
                username: document.getElementById('username')?.value?.trim() || 'Explorer',
                email: document.getElementById('email')?.value?.trim() || '',
                bio: document.getElementById('bio')?.value?.trim() || '',
                avatar: selectedAvatar,
                goals: {
                    cultural: !!document.getElementById('goalCultural')?.checked,
                    fluent: !!document.getElementById('goalFluent')?.checked,
                    teaching: !!document.getElementById('goalTeaching')?.checked,
                    research: !!document.getElementById('goalResearch')?.checked
                }
            });
            this.currentUser = this.getCurrentUser();
            GunaUserData.applyProfileToUI(profile);
            this.updateUserInfo();
            this.closeModal('profileModal');
            this.showNotification(typeof GunaI18n !== 'undefined' ? GunaI18n.t('profileSaved') : 'Profile saved!', 'success');
        });

        document.getElementById('saveSettingsBtn')?.addEventListener('click', () => {
            const settings = GunaUserData.saveSettings({
                theme: document.getElementById('settingTheme')?.value || 'light',
                language: document.getElementById('settingLanguage')?.value || 'en',
                dailyReminders: !!document.getElementById('settingDailyReminders')?.checked,
                achievementNotif: !!document.getElementById('settingAchievementNotif')?.checked,
                streakReminders: !!document.getElementById('settingStreakReminders')?.checked,
                audioPlayback: !!document.getElementById('settingAudioPlayback')?.checked,
                speechRecognition: !!document.getElementById('settingSpeechRecognition')?.checked,
                dailyGoal: parseInt(document.getElementById('settingDailyGoal')?.value || '100', 10),
                difficulty: document.getElementById('settingDifficulty')?.value || 'intermediate'
            });
            if (settings.theme === 'dark') {
                document.body.classList.add('dark-mode');
            } else if (settings.theme === 'light') {
                document.body.classList.remove('dark-mode');
            } else if (settings.theme === 'auto') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.body.classList.toggle('dark-mode', prefersDark);
            }
            if (typeof GunaI18n !== 'undefined') GunaI18n.setLanguage(settings.language);
            this.closeModal('settingsModal');
            this.showNotification(typeof GunaI18n !== 'undefined' ? GunaI18n.t('settingsSaved') : 'Settings saved!', 'success');
        });

        document.getElementById('profileModal')?.addEventListener('click', (e) => {
            if (e.target.closest('.modal-header') || e.target.closest('.modal-content')) {
                GunaUserData.applyProfileToUI();
                GunaUserData.applySettingsToForm();
            }
        });
    }

    handleUserAction(action) {
        switch(action) {
            case 'dashboard':
                this.loadSection('overview');
                break;
            case 'profile':
                if (typeof GunaUserData !== 'undefined') {
                    GunaUserData.applyProfileToUI();
                    const p = GunaUserData.getProfile();
                    const goalCultural = document.getElementById('goalCultural');
                    const goalFluent = document.getElementById('goalFluent');
                    const goalTeaching = document.getElementById('goalTeaching');
                    const goalResearch = document.getElementById('goalResearch');
                    if (goalCultural) goalCultural.checked = !!p.goals?.cultural;
                    if (goalFluent) goalFluent.checked = !!p.goals?.fluent;
                    if (goalTeaching) goalTeaching.checked = !!p.goals?.teaching;
                    if (goalResearch) goalResearch.checked = !!p.goals?.research;
                }
                this.openModal('profileModal');
                break;
            case 'settings':
                if (typeof GunaUserData !== 'undefined') GunaUserData.applySettingsToForm();
                this.openModal('settingsModal');
                break;
            case 'logout':
                this.logout();
                break;
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
        }
    }

    async logout() {
        // Show confirmation first
        if (!confirm('Are you sure you want to log out?')) {
            return;
        }
        
        // Sign out from Supabase
        if (typeof supabaseClient !== 'undefined') {
            try {
                await supabaseClient.auth.signOut();
                console.log('Successfully signed out from Supabase');
            } catch (error) {
                console.error('Error signing out from Supabase:', error);
            }
        }
        
        // Clear user data
        localStorage.removeItem('currentCourse');
        localStorage.removeItem('sidebarCollapsed');
        localStorage.removeItem('userProgress');
        
        // Clear Soged authentication data
        localStorage.removeItem('soged_token');
        localStorage.removeItem('soged_user');
        
        // Clear any remaining Supabase session data
        localStorage.removeItem('sb-ocmxpaxhcdwrfycsojyc-auth-token');
        
        // Redirect to login page instead of main page
        window.location.href = '../auth/login.html';
    }

    loadInitialSection() {
        const section = this.resolveSectionFromUrl();
        this.loadSection(section, true);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#2ECC71' : type === 'error' ? '#e74c3c' : '#00A3E0',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            fontSize: '0.9rem',
            fontWeight: '500'
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Global function for switching courses from overview
window.switchCourse = function(courseId) {
    if (window.learningHub) {
        window.learningHub.switchCourse(courseId);
    }
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.learningHub = new SimpleLearningHub();
});

// Make it globally accessible
window.SimpleLearningHub = SimpleLearningHub;
