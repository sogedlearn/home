/**
 * Guna Learning Path — lesson progress, unlocks & session resume
 */
const GunaProgress = {
    STORAGE_KEY: 'guna_lesson_progress',
    TOTAL_LESSONS: 10,

    getProgress() {
        try {
            const data = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || 'null');
            if (data && Array.isArray(data.completed)) {
                return {
                    completed: [],
                    current: 1,
                    sessions: {},
                    ...data
                };
            }
        } catch { /* ignore */ }
        return { completed: [], current: 1, sessions: {} };
    },

    saveProgress(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    isCompleted(lessonId) {
        return this.getProgress().completed.includes(lessonId);
    },

    canAccessLesson(lessonId, allowReview = false) {
        // Allow access to all lessons without restrictions
        return true;
    },

    getLessonsWithStatus(baseLessons) {
        const progress = this.getProgress();
        const completed = progress.completed;

        return baseLessons.map(lesson => {
            if (completed.includes(lesson.id)) {
                return { ...lesson, status: 'completed' };
            }
            // Mark all incomplete lessons as current (accessible)
            return { ...lesson, status: 'current' };
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

    completeLesson(lessonId) {
        const id = parseInt(lessonId, 10);
        if (!this.canAccessLesson(id)) return this.getProgress();

        const progress = this.getProgress();
        if (!progress.completed.includes(id)) {
            progress.completed.push(id);
            progress.completed.sort((a, b) => a - b);
        }
        const next = id + 1;
        progress.current = next <= this.TOTAL_LESSONS ? next : id;
        this.clearLessonSession(id);
        this.saveProgress(progress);

        if (typeof OgobEconomy !== 'undefined') {
            OgobEconomy.addOgob(25);
        }
        return progress;
    },

    getCompletedCount() {
        return this.getProgress().completed.length;
    }
};

window.GunaProgress = GunaProgress;
