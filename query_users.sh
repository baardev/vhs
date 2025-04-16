#!/bin/bash

# Set default query to list all users
QUERY="SELECT id, username, email, created_at FROM users;"

# Process command line arguments
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
  echo "Usage: ./query_users.sh [OPTION]"
  echo ""
  echo "Options:"
  echo "  --all        Show all user details"
  echo "  --count      Count total number of users"
  echo "  --recent     Show users sorted by creation date (newest first)"
  echo "  --username=X Find user with username X"
  echo "  --email=X    Find user with email X"
  echo "  --sql=\"SQL\"  Run custom SQL query"
  echo "  --help       Display this help and exit"
  exit 0
fi

if [ "$1" == "--all" ]; then
  QUERY="SELECT * FROM users;"
elif [ "$1" == "--count" ]; then
  QUERY="SELECT COUNT(*) AS total_users FROM users;"
elif [ "$1" == "--recent" ]; then
  QUERY="SELECT id, username, email, created_at FROM users ORDER BY created_at DESC;"
elif [[ "$1" == --username=* ]]; then
  USERNAME="${1#*=}"
  QUERY="SELECT * FROM users WHERE username = '$USERNAME';"
elif [[ "$1" == --email=* ]]; then
  EMAIL="${1#*=}"
  QUERY="SELECT * FROM users WHERE email = '$EMAIL';"
elif [[ "$1" == --sql=* ]]; then
  SQL="${1#*=}"
  QUERY="$SQL"
fi

# Run the query
docker exec vhs-db-1 psql -U user -d vhsdb -c "$QUERY"