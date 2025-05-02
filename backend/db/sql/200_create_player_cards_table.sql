-- 210_create_player_cards_table.sql
SET datestyle = 'DMY';
-- Drop the table if it already exists
DROP TABLE IF EXISTS player_cards CASCADE;

-- Create the player_cards table
CREATE TABLE player_cards (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL,
    play_date DATE NOT NULL,
    course_id INTEGER NOT NULL,
    ext_id INTEGER NOT NULL DEFAULT 0,
    clima VARCHAR(255),
    week_day VARCHAR(20),
    category VARCHAR(50),
    g_differential NUMERIC,
    post TEXT,
    judges TEXT,
    hcpi NUMERIC,
    hcp NUMERIC,
    ida INTEGER,
    vta INTEGER,
    gross INTEGER,
    net INTEGER,
    tarj VARCHAR(10),
    bir TEXT,
    par VARCHAR(50),
    bog INTEGER,
    bg2 INTEGER,
    bg3g INTEGER,
    plus_bg3 TEXT,
    putts TEXT,
    tee_id VARCHAR(50),
    h01 INTEGER, h02 INTEGER, h03 INTEGER, h04 INTEGER, h05 INTEGER,
    h06 INTEGER, h07 INTEGER, h08 INTEGER, h09 INTEGER,
    h10 INTEGER, h11 INTEGER, h12 INTEGER, h13 INTEGER, h14 INTEGER,
    h15 INTEGER, h16 INTEGER, h17 INTEGER, h18 INTEGER,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraints
ALTER TABLE player_cards
    ADD CONSTRAINT player_cards_course_id_fkey
    FOREIGN KEY (course_id) REFERENCES x_course_names(course_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;

ALTER TABLE player_cards
    ADD CONSTRAINT player_cards_tee_id_fkey
    FOREIGN KEY (tee_id) REFERENCES x_course_tee_types(tee_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;

ALTER TABLE player_cards
    ADD CONSTRAINT player_cards_player_id_fkey
    FOREIGN KEY (player_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE;

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_player_cards_player_id;
DROP INDEX IF EXISTS idx_player_cards_play_date;
DROP INDEX IF EXISTS idx_player_cards_course_id;
DROP INDEX IF EXISTS idx_player_cards_differential;
DROP INDEX IF EXISTS idx_player_cards_tarj;
DROP INDEX IF EXISTS idx_player_cards_verified;

-- Create optimized indices
CREATE INDEX idx_player_cards_player_id ON player_cards(player_id);
CREATE INDEX idx_player_cards_play_date ON player_cards(play_date DESC);
CREATE INDEX idx_player_cards_course_id ON player_cards(course_id);
CREATE INDEX idx_player_cards_g_differential ON player_cards(g_differential);
CREATE INDEX idx_player_cards_tarj ON player_cards(tarj);
CREATE INDEX idx_player_cards_verified ON player_cards(verified);

-- Add combined indexes for common queries
CREATE INDEX idx_player_cards_player_date ON player_cards(player_id, play_date DESC);
CREATE INDEX idx_player_cards_verified_tarj ON player_cards(verified, tarj);
CREATE INDEX idx_player_cards_handicap_calc ON player_cards(player_id, verified, tarj, play_date DESC);

-- Add indexes for hole scores (useful for statistical queries)
CREATE INDEX idx_player_cards_holes_front ON player_cards(h01, h02, h03, h04, h05, h06, h07, h08, h09);
CREATE INDEX idx_player_cards_holes_back ON player_cards(h10, h11, h12, h13, h14, h15, h16, h17, h18);

-- Add index for tee_id for better joining
CREATE INDEX idx_player_cards_tee_id ON player_cards(tee_id); 

\copy player_cards FROM '/tmp/200_player_cards.csv' WITH (FORMAT csv, HEADER true, NULL 'None');

update player_cards set created_at = play_date;