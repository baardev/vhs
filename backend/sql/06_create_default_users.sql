-- Create default users if they don't exist (passwd is "1q2w3e4r")
INSERT INTO users (username, email, password)
VALUES
('admin', 'admin@example.com', '$2b$10$rACnzk7TgV.rO.QBDxgE7.rjh5RMz0nG3XxQEPJ6waYZDEt7znmP.'),
('jm42', 'jeff.milton@gmail.com', '$2b$10$rACnzk7TgV.rO.QBDxgE7.rjh5RMz0nG3XxQEPJ6waYZDEt7znmP.'),
('vhs', 'ns.victoria@gmail.com', '$2b$10$rACnzk7TgV.rO.QBDxgE7.rjh5RMz0nG3XxQEPJ6waYZDEt7znmP.'),
ON CONFLICT (username) DO NOTHING;

