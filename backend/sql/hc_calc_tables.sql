DROP TABLE IF EXISTS player_cards CASCADE;
DROP TABLE IF EXISTS course_data CASCADE;
DROP TABLE IF EXISTS course_names CASCADE;
DROP VIEW IF EXISTS handicap_calculations CASCADE;

/* ──────────────────────────
   1.  master table: course_names
   ────────────────────────── */
CREATE TABLE course_names (
    id                     SERIAL PRIMARY KEY,
    course_id              INTEGER UNIQUE,       -- unique ID for the course (courseID in CSV)
    col_empty1             TEXT,                 -- Additional empty column in CSV
    course_name            TEXT,                 -- courseName in CSV  
    facility_id            INTEGER,              -- facilityID in CSV
    col_empty2             TEXT,                 -- Additional empty column in CSV
    facility_name          TEXT,                 -- facilityName in CSV
    col_empty3             TEXT,                 -- Additional empty column in CSV
    full_name              TEXT,                 -- fullName in CSV
    address1               TEXT,
    address2               TEXT,
    city                   TEXT,
    state                  VARCHAR(15),
    country                VARCHAR(5),
    ent_country_code       VARCHAR(10),          -- entCountryCode in CSV
    ent_state_code         VARCHAR(10),          -- entStateCode in CSV
    legacy_crp_course_id   INTEGER,              -- legacyCRPCourseId in CSV
    telephone              VARCHAR(50),
    email                  TEXT,
    ratings                TEXT,                 -- Changed from JSONB to TEXT as CSV has empty strings
    state_display          VARCHAR(10)           -- stateDisplay in CSV
);

-- /* ──────────────────────────
--    2.  tee‑by‑tee detail: course_data
--    ────────────────────────── */
CREATE TABLE course_data (
    id               SERIAL PRIMARY KEY,        -- synthetic key (one row per tee set)
    course_id        INTEGER NOT NULL,          -- Removed FK constraint temporarily for easier loading
    sel              INTEGER,                   -- Missing in schema but present in CSV
    tee_name         TEXT,
    gender           CHAR(1),                   -- "M" / "F"
    par              SMALLINT,
    course_rating    NUMERIC(4,1),
    bogey_rating     NUMERIC(4,1),
    slope_rating     SMALLINT,
    rating_f         NUMERIC(4,1),              -- front‑nine rating
    rating_b         NUMERIC(4,1),              -- back‑nine rating
    front            VARCHAR(50),               -- e.g. "33.7 / 119"
    back             VARCHAR(50),
    bogey_rating_f   NUMERIC(4,1),
    bogey_rating_b   NUMERIC(4,1),
    slope_f          SMALLINT,
    slope_b          SMALLINT,
    tee_id           INTEGER,
    length           INTEGER                    -- yards / metres (as given)
);

-- /* ──────────────────────────
--    3.  scorecards: player_cards
--    ────────────────────────── */
CREATE TABLE player_cards (
    id             SERIAL PRIMARY KEY,
    player_id      VARCHAR(50),
    play_date      DATE,                        -- Called "date" in CSV
    course_id      INTEGER,                     -- Removed FK constraint temporarily
    weather        VARCHAR(50),                 -- "clima" column in CSV
    day_of_week    SMALLINT,                    -- numeric 1–7 from "day" column in CSV
    category       VARCHAR(50),
    differential   NUMERIC(5,1),
    post           TEXT,                         -- Changed to TEXT to handle 'None' values
    judges         VARCHAR(50),
    hcpi           NUMERIC(5,1),
    hcp            NUMERIC(5,1),
    ida            INTEGER,
    vta            INTEGER,
    gross          INTEGER,
    net            INTEGER,
    tarj           VARCHAR(10),                 -- card submission status ("OK", "NPT"…)
    bir            TEXT,                         -- Changed to TEXT to handle 'None' values
    par_holes      INTEGER,                     -- Called "par" in CSV
    bog            INTEGER,
    bg2            INTEGER,
    bg3g           INTEGER,
    plus_bg3       TEXT,                         -- Changed to TEXT to handle 'None' values
    putts          TEXT                          -- Changed to TEXT to handle 'None' values
);
-- -- Set date format to European DMY
SET datestyle = 'European, DMY';

-- Import data directly from CSV files with exact column matching
\copy course_names FROM '/tmp/course_names.csv' WITH (FORMAT csv, HEADER true, NULL 'None');
\copy course_data FROM '/tmp/course_data.csv' WITH (FORMAT csv, HEADER true, NULL 'None');
\copy player_cards FROM '/tmp/player_cards.csv' WITH (FORMAT csv, HEADER true, NULL 'None');

-- -- Add foreign key constraints after data import
ALTER TABLE course_data
    ADD CONSTRAINT course_data_course_id_fkey
    FOREIGN KEY (course_id) REFERENCES course_names(course_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE player_cards
    ADD CONSTRAINT player_cards_course_id_fkey
    FOREIGN KEY (course_id) REFERENCES course_names(course_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;

-- -- Create a view for handicap calculations (using course_data instead of course_tees)
CREATE VIEW handicap_calculations AS
SELECT 
    pc.id,
    pc.player_id,
    pc.play_date,
    pc.course_id,
    pc.differential,
    pc.hcpi,
    pc.hcp,
    pc.gross,
    pc.net,
    cn.course_name,
    cd.tee_name,
    cd.course_rating,
    cd.slope_rating
FROM player_cards pc
JOIN course_names cn ON pc.course_id = cn.course_id
JOIN course_data cd ON pc.course_id = cd.course_id
ORDER BY pc.play_date DESC;

-- Create an index on play_date for faster sorting and filtering
CREATE INDEX idx_player_cards_play_date ON player_cards(play_date);

-- Create an index on differential for faster handicap calculations
CREATE INDEX idx_player_cards_differential ON player_cards(differential);