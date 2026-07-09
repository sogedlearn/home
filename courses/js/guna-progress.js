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
        const id = parseInt(lessonId, 10);
        if (allowReview && this.isCompleted(id)) return true;
        if (id === 1) return true;
        return this.getProgress().completed.includes(id - 1);
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

        if (typeof CocosEconomy !== 'undefined') {
            CocosEconomy.addOggob(25);
        }
        return progress;
    },

    getCompletedCount() {
        return this.getProgress().completed.length;
    }
};

window.GunaProgress = GunaProgress;
