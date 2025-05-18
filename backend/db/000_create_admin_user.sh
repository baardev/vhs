#!/bin/bash
source ${HOME}/sites/vhs/.env

# Run the SQL script
/usr/bin/docker exec -i $DB_CONTAINER psql -U admin -d ${DB_NAME} -p ${PGPORT} < ${ROOT_DIR}/backend/db/sql/010_create_users_table.sql
