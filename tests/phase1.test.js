process.env.SOGED_TEST_MODE = '1';

const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../api/app');
const memoryStore = require('../api/lib/memory-store');
const { validateSettingsPatch, defaultSettings } = require('../api/lib/core/settings');
const { checkLevelPermissions, completeLevelAtomic, defaultProgress } = require('../api/lib/core/progress');
const { applyTransaction, defaultAccount } = require('../api/lib/core/economy');
const { recordStudyDay, localDateKey, shiftDateKey } = require('../api/lib/core/streak');
const { createMemoryMatchEngine, flipCard, resolveMismatch } = require('../api/lib/core/memory-match');
const { validatePassword, validateEmail } = require('../api/lib/core/auth-rules');

let server;
let baseUrl;

before(async () => {
    const app = createApp();
    await new Promise((resolve) => {
        server = app.listen(0, '127.0.0.1', resolve);
    });
    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
});

beforeEach(() => memoryStore.resetStore());

function auth(userId) {
    return { Authorization: `Bearer test:${userId}` };
}

async function api(method, path, { userId = 'user-1', body } = {}) {
    const res = await fetch(`${baseUrl}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json', ...auth(userId) },
        body: body ? JSON.stringify(body) : undefined
    });
    return { status: res.status, json: await res.json() };
}

test('settings: rejects invalid payload', () => {
    assert.equal(validateSettingsPatch({ language: 'klingon' }).ok, false);
    assert.equal(validateSettingsPatch({ name: '' }).ok, false);
    assert.equal(validateSettingsPatch({}).ok, false);
    assert.equal(validateSettingsPatch({ name: 'Ana', language: 'es', theme: 'dark' }).ok, true);
});

test('settings: PATCH persists across GET (reload) and re-auth', async () => {
    const patch = await api('PATCH', '/api/v1/user/settings', {
        body: { name: 'Ailani', language: 'es', theme: 'dark', notifications: true }
    });
    assert.equal(patch.status, 200);
    assert.equal(patch.json.settings.displayName, 'Ailani');
    assert.equal(patch.json.settings.language, 'es');

    const reload = await api('GET', '/api/v1/user/settings');
    assert.equal(reload.json.settings.displayName, 'Ailani');
    assert.equal(reload.json.settings.theme, 'dark');

    const relogin = await api('GET', '/api/v1/user/settings', { userId: 'user-1' });
    assert.equal(relogin.json.settings.language, 'es');
    assert.equal(relogin.json.settings.notifications.dailyReminders, true);
});

test('settings: invalid PATCH returns 400 and does not write', async () => {
    await api('PATCH', '/api/v1/user/settings', { body: { name: 'KeepMe' } });
    const bad = await api('PATCH', '/api/v1/user/settings', { body: { language: 'francais' } });
    assert.equal(bad.status, 400);
    const again = await api('GET', '/api/v1/user/settings');
    assert.equal(again.json.settings.displayName, 'KeepMe');
});

test('auth rules: email unique format and password policy', () => {
    assert.equal(validateEmail('bad').ok, false);
    assert.equal(validateEmail('user@soged.org').ok, true);
    assert.equal(validatePassword('short').ok, false);
    assert.equal(validatePassword('abcdefgh').ok, false);
    assert.equal(validatePassword('abcd1234').ok, true);
});

test('new accounts start at 0 cocos', () => {
    assert.equal(defaultAccount().ogods, 0);
    assert.equal(defaultSettings().displayName, '');
    assert.equal(defaultProgress().maxCompletedLevel, 0);
});

test('economy GET initializes at 0', async () => {
    const res = await api('GET', '/api/v1/economy');
    assert.equal(res.status, 200);
    assert.equal(res.json.ogods, 0);
});

test('economy: never negative, idempotent rewards, one-time offer', async () => {
    const spend = applyTransaction(defaultAccount(), {
        action: 'spend', amount: -10, idempotencyKey: 's1'
    });
    assert.equal(spend.ok, false);
    assert.equal(spend.code, 'INSUFFICIENT_FUNDS');

    const add = applyTransaction(defaultAccount(), {
        action: 'add', amount: 25, idempotencyKey: 'reward-level-1'
    });
    assert.equal(add.ok, true);
    assert.equal(add.ogods, 25);

    const replay = applyTransaction(add.account, {
        action: 'add', amount: 25, idempotencyKey: 'reward-level-1'
    });
    assert.equal(replay.idempotent, true);
    assert.equal(replay.ogods, 25);

    const buy = applyTransaction(add.account, {
        action: 'purchase', amount: -25, itemId: 'burba-special', oneTime: true, idempotencyKey: 'buy-1'
    });
    assert.equal(buy.ok, true);
    assert.equal(buy.ogods, 0);

    const buyAgain = applyTransaction(buy.account, {
        action: 'purchase', amount: -25, itemId: 'burba-special', oneTime: true, idempotencyKey: 'buy-2'
    });
    assert.equal(buyAgain.ok, false);
    assert.equal(buyAgain.code, 'ALREADY_PURCHASED');
});

test('economy API: concurrent double-complete does not double credit', async () => {
    await api('POST', '/api/v1/economy/transact', {
        body: { action: 'add', amount: 10, source: 'test', idempotencyKey: 'same-key' }
    });
    const [a, b] = await Promise.all([
        api('POST', '/api/v1/economy/transact', {
            body: { action: 'add', amount: 10, source: 'test', idempotencyKey: 'same-key' }
        }),
        api('POST', '/api/v1/economy/transact', {
            body: { action: 'add', amount: 10, source: 'test', idempotencyKey: 'same-key' }
        })
    ]);
    assert.equal(a.json.ogods, 10);
    assert.equal(b.json.ogods, 10);
});

test('levels: cannot skip via API', async () => {
    const locked = await api('GET', '/api/v1/progress/levels/3');
    assert.equal(locked.status, 403);
    assert.equal(locked.json.code, 'LEVEL_LOCKED');

    const first = await api('GET', '/api/v1/progress/levels/1');
    assert.equal(first.status, 200);

    const skip = await api('POST', '/api/v1/progress/complete', { body: { levelId: 3 } });
    assert.equal(skip.status, 403);
});

test('levels: complete is atomic and idempotent (XP + unlock + cocos)', async () => {
    const done = await api('POST', '/api/v1/progress/complete', {
        body: { levelId: 1, timezone: 'UTC', idempotencyKey: 'complete-level-1' }
    });
    assert.equal(done.status, 200);
    assert.equal(done.json.progress.maxCompletedLevel, 1);
    assert.equal(done.json.xpGranted, 50);
    assert.equal(done.json.ogods, 25);

    const replay = await api('POST', '/api/v1/progress/complete', {
        body: { levelId: 1, idempotencyKey: 'complete-level-1' }
    });
    assert.equal(replay.json.idempotent, true);
    assert.equal(replay.json.xpGranted, 0);
    assert.equal(replay.json.ogods, 25);

    const two = await api('GET', '/api/v1/progress/levels/2');
    assert.equal(two.status, 200);
});

test('progress helper: skip check', () => {
    assert.equal(checkLevelPermissions(0, 2).ok, false);
    assert.equal(checkLevelPermissions(1, 2).ok, true);
    const once = completeLevelAtomic(defaultProgress(), 1);
    const twice = completeLevelAtomic(once.progress, 1);
    assert.equal(twice.idempotent, true);
    assert.equal(twice.xpGranted, 0);
});

test('streak: same local day does not increment; midnight boundary does', () => {
    const tz = 'America/Panama';
    const beforeMidnight = new Date('2026-08-28T04:30:00.000Z');
    const afterMidnight = new Date('2026-08-28T05:30:00.000Z');
    const first = recordStudyDay({ streak: 0, lastStudyDate: null }, beforeMidnight, tz);
    assert.equal(first.streak, 1);
    const sameDay = recordStudyDay(first, new Date('2026-08-28T04:59:00.000Z'), tz);
    assert.equal(sameDay.changed, false);
    assert.equal(sameDay.streak, 1);
    const nextDay = recordStudyDay(first, afterMidnight, tz);
    assert.equal(localDateKey(afterMidnight, tz), shiftDateKey(localDateKey(beforeMidnight, tz), 1));
    assert.equal(nextDay.streak, 2);
});

test('memory match: max two flips, pair by id, one life per miss, game over at 0', () => {
    const cards = [
        { pairId: 'a', label: 'Na' },
        { pairId: 'a', label: 'I' },
        { pairId: 'b', label: 'Be' },
        { pairId: 'b', label: 'You' }
    ];
    let state = createMemoryMatchEngine({ cards, lives: 2 });
    state = flipCard(state, 0);
    state = flipCard(state, 2);
    const blockedThird = flipCard(state, 1);
    assert.equal(blockedThird.lastResult.error, 'LOCKED');

    state = createMemoryMatchEngine({ cards, lives: 2 });
    state = flipCard(state, 0);
    state = flipCard(state, 1);
    assert.equal(state.lastResult.match, true);
    assert.equal(state.cards[0].matched, true);

    const locked = flipCard(state, 0);
    assert.equal(locked.lastResult.error, 'ALREADY_MATCHED');

    state = createMemoryMatchEngine({ cards, lives: 1 });
    const missA = cards.findIndex((c) => c.pairId === 'a');
    const missB = cards.findIndex((c) => c.pairId === 'b');
    state = flipCard(state, missA);
    state = flipCard(state, missB);
    assert.equal(state.lastResult.match, false);
    assert.equal(state.lastResult.livesLost, 1);
    assert.equal(state.lives, 0);
    assert.equal(state.status, 'lost');
    state = resolveMismatch(state);
    const afterOver = flipCard(state, 0);
    assert.equal(afterOver.lastResult.error, 'GAME_OVER');
});

test('home route serves landing page', async () => {
    const res = await fetch(`${baseUrl}/home`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.match(html, /SOGED|Soged|soged/i);
});
