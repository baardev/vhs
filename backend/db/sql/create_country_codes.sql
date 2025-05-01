-- Suppress notices
SET client_min_messages = 'warning';


-- ┌───────────────────────────────────────────────────────┐
-- │ country_codes (300_country_codes.csv)
--└───────────────────────────────────────────────────────┘
DROP TABLE IF EXISTS country_codes CASCADE;
CREATE TABLE IF NOT EXISTS country_codes (
    id SERIAL PRIMARY KEY,
    country_name VARCHAR(60),
    alpha_2 VARCHAR(2),
    alpha_3 VARCHAR(3),
    country_code VARCHAR(5)
);

-- Create indexes for tee types
CREATE INDEX IF NOT EXISTS idx_country_codes_country_code ON country_codes(country_code);
CREATE INDEX IF NOT EXISTS idx_country_codes_country_name ON country_codes(country_name);

\copy country_codes FROM '/tmp/country_codes.csv' WITH (FORMAT csv, HEADER true, NULL 'None');

