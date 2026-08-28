/**
 * User settings validation — shared by API and tests.
 * Accepts a partial PATCH; only provided fields are validated and returned.
 */

const SUPPORTED_LANGUAGES = ['en', 'es', 'guna'];
const SUPPORTED_THEMES = ['light', 'dark', 'auto'];
const SUPPORTED_DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const MAX_NAME_LENGTH = 80;
const DAILY_GOALS = [50, 100, 200, 300];

const PATCHABLE = [
    'name',
    'displayName',
    'language',
    'notifications',
    'theme',
    'dailyReminders',
    'achievementNotif',
    'streakReminders',
    'audioPlayback',
    'speechRecognition',
    'dailyGoal',
    'difficulty'
];

function isBool(value) {
    return typeof value === 'boolean';
}

function validateSettingsPatch(body) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return { ok: false, status: 400, error: 'Payload must be a JSON object.' };
    }

    const unknown = Object.keys(body).filter((key) => !PATCHABLE.includes(key));
    if (unknown.length) {
        return { ok: false, status: 400, error: `Unknown fields: ${unknown.join(', ')}` };
    }

    if (Object.keys(body).length === 0) {
        return { ok: false, status: 400, error: 'At least one field is required.' };
    }

    const patch = {};

    const name = body.name ?? body.displayName;
    if (name !== undefined) {
        if (typeof name !== 'string') {
            return { ok: false, status: 400, error: 'Name must be a string.' };
        }
        const trimmed = name.trim();
        if (trimmed.length < 1 || trimmed.length > MAX_NAME_LENGTH) {
            return { ok: false, status: 400, error: `Name must be between 1 and ${MAX_NAME_LENGTH} characters.` };
        }
        patch.displayName = trimmed;
    }

    if (body.language !== undefined) {
        if (!SUPPORTED_LANGUAGES.includes(body.language)) {
            return { ok: false, status: 400, error: `Unsupported language. Allowed: ${SUPPORTED_LANGUAGES.join(', ')}.` };
        }
        patch.language = body.language;
    }

    if (body.theme !== undefined) {
        if (!SUPPORTED_THEMES.includes(body.theme)) {
            return { ok: false, status: 400, error: `Unsupported theme. Allowed: ${SUPPORTED_THEMES.join(', ')}.` };
        }
        patch.theme = body.theme;
    }

    if (body.notifications !== undefined) {
        if (typeof body.notifications === 'boolean') {
            patch.dailyReminders = body.notifications;
        } else if (body.notifications && typeof body.notifications === 'object') {
            const n = body.notifications;
            if (n.dailyReminders !== undefined && !isBool(n.dailyReminders)) {
                return { ok: false, status: 400, error: 'notifications.dailyReminders must be boolean.' };
            }
            if (n.achievementNotif !== undefined && !isBool(n.achievementNotif)) {
                return { ok: false, status: 400, error: 'notifications.achievementNotif must be boolean.' };
            }
            if (n.streakReminders !== undefined && !isBool(n.streakReminders)) {
                return { ok: false, status: 400, error: 'notifications.streakReminders must be boolean.' };
            }
            if (n.dailyReminders !== undefined) patch.dailyReminders = n.dailyReminders;
            if (n.achievementNotif !== undefined) patch.achievementNotif = n.achievementNotif;
            if (n.streakReminders !== undefined) patch.streakReminders = n.streakReminders;
        } else {
            return { ok: false, status: 400, error: 'notifications must be a boolean or an object.' };
        }
    }

    for (const flag of ['dailyReminders', 'achievementNotif', 'streakReminders', 'audioPlayback', 'speechRecognition']) {
        if (body[flag] !== undefined) {
            if (!isBool(body[flag])) {
                return { ok: false, status: 400, error: `${flag} must be boolean.` };
            }
            patch[flag] = body[flag];
        }
    }

    if (body.dailyGoal !== undefined) {
        const goal = Number(body.dailyGoal);
        if (!DAILY_GOALS.includes(goal)) {
            return { ok: false, status: 400, error: `dailyGoal must be one of: ${DAILY_GOALS.join(', ')}.` };
        }
        patch.dailyGoal = goal;
    }

    if (body.difficulty !== undefined) {
        if (!SUPPORTED_DIFFICULTIES.includes(body.difficulty)) {
            return { ok: false, status: 400, error: `Unsupported difficulty. Allowed: ${SUPPORTED_DIFFICULTIES.join(', ')}.` };
        }
        patch.difficulty = body.difficulty;
    }

    return { ok: true, patch };
}

function defaultSettings() {
    return {
        displayName: '',
        language: 'en',
        theme: 'light',
        dailyReminders: true,
        achievementNotif: true,
        streakReminders: false,
        audioPlayback: true,
        speechRecognition: true,
        dailyGoal: 100,
        difficulty: 'intermediate'
    };
}

function applySettingsPatch(current, patch) {
    return { ...defaultSettings(), ...current, ...patch };
}

function toClientSettings(row) {
    return {
        name: row.displayName || '',
        displayName: row.displayName || '',
        language: row.language,
        theme: row.theme,
        notifications: {
            dailyReminders: !!row.dailyReminders,
            achievementNotif: !!row.achievementNotif,
            streakReminders: !!row.streakReminders
        },
        dailyReminders: !!row.dailyReminders,
        achievementNotif: !!row.achievementNotif,
        streakReminders: !!row.streakReminders,
        audioPlayback: row.audioPlayback !== false,
        speechRecognition: row.speechRecognition !== false,
        dailyGoal: row.dailyGoal || 100,
        difficulty: row.difficulty || 'intermediate'
    };
}

module.exports = {
    SUPPORTED_LANGUAGES,
    SUPPORTED_THEMES,
    MAX_NAME_LENGTH,
    validateSettingsPatch,
    defaultSettings,
    applySettingsPatch,
    toClientSettings
};
