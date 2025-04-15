-- Alter users table to add new fields
ALTER TABLE users
ADD COLUMN IF NOT EXISTS name VARCHAR(100),
ADD COLUMN IF NOT EXISTS family_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS matricula VARCHAR(50),
ADD COLUMN IF NOT EXISTS handicap DECIMAL(4,1);

-- Add index for matricula field for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_matricula ON users(matricula);