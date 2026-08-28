/**
 * Unified reward system for all minigames
 * Win: +Ogods | Lose: lives — always via the transactional economy API.
 */
const GameRewards = {
    async awardOgods(amount, source = 'game', idempotencyKey) {
        const key = idempotencyKey || `${source}:award:${Date.now()}`;
        if (typeof SogedSession !== 'undefined') {
            try {
                const result = await SogedSession.api('/api/v1/economy/transact', {
                    method: 'POST',
                    body: {
                        action: 'add',
                        amount,
                        source,
                        idempotencyKey: key
                    }
                });
                if (typeof CocosEconomy !== 'undefined') {
                    CocosEconomy.setBalance(result.ogods);
                    CocosEconomy.triggerConfetti();
                }
                if (result.burdas != null && typeof GunaLives !== 'undefined') {
                    const state = GunaLives.getState();
                    state.lives = result.burdas;
                    GunaLives.saveState(state);
                }
                return result;
            } catch (e) {
                console.warn('Supabase ogods sync failed:', e);
            }
        }

        if (typeof CocosEconomy !== 'undefined') {
            CocosEconomy.addOggob(amount);
            CocosEconomy.triggerConfetti();
        }
        return null;
    },

    async loseBurda(source = 'game', idempotencyKey, livesLost = 1) {
        const key = idempotencyKey || `${source}:life:${Date.now()}`;
        if (typeof SogedSession !== 'undefined') {
            try {
                const result = await SogedSession.api('/api/v1/economy/transact', {
                    method: 'POST',
                    body: {
                        action: 'lose_life',
                        amount: 0,
                        burdaDelta: -Math.abs(livesLost),
                        source,
                        idempotencyKey: key
                    }
                });
                if (typeof GunaLives !== 'undefined') {
                    const state = GunaLives.getState();
                    state.lives = result.burdas;
                    GunaLives.saveState(state);
                }
                return result;
            } catch (e) {
                console.warn('Supabase burda sync failed:', e);
            }
        }

        if (typeof GunaLives !== 'undefined') {
            GunaLives.loseLife();
        }
        return null;
    },

    async settleGame({ source, sessionId, ogods = 0, burdaDelta = 0 }) {
        const key = `${source}:${sessionId}:settle`;
        if (typeof SogedSession !== 'undefined') {
            try {
                const result = await SogedSession.api('/api/v1/economy/transact', {
                    method: 'POST',
                    body: {
                        action: ogods > 0 ? 'add' : (burdaDelta < 0 ? 'lose_life' : 'add'),
                        amount: ogods,
                        burdaDelta,
                        source,
                        idempotencyKey: key
                    }
                });
                if (typeof CocosEconomy !== 'undefined' && result.ogods != null) {
                    CocosEconomy.setBalance(result.ogods);
                    if (ogods > 0) CocosEconomy.triggerConfetti();
                }
                if (result.burdas != null && typeof GunaLives !== 'undefined') {
                    const state = GunaLives.getState();
                    state.lives = result.burdas;
                    GunaLives.saveState(state);
                }
                return result;
            } catch (e) {
                console.warn('Game settle sync failed:', e);
            }
        }
        if (ogods > 0 && typeof CocosEconomy !== 'undefined') {
            CocosEconomy.addOggob(ogods);
            CocosEconomy.triggerConfetti();
        }
        if (burdaDelta < 0 && typeof GunaLives !== 'undefined') {
            for (let i = 0; i < Math.abs(burdaDelta); i++) GunaLives.loseLife();
        }
        return null;
    },

    async syncFromServer() {
        try {
            const data = typeof SogedSession !== 'undefined'
                ? await SogedSession.api('/api/v1/economy')
                : await fetch('/api/v1/economy').then((r) => r.json());
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
