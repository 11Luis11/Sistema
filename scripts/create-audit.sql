CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id INTEGER,
  action TEXT NOT NULL,
  user_id INTEGER,
  details JSONB DEFAULT '{}' :: JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
