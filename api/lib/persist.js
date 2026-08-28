/**
 * Shared load/save for progress + economy.
 * Memory store for tests/dev; Supabase when configured.
 */

const memoryStore = require('./memory-store');
const { isSupabaseConfigured, createAdminClient } = require('./supabase-admin');
const { defaultAccount, applyTransaction } = require('./core/economy');
const { defaultProgress } = require('./core/progress');

function useMemory() {
    return !isSupabaseConfigured() || process.env.SOGED_TEST_MODE === '1';
}

function rowToAccount(row) {
    if (!row) return defaultAccount();
    return {
        ogods: row.ogods == null ? 0 : row.ogods,
        burdas: row.burdas == null ? 5 : row.burdas,
        purchases: row.purchases || [],
        ledger: []
    };
}

function rowToProgress(row) {
    if (!row) return defaultProgress();
    return {
        maxCompletedLevel: row.max_completed_level || 0,
        completed: row.completed_levels || [],
        current: (row.max_completed_level || 0) + 1,
        xp: row.xp || 0,
        level: row.level || 1,
        streak: row.streak || 0,
        lastStudyDate: row.last_study_date || null,
        timezone: row.timezone || 'UTC'
    };
}

async function loadAccount(userId) {
    if (useMemory()) return memoryStore.getUser(userId).account;
    const admin = createAdminClient();
    const { data, error } = await admin
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
    if (error && error.code !== 'PGRST116') console.warn('loadAccount:', error.message);
    if (!data) {
        const blank = defaultAccount();
        await admin.from('user_stats').upsert({
            user_id: userId,
            ogods: 0,
            burdas: blank.burdas,
            purchases: [],
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
        return blank;
    }
    return rowToAccount(data);
}

async function saveAccount(userId, account) {
    if (useMemory()) {
        memoryStore.getUser(userId).account = account;
        return account;
    }
    const admin = createAdminClient();
    const { error } = await admin.from('user_stats').upsert({
        user_id: userId,
        ogods: account.ogods,
        burdas: account.burdas,
        purchases: account.purchases || [],
        updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    if (error) throw error;
    return account;
}

async function loadProgress(userId) {
    if (useMemory()) return memoryStore.getUser(userId).progress;
    const admin = createAdminClient();
    const { data, error } = await admin
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
    if (error && error.code !== 'PGRST116') console.warn('loadProgress:', error.message);
    return rowToProgress(data);
}

async function saveProgress(userId, progress) {
    if (useMemory()) {
        memoryStore.getUser(userId).progress = progress;
        return progress;
    }
    const admin = createAdminClient();
    const { error } = await admin.from('user_progress').upsert({
        user_id: userId,
        max_completed_level: progress.maxCompletedLevel,
        completed_levels: progress.completed,
        xp: progress.xp,
        level: progress.level,
        streak: progress.streak,
        last_study_date: progress.lastStudyDate,
        timezone: progress.timezone || 'UTC',
        updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    if (error) throw error;
    return progress;
}

async function findLedgerEntry(userId, idempotencyKey) {
    if (useMemory()) {
        return memoryStore.getUser(userId).account.ledger
            .find((entry) => entry.idempotencyKey === idempotencyKey) || null;
    }
    const admin = createAdminClient();
    const { data } = await admin
        .from('economy_ledger')
        .select('*')
        .eq('user_id', userId)
        .eq('idempotency_key', idempotencyKey)
        .maybeSingle();
    return data || null;
}

async function insertLedger(userId, entry) {
    if (useMemory()) return;
    const admin = createAdminClient();
    const { error } = await admin.from('economy_ledger').insert({
        user_id: userId,
        idempotency_key: entry.idempotencyKey,
        action: entry.action,
        source: entry.source,
        delta: entry.delta,
        burda_delta: entry.burdaDelta,
        result_ogods: entry.resultOgods,
        result_burdas: entry.resultBurdas,
        item_id: entry.itemId
    });
    if (error && error.code !== '23505') throw error;
    return error && error.code === '23505';
}

async function applyAccountChange(userId, payload, user) {
    const existing = await findLedgerEntry(userId, payload.idempotencyKey);
    if (existing) {
        return {
            ok: true,
            idempotent: true,
            ogods: existing.resultOgods ?? existing.result_ogods,
            burdas: existing.resultBurdas ?? existing.result_burdas,
            purchases: user.account.purchases
        };
    }

    const account = useMemory() ? user.account : await loadAccount(userId);
    const result = applyTransaction(account, payload);
    if (!result.ok) return result;

    user.account = result.account;
    const duplicate = await insertLedger(userId, result.account.ledger[result.account.ledger.length - 1]);
    if (duplicate) {
        const again = await findLedgerEntry(userId, payload.idempotencyKey);
        return {
            ok: true,
            idempotent: true,
            ogods: again.resultOgods ?? again.result_ogods,
            burdas: again.resultBurdas ?? again.result_burdas,
            purchases: account.purchases
        };
    }
    await saveAccount(userId, result.account);
    return result;
}

async function transact(userId, payload) {
    return memoryStore.withUserLock(userId, async (user) => applyAccountChange(userId, payload, user));
}

module.exports = {
    useMemory,
    loadAccount,
    saveAccount,
    loadProgress,
    saveProgress,
    applyAccountChange,
    transact,
    defaultProgress,
    defaultAccount
};
