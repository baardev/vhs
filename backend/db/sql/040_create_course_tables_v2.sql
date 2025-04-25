-- Suppress notices
SET client_min_messages = 'warning';

-- Golf Course Tables

-- Create the course_names table to match course_names_v2.csv
DROP TABLE IF EXISTS course_names CASCADE;
CREATE TABLE IF NOT EXISTS course_names (
    id SERIAL PRIMARY KEY,
    course_id INTEGER UNIQUE,
    col_empty1 TEXT,
    course_name TEXT,
    facility_id INTEGER,
    col_empty2 TEXT,
    facility_name TEXT,
    col_empty3 TEXT,
    full_name TEXT,
    address1 TEXT,
    address2 TEXT,
    city TEXT,
    state VARCHAR(15),
    country VARCHAR(5),
    ent_country_code VARCHAR(10),
    ent_state_code VARCHAR(10),
    legacy_crp_course_id INTEGER,
    telephone VARCHAR(50),
    email TEXT,
    ratings TEXT,
    state_display VARCHAR(10)
);

-- Create index for course_names
DROP INDEX IF EXISTS idx_course_names_course_id CASCADE;
CREATE INDEX IF NOT EXISTS idx_course_names_course_id ON course_names(course_id);
DROP INDEX IF EXISTS idx_course_names_name CASCADE;
CREATE INDEX IF NOT EXISTS idx_course_names_name ON course_names(course_name);

-- Create the course_data table to match course_data_v2.csv
DROP TABLE IF EXISTS course_data CASCADE;
CREATE TABLE IF NOT EXISTS course_data (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL,
    sel INTEGER,
    tee_name TEXT,
    gender CHAR(1),
    par INTEGER,
    course_rating NUMERIC(4,1),
    bogey_rating NUMERIC(4,1),
    slope_rating INTEGER,
    rating_f NUMERIC(4,1),
    rating_b NUMERIC(4,1),
    front VARCHAR(50),
    back VARCHAR(50),
    bogey_rating_f NUMERIC(4,1),
    bogey_rating_b NUMERIC(4,1),
    slope_f INTEGER,
    slope_b INTEGER,
    tee_id INTEGER,
    length INTEGER,
    -- Renamed hole par columns and changed to INTEGER type
    par_h01 INTEGER, par_h02 INTEGER, par_h03 INTEGER, par_h04 INTEGER, par_h05 INTEGER, 
    par_h06 INTEGER, par_h07 INTEGER, par_h08 INTEGER, par_h09 INTEGER,
    par_h10 INTEGER, par_h11 INTEGER, par_h12 INTEGER, par_h13 INTEGER, par_h14 INTEGER, 
    par_h15 INTEGER, par_h16 INTEGER, par_h17 INTEGER, par_h18 INTEGER
);

-- Create index for course_data
DROP INDEX IF EXISTS idx_course_data_course_id CASCADE;
CREATE INDEX IF NOT EXISTS idx_course_data_course_id ON course_data(course_id);
DROP INDEX IF EXISTS idx_course_data_tee_name CASCADE;
CREATE INDEX IF NOT EXISTS idx_course_data_tee_name ON course_data(tee_name);

-- Create the tee_types table to match tee_types_v2.csv
DROP TABLE IF EXISTS tee_types CASCADE;
CREATE TABLE IF NOT EXISTS tee_types (
    id VARCHAR(10) PRIMARY KEY,
    course_id INTEGER NOT NULL,
    tee_type VARCHAR(20) NOT NULL,
    color VARCHAR(50)
);

-- Create index for tee_types
DROP INDEX IF EXISTS idx_tee_types_course_id CASCADE;
CREATE INDEX IF NOT EXISTS idx_tee_types_course_id ON tee_types(course_id);
DROP INDEX IF EXISTS idx_tee_types_tee_type CASCADE;
CREATE INDEX IF NOT EXISTS idx_tee_types_tee_type ON tee_types(tee_type);

-- Add foreign key constraints after all tables are created
ALTER TABLE course_data 
    ADD CONSTRAINT course_data_course_id_fkey 
    FOREIGN KEY (course_id) REFERENCES course_names(course_id);

ALTER TABLE tee_types 
    ADD CONSTRAINT tee_types_course_id_fkey 
    FOREIGN KEY (course_id) REFERENCES course_names(id);

-- Import data directly from CSV files
\copy course_names(id, course_id, col_empty1, course_name, facility_id, col_empty2, facility_name, col_empty3, full_name, address1, address2, city, state, country, ent_country_code, ent_state_code, legacy_crp_course_id, telephone, email, ratings, state_display) FROM '/tmp/course_names_v2.csv' WITH (FORMAT csv, HEADER true, NULL 'None');
\copy course_data(id, course_id, sel, tee_name, gender, par, course_rating, bogey_rating, slope_rating, rating_f, rating_b, front, back, bogey_rating_f, bogey_rating_b, slope_f, slope_b, tee_id, length, par_h01, par_h02, par_h03, par_h04, par_h05, par_h06, par_h07, par_h08, par_h09, par_h10, par_h11, par_h12, par_h13, par_h14, par_h15, par_h16, par_h17, par_h18) FROM '/tmp/course_data_v2.csv' WITH (FORMAT csv, HEADER true, NULL 'None');
\copy tee_types FROM '/tmp/tee_types_v2.csv' WITH (FORMAT csv, HEADER true, NULL 'None');




