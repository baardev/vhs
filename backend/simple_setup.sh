#!/bin/bash

# Start PostgreSQL
echo "Starting PostgreSQL..."
sudo systemctl start postgresql.service

# Check if PostgreSQL is running
pg_isready > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "PostgreSQL is not running. Please start it manually."
  exit 1
fi

echo "PostgreSQL is running."

# Store SQL content in a variable to avoid file permission issues
SQL_CONTENT=$(cat <<'EOF'
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indices for users table
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(100) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  used BOOLEAN DEFAULT FALSE
);

-- Add index on token for faster lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);

-- Add index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);

-- Create initial admin user (password is 'admin123' - change this in production!)
INSERT INTO users (username, email, password)
VALUES (
  'adminuser',
  'admin@example.com',
  '$2b$10$mG5Ms3iDHJv9JKT2bQrxvOuTxlXHSkZQGzYPBKTOLHzWdVGnH3A7m'
) ON CONFLICT (email) DO NOTHING;
EOF
)

# Create user and database directly with PostgreSQL commands
echo "Creating database and user..."
sudo -u postgres psql <<EOF
DROP DATABASE IF EXISTS vhsdb;
DROP USER IF EXISTS admin;
CREATE USER admin WITH PASSWORD 'adminpassword';
ALTER USER admin WITH SUPERUSER;
CREATE DATABASE vhsdb;
GRANT ALL PRIVILEGES ON DATABASE vhsdb TO admin;
\c vhsdb
$SQL_CONTENT
EOF

echo "Database setup complete!"