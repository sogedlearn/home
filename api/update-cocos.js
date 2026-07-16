const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const DEFAULT_OGODS = 1250;
const DEFAULT_BURDAS = 5;

async function getUserStats(userId) {
    if (!supabase) {
        return { ogods: DEFAULT_OGODS, burdas: DEFAULT_BURDAS };
    }

    const { data, error } = await supabase
        .from('user_stats')
        .select('ogods, burdas')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.warn('getUserStats error:', error.message);
    }

    if (data) {
        return { ogods: data.ogods ?? DEFAULT_OGODS, burdas: data.burdas ?? DEFAULT_BURDAS };
    }

    return { ogods: DEFAULT_OGODS, burdas: DEFAULT_BURDAS };
}

async function upsertUserStats(userId, ogods, burdas) {
    if (!supabase) return { ogods, burdas };

    const { data, error } = await supabase
        .from('user_stats')
        .upsert({
            user_id: userId,
            ogods,
            burdas,
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
        .select()
        .single();

    if (error) {
        console.warn('upsertUserStats error:', error.message);
        return { ogods, burdas };
    }

    return { ogods: data.ogods, burdas: data.burdas };
}

// GET /api/update-cocos?user_id=...
router.get('/', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(400).json({ error: 'user_id is required' });
        }

        const stats = await getUserStats(user_id);
        res.json({ success: true, ...stats });
    } catch (error) {
        console.error('GET update-cocos error:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/update-cocos
router.post('/', async (req, res) => {
    try {
        const { user_id, amount = 0, burda_delta = 0, action, source } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: 'user_id is required' });
        }

        const current = await getUserStats(user_id);
        let ogods = current.ogods;
        let burdas = current.burdas;

        if (action === 'add' || amount > 0) {
            ogods = Math.max(0, ogods + (amount || 0));
        } else if (action === 'spend' && amount < 0) {
            ogods = Math.max(0, ogods + amount);
        }

        if (action === 'lose_burda' || burda_delta < 0) {
            burdas = Math.max(0, burdas + (burda_delta || -1));
        } else if (burda_delta > 0) {
            burdas = Math.min(5, burdas + burda_delta);
        }

        const updated = await upsertUserStats(user_id, ogods, burdas);

        console.log(`[user_stats] ${action || 'update'} user=${user_id} source=${source || 'unknown'} ogods=${updated.ogods} burdas=${updated.burdas}`);

        res.json({
            success: true,
            ogods: updated.ogods,
            burdas: updated.burdas,
            action,
            source
        });
    } catch (error) {
        console.error('POST update-cocos error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
