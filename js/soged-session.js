/**
 * Session + authenticated API helper for SOGED.
 * Persists the Supabase access token BEFORE any follow-up request.
 */
const SogedSession = {
    TOKEN_KEY: 'soged_token',
    USER_KEY: 'soged_user',

    persistSession(session) {
        if (!session?.access_token) return null;
        localStorage.setItem(this.TOKEN_KEY, session.access_token);
        const user = session.user || {};
        const meta = user.user_metadata || {};
        const payload = {
            id: user.id,
            email: user.email || '',
            name: [meta.first_name, meta.last_name].filter(Boolean).join(' ') || meta.username || (user.email || '').split('@')[0],
            username: meta.username || meta.first_name || (user.email || '').split('@')[0],
            role: 'user',
            subscription: 'basic',
            emailVerified: !!(user.email_confirmed_at || user.confirmed_at)
        };
        localStorage.setItem(this.USER_KEY, JSON.stringify(payload));
        localStorage.setItem('isLoggedIn', 'true');
        if (payload.email) localStorage.setItem('userEmail', payload.email);
        if (payload.name) localStorage.setItem('userName', payload.name);
        return payload;
    },

    getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    },

    getUser() {
        try {
            const raw = localStorage.getItem(this.USER_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    },

    async hydrate() {
        if (typeof supabaseClient === 'undefined') {
            const token = this.getToken();
            return token ? { access_token: token, user: this.getUser() } : null;
        }
        const { data } = await supabaseClient.auth.getSession();
        if (!data?.session) return null;
        this.persistSession(data.session);
        return data.session;
    },

    async getAccessToken() {
        const existing = this.getToken();
        if (existing && existing !== 'guest_token' && !existing.startsWith('dummy_token_')) {
            return existing;
        }
        const session = await this.hydrate();
        return session?.access_token || null;
    },

    async api(path, { method = 'GET', body, headers } = {}) {
        const token = await this.getAccessToken();
        const response = await fetch(path, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...headers
            },
            body: body != null ? JSON.stringify(body) : undefined
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            const error = new Error(data.message || data.error || 'Error en la respuesta del servidor');
            error.status = response.status;
            error.payload = data;
            throw error;
        }
        return data;
    },

    clearAllUserState() {
        const exact = [
            'isGuest', 'guestAccessLevel', 'isLoggedIn', 'userEmail', 'userName',
            'username', 'currentCourse', 'userProgress', 'sidebarCollapsed'
        ];
        Object.keys(localStorage).forEach((key) => {
            if (
                key.startsWith('soged_') ||
                key.startsWith('guna_') ||
                key.startsWith('sb-') ||
                exact.includes(key)
            ) {
                localStorage.removeItem(key);
            }
        });
    },

    async syncFromServer() {
        const token = await this.getAccessToken();
        if (!token) return null;
        const [settings, progress, economy] = await Promise.allSettled([
            this.api('/api/v1/user/settings'),
            this.api('/api/v1/progress'),
            this.api('/api/v1/economy')
        ]);
        return {
            settings: settings.status === 'fulfilled' ? settings.value : null,
            progress: progress.status === 'fulfilled' ? progress.value : null,
            economy: economy.status === 'fulfilled' ? economy.value : null
        };
    }
};

window.SogedSession = SogedSession;
