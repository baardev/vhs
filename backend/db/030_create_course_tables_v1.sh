#!/bin/bash
set -e

# Set database connection parameters
# DB_CONTAINER=${DB_CONTAINER:-vhs-postgres}
# DB_USER=${DB_USER:-admin}
# DB_NAME=${DB_NAME:-vhsdb}
SQL_FILE="${ROOT_DIR}/backend/db/sql/030_create_course_tables_v1.sql"

echo "Creating course tables..."

# Copy CSV files to container
docker cp ${ROOT_DIR}/backend/db/csv/courses_v1.csv $DB_CONTAINER:/tmp/courses_v1.csv
echo "Course tables created successfully"

docker cp ${ROOT_DIR}/backend/db/csv/tee_boxes_v1.csv $DB_CONTAINER:/tmp/tee_boxes_v1.csv
echo "tee_boxes tables created successfully"

docker cp ${ROOT_DIR}/backend/db/csv/course_holes_v1.csv $DB_CONTAINER:/tmp/course_holes_v1.csv
echo "course_holes tables created successfully"
# Execute SQL file by streaming it into the container instead of using -f
cat "$SQL_FILE" | docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME"


