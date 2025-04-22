#!/bin/bash

docker exec -i $db_container psql -U admin -d vhsdb < ~/sites/vhs/backend/sql/hc_calc_tables.sql



db_container=$(docker ps --format "{{.Names}}" | grep db)
docker cp ~/sites/vhs/backend/data/course_names.csv $db_container:/tmp/course_names.csv
docker cp ~/sites/vhs/backend/data/course_data.csv $db_container:/tmp/course_data.csv
docker cp ~/sites/vhs/backend/data/player_cards.csv $db_container:/tmp/player_cards.csv

\copy course_names  FROM '/tmp/course_names.csv'  CSV HEADER;
\copy course_data   FROM '/tmp/course_data.csv'   CSV HEADER;
\copy player_cards  FROM '/tmp/player_cards.csv'  CSV HEADER;