/**
 * Sequential level access + atomic completion (XP + unlock in one step).
 */

function checkLevelPermissions(maxCompletedLevel, requestedLevel) {
    const requested = parseInt(requestedLevel, 10);
    const maxCompleted = Number.isFinite(maxCompletedLevel) ? maxCompletedLevel : 0;

    if (!Number.isInteger(requested) || requested < 1) {
        return {
            ok: false,
            status: 400,
            code: 'INVALID_LEVEL',
            message: 'levelId must be a positive integer.'
        };
    }

    if (requested > maxCompleted + 1) {
        return {
            ok: false,
            status: 403,
            code: 'LEVEL_LOCKED',
            message: 'Acceso denegado: Debe completar las lecciones previas para desbloquear este nivel.'
        };
    }

    return { ok: true, requested, maxCompleted };
}

function defaultProgress() {
    return {
        maxCompletedLevel: 0,
        completed: [],
        current: 1,
        xp: 0,
        level: 1,
        streak: 0,
        lastStudyDate: null,
        timezone: 'UTC'
    };
}

function xpForLevel(level) {
    return level * 200;
}

function applyXp(state, amount) {
    let xp = state.xp + amount;
    let level = state.level;
    while (xp >= xpForLevel(level)) {
        xp -= xpForLevel(level);
        level += 1;
    }
    return { xp, level };
}

/**
 * Completes a level atomically. Replaying the same level is idempotent:
 * progress/XP/cocos are not granted twice.
 */
function completeLevelAtomic(state, levelId, { xpReward = 50, cocoReward = 25 } = {}) {
    const current = { ...defaultProgress(), ...state };
    const access = checkLevelPermissions(current.maxCompletedLevel, levelId);
    if (!access.ok) return access;

    const id = access.requested;
    const alreadyDone = current.completed.includes(id);

    if (alreadyDone) {
        return {
            ok: true,
            idempotent: true,
            progress: current,
            xpGranted: 0,
            cocoReward: 0
        };
    }

    const completed = [...current.completed, id].sort((a, b) => a - b);
    const maxCompletedLevel = Math.max(current.maxCompletedLevel, id);
    const { xp, level } = applyXp(current, xpReward);

    return {
        ok: true,
        idempotent: false,
        progress: {
            ...current,
            completed,
            maxCompletedLevel,
            current: id + 1,
            xp,
            level
        },
        xpGranted: xpReward,
        cocoReward
    };
}

module.exports = {
    checkLevelPermissions,
    defaultProgress,
    completeLevelAtomic,
    xpForLevel,
    applyXp
};
