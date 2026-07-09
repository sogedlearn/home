/**
 * Leaderboard — weekly, monthly, all-time rankings (localStorage)
 */
const GunaLeaderboard = {
    STORAGE_KEY: 'guna_leaderboard_snapshots',

    COMMUNITY_PLAYERS: [
        { name: 'María González', avatar: '👩‍🎓', baseXp: 2450, lessons: 10, vocab: 85, streak: 15, community: 12 },
        { name: 'Carlos Rivera', avatar: '👨‍💼', baseXp: 2380, lessons: 9, vocab: 72, streak: 12, community: 8 },
        { name: 'Ana Morales', avatar: '👩‍🏫', baseXp: 2210, lessons: 9, vocab: 68, streak: 18, community: 15 },
        { name: 'José Pérez', avatar: '👨‍🎨', baseXp: 2150, lessons: 8, vocab: 60, streak: 8, community: 6 },
        { name: 'Elena Castro', avatar: '👩‍💻', baseXp: 1980, lessons: 7, vocab: 55, streak: 5, community: 9 },
        { name: 'Miguel Torres', avatar: '👨‍🔬', baseXp: 1850, lessons: 7, vocab: 48, streak: 3, community: 4 },
        { name: 'Sofía Herrera', avatar: '👩‍🔬', baseXp: 1720, lessons: 6, vocab: 42, streak: 6, community: 7 },
        { name: 'Luis Mendoza', avatar: '👨‍🏫', baseXp: 1600, lessons: 6, vocab: 38, streak: 4, community: 5 }
    ],

    getUserStats() {
        const gam = typeof GunaGamification !== 'undefined' ? GunaGamification.getState() : { xp: 0, streak: 0, badges: [], totalLessons: 0 };
        const lessons = typeof GunaProgress !== 'undefined' ? GunaProgress.getCompletedCount() : 0;
        let vocab = 0;
        try { vocab = JSON.parse(localStorage.getItem('guna_vocab_learned') || '[]').length; } catch { /* ignore */ }
        const profile = typeof GunaUserData !== 'undefined' ? GunaUserData.getProfile() : {};
        const communityVisits = parseInt(localStorage.getItem('guna_community_visits') || '0', 10);
        const totalXp = gam.xp + (gam.level - 1) * 200;

        return {
            name: profile.username || 'Language Explorer',
            avatar: profile.avatar ? '' : '🐢',
            avatarImg: profile.avatar || null,
            xp: totalXp,
            streak: gam.streak,
            lessons,
            vocab,
            badges: gam.badges?.length || 0,
            community: communityVisits,
            isCurrentUser: true
        };
    },

    scaleForPeriod(player, period) {
        const factors = { week: 0.22, month: 0.55, all: 1 };
        const f = factors[period] || 1;
        return {
            ...player,
            xp: Math.round(player.xp * f),
            lessons: Math.min(player.lessons, Math.max(1, Math.round(player.lessons * f))),
            vocab: Math.min(player.vocab, Math.max(0, Math.round(player.vocab * f))),
            community: Math.min(player.community, Math.max(0, Math.round(player.community * f)))
        };
    },

    getRankings(period = 'week', sortBy = 'xp') {
        const user = this.getUserStats();
        const players = [
            user,
            ...this.COMMUNITY_PLAYERS.map(p => ({
                ...this.scaleForPeriod(p, period),
                isCurrentUser: false
            }))
        ];

        const sortKey = sortBy === 'lessons' ? 'lessons' : sortBy === 'vocab' ? 'vocab' : 'xp';
        players.sort((a, b) => b[sortKey] - a[sortKey]);

        return players.map((p, i) => ({ ...p, rank: i + 1 }));
    },

    rewardTopPlayers(period) {
        const top = this.getRankings(period, 'xp')[0];
        if (!top?.isCurrentUser) return;
        if (typeof GunaGamification !== 'undefined') {
            GunaGamification.awardBadge(`leader-${period}`);
            GunaGamification.addXP(period === 'week' ? 50 : period === 'month' ? 150 : 0);
        }
        if (typeof CocosEconomy !== 'undefined' && period !== 'all') {
            CocosEconomy.addOggob(period === 'week' ? 25 : 75);
        }
    }
};

window.GunaLeaderboard = GunaLeaderboard;
