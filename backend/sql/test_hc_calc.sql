-- Step 1: Create a table with the player's 20 most recent valid rounds
DROP TABLE IF EXISTS x_recent_rounds;
DROP TABLE IF EXISTS x_best_differentials;
DROP TABLE IF EXISTS x_player_handicap;

commit;

CREATE TABLE x_recent_rounds AS
SELECT 
    player_id,
    play_date,
    differential
FROM player_cards
WHERE 
    player_id = 'vns'
    AND tarj = 'OK'
    AND differential IS NOT NULL
ORDER BY play_date DESC
LIMIT 20;

COMMIT;
select * from x_recent_rounds;

-- Step 2: Create a table with the best 8 differentials
CREATE TABLE x_best_differentials AS
SELECT 
    player_id,
    differential
FROM x_recent_rounds
ORDER BY differential ASC
LIMIT 8;

COMMIT;
select	* from 	x_best_differentials;


CREATE TABLE x_player_handicap AS
SELECT
    player_id,
    AVG(differential) AS avg_differential,
    COUNT(*) AS rounds_used,
    ROUND((AVG(differential) * 0.96)::numeric, 1) AS handicap_index
FROM x_best_differentials
GROUP BY player_id;

COMMIT;

select	* from 	x_player_handicap ;
