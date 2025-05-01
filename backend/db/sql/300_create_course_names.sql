-- Suppress notices
SET client_min_messages = 'warning';

-- ┌───────────────────────────────────────────────────────┐
-- │ x_course_names (300_course_names.csv)
--└───────────────────────────────────────────────────────┘
DROP TABLE IF EXISTS x_course_names CASCADE;
CREATE TABLE IF NOT EXISTS x_course_names (
    id SERIAL PRIMARY KEY,
    course_id INTEGER UNIQUE,
    course_name TEXT,
    address1 TEXT,
    address2 TEXT,
    city TEXT,
    province VARCHAR(15),
    country_code VARCHAR(5),
    telephone VARCHAR(50),
    email TEXT
);

-- Create indexes for courses
CREATE INDEX IF NOT EXISTS idx_x_course_names_course_id ON x_course_names(course_id);
CREATE INDEX IF NOT EXISTS idx_x_course_names_name ON x_course_names(course_name);

\copy x_course_names FROM '/tmp/300_course_names.csv' WITH (FORMAT csv, HEADER true, NULL 'None');

