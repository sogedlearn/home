/**
 * Matching-cards engine: pair by ID (never by label text),
 * at most two face-up unmatched cards, matched cards stay locked,
 * one life per mismatch, game over at 0 lives.
 */

function createMemoryMatchEngine({ cards, lives = 5 }) {
    return {
        cards: cards.map((card) => ({
            ...card,
            revealed: false,
            matched: false
        })),
        flipped: [],
        lives,
        lock: false,
        status: 'playing',
        mismatches: 0,
        moves: 0,
        matchedPairs: 0,
        totalPairs: new Set(cards.map((c) => c.pairId)).size,
        lastResult: null
    };
}

function flipCard(state, index) {
    if (state.status !== 'playing') {
        return { ...state, lastResult: { error: 'GAME_OVER' } };
    }
    if (state.lock || state.flipped.length >= 2) {
        return { ...state, lastResult: { error: 'LOCKED' } };
    }

    const card = state.cards[index];
    if (!card) return { ...state, lastResult: { error: 'INVALID_CARD' } };
    if (card.matched) return { ...state, lastResult: { error: 'ALREADY_MATCHED' } };
    if (card.revealed || state.flipped.includes(index)) {
        return { ...state, lastResult: { error: 'ALREADY_FLIPPED' } };
    }

    const next = {
        ...state,
        cards: state.cards.map((c, i) => (i === index ? { ...c, revealed: true } : c)),
        flipped: [...state.flipped, index]
    };

    if (next.flipped.length < 2) {
        return { ...next, lastResult: { ok: true, waiting: true } };
    }

    next.lock = true;
    next.moves += 1;
    const [aIdx, bIdx] = next.flipped;
    const a = next.cards[aIdx];
    const b = next.cards[bIdx];

    if (a.pairId === b.pairId) {
        next.cards = next.cards.map((c, i) => (
            i === aIdx || i === bIdx ? { ...c, matched: true, revealed: true } : c
        ));
        next.matchedPairs += 1;
        next.flipped = [];
        next.lock = false;
        if (next.matchedPairs >= next.totalPairs) {
            next.status = 'won';
        }
        return { ...next, lastResult: { ok: true, match: true, status: next.status } };
    }

    next.mismatches += 1;
    next.lives = Math.max(0, next.lives - 1);
    if (next.lives <= 0) {
        next.status = 'lost';
    }
    return {
        ...next,
        lastResult: {
            ok: true,
            match: false,
            livesLost: 1,
            lives: next.lives,
            status: next.status
        }
    };
}

function resolveMismatch(state) {
    if (state.status !== 'playing') return state;
    const hide = new Set(state.flipped);
    return {
        ...state,
        cards: state.cards.map((c, i) => (
            hide.has(i) && !c.matched ? { ...c, revealed: false } : c
        )),
        flipped: [],
        lock: false,
        lastResult: { ok: true, resolved: true }
    };
}

const MemoryMatchEngine = {
    createMemoryMatchEngine,
    flipCard,
    resolveMismatch
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MemoryMatchEngine;
}
if (typeof window !== 'undefined') window.MemoryMatchEngine = MemoryMatchEngine;
