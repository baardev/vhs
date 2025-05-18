#!/bin/bash
set -e

source ${HOME}/sites/vhs/.env
# Container and path variables
#DB_CONTAINER=${DB_CONTAINER:-vhs-postgres}
#ROOT_DIR=${ROOT_DIR:-$(git rev-parse --show-toplevel)}
SQL_FILE="${ROOT_DIR}/backend/db/sql/200_create_player_cards_table.sql"


# Copy CSV files to container
docker cp ${ROOT_DIR}/backend/db/csv/200_player_cards.csv $DB_CONTAINER:/tmp/200_player_cards.csv
echo "200_player_cards created successfully"

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
echo "│ ${ROOT_DIR}/backend/db/200_create_player_cards_tables.sh..."
echo "└───────────────────────────────────────────────────────┘"

if docker exec -i $DB_CONTAINER psql -U admin -d "$DB_NAME" -p ${PGPORT} < "$SQL_FILE"; then

    echo "Player_cards table created successfully"
else
    echo "Error: Failed to create player_cards table"
    exit 1
fi

echo "┌───────────────────────────────────────────────────────┐"
echo "│ Updating player_cards table indexes...                │"
echo "└───────────────────────────────────────────────────────┘"

