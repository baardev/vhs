#!/bin/bash
set -e

# Container and path variables
#DB_CONTAINER=${DB_CONTAINER:-vhs-postgres}
#ROOT_DIR=${ROOT_DIR:-$(git rev-parse --show-toplevel)}
SQL_FILE="${ROOT_DIR}/backend/db/sql/200_create_player_card_tables.sql"


# Copy CSV files to container
docker cp ${ROOT_DIR}/backend/db/csv/player_cards.csv $DB_CONTAINER:/tmp/player_cards.csv
echo "player_cards created successfully"

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
echo "│ ${ROOT_DIR}/backend/db/200_create_player_card_tables.sh..."
echo "└───────────────────────────────────────────────────────┘"

if docker exec -i $DB_CONTAINER psql -U admin -d vhsdb < "$SQL_FILE"; then

    echo "Todo table created successfully"
else
    echo "Error: Failed to create todo table"
    exit 1
fi

echo "┌───────────────────────────────────────────────────────┐"
echo "│ Updating player_cards table indexes...                │"
echo "└───────────────────────────────────────────────────────┘"

# Create SQL for index updates
cat << EOF > /tmp/update_player_card_indexes.sql
-- Drop existing indexes first to avoid conflicts
DROP INDEX IF EXISTS idx_player_cards_player_id;
DROP INDEX IF EXISTS idx_player_cards_play_date;
DROP INDEX IF EXISTS idx_player_cards_course_id;
DROP INDEX IF EXISTS idx_player_cards_differential;
DROP INDEX IF EXISTS idx_player_cards_tarj;
DROP INDEX IF EXISTS idx_player_cards_verified;

-- Recreate optimized indexes
CREATE INDEX idx_player_cards_player_id ON player_cards(player_id);
CREATE INDEX idx_player_cards_play_date ON player_cards(play_date DESC);
CREATE INDEX idx_player_cards_course_id ON player_cards(course_id);
CREATE INDEX idx_player_cards_g_differential ON player_cards(g_differential);
CREATE INDEX idx_player_cards_tarj ON player_cards(tarj);
CREATE INDEX idx_player_cards_verified ON player_cards(verified);

-- Add combined indexes for common queries
CREATE INDEX idx_player_cards_player_date ON player_cards(player_id, play_date DESC);
CREATE INDEX idx_player_cards_verified_tarj ON player_cards(verified, tarj);
CREATE INDEX idx_player_cards_handicap_calc ON player_cards(player_id, verified, tarj, play_date DESC);

-- Add indexes for hole scores (useful for statistical queries)
CREATE INDEX idx_player_cards_holes_front ON player_cards(h01, h02, h03, h04, h05, h06, h07, h08, h09);
CREATE INDEX idx_player_cards_holes_back ON player_cards(h10, h11, h12, h13, h14, h15, h16, h17, h18);

-- Add index for tee_id for better joining
CREATE INDEX idx_player_cards_tee_id ON player_cards(tee_id);
EOF

# Execute SQL file
if docker exec -i $DB_CONTAINER psql -U admin -d vhsdb < /tmp/update_player_card_indexes.sql; then
    echo "Player cards indexes updated successfully"
else
    echo "Error: Failed to update player cards indexes"
    exit 1
fi

# Remove temporary SQL file
rm /tmp/update_player_card_indexes.sql