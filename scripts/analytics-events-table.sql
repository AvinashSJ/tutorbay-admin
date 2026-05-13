-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  user_id UUID,
  entity_id TEXT,
  entity_type TEXT,
  metadata JSONB DEFAULT '{}',
  source TEXT DEFAULT 'web',
  session_id TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_entity ON analytics_events(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);

-- RLS Policies
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for authenticated users"
  ON analytics_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Auto-cleanup: keep only last 90 days of events
-- This prevents the table from growing unbounded
CREATE OR REPLACE FUNCTION cleanup_old_analytics_events()
RETURNS void AS $$
BEGIN
  DELETE FROM analytics_events WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Daily cleanup job (run via pg_cron or Supabase Cron)
-- SELECT cron.schedule('cleanup-analytics', '0 3 * * *', 'SELECT cleanup_old_analytics_events()');