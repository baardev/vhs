-- Suppress notices
SET client_min_messages = 'warning';

-- ┌───────────────────────────────────────────────────────┐
-- │ x_course_holes (300_course_holes.csv)
--└───────────────────────────────────────────────────────┘

DROP TABLE IF EXISTS x_course_holes CASCADE;
CREATE TABLE IF NOT EXISTS x_course_holes (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL,
    hole_number INTEGER NOT NULL CHECK (hole_number BETWEEN 1 AND 18),
    par INTEGER,
    men_stroke_index INTEGER,
    women_stroke_index INTEGER,
    FOREIGN KEY (course_id) REFERENCES x_course_names(course_id),
    UNIQUE (course_id, hole_number)
);

-- Create index for holes
CREATE INDEX IF NOT EXISTS idx_x_course_holes_course_id ON x_course_holes(course_id);

-- Import data directly from CSV files with matching table names
\copy x_course_holes FROM '/tmp/300_course_holes.csv' WITH (FORMAT csv, HEADER true, NULL 'None');
