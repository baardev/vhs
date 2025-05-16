#!/bin/bash
set -e

source ${HOME}/sites/vhs/.env
# Container and path variables
#DB_CONTAINER=${DB_CONTAINER:-vhs-postgres}
#ROOT_DIR=${ROOT_DIR:-$(git rev-parse --show-toplevel)}
SQL_FILE="${ROOT_DIR}/backend/db/sql/500_create_handicap_VIEW.sql"


# Copy CSV files to container
docker cp ${ROOT_DIR}/backend/db/sql/500_create_handicap_VIEW.sql $DB_CONTAINER:/tmp/500_create_handicap_VIEW.sql
echo "500_create_handicap_VIEW created successfully"

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
echo "│ ${ROOT_DIR}/backend/db/500_create_handicap_VIEW.sh..."
echo "└───────────────────────────────────────────────────────┘"

if docker exec -i $DB_CONTAINER psql -U admin -d vhsdb < "$SQL_FILE"; then

    echo "Handicap views created successfully"
else
    echo "Error: Failed to create handicap views"
    exit 1
fi