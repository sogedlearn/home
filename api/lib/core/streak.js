/**
 * Study-streak logic using the learner's IANA timezone (fallback UTC).
 * A "day completed" is any qualifying activity on that local calendar date.
 */

function pad(n) {
    return String(n).padStart(2, '0');
}

function localDateKey(date, timeZone = 'UTC') {
    try {
        const parts = new Intl.DateTimeFormat('en-CA', {
            timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).formatToParts(date);
        const year = parts.find((p) => p.type === 'year').value;
        const month = parts.find((p) => p.type === 'month').value;
        const day = parts.find((p) => p.type === 'day').value;
        return `${year}-${month}-${day}`;
    } catch {
        return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
    }
}

function shiftDateKey(dateKey, days) {
    const [y, m, d] = dateKey.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    dt.setUTCDate(dt.getUTCDate() + days);
    return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

function recordStudyDay(state, now = new Date(), timeZone = 'UTC') {
    const today = localDateKey(now, timeZone);
    const last = state.lastStudyDate || null;
    if (last === today) {
        return { ...state, timezone: timeZone, changed: false };
    }
    const yesterday = shiftDateKey(today, -1);
    const streak = last === yesterday ? (state.streak || 0) + 1 : 1;
    return {
        ...state,
        streak,
        lastStudyDate: today,
        timezone: timeZone,
        changed: true
    };
}

module.exports = {
    localDateKey,
    shiftDateKey,
    recordStudyDay
};
