-- List all users with basic information
SELECT id, username, email, created_at FROM users;

-- List all users with complete profile information
SELECT id, username, email, created_at, name, family_name, matricula, handicap FROM users;

-- Find a specific user by username (replace 'adminuser' with the username you want to find)
SELECT * FROM users WHERE username = 'adminuser';

-- Find a specific user by email (replace 'admin@example.com' with the email you want to find)
SELECT * FROM users WHERE email = 'admin@example.com';

-- List users sorted by creation date (newest first)
SELECT id, username, email, created_at FROM users ORDER BY created_at DESC;

-- List users with non-null handicap values
SELECT id, username, email, handicap FROM users WHERE handicap IS NOT NULL;

-- Count total number of users
SELECT COUNT(*) AS total_users FROM users;