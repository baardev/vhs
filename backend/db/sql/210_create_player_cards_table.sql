-- 210_create_player_cards_table.sql

-- Drop the table if it already exists
DROP TABLE IF EXISTS player_cards CASCADE;

-- Create the player_cards table
CREATE TABLE player_cards (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL,
    play_date DATE NOT NULL,
    course_id INTEGER NOT NULL,
    weather VARCHAR(50),
    day_of_week VARCHAR(10),
    category VARCHAR(50),
    differential NUMERIC(5,1),
    post TEXT,
    judges VARCHAR(100),
    hcpi NUMERIC(5,1),
    hcp NUMERIC(5,1),
    ida INTEGER,
    vta INTEGER,
    gross INTEGER,
    net INTEGER,
    tarj VARCHAR(10),
    bir TEXT,
    par_holes TEXT,
    bog INTEGER,
    bg2 INTEGER,
    bg3g INTEGER,
    plus_bg3 TEXT,
    putts TEXT,
    tee_id VARCHAR(10),
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

-- Create indices
CREATE INDEX idx_player_cards_player_id ON player_cards(player_id);
CREATE INDEX idx_player_cards_play_date ON player_cards(play_date);
CREATE INDEX idx_player_cards_course_id ON player_cards(course_id);
CREATE INDEX idx_player_cards_differential ON player_cards(differential);
CREATE INDEX idx_player_cards_tarj ON player_cards(tarj);
CREATE INDEX idx_player_cards_verified ON player_cards(verified); 