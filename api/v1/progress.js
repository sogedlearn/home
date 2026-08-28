const express = require('express');
const { requireAuth, requireVerified } = require('../lib/auth-middleware');
const memoryStore = require('../lib/memory-store');
const persist = require('../lib/persist');
const { checkLevelPermissions, completeLevelAtomic } = require('../lib/core/progress');
const { recordStudyDay } = require('../lib/core/streak');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
    try {
        const progress = await persist.loadProgress(req.user.id);
        res.json({ success: true, progress });
    } catch (error) {
        console.error('GET progress:', error);
        res.status(500).json({ status: 'error', message: 'No se pudo leer el progreso.' });
    }
});

router.get('/levels/:levelId', requireAuth, async (req, res) => {
    try {
        const progress = await persist.loadProgress(req.user.id);
        const access = checkLevelPermissions(progress.maxCompletedLevel, req.params.levelId);
        if (!access.ok) {
            return res.status(access.status).json({
                status: 'error',
                code: access.code,
                message: access.message
            });
        }
        res.json({ success: true, allowed: true, levelId: access.requested, progress });
    } catch (error) {
        console.error('GET level access:', error);
        res.status(500).json({ status: 'error', message: 'No se pudo verificar el acceso.' });
    }
});

router.post('/complete', requireAuth, requireVerified, async (req, res) => {
    const levelId = req.body?.levelId ?? req.body?.lessonId;
    const timezone = req.body?.timezone || 'UTC';
    const xpReward = Number.isFinite(Number(req.body?.xpReward)) ? Number(req.body.xpReward) : 50;
    const cocoReward = Number.isFinite(Number(req.body?.cocoReward)) ? Number(req.body.cocoReward) : 25;
    const idempotencyKey = req.body?.idempotencyKey || `complete-level-${levelId}`;

    try {
        const result = await memoryStore.withUserLock(req.user.id, async (user) => {
            const progress = await persist.loadProgress(req.user.id);
            const completed = completeLevelAtomic(progress, levelId, { xpReward, cocoReward });
            if (!completed.ok) return completed;

            let nextProgress = completed.progress;
            let economyResult = {
                ogods: user.account.ogods,
                burdas: user.account.burdas,
                idempotent: true
            };

            if (!completed.idempotent) {
                nextProgress = recordStudyDay(nextProgress, new Date(), timezone);
                economyResult = await persist.applyAccountChange(req.user.id, {
                    action: 'add',
                    amount: completed.cocoReward,
                    source: `level-${levelId}`,
                    idempotencyKey
                }, user);
                if (!economyResult.ok) return economyResult;
                user.account = economyResult.account || user.account;
            }

            user.progress = nextProgress;
            await persist.saveProgress(req.user.id, nextProgress);

            return {
                ok: true,
                idempotent: completed.idempotent,
                progress: nextProgress,
                xpGranted: completed.xpGranted,
                cocoReward: completed.idempotent ? 0 : completed.cocoReward,
                ogods: economyResult.ogods,
                burdas: economyResult.burdas
            };
        });

        if (!result.ok) {
            return res.status(result.status || 400).json({
                status: 'error',
                code: result.code,
                message: result.message || result.error
            });
        }

        res.json({ success: true, ...result });
    } catch (error) {
        console.error('POST complete level:', error);
        res.status(500).json({ status: 'error', message: 'No se pudo completar el nivel.' });
    }
});

module.exports = router;
