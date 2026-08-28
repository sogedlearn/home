-- SOGED schema — run in Supabase SQL Editor
-- Phase 1: persistence for settings, progress, sequential levels, and coco ledger.

CREATE TABLE IF NOT EXISTS user_stats (
    user_id TEXT PRIMARY KEY,
    ogods INTEGER NOT NULL DEFAULT 0,
    burdas INTEGER NOT NULL DEFAULT 5,
    purchases TEXT[] NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS purchases TEXT[] DEFAULT '{}';
ALTER TABLE user_stats ALTER COLUMN ogods SET DEFAULT 0;

CREATE TABLE IF NOT EXISTS user_settings (
    user_id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL DEFAULT '',
    language TEXT NOT NULL DEFAULT 'en',
    theme TEXT NOT NULL DEFAULT 'light',
    daily_reminders BOOLEAN NOT NULL DEFAULT TRUE,
    achievement_notif BOOLEAN NOT NULL DEFAULT TRUE,
    streak_reminders BOOLEAN NOT NULL DEFAULT FALSE,
    audio_playback BOOLEAN NOT NULL DEFAULT TRUE,
    speech_recognition BOOLEAN NOT NULL DEFAULT TRUE,
    daily_goal INTEGER NOT NULL DEFAULT 100,
    difficulty TEXT NOT NULL DEFAULT 'intermediate',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_progress (
    user_id TEXT PRIMARY KEY,
    max_completed_level INTEGER NOT NULL DEFAULT 0,
    completed_levels INTEGER[] NOT NULL DEFAULT '{}',
    xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    streak INTEGER NOT NULL DEFAULT 0,
    last_study_date TEXT,
    timezone TEXT NOT NULL DEFAULT 'UTC',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS economy_ledger (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    idempotency_key TEXT NOT NULL,
    action TEXT,
    source TEXT,
    delta INTEGER DEFAULT 0,
    burda_delta INTEGER DEFAULT 0,
    result_ogods INTEGER,
    result_burdas INTEGER,
    item_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, idempotency_key)
);

CREATE TABLE IF NOT EXISTS chat_history (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON chat_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_economy_ledger_user ON economy_ledger(user_id);

ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE economy_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Service-role (API) bypasses RLS. These policies cover direct client access.
DO $$ BEGIN
    CREATE POLICY "Users can read own stats" ON user_stats FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
    CREATE POLICY "Users can upsert own stats" ON user_stats FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
    CREATE POLICY "Users can update own stats" ON user_stats FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
