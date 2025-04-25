-- Suppress notices
SET client_min_messages = 'warning';

-- Drop view if exists
DROP VIEW IF EXISTS handicap_calculations CASCADE;

-- Drop all indexes if they exist
DROP INDEX IF EXISTS idx_player_cards_player_id CASCADE;
DROP INDEX IF EXISTS idx_player_cards_play_date CASCADE;
DROP INDEX IF EXISTS idx_player_cards_course_id CASCADE;
DROP INDEX IF EXISTS idx_player_cards_differential CASCADE;
DROP INDEX IF EXISTS idx_player_cards_tarj CASCADE;
DROP INDEX IF EXISTS idx_player_cards_verified CASCADE;

-- Drop table if exists
DROP TABLE IF EXISTS player_cards CASCADE;

-- Create the player_cards table matching CSV structure exactly
CREATE TABLE IF NOT EXISTS player_cards (
    id             SERIAL PRIMARY KEY,
    player_id      INTEGER,                    -- User ID reference
    play_date      DATE,                       -- Called "date" in CSV
    course_id      INTEGER,                    -- Course reference
    weather        VARCHAR(50),                -- "clima" in CSV
    day_of_week    VARCHAR(10),                -- "day" in CSV - can be number or text
    category       VARCHAR(50),
    differential   NUMERIC(5,1),
    post           TEXT,                       
    judges         VARCHAR(100),               
    hcpi           NUMERIC(5,1),
    hcp            NUMERIC(5,1),
    ida            INTEGER,
    vta            INTEGER,
    gross          INTEGER,
    net            INTEGER,
    tarj           VARCHAR(10),                -- Card status ("OK", "NPT", "DES")
    bir            TEXT,                       
    par_holes      TEXT,                       -- "par" in CSV
    bog            INTEGER,
    bg2            INTEGER,
    bg3g           INTEGER,
    plus_bg3       TEXT,                       
    putts          TEXT,                       
    tee_id         VARCHAR(10),                -- Tee type reference
    
    -- Hole-by-hole scores
    h01 INTEGER, h02 INTEGER, h03 INTEGER, h04 INTEGER, h05 INTEGER,
    h06 INTEGER, h07 INTEGER, h08 INTEGER, h09 INTEGER, h10 INTEGER,
    h11 INTEGER, h12 INTEGER, h13 INTEGER, h14 INTEGER, h15 INTEGER,
    h16 INTEGER, h17 INTEGER, h18 INTEGER,
    
    verified       BOOLEAN DEFAULT FALSE,
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Set date format to European DMY for import
SET datestyle = 'European, DMY';

-- Import data directly from CSV file - column names match CSV headers exactly
\copy player_cards(id, player_id, play_date, course_id, weather, day_of_week, category, differential, post, judges, hcpi, hcp, ida, vta, gross, net, tarj, bir, par_holes, bog, bg2, bg3g, plus_bg3, putts, tee_id, h01, h02, h03, h04, h05, h06, h07, h08, h09, h10, h11, h12, h13, h14, h15, h16, h17, h18, verified) FROM '/tmp/player_cards.csv' WITH (FORMAT csv, HEADER true, FORCE_NULL(post, judges, bir, plus_bg3, putts), NULL 'None');

-- Add foreign key constraints after data import
ALTER TABLE player_cards
    ADD CONSTRAINT player_cards_course_id_fkey
    FOREIGN KEY (course_id) REFERENCES course_names(course_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;

ALTER TABLE player_cards
    ADD CONSTRAINT player_cards_tee_id_fkey
    FOREIGN KEY (tee_id) REFERENCES tee_types(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;

ALTER TABLE player_cards
    ADD CONSTRAINT player_cards_player_id_fkey
    FOREIGN KEY (player_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE;

-- Create indices for faster queries
CREATE INDEX idx_player_cards_player_id ON player_cards(player_id);
CREATE INDEX idx_player_cards_play_date ON player_cards(play_date);
CREATE INDEX idx_player_cards_course_id ON player_cards(course_id);
CREATE INDEX idx_player_cards_differential ON player_cards(differential);
CREATE INDEX idx_player_cards_tarj ON player_cards(tarj);
CREATE INDEX idx_player_cards_verified ON player_cards(verified);

-- Create a view for handicap calculations
CREATE OR REPLACE VIEW handicap_calculations AS
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
    pc.verified,
    pc.tarj,
    cn.course_name,
    cd.tee_name,
    cd.course_rating,
    cd.slope_rating,
    u.username AS player_name
FROM player_cards pc
JOIN course_names cn ON pc.course_id = cn.course_id
JOIN course_data cd ON pc.course_id = cd.course_id
LEFT JOIN users u ON pc.player_id = u.id
WHERE pc.tarj = 'OK'
ORDER BY pc.play_date DESC;