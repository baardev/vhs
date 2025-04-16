#!/bin/bash
docker exec vhs-db-1 psql -U user -d vhsdb -c "SELECT id, username, email, created_at FROM users;" > users_list.txt
echo "User list exported to users_list.txt"