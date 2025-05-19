#!/bin/bash
source ${HOME}/sites/vhs/.env

# Create the basic users table
/usr/bin/docker exec -i $DB_CONTAINER psql -U admin -d ${DB_NAME} -p "${DB_PORT}" < ${ROOT_DIR}/backend/db/sql/010_create_users_table.sql
