CREATE INDEX IF NOT EXISTS idx_customers_document ON customers(LOWER(document));
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);