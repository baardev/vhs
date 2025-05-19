#!/bin/bash
set -e

source ${HOME}/sites/vhs/.env

# Container and path variables
# DB_CONTAINER=${DB_CONTAINER:-dev-vhs-db
DB_USER=${DB_USER:-admin}
DB_NAME=${DB_NAME:-vhsdb}
SQL_FILE="${ROOT_DIR}/backend/db/sql/010_create_users_table.sql"

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

echo "Creating user tables..."

# Pass the password as a psql variable
cat "$SQL_FILE" | docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -p "${DB_PORT}" -v db_pass="'$DB_PASSWORD'"

echo "User tables created successfully"
