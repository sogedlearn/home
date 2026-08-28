const { createClient } = require('@supabase/supabase-js');

function getSupabaseUrl() {
    return process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
}

function getAnonKey() {
    return process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
}

function getServiceKey() {
    return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';
}

function isSupabaseConfigured() {
    return Boolean(getSupabaseUrl() && (getServiceKey() || getAnonKey()));
}

function createUserClient(accessToken) {
    const url = getSupabaseUrl();
    const key = getAnonKey();
    if (!url || !key) return null;
    return createClient(url, key, {
        global: {
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
        },
        auth: { persistSession: false, autoRefreshToken: false }
    });
}

function createAdminClient() {
    const url = getSupabaseUrl();
    const key = getServiceKey() || getAnonKey();
    if (!url || !key) return null;
    return createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false }
    });
}

module.exports = {
    getSupabaseUrl,
    getAnonKey,
    getServiceKey,
    isSupabaseConfigured,
    createUserClient,
    createAdminClient
};
