-- Test script for course database relationships

-- 1. Check if tables exist and have data
SELECT COUNT(*) AS course_names_count FROM x_course_names;
SELECT COUNT(*) AS course_data_count FROM x_course_data;
SELECT COUNT(*) AS course_data_by_tee_count FROM x_course_data_by_tee;
SELECT COUNT(*) AS course_tee_types_count FROM x_course_tee_types;
SELECT COUNT(*) AS course_holes_count FROM x_course_holes;

-- 2. Join operations to test relationships
-- Course names and tee types
SELECT cn.course_name, COUNT(tt.tee_id) AS tee_count
FROM x_course_names cn
LEFT JOIN x_course_tee_types tt ON cn.course_id = tt.course_id
GROUP BY cn.course_name
ORDER BY tee_count DESC
LIMIT 10;

-- Courses with their holes
SELECT cn.course_name, COUNT(ch.hole_number) AS hole_count
FROM x_course_names cn
LEFT JOIN x_course_holes ch ON cn.course_id = ch.course_id
GROUP BY cn.course_name
ORDER BY hole_count DESC
LIMIT 10;

-- Tee types with their course data
SELECT tt.tee_color, tt.tee_name, cd.par, cd.course_rating, cd.slope_rating
FROM x_course_tee_types tt
JOIN x_course_data_by_tee cd ON tt.tee_id = cd.tee_id
LIMIT 10;

-- 3. Advanced relationship testing
-- Courses with complete data (names, tees, holes)
SELECT cn.course_name, 
       COUNT(DISTINCT tt.tee_id) AS tee_count,
       COUNT(DISTINCT ch.hole_number) AS hole_count
FROM x_course_names cn
LEFT JOIN x_course_tee_types tt ON cn.course_id = tt.course_id
LEFT JOIN x_course_holes ch ON cn.course_id = ch.course_id
GROUP BY cn.course_name
HAVING COUNT(DISTINCT ch.hole_number) = 18
ORDER BY tee_count DESC
LIMIT 10;

-- 4. Finding inconsistencies
-- Courses without tee types
SELECT cn.course_id, cn.course_name
FROM x_course_names cn
LEFT JOIN x_course_tee_types tt ON cn.course_id = tt.course_id
WHERE tt.tee_id IS NULL
LIMIT 10;

-- Tee types without course data
SELECT tt.tee_id, tt.tee_color, tt.tee_name, cn.course_name
FROM x_course_tee_types tt
JOIN x_course_names cn ON tt.course_id = cn.course_id
LEFT JOIN x_course_data_by_tee cd ON tt.tee_id = cd.tee_id
WHERE cd.tee_id IS NULL
LIMIT 10;

-- 5. Specific data integrity tests
-- Check if all holes have valid par values
SELECT course_id, hole_number, par
FROM x_course_holes
WHERE par NOT BETWEEN 3 AND 5
LIMIT 10;

-- Check if all tee data has valid slope and course ratings
SELECT tee_id, slope_rating, course_rating
FROM x_course_data_by_tee
WHERE slope_rating NOT BETWEEN 55 AND 155
   OR course_rating NOT BETWEEN 60 AND 80
LIMIT 10;

-- 6. Compare data between related tables
-- Compare course data between x_course_data and x_course_data_by_tee
SELECT cd.tee_id, cd.par AS data_par, cdt.par AS by_tee_par, 
       cd.slope_rating AS data_slope, cdt.slope_rating AS by_tee_slope
FROM x_course_data cd
JOIN x_course_data_by_tee cdt ON cd.tee_id = cdt.tee_id
WHERE cd.par != cdt.par OR cd.slope_rating != cdt.slope_rating
LIMIT 10;

-- 7. Additional relationship tests
-- Hole distribution across courses (check for missing holes)
SELECT cn.course_id, cn.course_name, 
       string_agg(CAST(ch.hole_number AS TEXT), ',' ORDER BY ch.hole_number) AS holes_present,
       COUNT(ch.hole_number) AS total_holes
FROM x_course_names cn
LEFT JOIN x_course_holes ch ON cn.course_id = ch.course_id
GROUP BY cn.course_id, cn.course_name
HAVING COUNT(ch.hole_number) < 18
ORDER BY total_holes
LIMIT 10;

-- 8. Check tee type variations per course
SELECT cn.course_name, 
       string_agg(DISTINCT tt.tee_color, ', ') AS tee_colors,
       COUNT(DISTINCT tt.tee_color) AS color_count
FROM x_course_names cn
JOIN x_course_tee_types tt ON cn.course_id = tt.course_id
GROUP BY cn.course_name
ORDER BY color_count DESC
LIMIT 10;

-- 9. Cross-check between tee_types and course_data_by_tee
SELECT tt.course_id, cn.course_name, tt.tee_id, tt.tee_color, tt.tee_name,
       CASE WHEN cdt.tee_id IS NULL THEN 'Missing' ELSE 'Present' END AS data_status
FROM x_course_tee_types tt
JOIN x_course_names cn ON tt.course_id = cn.course_id
LEFT JOIN x_course_data_by_tee cdt ON tt.tee_id = cdt.tee_id
ORDER BY data_status, cn.course_name
LIMIT 10;

-- 10. Test for stroke index consistency
SELECT course_id, 
       COUNT(DISTINCT men_stroke_index) AS distinct_men_indexes,
       COUNT(DISTINCT women_stroke_index) AS distinct_women_indexes
FROM x_course_holes
GROUP BY course_id
HAVING COUNT(DISTINCT men_stroke_index) != 18 OR COUNT(DISTINCT women_stroke_index) != 18
LIMIT 10;

-- 11. Check foreign key integrity
-- This will list any course_id in tee_types that doesn't exist in course_names
SELECT tt.course_id, tt.tee_id
FROM x_course_tee_types tt
LEFT JOIN x_course_names cn ON tt.course_id = cn.course_id
WHERE cn.course_id IS NULL
LIMIT 10;

-- 12. Check for duplicate hole numbers within a course
SELECT course_id, hole_number, COUNT(*) AS occurrences
FROM x_course_holes
GROUP BY course_id, hole_number
HAVING COUNT(*) > 1
LIMIT 10;