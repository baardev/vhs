
#!/bin/bash
set -e

source ${HOME}/sites/vhs/.env
# Check if container is running
if ! docker ps | grep -q $DB_CONTAINER; then
    echo "Error: Database container '$DB_CONTAINER' is not running"
    exit 1
fi


# Copy CSV files to container
echo "┌───────────────────────────────────────────────────────┐"
echo "│ ${ROOT_DIR}/backend/db/300_create_course_data_updated.sh..."
echo "└───────────────────────────────────────────────────────┘"


docker cp ${ROOT_DIR}/backend/db/csv/300_course_data_updated.csv $DB_CONTAINER:/tmp/300_course_data_updated.csv
docker exec -i $DB_CONTAINER psql -U admin -d vhsdb < ${ROOT_DIR}/backend/db/sql/300_create_course_data.sql

