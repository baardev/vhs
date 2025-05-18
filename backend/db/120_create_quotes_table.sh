#!/bin/bash
set -e

source ${HOME}/sites/vhs/.env
SQL_FILE="${ROOT_DIR}/backend/db/sql/120_create_quotes_table.sql"

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

echo "Creating quotes table..."

echo "┌───────────────────────────────────────────────────────┐"
echo "│ ${ROOT_DIR}/backend/db/120_create_quotes_table.sh..."
echo "└───────────────────────────────────────────────────────┘"

if docker exec -i $DB_CONTAINER psql -U admin -d "$DB_NAME" -p ${PGPORT} < "$SQL_FILE"; then
    echo "Quotes table created successfully"
else
    echo "Error: Failed to create quotes table"
    exit 1
fi

