CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




-- Add index on token for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Add index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);