/**
 * Unified reward system for all minigames
 * Win: +Ogods | Lose: -1 Burda (blue heart)
 */
const GameRewards = {
    async awardOgods(amount, source = 'game') {
        const userId = await HubFlow.getUserId();

        try {
            await fetch('/api/update-cocos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, amount, action: 'add', source })
            });
        } catch (e) {
            console.warn('Supabase ogods sync failed:', e);
        }

        if (typeof CocosEconomy !== 'undefined') {
            CocosEconomy.addOggob(amount);
            CocosEconomy.triggerConfetti();
        }
    },

    async loseBurda(source = 'game') {
        const userId = await HubFlow.getUserId();

        try {
            await fetch('/api/update-cocos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, burda_delta: -1, action: 'lose_burda', source })
            });
        } catch (e) {
            console.warn('Supabase burda sync failed:', e);
        }

        if (typeof GunaLives !== 'undefined') {
            GunaLives.loseLife();
        }
    },

    async syncFromServer() {
        const userId = await HubFlow.getUserId();
        try {
            const res = await fetch(`/api/update-cocos?user_id=${encodeURIComponent(userId)}`);
            if (!res.ok) return;
            const data = await res.json();
            if (data.ogods != null && typeof CocosEconomy !== 'undefined') {
                CocosEconomy.setBalance(data.ogods);
            }
            if (data.burdas != null && typeof GunaLives !== 'undefined') {
                const state = GunaLives.getState();
                state.lives = data.burdas;
                GunaLives.saveState(state);
            }
        } catch (e) {
            console.warn('Could not sync from server:', e);
        }
    },

    canPlay() {
        return typeof GunaLives === 'undefined' || GunaLives.canPlay();
    },

    showNoLivesMessage(host) {
        const el = host || document.body;
        const msg = document.createElement('div');
        msg.className = 'hub-card';
        msg.style.cssText = 'text-align:center;padding:2rem;margin:2rem auto;max-width:400px;';
        msg.innerHTML = `
            <h3 style="color:#000;margin-bottom:1rem;">No Burdas Left</h3>
            <p style="color:#000;margin-bottom:1.5rem;">Wait for your hearts to regenerate, or visit the Store to recover.</p>
            <button class="hub-btn hub-btn-secondary" id="noLivesHomeBtn">Return Home</button>
        `;
        el.appendChild(msg);
        msg.querySelector('#noLivesHomeBtn')?.addEventListener('click', () => HubFlow.returnHome());
    }
};

window.GameRewards = GameRewards;
