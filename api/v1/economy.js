const express = require('express');
const { requireAuth, requireVerified } = require('../lib/auth-middleware');
const { transact, loadAccount } = require('../lib/persist');
const { defaultAccount } = require('../lib/core/economy');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
    try {
        const account = await loadAccount(req.user.id);
        res.json({
            success: true,
            ogods: account.ogods,
            burdas: account.burdas,
            purchases: account.purchases || [],
            initialized: true
        });
    } catch (error) {
        console.error('GET economy:', error);
        res.status(500).json({ status: 'error', message: 'No se pudo leer el saldo.' });
    }
});

router.post('/transact', requireAuth, requireVerified, async (req, res) => {
    try {
        const {
            action = 'add',
            amount = 0,
            burdaDelta = 0,
            source = 'unknown',
            idempotencyKey,
            itemId,
            oneTime = false
        } = req.body || {};

        if (!idempotencyKey) {
            return res.status(400).json({
                status: 'error',
                code: 'MISSING_IDEMPOTENCY_KEY',
                message: 'idempotencyKey is required.'
            });
        }

        const result = await transact(req.user.id, {
            action,
            amount,
            burdaDelta,
            source,
            idempotencyKey,
            itemId,
            oneTime
        });

        if (!result.ok) {
            return res.status(result.status || 400).json({
                status: 'error',
                code: result.code,
                message: result.error,
                ogods: result.ogods,
                burdas: result.burdas
            });
        }

        res.json({
            success: true,
            idempotent: !!result.idempotent,
            ogods: result.ogods,
            burdas: result.burdas,
            purchases: result.purchases || result.account?.purchases || []
        });
    } catch (error) {
        console.error('POST economy transact:', error);
        res.status(500).json({ status: 'error', message: 'No se pudo actualizar el saldo.' });
    }
});

router.get('/bootstrap', requireAuth, async (req, res) => {
    try {
        const account = await loadAccount(req.user.id);
        const fresh = account.ogods === defaultAccount().ogods;
        res.json({
            success: true,
            ogods: account.ogods,
            burdas: account.burdas,
            newAccount: fresh && (account.ledger || []).length === 0
        });
    } catch (error) {
        console.error('GET economy bootstrap:', error);
        res.status(500).json({ status: 'error', message: 'No se pudo inicializar la cuenta.' });
    }
});

module.exports = router;
