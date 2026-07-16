/**
 * Shared navigation and reward flow for Cultural Hub & Games
 */
const HubFlow = {
    handleNext() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    returnHome() {
        if (window.learningHub) {
            window.learningHub.navigateToSection('overview');
        } else {
            window.location.href = 'learning-hub.html#overview';
        }
    },

    renderFinalActions(container, { onNext, nextLabel = 'Next Lesson' } = {}) {
        const el = typeof container === 'string' ? document.querySelector(container) : container;
        if (!el) return;

        el.innerHTML = `
            <div class="hub-final-actions">
                <button type="button" class="hub-btn hub-btn-primary" id="hubNextLessonBtn">
                    <i class="fas fa-arrow-right"></i> ${nextLabel}
                </button>
                <button type="button" class="hub-btn hub-btn-secondary" id="hubReturnHomeBtn">
                    <i class="fas fa-home"></i> Return Home
                </button>
            </div>
        `;

        el.querySelector('#hubNextLessonBtn')?.addEventListener('click', () => {
            HubFlow.handleNext();
            if (typeof onNext === 'function') onNext();
        });

        el.querySelector('#hubReturnHomeBtn')?.addEventListener('click', () => {
            HubFlow.returnHome();
        });
    },

    async getUserId() {
        if (typeof supabaseClient !== 'undefined') {
            try {
                const { data: { session } } = await supabaseClient.auth.getSession();
                if (session?.user?.id) return session.user.id;
            } catch (e) {
                console.warn('Could not get Supabase session:', e);
            }
        }
        let guestId = localStorage.getItem('soged_guest_id');
        if (!guestId) {
            guestId = 'guest_' + Date.now();
            localStorage.setItem('soged_guest_id', guestId);
        }
        return guestId;
    },

    getUserContext() {
        const level = typeof GunaGamification !== 'undefined'
            ? GunaGamification.getState().level
            : parseInt(localStorage.getItem('guna_level') || '1', 10);
        const ogods = typeof CocosEconomy !== 'undefined' ? CocosEconomy.getBalance() : 0;
        const burdas = typeof GunaLives !== 'undefined' ? GunaLives.getLives() : 5;
        const completedLessons = typeof GunaProgress !== 'undefined'
            ? GunaProgress.getCompletedCount()
            : 0;
        const lastReading = localStorage.getItem('guna_last_reading') || 'none';
        const lastGame = localStorage.getItem('guna_last_game') || 'none';

        return { level, ogods, burdas, completedLessons, lastReading, lastGame };
    },

    trackActivity(type, id) {
        if (type === 'reading') localStorage.setItem('guna_last_reading', id);
        if (type === 'game') localStorage.setItem('guna_last_game', id);
    }
};

window.HubFlow = HubFlow;
