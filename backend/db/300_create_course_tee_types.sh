
#!/bin/bash
set -e

# Check if container is running
if ! docker ps | grep -q $DB_CONTAINER; then
    echo "Error: Database container '$DB_CONTAINER' is not running"
    exit 1
fi


# Copy CSV files to container
echo "┌───────────────────────────────────────────────────────┐"
echo "│ ${ROOT_DIR}/backend/db/300_create_course_tee_types.sh..."
echo "└───────────────────────────────────────────────────────┘"

docker cp ${ROOT_DIR}/backend/db/csv/300_course_tee_types.csv $DB_CONTAINER:/tmp/300_course_tee_types.csv
docker exec -i $DB_CONTAINER psql -U admin -d vhsdb < ${ROOT_DIR}/backend/db/sql/300_create_course_tee_types.sql

