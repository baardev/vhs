#!/bin/bash
set -e

source ${HOME}/sites/vhs/.env
# # Set database connection parameters
# DB_CONTAINER=${DB_CONTAINER:-vhs-postgres}
# DB_USER=${DB_USER:-admin}
# DB_NAME=${DB_NAME:-vhsdb}
# DB_PASSWORD=${DB_PASSWORD:-"bcrypt_hashed_password_here"}

docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -p ${PGPORT} -tAc "CREATE EXTENSION IF NOT EXISTS pgcrypto;" 

function add_user_pw() {
    if [ -z "$1" ]; then
        echo "❌ Error: Username parameter is required"
        return 1
    fi
    
    # echo "Setting password for user '$1'..."
    
    if docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -p ${PGPORT} -tAc \
        "UPDATE users SET password = crypt('$DB_PASSWORD', gen_salt('bf')) WHERE username = '$1' RETURNING id" | grep -q "^[0-9]"; then
        echo "✅ User '$1' password updated successfully"
    else
        echo "❌ Failed to update password for user '$1'"
        return 1
    fi
}

# Update passwords for users
add_user_pw "victoria"
add_user_pw "adminuser"
add_user_pw "jwx"
