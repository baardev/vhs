#!/bin/bash
set -e

source ${HOME}/sites/vhs/.env
# Container and path variables
#DB_CONTAINER=${DB_CONTAINER:-vhs-postgres}
#ROOT_DIR=${ROOT_DIR:-$(git rev-parse --show-toplevel)}
SQL_FILE="${ROOT_DIR}/backend/db/sql/test_200.sql"

# Check if container is running
if ! docker ps | grep -q $DB_CONTAINER; then
    echo "Error: Database container '$DB_CONTAINER' is not running"
    exit 1
fi


echo "┌───────────────────────────────────────────────────────┐"
echo "│ ${ROOT_DIR}/backend/db/test_200.sh..."
echo "└───────────────────────────────────────────────────────┘"

docker exec -i $DB_CONTAINER psql -U admin -d vhsdb < "$SQL_FILE"
