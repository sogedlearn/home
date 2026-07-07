/**
 * Interface translations — English / Español
 */
const GunaI18n = {
    STORAGE_KEY: 'guna_ui_language',

    strings: {
        en: {
            overview: 'Overview', learn: 'Learning Path', vocabulary: 'Vocabulary', store: 'Guna Store',
            stories: 'Stories', chat: 'AI Tutor', community: 'Culture Center', leaderboard: 'Leaderboard',
            achievements: 'Achievements', streak: 'streak', lives: 'burba', cocos: 'Ogob',
            saveChanges: 'Save Changes', saveSettings: 'Save Settings', cancel: 'Cancel',
            profileTitle: 'Your Profile', settingsTitle: 'Settings',
            noLives: 'No burba left! Visit the store to buy more or wait for regeneration.',
            livesLost: 'You lost a burba!',
            purchaseSuccess: 'Purchase successful!',
            notEnoughCocos: 'Not enough ogob.',
            profileSaved: 'Profile saved successfully!',
            settingsSaved: 'Settings saved successfully!',
            locked: 'Locked', startLesson: 'Start Lesson', review: 'Review',
            complete: 'Complete Lesson', outOfLives: 'Out of Burba'
        },
        es: {
            overview: 'Inicio', learn: 'Ruta de Aprendizaje', vocabulary: 'Vocabulario', store: 'Tienda Guna',
            stories: 'Historias', chat: 'Tutor IA', community: 'Centro Cultural', leaderboard: 'Clasificación',
            achievements: 'Logros', streak: 'racha', lives: 'vidas', cocos: 'Cocos',
            saveChanges: 'Guardar Cambios', saveSettings: 'Guardar Configuración', cancel: 'Cancelar',
            profileTitle: 'Tu Perfil', settingsTitle: 'Configuración',
            noLives: '¡Sin vidas! Visita la tienda o espera la regeneración.',
            livesLost: '¡Perdiste una vida!',
            purchaseSuccess: '¡Compra exitosa!',
            notEnoughCocos: 'No tienes suficientes cocos.',
            profileSaved: '¡Perfil guardado correctamente!',
            settingsSaved: '¡Configuración guardada correctamente!',
            locked: 'Bloqueado', startLesson: 'Iniciar Lección', review: 'Repasar',
            complete: 'Completar Lección', outOfLives: 'Sin Vidas'
        }
    },

    getLanguage() {
        const settings = typeof GunaUserData !== 'undefined' ? GunaUserData.getSettings() : null;
        return settings?.language || localStorage.getItem(this.STORAGE_KEY) || 'en';
    },

    setLanguage(lang) {
        localStorage.setItem(this.STORAGE_KEY, lang);
        this.apply();
    },

    t(key) {
        const lang = this.getLanguage();
        return this.strings[lang]?.[key] || this.strings.en[key] || key;
    },

    apply() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const text = this.t(key);
            if (text) el.textContent = text;
        });
    }
};

window.GunaI18n = GunaI18n;
