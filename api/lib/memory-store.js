/**
 * In-memory persistence used when Supabase is not configured (local/dev/tests).
 * Per-user mutex serializes economy/progress writes to avoid races.
 */

const { defaultSettings, applySettingsPatch } = require('./core/settings');
const { defaultProgress } = require('./core/progress');
const { defaultAccount } = require('./core/economy');

const users = new Map();
const locks = new Map();

function blankUser() {
    return {
        settings: defaultSettings(),
        progress: defaultProgress(),
        account: defaultAccount()
    };
}

function getUser(userId) {
    if (!users.has(userId)) users.set(userId, blankUser());
    return users.get(userId);
}

async function withUserLock(userId, fn) {
    const previous = locks.get(userId) || Promise.resolve();
    let release;
    const gate = new Promise((resolve) => {
        release = resolve;
    });
    locks.set(userId, previous.then(() => gate));
    await previous;
    try {
        return await fn(getUser(userId));
    } finally {
        release();
        if (locks.get(userId) === gate) locks.delete(userId);
    }
}

function patchSettings(userId, patch) {
    const user = getUser(userId);
    user.settings = applySettingsPatch(user.settings, patch);
    return user.settings;
}

function resetStore() {
    users.clear();
    locks.clear();
}

module.exports = {
    getUser,
    withUserLock,
    patchSettings,
    resetStore,
    blankUser
};
