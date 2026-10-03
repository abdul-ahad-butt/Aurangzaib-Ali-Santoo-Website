CREATE TABLE IF NOT EXISTS booking_inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date TEXT NOT NULL,
  alt_date TEXT,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  venue_type TEXT,
  guest_count TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON booking_inquiries(created_at);
