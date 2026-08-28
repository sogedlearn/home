const express = require('express');
const { requireAuth } = require('./lib/auth-middleware');
const { transact, loadAccount } = require('./lib/persist');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
    try {
        const account = await loadAccount(req.user.id);
        res.json({ success: true, ogods: account.ogods, burdas: account.burdas });
    } catch (error) {
        console.error('GET update-cocos error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/', requireAuth, async (req, res) => {
    try {
        const { amount = 0, burda_delta = 0, action, source, idempotencyKey, itemId, oneTime } = req.body || {};
        const result = await transact(req.user.id, {
            action: action || (amount < 0 ? 'spend' : 'add'),
            amount,
            burdaDelta: burda_delta,
            source: source || 'update-cocos',
            idempotencyKey: idempotencyKey || `legacy-${source || 'update'}-${Date.now()}-${Math.random()}`,
            itemId,
            oneTime: !!oneTime
        });

        if (!result.ok) {
            return res.status(result.status || 400).json({
                error: result.error,
                code: result.code,
                ogods: result.ogods,
                burdas: result.burdas
            });
        }

        res.json({
            success: true,
            ogods: result.ogods,
            burdas: result.burdas,
            idempotent: !!result.idempotent,
            action,
            source
        });
    } catch (error) {
        console.error('POST update-cocos error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
