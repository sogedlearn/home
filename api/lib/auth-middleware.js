const { createUserClient, isSupabaseConfigured } = require('./supabase-admin');

function extractBearer(req) {
    const header = req.headers.authorization || req.headers.Authorization || '';
    if (typeof header === 'string' && header.startsWith('Bearer ')) {
        return header.slice(7).trim();
    }
    return null;
}

async function requireAuth(req, res, next) {
    const token = extractBearer(req);
    if (!token) {
        return res.status(401).json({
            status: 'error',
            code: 'UNAUTHENTICATED',
            message: 'Se requiere un token de sesión.'
        });
    }

    if (process.env.SOGED_TEST_MODE === '1' && token.startsWith('test:')) {
        req.user = { id: token.slice(5), email: `${token.slice(5)}@test.soged` };
        req.accessToken = token;
        return next();
    }

    if (!isSupabaseConfigured()) {
        return res.status(503).json({
            status: 'error',
            code: 'AUTH_UNAVAILABLE',
            message: 'Servicio de autenticación no configurado.'
        });
    }

    try {
        const client = createUserClient(token);
        const { data, error } = await client.auth.getUser(token);
        if (error || !data?.user) {
            return res.status(401).json({
                status: 'error',
                code: 'INVALID_TOKEN',
                message: 'Sesión inválida o expirada.'
            });
        }
        req.user = { id: data.user.id, email: data.user.email, user: data.user };
        req.accessToken = token;
        return next();
    } catch (err) {
        console.error('requireAuth error:', err);
        return res.status(401).json({
            status: 'error',
            code: 'INVALID_TOKEN',
            message: 'No se pudo validar la sesión.'
        });
    }
}

function isEmailVerified(user) {
    if (!user) return false;
    return Boolean(user.email_confirmed_at || user.confirmed_at || user.user?.email_confirmed_at);
}

function requireVerified(req, res, next) {
    if (process.env.SOGED_TEST_MODE === '1') return next();
    const raw = req.user?.user || req.user;
    if (raw && !isEmailVerified(raw) && raw.email && !String(raw.email).endsWith('@test.soged')) {
        return res.status(403).json({
            status: 'error',
            code: 'EMAIL_NOT_VERIFIED',
            message: 'Confirma tu correo electrónico para guardar progreso y recompensas.'
        });
    }
    return next();
}

module.exports = { requireAuth, requireVerified, extractBearer, isEmailVerified };
