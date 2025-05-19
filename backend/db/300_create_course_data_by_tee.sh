
#!/bin/bash
set -e

source ${HOME}/sites/vhs/.env
echo "DB_CONTAINER: $DB_CONTAINER"

# Check if container is running
if ! docker ps | grep -q $DB_CONTAINER; then
    echo "Error: Database container '$DB_CONTAINER' is not running"
    exit 1
fi


# Copy CSV files to container
echo "┌───────────────────────────────────────────────────────┐"
echo "│ ${ROOT_DIR}/backend/db/300_course_data_by_tee.sh..."
echo "└───────────────────────────────────────────────────────┘"


docker cp ${ROOT_DIR}/backend/db/csv/300_course_data_by_tee.csv $DB_CONTAINER:/tmp/300_course_data_by_tee.csv
docker exec -i $DB_CONTAINER psql -U admin -d "$DB_NAME" -p "${DB_PORT}" < ${ROOT_DIR}/backend/db/sql/300_create_course_data_by_tee.sql


