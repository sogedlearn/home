/**
 * User profile & settings persistence (localStorage — synced with soged_user)
 */
const GunaUserData = {
    PROFILE_KEY: 'guna_user_profile',
    SETTINGS_KEY: 'guna_user_settings',

    AVATARS: [
        '../Multimedia/Images/Soged/Newturttle.png',
        '../Multimedia/Images/Soged/mola-icon.png',
        '../Multimedia/Images/Soged/LOGO SOGED.png',
        '../Multimedia/Images/Molas - Guna/Mola 1.jpg',
        '../Multimedia/Images/Molas - Guna/Mola 3.jpg'
    ],

    defaultProfile() {
        const user = this.getAuthUser();
        return {
            username: user?.username || user?.name || 'Explorer',
            email: user?.email || '',
            bio: 'Passionate about preserving indigenous languages and cultures of Panama.',
            avatar: '../Multimedia/Images/Soged/Newturttle.png',
            title: 'Cultural Ambassador',
            goals: { cultural: true, fluent: true, teaching: false, research: false }
        };
    },

    defaultSettings() {
        return {
            theme: 'light',
            language: 'en',
            dailyReminders: true,
            achievementNotif: true,
            streakReminders: false,
            audioPlayback: true,
            speechRecognition: true,
            dailyGoal: 100,
            difficulty: 'intermediate'
        };
    },

    getAuthUser() {
        try {
            const data = localStorage.getItem('soged_user');
            if (data) return JSON.parse(data);
        } catch { /* ignore */ }
        return null;
    },

    syncAuthUser(profile) {
        const user = this.getAuthUser() || {};
        user.username = profile.username;
        user.name = profile.username;
        user.email = profile.email;
        user.bio = profile.bio;
        user.avatar = profile.avatar;
        localStorage.setItem('soged_user', JSON.stringify(user));
        localStorage.setItem('userName', profile.username);
        if (profile.email) localStorage.setItem('userEmail', profile.email);
    },

    getProfile() {
        try {
            const data = JSON.parse(localStorage.getItem(this.PROFILE_KEY) || 'null');
            if (data) return { ...this.defaultProfile(), ...data };
        } catch { /* ignore */ }
        return this.defaultProfile();
    },

    saveProfile(profile) {
        const merged = { ...this.getProfile(), ...profile };
        localStorage.setItem(this.PROFILE_KEY, JSON.stringify(merged));
        this.syncAuthUser(merged);
        return merged;
    },

    getSettings() {
        try {
            const data = JSON.parse(localStorage.getItem(this.SETTINGS_KEY) || 'null');
            if (data) return { ...this.defaultSettings(), ...data };
        } catch { /* ignore */ }
        const theme = localStorage.getItem('gunaTheme');
        const base = this.defaultSettings();
        if (theme === 'dark') base.theme = 'dark';
        return base;
    },

    saveSettings(settings) {
        const merged = { ...this.getSettings(), ...settings };
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(merged));
        if (merged.theme === 'dark') {
            document.body.classList.add('dark-mode');
            localStorage.setItem('gunaTheme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('gunaTheme', 'light');
        }
        if (typeof GunaI18n !== 'undefined') {
            GunaI18n.setLanguage(merged.language);
        }
        return merged;
    },

    applyProfileToUI(profile) {
        profile = profile || this.getProfile();
        const name = profile.username;
        document.querySelectorAll('.username, .dropdown-username, .profile-username').forEach(el => {
            if (el) el.textContent = name;
        });
        const input = document.getElementById('profileUsername');
        if (input) input.value = name;
        const usernameInput = document.getElementById('username');
        if (usernameInput) usernameInput.value = name;
        const emailInput = document.getElementById('email');
        if (emailInput) emailInput.value = profile.email || '';
        const bioInput = document.getElementById('bio');
        if (bioInput) bioInput.value = profile.bio || '';
        document.querySelectorAll('.profile-avatar-img, .avatar-img, .header-avatar').forEach(el => {
            if (el && profile.avatar) el.src = profile.avatar;
        });
        if (typeof GunaGamification !== 'undefined') {
            const state = GunaGamification.getState();
            const xpNext = GunaGamification.xpForLevel(state.level);
            const levelEl = document.querySelector('.profile-level');
            if (levelEl) levelEl.textContent = `Level ${state.level} • ${profile.title}`;
            const xpEl = document.querySelector('.profile-xp');
            if (xpEl) xpEl.textContent = `${state.xp.toLocaleString()} / ${xpNext.toLocaleString()} XP to next level`;
        }
    },

    applySettingsToForm(settings) {
        settings = settings || this.getSettings();
        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
        const setChk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = !!val; };
        setVal('settingTheme', settings.theme);
        setVal('settingLanguage', settings.language);
        setVal('settingDailyGoal', String(settings.dailyGoal));
        setVal('settingDifficulty', settings.difficulty);
        setChk('settingDailyReminders', settings.dailyReminders);
        setChk('settingAchievementNotif', settings.achievementNotif);
        setChk('settingStreakReminders', settings.streakReminders);
        setChk('settingAudioPlayback', settings.audioPlayback);
        setChk('settingSpeechRecognition', settings.speechRecognition);
    }
};

window.GunaUserData = GunaUserData;
