-- Golf Course Tables

-- Create the courses table
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(2) NOT NULL,
    city_province VARCHAR(100) NOT NULL,
    website VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    is_verified BOOLEAN DEFAULT FALSE
);

-- Create index for courses
CREATE INDEX IF NOT EXISTS idx_courses_name ON courses(name);
CREATE INDEX IF NOT EXISTS idx_courses_country ON courses(country);
CREATE INDEX IF NOT EXISTS idx_courses_website ON courses(website);

-- Create the tee_boxes table
CREATE TABLE IF NOT EXISTS tee_boxes (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- e.g., Blue, Championship, etc.
    gender VARCHAR(10) NOT NULL, -- 'male', 'female', 'other'
    course_rating DECIMAL(4,1) NOT NULL, -- e.g., 72.4
    slope_rating INTEGER NOT NULL, -- e.g., 132
    yardage INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for tee_boxes
CREATE INDEX IF NOT EXISTS idx_tee_boxes_course_id ON tee_boxes(course_id);

-- Create the course_holes table to store hole-by-hole information
CREATE TABLE IF NOT EXISTS course_holes (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    hole_number INTEGER NOT NULL CHECK (hole_number BETWEEN 1 AND 18),
    par INTEGER NOT NULL CHECK (par BETWEEN 3 AND 6),
    stroke_index INTEGER NOT NULL CHECK (stroke_index BETWEEN 1 AND 18),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, hole_number)
);

-- Create index for course_holes
CREATE INDEX IF NOT EXISTS idx_course_holes_course_id ON course_holes(course_id);

-- Create table for course uploads/attachments
CREATE TABLE IF NOT EXISTS course_attachments (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    attachment_type VARCHAR(50) NOT NULL, -- 'scorecard', 'rating_certificate', 'course_info'
    file_path VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    uploaded_by INTEGER REFERENCES users(id)
);

-- Create index for course_attachments
CREATE INDEX IF NOT EXISTS idx_course_attachments_course_id ON course_attachments(course_id);

-- Insert sample golf course data
INSERT INTO courses (name, country, city_province, website) VALUES
('Augusta National Golf Club', 'US', 'Augusta, Georgia', 'https://www.augustanational.com'),
('St Andrews Links (Old Course)', 'GB', 'St Andrews, Fife', 'https://www.standrews.com'),
('Club de Golf Los Cedros', 'MX', 'Monterrey, Nuevo León', 'https://www.loscedros.mx');

-- Insert sample tee boxes for Augusta National
INSERT INTO tee_boxes (course_id, name, gender, course_rating, slope_rating, yardage) VALUES
(1, 'Championship', 'male', 78.1, 137, 7475),
(1, 'Tournament', 'male', 76.2, 132, 7270),
(1, 'Member', 'male', 73.5, 128, 6835),
(1, 'Ladies', 'female', 76.2, 135, 6365);

-- Insert sample tee boxes for St Andrews
INSERT INTO tee_boxes (course_id, name, gender, course_rating, slope_rating, yardage) VALUES
(2, 'Championship', 'male', 73.1, 132, 7305),
(2, 'White', 'male', 72.3, 127, 6721),
(2, 'Green', 'other', 70.8, 125, 6416),
(2, 'Red', 'female', 74.2, 129, 6095);

-- Insert sample tee boxes for Los Cedros
INSERT INTO tee_boxes (course_id, name, gender, course_rating, slope_rating, yardage) VALUES
(3, 'Azul', 'male', 72.8, 133, 7105),
(3, 'Blanco', 'male', 71.4, 129, 6825),
(3, 'Amarillo', 'other', 69.5, 122, 6355),
(3, 'Rojo', 'female', 72.7, 130, 5901);

-- Insert holes for Augusta National
INSERT INTO course_holes (course_id, hole_number, par, stroke_index) VALUES
(1, 1, 4, 9), (1, 2, 5, 11), (1, 3, 4, 7), (1, 4, 3, 17), (1, 5, 4, 5),
(1, 6, 3, 15), (1, 7, 4, 3), (1, 8, 5, 13), (1, 9, 4, 1), (1, 10, 4, 2),
(1, 11, 4, 8), (1, 12, 3, 16), (1, 13, 5, 12), (1, 14, 4, 10), (1, 15, 5, 14),
(1, 16, 3, 18), (1, 17, 4, 6), (1, 18, 4, 4);

-- Insert holes for St Andrews
INSERT INTO course_holes (course_id, hole_number, par, stroke_index) VALUES
(2, 1, 4, 10), (2, 2, 4, 14), (2, 3, 4, 2), (2, 4, 4, 8), (2, 5, 5, 12),
(2, 6, 4, 4), (2, 7, 4, 6), (2, 8, 3, 16), (2, 9, 4, 18), (2, 10, 4, 9),
(2, 11, 3, 17), (2, 12, 4, 5), (2, 13, 4, 1), (2, 14, 5, 11), (2, 15, 4, 7),
(2, 16, 4, 15), (2, 17, 4, 3), (2, 18, 4, 13);

-- Insert holes for Los Cedros
INSERT INTO course_holes (course_id, hole_number, par, stroke_index) VALUES
(3, 1, 4, 9), (3, 2, 4, 7), (3, 3, 4, 15), (3, 4, 4, 3), (3, 5, 4, 13),
(3, 6, 3, 17), (3, 7, 5, 5), (3, 8, 4, 11), (3, 9, 4, 1), (3, 10, 4, 2),
(3, 11, 4, 10), (3, 12, 4, 4), (3, 13, 3, 18), (3, 14, 5, 12), (3, 15, 4, 6),
(3, 16, 4, 14), (3, 17, 3, 16), (3, 18, 5, 8);