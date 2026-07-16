-- Supabase schema for SOGED unified hub
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS user_stats (
    user_id TEXT PRIMARY KEY,
    ogods INTEGER NOT NULL DEFAULT 1250,
    burdas INTEGER NOT NULL DEFAULT 5,
    updated_at TIMESTAMPTZ DEFAULT NOW()
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

-- Enable RLS (adjust policies for your auth setup)
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own stats" ON user_stats
    FOR SELECT USING (true);

CREATE POLICY "Users can upsert own stats" ON user_stats
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own stats" ON user_stats
    FOR UPDATE USING (true);

CREATE POLICY "Users can read own chat" ON chat_history
    FOR SELECT USING (true);

CREATE POLICY "Users can insert chat" ON chat_history
    FOR INSERT WITH CHECK (true);
