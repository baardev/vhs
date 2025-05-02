CREATE OR REPLACE VIEW data_by_tee AS

SELECT
	x_course_data_by_tee.course_rating_front, 
	x_course_data_by_tee.course_rating_back, 
	x_course_data_by_tee.course_rating, 
	x_course_data_by_tee.bogey_rating_front, 
	x_course_data_by_tee.bogey_rating_back, 
	x_course_data_by_tee.bogey_rating, 
	x_course_data_by_tee.slope_front, 
	x_course_data_by_tee.slope_back, 
	x_course_data_by_tee.slope_rating, 
	x_course_data_by_tee."length" AS yardage, 
	x_course_data_by_tee.par, 
	x_course_tee_types.tee_name, 
	x_course_names.course_name, 
	x_course_data_by_tee.course_id as course_id
FROM
	x_course_tee_types
	INNER JOIN
	x_course_data_by_tee
	ON 
		x_course_tee_types.course_id = x_course_data_by_tee.course_id AND
		x_course_tee_types.tee_id = x_course_data_by_tee.tee_id
	INNER JOIN
	x_course_names
	ON 
		x_course_tee_types.course_id = x_course_names.course_id