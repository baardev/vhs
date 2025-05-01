-- Test script for player_cards table relationships

-- 1. Basic checks - verify tables and view exist
SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'player_cards') AS player_cards_exists;
SELECT EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'handicap_calculations') AS handicap_view_exists;

-- 2. Count records in player_cards table
SELECT COUNT(*) AS total_player_cards FROM player_cards;

-- 3. Check foreign key relationships
-- 3.1 Player cards with missing course references
SELECT COUNT(*) AS orphaned_course_refs 
FROM player_cards pc
LEFT JOIN x_course_names cn ON pc.course_id = cn.course_id
WHERE cn.course_id IS NULL;

-- 3.2 Player cards with missing tee type references
SELECT COUNT(*) AS orphaned_tee_refs
FROM player_cards pc
LEFT JOIN x_course_tee_types tt ON pc.tee_id = tt.tee_id
WHERE tt.tee_id IS NULL;

-- 3.3 Player cards with missing player references
SELECT COUNT(*) AS orphaned_player_refs
FROM player_cards pc
LEFT JOIN users u ON pc.player_id = u.id
WHERE u.id IS NULL;

-- 4. Test the view relationships
-- 4.1 Compare record counts between table and view
SELECT 
    COUNT(*) AS total_cards,
    SUM(CASE WHEN tarj = 'OK' THEN 1 ELSE 0 END) AS ok_cards
FROM player_cards;

SELECT COUNT(*) AS handicap_view_records
FROM handicap_calculations;

-- 5. Sample data retrieval tests
-- 5.1 Get most recent 5 player cards with player names
SELECT pc.id, pc.player_id, pc.play_date, pc.course_id, pc.g_differential, u.username
FROM player_cards pc
JOIN users u ON pc.player_id = u.id
ORDER BY pc.play_date DESC
LIMIT 5;

-- 5.2 Check distribution of cards by course
SELECT cn.course_name, COUNT(*) AS card_count
FROM player_cards pc
JOIN x_course_names cn ON pc.course_id = cn.course_id
GROUP BY cn.course_name
ORDER BY card_count DESC
LIMIT 10;

-- 5.3 Cards by tee type
SELECT tt.tee_color, tt.tee_name, COUNT(*) AS card_count
FROM player_cards pc
JOIN x_course_tee_types tt ON pc.tee_id = tt.tee_id
GROUP BY tt.tee_color, tt.tee_name
ORDER BY card_count DESC
LIMIT 10;

-- 6. Test handicap calculation view
-- 6.1 Compare a few records between original table and view
SELECT 
    pc.id, 
    pc.player_id,
    pc.play_date,
    pc.g_differential,
    hc.id AS view_id,
    hc.player_id AS view_player_id,
    hc.play_date AS view_play_date,
    hc.g_differential AS view_differential
FROM player_cards pc
LEFT JOIN handicap_calculations hc ON pc.id = hc.id
WHERE pc.tarj = 'OK'
LIMIT 5;

-- 6.2 Verify all expected view fields are populated
SELECT 
    id,
    player_id,
    play_date,
    course_id,
    g_differential,
    course_name,
    tee_name,
    course_rating,
    slope_rating,
    player_name
FROM handicap_calculations
LIMIT 5;

-- 7. Index utilization tests (execution plans)
EXPLAIN ANALYZE
SELECT * FROM player_cards WHERE player_id = 1;

EXPLAIN ANALYZE
SELECT * FROM player_cards WHERE play_date > '2023-01-01';

EXPLAIN ANALYZE
SELECT * FROM player_cards WHERE course_id = 1;

EXPLAIN ANALYZE
SELECT * FROM player_cards WHERE g_differential < 10;

EXPLAIN ANALYZE
SELECT * FROM player_cards WHERE tarj = 'OK';

EXPLAIN ANALYZE
SELECT * FROM player_cards WHERE verified = true;
