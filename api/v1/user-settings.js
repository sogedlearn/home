const express = require('express');
const { requireAuth } = require('../lib/auth-middleware');
const { isSupabaseConfigured, createAdminClient } = require('../lib/supabase-admin');
const memoryStore = require('../lib/memory-store');
const {
    validateSettingsPatch,
    toClientSettings,
    defaultSettings
} = require('../lib/core/settings');

const router = express.Router();

function rowToSettings(row) {
    if (!row) return defaultSettings();
    return {
        displayName: row.display_name || '',
        language: row.language || 'en',
        theme: row.theme || 'light',
        dailyReminders: row.daily_reminders !== false,
        achievementNotif: row.achievement_notif !== false,
        streakReminders: !!row.streak_reminders,
        audioPlayback: row.audio_playback !== false,
        speechRecognition: row.speech_recognition !== false,
        dailyGoal: row.daily_goal || 100,
        difficulty: row.difficulty || 'intermediate'
    };
}

function settingsToRow(userId, settings) {
    return {
        user_id: userId,
        display_name: settings.displayName || '',
        language: settings.language,
        theme: settings.theme,
        daily_reminders: settings.dailyReminders,
        achievement_notif: settings.achievementNotif,
        streak_reminders: settings.streakReminders,
        audio_playback: settings.audioPlayback,
        speech_recognition: settings.speechRecognition,
        daily_goal: settings.dailyGoal,
        difficulty: settings.difficulty,
        updated_at: new Date().toISOString()
    };
}

async function readSettings(userId) {
    if (!isSupabaseConfigured() || process.env.SOGED_TEST_MODE === '1') {
        return memoryStore.getUser(userId).settings;
    }

    const admin = createAdminClient();
    const { data, error } = await admin
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

    if (error && error.code !== 'PGRST116') {
        console.warn('readSettings:', error.message);
    }
    if (!data) return defaultSettings();
    return rowToSettings(data);
}

async function writeSettings(userId, settings) {
    if (!isSupabaseConfigured() || process.env.SOGED_TEST_MODE === '1') {
        const user = memoryStore.getUser(userId);
        user.settings = settings;
        return settings;
    }

    const admin = createAdminClient();
    const { data, error } = await admin
        .from('user_settings')
        .upsert(settingsToRow(userId, settings), { onConflict: 'user_id' })
        .select()
        .single();

    if (error) throw error;
    return rowToSettings(data);
}

router.get('/', requireAuth, async (req, res) => {
    try {
        const settings = await readSettings(req.user.id);
        res.json({ success: true, settings: toClientSettings(settings) });
    } catch (error) {
        console.error('GET settings:', error);
        res.status(500).json({ status: 'error', message: 'No se pudieron leer los ajustes.' });
    }
});

router.patch('/', requireAuth, async (req, res) => {
    try {
        const validated = validateSettingsPatch(req.body || {});
        if (!validated.ok) {
            return res.status(400).json({ status: 'error', message: validated.error });
        }

        const current = await readSettings(req.user.id);
        const merged = { ...current, ...validated.patch };
        const saved = await writeSettings(req.user.id, merged);
        res.json({ success: true, settings: toClientSettings(saved) });
    } catch (error) {
        console.error('PATCH settings:', error);
        res.status(500).json({ status: 'error', message: 'No se pudieron guardar los ajustes.' });
    }
});

module.exports = router;
