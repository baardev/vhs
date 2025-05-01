CREATE OR REPLACE VIEW course_holes AS

SELECT
	x_course_holes.course_id, 
	x_course_holes.hole_number, 
	x_course_holes.par, 
	x_course_holes.men_stroke_index, 
	x_course_holes.women_stroke_index
FROM
	x_course_holes