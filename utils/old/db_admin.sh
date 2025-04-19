#!/bin/bash

# Helper function to run SQL
run_sql() {
  docker exec vhs-db-1 psql -U user -d vhsdb -c "$1"
}

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}          VHS Database Administration          ${NC}"
echo -e "${BLUE}===============================================${NC}"

# Menu
while true; do
  echo ""
  echo "Choose an operation:"
  echo "1. List all users (basic info)"
  echo "2. List all users (detailed info)"
  echo "3. Find user by username"
  echo "4. Find user by email"
  echo "5. List users by creation date (newest first)"
  echo "6. Count total number of users"
  echo "7. Run custom SQL query"
  echo "0. Exit"
  echo ""

  read -p "Enter your choice: " choice

  case $choice in
    1)
      echo -e "${GREEN}Listing all users (basic info):${NC}"
      run_sql "SELECT id, username, email, created_at FROM users;"
      ;;
    2)
      echo -e "${GREEN}Listing all users (detailed info):${NC}"
      run_sql "SELECT * FROM users;"
      ;;
    3)
      read -p "Enter username to search: " search_username
      echo -e "${GREEN}Finding user with username '$search_username':${NC}"
      run_sql "SELECT * FROM users WHERE username = '$search_username';"
      ;;
    4)
      read -p "Enter email to search: " search_email
      echo -e "${GREEN}Finding user with email '$search_email':${NC}"
      run_sql "SELECT * FROM users WHERE email = '$search_email';"
      ;;
    5)
      echo -e "${GREEN}Listing users by creation date (newest first):${NC}"
      run_sql "SELECT id, username, email, created_at FROM users ORDER BY created_at DESC;"
      ;;
    6)
      echo -e "${GREEN}Counting total number of users:${NC}"
      run_sql "SELECT COUNT(*) AS total_users FROM users;"
      ;;
    7)
      echo "Enter your custom SQL query (careful!):"
      read -p "> " custom_query
      echo -e "${GREEN}Running custom query:${NC}"
      run_sql "$custom_query"
      ;;
    0)
      echo -e "${GREEN}Exiting...${NC}"
      exit 0
      ;;
    *)
      echo -e "${RED}Invalid option. Please try again.${NC}"
      ;;
  esac

  echo -e "${BLUE}===============================================${NC}"
done