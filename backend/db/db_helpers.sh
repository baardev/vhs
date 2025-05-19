#!/bin/bash
# db_helpers.sh - Helper functions for database operations
# Source this file in your scripts that need to interact with PostgreSQL

# This helper script ensures all psql commands use the correct port (from environment)
# and provides consistent command execution patterns

# Execute a PostgreSQL command in the database container
# Usage: db_exec <database> <command>
db_exec() {
    local db=$1
    local cmd=$2
    docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$db" -p "${DB_PORT}" -c "$cmd"
}

# Execute a PostgreSQL script file in the database container
# Usage: db_exec_file <database> <sql_file>
db_exec_file() {
    local db=$1
    local file=$2
    docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$db" -p "${DB_PORT}" < "$file"
}

# Execute a PostgreSQL command with table-only output (no headers, aligned)
# Usage: db_exec_table <database> <command>
db_exec_table() {
    local db=$1
    local cmd=$2
    docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$db" -p "${DB_PORT}" -tA -c "$cmd"
}

# Check if a table exists in the database
# Usage: if db_table_exists <database> <table>; then echo "Table exists"; fi
db_table_exists() {
    local db=$1
    local table=$2
    docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$db" -p "${DB_PORT}" -tAc \
        "SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='$table')" | grep -q t
}

echo "PostgreSQL helper functions loaded (using port ${DB_PORT})" 