-- Suppress notices
SET client_min_messages = 'warning';


-- ┌───────────────────────────────────────────────────────┐
-- │ x_course_data_by_tee (300_course_data_by_tee.csv)
--└───────────────────────────────────────────────────────┘
DROP TABLE IF EXISTS x_course_data_by_tee CASCADE;
CREATE TABLE IF NOT EXISTS x_course_data_by_tee (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL,
    tee_id VARCHAR(50),
    par INTEGER,
    length INTEGER, 
    slope_rating INTEGER,
    slope_back INTEGER,
    slope_front INTEGER,
    bogey_rating NUMERIC(4,1),
    bogey_rating_back NUMERIC(4,1),
    bogey_rating_front NUMERIC(4,1),
    course_rating NUMERIC(4,1),
    course_rating_back NUMERIC(4,1),
    course_rating_front NUMERIC(4,1)
);

-- Create indexes for tee types
CREATE INDEX IF NOT EXISTS idx_x_course_data_by_tee_course_id ON x_course_data_by_tee(course_id);
CREATE INDEX IF NOT EXISTS idx_x_course_data_by_tee_tee_id ON x_course_data_by_tee(tee_id);

\copy x_course_data_by_tee FROM '/tmp/300_course_data_by_tee.csv' WITH (FORMAT csv, HEADER true, NULL 'None');

