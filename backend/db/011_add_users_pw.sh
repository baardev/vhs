#!/bin/bash
set -e

source ${HOME}/sites/vhs/.env
# # Set database connection parameters
# DB_CONTAINER=${DB_CONTAINER:-vhs-postgres}
# DB_USER=${DB_USER:-admin}
# DB_NAME=${DB_NAME:-vhsdb}
# DB_PASSWORD=${DB_PASSWORD:-"bcrypt_hashed_password_here"}

docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -p "${DB_PORT}" -tAc "CREATE EXTENSION IF NOT EXISTS pgcrypto;" 

function add_user_pw() {
    if [ -z "$1" ]; then
        echo "❌ Error: Username parameter is required"
        return 1
    fi
    
    # echo "Setting password for user '$1'..."
    
    if docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -p "${DB_PORT}" -tAc \
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

# Add encrypted password to users who don't have one

# Setup variables
DB_USER=${DB_USER:-admin}
DB_NAME=${DB_NAME:-vhsdb}

# Enable pgcrypto extension (needed for password encryption)
docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -p "${DB_PORT}" -tAc "CREATE EXTENSION IF NOT EXISTS pgcrypto;"

# Default password for testing (this would be different in production)
DEFAULT_PASSWORD="${DB_PASSWORD:-admin123}"

# Count how many users need password updates
echo "Checking for users without passwords..."
if docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -p "${DB_PORT}" -tAc \
    "SELECT COUNT(*) FROM users WHERE password IS NULL OR password = '';" | grep -q "^0$"; then
    echo "All users already have passwords. No updates needed."
    exit 0
fi

# Update all users without passwords
echo "Adding encrypted passwords to users that don't have one..."
update_query="UPDATE users SET password = crypt('$DEFAULT_PASSWORD', gen_salt('bf')) WHERE password IS NULL OR password = '';"
docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -p "${DB_PORT}" -c "$update_query"

# Verify the update
user_count=$(docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -p "${DB_PORT}" -tAc \
    "SELECT COUNT(*) FROM users WHERE password IS NULL OR password = '';")

if [ "$user_count" -eq 0 ]; then
    echo "Successfully updated passwords for all users!"
else
    echo "Warning: $user_count users still don't have passwords."
    exit 1
fi
