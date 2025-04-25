#!/bin/bash



db_container=$(docker ps --format "{{.Names}}" | grep db)

docker cp ${ROOT_DIR}/backend/sql/csv/course_names.csv $db_container:/tmp/course_names.csv
docker cp ${ROOT_DIR}/backend/sql/csv/course_data.csv $db_container:/tmp/course_data.csv
docker cp ${ROOT_DIR}/backend/sql/csv/player_cards.csv $db_container:/tmp/player_cards.csv

docker exec -i $db_container psql -U admin -d vhsdb < ${ROOT_DIR}/backend/sql/hc_calc_tables.sql
