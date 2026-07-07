/**
 * Sistema de moneda virtual — Ogob Guna
 */
const OgobEconomy = {
    STORAGE_KEY: 'guna_ogob',
    PURCHASES_KEY: 'guna_purchases',
    DEFAULT_BALANCE: 1250,

    getBalance() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored === null) {
            localStorage.setItem(this.STORAGE_KEY, String(this.DEFAULT_BALANCE));
            return this.DEFAULT_BALANCE;
        }
        return parseInt(stored, 10) || 0;
    },

    setBalance(amount) {
        const value = Math.max(0, amount);
        localStorage.setItem(this.STORAGE_KEY, String(value));
        this.updateAllDisplays(value);
        return value;
    },

    addOgob(amount) {
        const newBalance = this.getBalance() + amount;
        this.setBalance(newBalance);
        this.animateOgobChange('gain');
        return newBalance;
    },

    spendOgob(amount) {
        const balance = this.getBalance();
        if (balance < amount) return false;
        this.setBalance(balance - amount);
        this.animateOgobChange('spend');
        return true;
    },

    getPurchases() {
        try {
            return JSON.parse(localStorage.getItem(this.PURCHASES_KEY) || '[]');
        } catch {
            return [];
        }
    },

    isPurchased(itemId) {
        return this.getPurchases().includes(itemId);
    },

    recordPurchase(itemId) {
        const purchases = this.getPurchases();
        if (!purchases.includes(itemId)) {
            purchases.push(itemId);
            localStorage.setItem(this.PURCHASES_KEY, JSON.stringify(purchases));
        }
    },

    formatOgob(amount) {
        return amount.toLocaleString('es-ES');
    },

    updateAllDisplays(balance) {
        const value = balance ?? this.getBalance();
        const formatted = this.formatOgob(value);

        document.querySelectorAll('[data-ogob-balance]').forEach(el => {
            el.textContent = formatted;
        });

        document.querySelectorAll('[data-ogob-label]').forEach(el => {
            el.textContent = `${formatted} Ogob`;
        });
    },

    animateOgobChange(type) {
        document.querySelectorAll('.ogob-counter, .ogob-balance-display').forEach(el => {
            el.classList.remove('ogob-bounce');
            void el.offsetWidth;
            el.classList.add('ogob-bounce');
            if (type === 'gain') el.classList.add('ogob-gain');
            if (type === 'spend') el.classList.add('ogob-spend');
            setTimeout(() => {
                el.classList.remove('ogob-gain', 'ogob-spend');
            }, 600);
        });
    },

    triggerConfetti() {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.65 },
                colors: ['#28A745', '#FFB300', '#FF6B35', '#8B5E3C', '#5D8A3E']
            });
        }
    }
};

window.OgobEconomy = OgobEconomy;
