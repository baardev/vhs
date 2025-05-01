-- Suppress notices
SET client_min_messages = 'warning';


-- ┌───────────────────────────────────────────────────────┐
-- │ country_codes (300_country_codes.csv)
--└───────────────────────────────────────────────────────┘
DROP TABLE IF EXISTS province_codes CASCADE;
CREATE TABLE IF NOT EXISTS province_codes ( 
    id SERIAL PRIMARY KEY,
    country_code VARCHAR(2),
    iso_code VARCHAR(5),
    province_name VARCHAR(60)
);

-- Create indexes for province codes
CREATE INDEX IF NOT EXISTS idx_province_codes_iso_code ON province_codes(iso_code);
CREATE INDEX IF NOT EXISTS idx_province_codes_province_name ON province_codes(province_name);

\copy province_codes FROM '/tmp/province_codes.csv' WITH (FORMAT csv, HEADER true, NULL 'None');

