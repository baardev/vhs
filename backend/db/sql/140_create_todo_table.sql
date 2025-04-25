SET client_min_messages = 'warning';
-- Create the todos table
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);