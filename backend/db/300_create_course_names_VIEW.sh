#!/bin/bash
set -e

source ${HOME}/sites/vhs/.env
SQL_FILE="${ROOT_DIR}/backend/db/sql/300_create_course_names_VIEW.sql"


# Copy CSV files to container
docker cp ${ROOT_DIR}/backend/db/sql/300_create_course_names_VIEW.sql $DB_CONTAINER:/tmp/300_create_course_names_VIEW.sql
echo "300_create_course_names_VIEW created successfully"

# Check if SQL file exists
if [ ! -f "$SQL_FILE" ]; then
    echo "Error: SQL file not found at $SQL_FILE"
    exit 1
fi


# Check if container is running
if ! docker ps | grep -q $DB_CONTAINER; then
    echo "Error: Database container '$DB_CONTAINER' is not running"
    exit 1
fi


echo "┌───────────────────────────────────────────────────────┐"
echo "│ ${ROOT_DIR}/backend/db/300_create_course_names_VIEW.sh..."
echo "└───────────────────────────────────────────────────────┘"

if docker exec -i $DB_CONTAINER psql -U admin -d "$DB_NAME" -p "${DB_PORT}" < "$SQL_FILE"; then

    echo "Course names view created successfully"
else
    echo "Error: Failed to create course names view"
    exit 1
fi