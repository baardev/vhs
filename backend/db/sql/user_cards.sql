SET client_min_messages = 'warning';


-- Create tee_names table which links to existing course_names
CREATE TABLE IF NOT EXISTS tee_names (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES course_names(course_id),
  tee_type VARCHAR(20) NOT NULL CHECK (tee_type IN ('pro', 'skill', 'regular', 'ladies')),
  color VARCHAR(50),
  UNIQUE(course_id, tee_type)
);

-- Create index for tee_names
CREATE INDEX IF NOT EXISTS idx_tee_names_course_id ON tee_names(course_id);
CREATE INDEX IF NOT EXISTS idx_tee_names_tee_type ON tee_names(tee_type);

-- Create player_cards table for recording golf scores
CREATE TABLE IF NOT EXISTS player_cards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES course_names(course_id) ON DELETE RESTRICT,
  tee_id INTEGER NOT NULL REFERENCES tee_names(id) ON DELETE RESTRICT,
  played_date DATE NOT NULL,
  
  -- Strokes for each hole
  hole_1 INTEGER NOT NULL CHECK (hole_1 > 0),
  hole_2 INTEGER NOT NULL CHECK (hole_2 > 0),
  hole_3 INTEGER NOT NULL CHECK (hole_3 > 0),
  hole_4 INTEGER NOT NULL CHECK (hole_4 > 0),
  hole_5 INTEGER NOT NULL CHECK (hole_5 > 0),
  hole_6 INTEGER NOT NULL CHECK (hole_6 > 0),
  hole_7 INTEGER NOT NULL CHECK (hole_7 > 0),
  hole_8 INTEGER NOT NULL CHECK (hole_8 > 0),
  hole_9 INTEGER NOT NULL CHECK (hole_9 > 0),
  hole_10 INTEGER NOT NULL CHECK (hole_10 > 0),
  hole_11 INTEGER NOT NULL CHECK (hole_11 > 0),
  hole_12 INTEGER NOT NULL CHECK (hole_12 > 0),
  hole_13 INTEGER NOT NULL CHECK (hole_13 > 0),
  hole_14 INTEGER NOT NULL CHECK (hole_14 > 0),
  hole_15 INTEGER NOT NULL CHECK (hole_15 > 0),
  hole_16 INTEGER NOT NULL CHECK (hole_16 > 0),
  hole_17 INTEGER NOT NULL CHECK (hole_17 > 0),
  hole_18 INTEGER NOT NULL CHECK (hole_18 > 0),
  
  -- Automatically calculated total
  total_score INTEGER GENERATED ALWAYS AS (
    hole_1 + hole_2 + hole_3 + hole_4 + hole_5 + hole_6 + hole_7 + hole_8 + hole_9 +
    hole_10 + hole_11 + hole_12 + hole_13 + hole_14 + hole_15 + hole_16 + hole_17 + hole_18
  ) STORED,
  
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for user_cards
CREATE INDEX IF NOT EXISTS idx_user_cards_user_id ON user_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_cards_course_id ON user_cards(course_id);
CREATE INDEX IF NOT EXISTS idx_user_cards_tee_id ON user_cards(tee_id);
CREATE INDEX IF NOT EXISTS idx_user_cards_played_date ON user_cards(played_date);