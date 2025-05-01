-- Suppress notices
SET client_min_messages = 'warning';

-- 1. COURSES TABLE-- ┌───────────────────────────────────────────────────────┐
-- │ x_course_tee_types (300_tee_types_v.csv)
--└───────────────────────────────────────────────────────┘

DROP TABLE IF EXISTS x_course_tee_types CASCADE;
CREATE TABLE IF NOT EXISTS x_course_tee_types (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL,
    tee_id VARCHAR(50) UNIQUE,
    tee_color VARCHAR(50),
    tee_name VARCHAR(50),
    tee_desc TEXT,
    FOREIGN KEY (course_id) REFERENCES x_course_names(course_id)
);

-- Create indexes for tee types
CREATE INDEX IF NOT EXISTS idx_x_course_tee_types_course_id ON x_course_tee_types(course_id);
CREATE INDEX IF NOT EXISTS idx_x_course_tee_types_tee_id ON x_course_tee_types(tee_id);
\copy x_course_tee_types FROM '/tmp/300_course_tee_types.csv' WITH (FORMAT csv, HEADER true, NULL 'None');

