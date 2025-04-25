#!/bin/bash
set -e

# Container and path variables
#DB_CONTAINER=${DB_CONTAINER:-vhs-postgres}
#ROOT_DIR=${ROOT_DIR:-$(git rev-parse --show-toplevel)}
SQL_FILE="${ROOT_DIR}/backend/db/sql/140_create_todo_table.sql"

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


echo "Creating todo table..."
if docker exec -i $DB_CONTAINER psql -U admin -d vhsdb < "$SQL_FILE"; then
    echo "Todo table created successfully"
else
    echo "Error: Failed to create todo table"
    exit 1
fi