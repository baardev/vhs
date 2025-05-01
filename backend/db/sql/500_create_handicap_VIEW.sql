CREATE OR REPLACE VIEW handicap_calculator AS
WITH hole_scores AS (
    SELECT 
        player_id,
        id AS card_id,
        course_id,
        play_date,
        tee_id,
        ARRAY[h01, h02, h03, h04, h05, h06, h07, h08, h09, 
              h10, h11, h12, h13, h14, h15, h16, h17, h18] AS hole_scores,
        gross,
        net,
        g_differential
    FROM 
        player_cards
    WHERE 
        verified = true
        AND tarj = 'OK'
)
SELECT 
    pc.id AS card_id,
    pc.player_id,
    u.username AS player_name,
    pc.play_date,
    pc.course_id,
    cn.course_name,
    pc.tee_id,
    tt.tee_color,
    tt.tee_name,
    
    -- Course difficulty metrics
    cdt.par,
    cdt.course_rating,
    cdt.slope_rating,
    cdt.length,
    
    -- Front/back nine details
    cdt.course_rating_front,
    cdt.course_rating_back,
    cdt.slope_front,
    cdt.slope_back,
    
    -- Score data
    pc.gross,
    pc.net,
    pc.g_differential,
    
    -- Individual hole scores and pars
    pc.h01, pc.h02, pc.h03, pc.h04, pc.h05, pc.h06, pc.h07, pc.h08, pc.h09,
    pc.h10, pc.h11, pc.h12, pc.h13, pc.h14, pc.h15, pc.h16, pc.h17, pc.h18,
    
    -- Hole data (stroke indexes)
    (SELECT json_object_agg(
        'hole_' || hole_number, 
        json_build_object(
            'par', par,
            'men_si', men_stroke_index,
            'women_si', women_stroke_index
        )
    ) FROM x_course_holes ch WHERE ch.course_id = pc.course_id) AS hole_data,
    
    -- Calculate differential if not already present
    CASE
        WHEN pc.g_differential IS NULL THEN 
            (pc.gross - cdt.course_rating) * 113 / NULLIF(cdt.slope_rating, 0)
        ELSE pc.g_differential
    END AS calculated_differential,
    
    -- Flag recent rounds for handicap calculation (last 20 rounds)
    ROW_NUMBER() OVER (PARTITION BY pc.player_id ORDER BY pc.play_date DESC) AS recency_rank
FROM 
    player_cards pc
JOIN 
    users u ON pc.player_id = u.id
JOIN 
    x_course_names cn ON pc.course_id = cn.course_id
JOIN 
    x_course_tee_types tt ON pc.tee_id = tt.tee_id
JOIN 
    x_course_data_by_tee cdt ON pc.tee_id = cdt.tee_id
WHERE 
    pc.verified = true
    AND pc.tarj = 'OK'
ORDER BY 
    pc.player_id, pc.play_date DESC;

-- Helper view to calculate current handicap indexes
CREATE OR REPLACE VIEW current_handicap_indexes AS
WITH recent_differentials AS (
    SELECT 
        player_id,
        player_name,
        card_id,
        play_date,
        calculated_differential,
        recency_rank
    FROM 
        handicap_calculator
    WHERE 
        recency_rank <= 20  -- Only consider last 20 rounds
    ORDER BY 
        calculated_differential  -- For determining best differentials
),
handicap_calculation AS (
    SELECT 
        player_id,
        player_name,
        -- Calculate how many differentials to use based on number of rounds
        CASE
            WHEN COUNT(*) >= 20 THEN 8
            WHEN COUNT(*) = 19 THEN 8
            WHEN COUNT(*) = 18 THEN 8
            WHEN COUNT(*) = 17 THEN 8
            WHEN COUNT(*) = 16 THEN 8
            WHEN COUNT(*) = 15 THEN 6
            WHEN COUNT(*) = 14 THEN 6
            WHEN COUNT(*) = 13 THEN 5
            WHEN COUNT(*) = 12 THEN 5
            WHEN COUNT(*) = 11 THEN 4
            WHEN COUNT(*) = 10 THEN 4
            WHEN COUNT(*) = 9 THEN 4
            WHEN COUNT(*) = 8 THEN 3
            WHEN COUNT(*) = 7 THEN 3
            WHEN COUNT(*) = 6 THEN 2
            WHEN COUNT(*) = 5 THEN 1
            WHEN COUNT(*) <= 4 THEN 0
        END AS differentials_to_use,
        COUNT(*) AS total_rounds
    FROM 
        recent_differentials
    GROUP BY 
        player_id, player_name
)
SELECT 
    hc.player_id,
    hc.player_name,
    hc.total_rounds,
    hc.differentials_to_use,
    CASE 
        WHEN hc.differentials_to_use > 0 THEN
            (SELECT ROUND(AVG(calculated_differential) * 0.96, 1)
             FROM (
                 SELECT calculated_differential
                 FROM recent_differentials rd
                 WHERE rd.player_id = hc.player_id
                 ORDER BY calculated_differential
                 LIMIT hc.differentials_to_use
             ) AS best_differentials)
        ELSE NULL
    END AS handicap_index,
    MAX(rd.play_date) AS last_play_date
FROM 
    handicap_calculation hc
LEFT JOIN 
    recent_differentials rd ON hc.player_id = rd.player_id AND rd.recency_rank = 1
GROUP BY 
    hc.player_id, hc.player_name, hc.total_rounds, hc.differentials_to_use;