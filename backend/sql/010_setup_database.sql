-- Create users table with all necessary fields
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  first_name VARCHAR(100),
  family_name VARCHAR(100),
  gender VARCHAR(20),
  matricula VARCHAR(50),
  birthday DATE,
  category VARCHAR(50),
  handicap DECIMAL(4,1),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drop obsolete index on name if exists
DROP INDEX IF EXISTS idx_users_name;

-- Add indices for users table
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_matricula ON users(matricula);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
CREATE INDEX IF NOT EXISTS idx_users_category ON users(category);
CREATE INDEX IF NOT EXISTS idx_users_first_name ON users(first_name);

-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(100) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  used BOOLEAN DEFAULT FALSE
);

-- Add indices for password_reset_tokens table
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);

-- -- Create initial admin user (password is 'admin123' - change this in production!)
-- INSERT INTO users (username, email, password, name, family_name, is_admin)
-- VALUES (
--   'adminuser',
--   'admin@example.com',
--   '$2b$10$wG0C2gUm4KMQxJdX3VJWmu.Nr7T5IW7SbxA4nE7mFsiZLdm1YzmG6',
--   'Admin',
--   'User',
--   TRUE
-- ) ON CONFLICT (email) DO NOTHING;