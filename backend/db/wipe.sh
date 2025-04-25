#!/bin/bash

# Set consistent variable name (uppercase)
DB_CONTAINER=${DB_CONTAINER:-vhs-postgres}

# Check if container is running
if ! docker ps | grep -q $DB_CONTAINER; then
    echo "Error: Database container '$DB_CONTAINER' is not running."
    echo "Start the container before running this script."
    exit 1
fi

# Prompt for confirmation
# read -p "WARNING: This will permanently delete the vhsdb database. Continue? (y/N): " confirm
# if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
#     echo "Database wipe cancelled."
#     exit 0
# fi

echo "Dropping database (if exists)..."
if ! docker exec -i $DB_CONTAINER psql -U admin -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'vhsdb' AND pid <> pg_backend_pid();" -c "DROP DATABASE IF EXISTS vhsdb;"; then
    echo "Error: Failed to drop database."
    exit 1
fi

echo "Creating fresh database..."
if ! docker exec -i $DB_CONTAINER psql -U admin -d postgres -c 'CREATE DATABASE vhsdb OWNER admin;'; then
    echo "Error: Failed to create database."
    exit 1
fi

echo "Database reset completed successfully."