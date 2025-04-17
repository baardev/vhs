-- Add is_admin column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Set existing admin users
UPDATE users SET is_admin = TRUE WHERE username = 'admin' OR username = 'adminuser';
UPDATE users SET is_admin = TRUE WHERE email = 'admin@example.com';

-- Create an index on is_admin column for faster queries
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);