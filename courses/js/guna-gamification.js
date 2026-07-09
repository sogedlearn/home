/**
 * Guna Gamification — XP, levels, streaks, badges
 */
const GunaGamification = {
    STORAGE_KEY: 'guna_gamification',

    BADGE_CATALOG: [
        // Vocabulary
        { id: 'first-word', category: 'vocabulary', icon: '📝', title: 'First Word Learned', description: 'Learn your first Guna word', check: () => GunaGamification.getVocabCount() >= 1 },
        { id: 'vocab-25', category: 'vocabulary', icon: '📖', title: '25 Words Learned', description: 'Master 25 vocabulary words', check: () => GunaGamification.getVocabCount() >= 25 },
        { id: 'vocab-50', category: 'vocabulary', icon: '📚', title: '50 Words Learned', description: 'Master 50 vocabulary words', check: () => GunaGamification.getVocabCount() >= 50 },
        { id: 'vocab-100', category: 'vocabulary', icon: '🎓', title: '100 Words Learned', description: 'Master 100 vocabulary words', check: () => GunaGamification.getVocabCount() >= 100 },
        { id: 'vocab-master', category: 'vocabulary', icon: '🏆', title: 'Vocabulary Master', description: 'Learn all dictionary words', check: () => GunaGamification.getVocabCount() >= 60 },
        // Learning path
        { id: 'first-lesson', category: 'learning', icon: '🎯', title: 'First Lesson Completed', description: 'Complete your first lesson', check: () => (GunaProgress?.getCompletedCount() || 0) >= 1 },
        { id: 'first-unit', category: 'learning', icon: '📦', title: 'First Unit Completed', description: 'Complete 3 lessons', check: () => (GunaProgress?.getCompletedCount() || 0) >= 3 },
        { id: 'learning-explorer', category: 'learning', icon: '🧭', title: 'Learning Explorer', description: 'Complete 5 lessons', check: () => (GunaProgress?.getCompletedCount() || 0) >= 5 },
        { id: 'learning-champion', category: 'learning', icon: '⭐', title: 'Learning Champion', description: 'Complete 8 lessons', check: () => (GunaProgress?.getCompletedCount() || 0) >= 8 },
        { id: 'path-master', category: 'learning', icon: '👑', title: 'Path Master', description: 'Complete all 10 lessons', check: () => (GunaProgress?.getCompletedCount() || 0) >= 10 },
        { id: 'guna-master', category: 'learning', icon: '🏝️', title: 'Guna Grand Master', description: 'Beat the final challenge', check: () => (GunaProgress?.getCompletedCount() || 0) >= 10 },
        // Community
        { id: 'history-explorer', category: 'community', icon: '📜', title: 'History Explorer', description: 'Visit the History section', check: () => localStorage.getItem('guna_history_visited') === '1' },
        { id: 'culture-enthusiast', category: 'community', icon: '🧵', title: 'Culture Enthusiast', description: 'Explore Guna culture', check: () => localStorage.getItem('guna_culture_visited') === '1' },
        { id: 'territory-expert', category: 'community', icon: '🗺️', title: 'Territory Expert', description: 'Explore the Guna territory map', check: () => localStorage.getItem('guna_territory_visited') === '1' },
        { id: 'mola-collector', category: 'community', icon: '🎨', title: 'Mola Collector', description: 'Purchase a mola in the store', check: () => CocosEconomy?.isPurchased('mola-colibri') || CocosEconomy?.isPurchased('mola-coco') },
        // Streaks
        { id: 'streak-3', category: 'streak', icon: '🔥', title: '3-Day Streak', description: 'Study 3 days in a row', check: () => GunaGamification.getState().streak >= 3 },
        { id: 'streak-7', category: 'streak', icon: '🔥', title: '7-Day Streak', description: 'Study 7 days in a row', check: () => GunaGamification.getState().streak >= 7 },
        { id: 'streak-15', category: 'streak', icon: '💪', title: '15-Day Streak', description: 'Study 15 days in a row', check: () => GunaGamification.getState().streak >= 15 },
        { id: 'streak-30', category: 'streak', icon: '🌟', title: '30-Day Streak', description: 'Study 30 days in a row', check: () => GunaGamification.getState().streak >= 30 },
        { id: 'streak-100', category: 'streak', icon: '💎', title: '100-Day Streak', description: 'Study 100 days in a row', check: () => GunaGamification.getState().streak >= 100 },
        // Special
        { id: 'ai-expert', category: 'special', icon: '🤖', title: 'AI Conversation Expert', description: 'Have 10+ AI tutor messages', check: () => parseInt(localStorage.getItem('guna_ai_messages') || '0', 10) >= 10 },
        { id: 'perfect-lesson', category: 'special', icon: '💯', title: 'Perfect Lesson', description: 'Score 100% on a lesson quiz', check: () => localStorage.getItem('guna_perfect_quiz') === '1' },
        { id: 'no-mistakes', category: 'special', icon: '✨', title: 'No Mistakes Challenge', description: 'Complete a memory game perfectly', check: () => localStorage.getItem('guna_memory_perfect') === '1' },
        { id: 'guna-ambassador', category: 'special', icon: '🏅', title: 'Guna Language Ambassador', description: 'Earn 20 badges', check: () => GunaGamification.getState().badges.length >= 20 },
        { id: 'leader-week', category: 'special', icon: '🥇', title: 'Weekly Champion', description: 'Top the weekly leaderboard', check: () => GunaGamification.getState().badges.includes('leader-week') },
        { id: 'leader-month', category: 'special', icon: '🏆', title: 'Monthly Champion', description: 'Top the monthly leaderboard', check: () => GunaGamification.getState().badges.includes('leader-month') }
    ],

    defaults() {
        return { xp: 0, level: 1, streak: 0, lastStudyDate: null, badges: [], totalLessons: 0, memoryGamesWon: 0 };
    },

    getState() {
        try {
            const data = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || 'null');
            if (data) return { ...this.defaults(), ...data };
        } catch { /* ignore */ }
        return this.defaults();
    },

    saveState(state) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
        this.updateDisplays(state);
    },

    getVocabCount() {
        try { return JSON.parse(localStorage.getItem('guna_vocab_learned') || '[]').length; } catch { return 0; }
    },

    recordVocabWord(guna) {
        try {
            const list = JSON.parse(localStorage.getItem('guna_vocab_learned') || '[]');
            if (!list.includes(guna)) {
                list.push(guna);
                localStorage.setItem('guna_vocab_learned', JSON.stringify(list));
                this.checkAllBadges();
            }
        } catch { /* ignore */ }
    },

    xpForLevel(level) {
        return level * 200;
    },

    addXP(amount) {
        const state = this.getState();
        state.xp += amount;
        while (state.xp >= this.xpForLevel(state.level)) {
            state.xp -= this.xpForLevel(state.level);
            state.level++;
        }
        this.saveState(state);
        this.checkAllBadges();
        return state;
    },

    recordStudyDay() {
        const state = this.getState();
        const today = new Date().toISOString().slice(0, 10);
        if (state.lastStudyDate === today) return state;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().slice(0, 10);
        state.streak = state.lastStudyDate === yStr ? state.streak + 1 : 1;
        state.lastStudyDate = today;
        this.saveState(state);
        this.checkAllBadges();
        return state;
    },

    onLessonComplete(lessonId, xpReward = 50) {
        const state = this.getState();
        state.totalLessons = Math.max(state.totalLessons, lessonId);
        this.saveState(state);
        this.recordStudyDay();
        this.checkAllBadges();
        return this.addXP(xpReward);
    },

    onMemoryGameComplete(perfect = false) {
        const state = this.getState();
        state.memoryGamesWon = (state.memoryGamesWon || 0) + 1;
        this.saveState(state);
        if (perfect) localStorage.setItem('guna_memory_perfect', '1');
        this.addXP(perfect ? 40 : 20);
        if (typeof CocosEconomy !== 'undefined') CocosEconomy.addOggob(perfect ? 15 : 8);
        this.checkAllBadges();
    },

    awardBadge(badgeId, silent = false) {
        const state = this.getState();
        if (!state.badges.includes(badgeId)) {
            state.badges.push(badgeId);
            this.saveState(state);
            if (!silent && typeof window.showNotification === 'function') {
                const badge = this.BADGE_CATALOG.find(b => b.id === badgeId);
                window.showNotification(`🏅 Badge unlocked: ${badge?.title || badgeId}!`, 'success');
            }
        }
        return state;
    },

    checkAllBadges() {
        const state = this.getState();
        this.BADGE_CATALOG.forEach(badge => {
            try {
                if (badge.check() && badge.id && !state.badges.includes(badge.id)) {
                    this.awardBadge(badge.id, true);
                }
            } catch { /* ignore */ }
        });
    },

    getBadgesForUI(category = 'all') {
        const state = this.getState();
        return this.BADGE_CATALOG
            .filter(b => category === 'all' || b.category === category)
            .map(b => ({
                ...b,
                status: state.badges.includes(b.id) ? 'unlocked' : (b.check() ? 'unlocked' : 'locked'),
                reward: '+50 XP'
            }));
    },

    updateDisplays(state) {
        state = state || this.getState();
        const xpNext = this.xpForLevel(state.level);
        const pct = Math.round((state.xp / xpNext) * 100);

        document.querySelectorAll('[data-user-level]').forEach(el => { el.textContent = state.level; });
        document.querySelectorAll('[data-user-xp]').forEach(el => { el.textContent = state.xp.toLocaleString('en-US'); });
        document.querySelectorAll('.xp-current').forEach(el => { el.textContent = `${state.xp.toLocaleString('en-US')} XP`; });
        document.querySelectorAll('.xp-fill').forEach(el => { el.style.width = `${pct}%`; });
        document.querySelectorAll('.xp-next').forEach(el => { el.textContent = `Next: ${xpNext.toLocaleString('en-US')} XP`; });
        document.querySelectorAll('.level-badge').forEach(el => { el.textContent = state.level; });
        document.querySelectorAll('[data-streak-count]').forEach(el => { el.textContent = state.streak; });
        document.querySelectorAll('[data-badge-count]').forEach(el => { el.textContent = state.badges.length; });
    }
};

window.GunaGamification = GunaGamification;
