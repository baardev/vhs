#!/bin/bash
source ${HOME}/sites/vhs/.env

# Run the SQL script
/usr/bin/docker exec -i $DB_CONTAINER psql -U admin -d vhsdb < ${ROOT_DIR}/backend/db/sql/010_create_users_table.sql
