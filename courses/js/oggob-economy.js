/**
 * Sistema de moneda virtual — Oggob Guna
 */
const OggobEconomy = {
    STORAGE_KEY: 'guna_oggob',
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

    addOggob(amount) {
        const newBalance = this.getBalance() + amount;
        this.setBalance(newBalance);
        this.animateOggobChange('gain');
        return newBalance;
    },

    spendOggob(amount) {
        const balance = this.getBalance();
        if (balance < amount) return false;
        this.setBalance(balance - amount);
        this.animateOggobChange('spend');
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

    formatOggob(amount) {
        return amount.toLocaleString('es-ES');
    },

    updateAllDisplays(balance) {
        const value = balance ?? this.getBalance();
        const formatted = this.formatOggob(value);

        document.querySelectorAll('[data-oggob-balance]').forEach(el => {
            el.textContent = formatted;
        });

        document.querySelectorAll('[data-oggob-label]').forEach(el => {
            el.textContent = `${formatted} Oggob`;
        });
    },

    animateOggobChange(type) {
        document.querySelectorAll('.oggob-counter, .oggob-balance-display').forEach(el => {
            el.classList.remove('oggob-bounce');
            void el.offsetWidth;
            el.classList.add('oggob-bounce');
            if (type === 'gain') el.classList.add('oggob-gain');
            if (type === 'spend') el.classList.add('oggob-spend');
            setTimeout(() => {
                el.classList.remove('oggob-gain', 'oggob-spend');
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

window.OggobEconomy = OggobEconomy;
