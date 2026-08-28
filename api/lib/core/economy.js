/**
 * Atomic coco (Oggob) + lives (Burba) ledger.
 * New accounts always start at 0 cocos. Spends never go negative.
 * Idempotency keys prevent double rewards on retries.
 */

const DEFAULT_OGODS = 0;
const DEFAULT_BURDAS = 5;
const MAX_BURDAS = 5;

function defaultAccount() {
    return {
        ogods: DEFAULT_OGODS,
        burdas: DEFAULT_BURDAS,
        purchases: [],
        ledger: []
    };
}

function applyTransaction(account, payload) {
    const current = {
        ...defaultAccount(),
        ...account,
        purchases: [...(account?.purchases || [])],
        ledger: [...(account?.ledger || [])]
    };

    const {
        action = 'add',
        amount = 0,
        burdaDelta = 0,
        source = 'unknown',
        idempotencyKey,
        itemId,
        oneTime = false
    } = payload || {};

    if (!idempotencyKey || typeof idempotencyKey !== 'string') {
        return { ok: false, status: 400, error: 'idempotencyKey is required.' };
    }

    const previous = current.ledger.find((entry) => entry.idempotencyKey === idempotencyKey);
    if (previous) {
        return {
            ok: true,
            idempotent: true,
            ogods: previous.resultOgods,
            burdas: previous.resultBurdas,
            purchases: current.purchases
        };
    }

    const delta = Number(amount) || 0;
    const livesDelta = Number(burdaDelta) || 0;

    if (!Number.isFinite(delta) || !Number.isFinite(livesDelta)) {
        return { ok: false, status: 400, error: 'amount and burdaDelta must be numbers.' };
    }

    if (oneTime && itemId && current.purchases.includes(itemId)) {
        return {
            ok: false,
            status: 409,
            code: 'ALREADY_PURCHASED',
            error: 'This one-time offer has already been purchased.'
        };
    }

    let ogods = current.ogods;
    let burdas = current.burdas;

    const isSpend = action === 'spend' || action === 'purchase' || delta < 0;
    if (isSpend && (delta !== 0 || action === 'spend' || action === 'purchase')) {
        const cost = Math.abs(delta);
        if (ogods < cost) {
            return {
                ok: false,
                status: 400,
                code: 'INSUFFICIENT_FUNDS',
                error: 'Saldo insuficiente.',
                ogods,
                burdas
            };
        }
        ogods -= cost;
    } else if (action === 'add' || delta > 0) {
        ogods += Math.abs(delta);
    }

    if (action === 'lose_life' || livesDelta < 0) {
        burdas = Math.max(0, burdas + (livesDelta || -1));
    } else if (livesDelta > 0) {
        burdas = Math.min(MAX_BURDAS, burdas + livesDelta);
    }

    if (ogods < 0) {
        return { ok: false, status: 400, code: 'NEGATIVE_BALANCE', error: 'Balance cannot be negative.' };
    }

    if (itemId && (action === 'purchase' || oneTime)) {
        if (!current.purchases.includes(itemId)) current.purchases.push(itemId);
    }

    const entry = {
        idempotencyKey,
        action,
        source,
        delta,
        burdaDelta: livesDelta,
        resultOgods: ogods,
        resultBurdas: burdas,
        itemId: itemId || null,
        createdAt: new Date().toISOString()
    };
    current.ledger.push(entry);

    return {
        ok: true,
        idempotent: false,
        ogods,
        burdas,
        purchases: current.purchases,
        account: {
            ...current,
            ogods,
            burdas
        }
    };
}

module.exports = {
    DEFAULT_OGODS,
    DEFAULT_BURDAS,
    MAX_BURDAS,
    defaultAccount,
    applyTransaction
};
