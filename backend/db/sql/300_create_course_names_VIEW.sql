CREATE OR REPLACE VIEW course_names AS

 SELECT x_course_names.course_id,
    x_course_names.course_name AS name,
    x_course_names.address1,
    x_course_names.address2,
    x_course_names.city,
    x_course_names.telephone,
    x_course_names.website,
    x_course_names.email,
    country_codes.country_name AS country,
    province_codes.province_name AS province_state,
		x_course_names.created_at
   FROM x_course_names
     JOIN country_codes ON x_course_names.country_code::text = country_codes.alpha_2::text
     JOIN province_codes ON x_course_names.country_code::text = province_codes.country_code::text AND x_course_names.province::text = province_codes.iso_code::text