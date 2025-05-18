#!/bin/bash

# Make sure PostgreSQL is running
echo "Making sure PostgreSQL is running..."
sudo systemctl start postgresql.service

# Create the admin user and database
echo "Creating admin user and database..."
sudo -u postgres psql <<EOF
DROP DATABASE IF EXISTS vhsdb;
DROP USER IF EXISTS admin;
CREATE USER admin WITH PASSWORD 'adminpassword' SUPERUSER CREATEDB CREATEROLE;
CREATE DATABASE vhsdb OWNER admin;
GRANT ALL PRIVILEGES ON DATABASE vhsdb TO admin;
\q
EOF

# Connect to the new database and create schema
echo "Setting up database tables..."
PGPASSWORD=adminpassword psql -h localhost -p 6541 -U admin -d postgres -c "SELECT 1 FROM pg_database WHERE datname = 'vhsdb'" | grep -q 1 || PGPASSWORD=adminpassword psql -h localhost -p 6541 -U admin -d postgres -c "CREATE DATABASE vhsdb OWNER admin"

# Run the SQL setup script
echo "Creating tables in vhsdb database..."
PGPASSWORD=adminpassword psql -h localhost -p 6541 -U admin -d vhsdb -f sql/setup_database.sql

echo "Database setup complete!"