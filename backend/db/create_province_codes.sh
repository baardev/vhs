
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
echo "│ ${ROOT_DIR}/backend/db/create_province_codes.sh..."
echo "└───────────────────────────────────────────────────────┘"


docker cp ${ROOT_DIR}/backend/db/csv/province_codes.csv $DB_CONTAINER:/tmp/province_codes.csv
docker exec -i $DB_CONTAINER psql -U admin -d vhsdb < ${ROOT_DIR}/backend/db/sql/create_province_codes.sql   