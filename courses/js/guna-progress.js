/**
 * Guna Learning Path — lesson progress, unlocks & session resume
 */
const GunaProgress = {
    STORAGE_KEY: 'guna_lesson_progress',
    TOTAL_LESSONS: 20,

    getProgress() {
        try {
            const data = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || 'null');
            if (data && Array.isArray(data.completed)) {
                return {
                    completed: [],
                    current: 1,
                    sessions: {},
                    maxCompletedLevel: 0,
                    ...data
                };
            }
        } catch { /* ignore */ }
        return { completed: [], current: 1, sessions: {}, maxCompletedLevel: 0 };
    },

    saveProgress(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    isCompleted(lessonId) {
        return this.getProgress().completed.includes(lessonId);
    },

    canAccessLesson(lessonId, allowReview = false) {
        const id = parseInt(lessonId, 10);
        if (allowReview && this.isCompleted(id)) return true;
        if (id === 1) return true;
        const progress = this.getProgress();
        const maxCompleted = Number.isFinite(progress.maxCompletedLevel)
            ? progress.maxCompletedLevel
            : Math.max(0, ...(progress.completed || [0]));
        return id <= maxCompleted + 1 && (progress.completed.includes(id - 1) || maxCompleted >= id - 1);
    },

    getLessonsWithStatus(baseLessons) {
        const progress = this.getProgress();
        const completed = progress.completed;
        let foundCurrent = false;

        return baseLessons.map(lesson => {
            if (completed.includes(lesson.id)) {
                return { ...lesson, status: 'completed' };
            }
            if (!foundCurrent && (lesson.id === 1 || completed.includes(lesson.id - 1))) {
                foundCurrent = true;
                return { ...lesson, status: 'current' };
            }
            return { ...lesson, status: 'locked' };
        });
    },

    saveLessonSession(lessonId, sessionData) {
        const progress = this.getProgress();
        progress.sessions = progress.sessions || {};
        progress.sessions[String(lessonId)] = {
            ...sessionData,
            updatedAt: Date.now()
        };
        this.saveProgress(progress);
    },

    getLessonSession(lessonId) {
        const progress = this.getProgress();
        return progress.sessions?.[String(lessonId)] || null;
    },

    clearLessonSession(lessonId) {
        const progress = this.getProgress();
        if (progress.sessions) {
            delete progress.sessions[String(lessonId)];
        }
        this.saveProgress(progress);
    },

    async completeLesson(lessonId) {
        const id = parseInt(lessonId, 10);
        if (!this.canAccessLesson(id)) return this.getProgress();

        const progress = this.getProgress();
        if (!progress.completed.includes(id)) {
            progress.completed.push(id);
            progress.completed.sort((a, b) => a - b);
        }
        progress.maxCompletedLevel = Math.max(
            Number(progress.maxCompletedLevel) || 0,
            id,
            ...progress.completed
        );
        const next = id + 1;
        progress.current = next <= this.TOTAL_LESSONS ? next : id;
        this.clearLessonSession(id);
        this.saveProgress(progress);

        try {
            if (typeof SogedSession !== 'undefined') {
                const result = await SogedSession.api('/api/v1/progress/complete', {
                    method: 'POST',
                    body: {
                        levelId: id,
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
                        idempotencyKey: `complete-level-${id}`
                    }
                });
                if (result.progress) {
                    this.saveProgress({
                        ...this.getProgress(),
                        completed: result.progress.completed || progress.completed,
                        current: result.progress.current || progress.current,
                        maxCompletedLevel: result.progress.maxCompletedLevel
                    });
                }
                if (result.ogods != null && typeof CocosEconomy !== 'undefined') {
                    CocosEconomy.setBalance(result.ogods);
                }
                if (typeof GunaGamification !== 'undefined' && result.progress) {
                    const state = GunaGamification.getState();
                    state.xp = result.progress.xp;
                    state.level = result.progress.level;
                    state.streak = result.progress.streak;
                    state.lastStudyDate = result.progress.lastStudyDate;
                    state.totalLessons = Math.max(state.totalLessons || 0, id);
                    GunaGamification.saveState(state);
                }
                window.dispatchEvent(new CustomEvent('soged:progress-updated', { detail: result }));
                return this.getProgress();
            }
        } catch (error) {
            console.warn('Progress sync failed, keeping local completion:', error);
        }

        if (typeof CocosEconomy !== 'undefined') {
            CocosEconomy.addOggob(25);
        }
        return this.getProgress();
    },

    async syncFromServer() {
        if (typeof SogedSession === 'undefined') return this.getProgress();
        try {
            const data = await SogedSession.api('/api/v1/progress');
            if (data?.progress) {
                const current = this.getProgress();
                this.saveProgress({
                    ...current,
                    completed: data.progress.completed || current.completed,
                    current: data.progress.current || current.current,
                    maxCompletedLevel: data.progress.maxCompletedLevel
                });
                if (typeof GunaGamification !== 'undefined') {
                    const state = GunaGamification.getState();
                    state.xp = data.progress.xp ?? state.xp;
                    state.level = data.progress.level ?? state.level;
                    state.streak = data.progress.streak ?? state.streak;
                    state.lastStudyDate = data.progress.lastStudyDate ?? state.lastStudyDate;
                    GunaGamification.saveState(state);
                }
            }
        } catch (error) {
            console.warn('Could not sync progress:', error);
        }
        return this.getProgress();
    },

    getCompletedCount() {
        return this.getProgress().completed.length;
    }
};

window.GunaProgress = GunaProgress;
