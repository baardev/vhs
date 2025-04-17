#!/usr/bin/env python3
"""
VHS User Management Script

This script provides command-line functionality for managing users on the VHS website.
It supports adding new users and deleting existing ones with proper authentication.

Note for developers:
  The backend currently doesn't support unauthenticated user deletion or admin user deletion.
  To enable this feature, consider adding these endpoints to backend/src/routes/auth.ts:

  // Admin delete user endpoint
  router.delete('/user/:username', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      // Check if user is an admin
      const adminCheck = await pool.query('SELECT is_admin FROM users WHERE id = $1', [req.user?.id]);
      if (!adminCheck.rows[0] || !adminCheck.rows[0].is_admin) {
        res.status(403).json({ error: 'Unauthorized: Admin privileges required' });
        return;
      }

      // Delete the specified user
      const result = await pool.query('DELETE FROM users WHERE username = $1 RETURNING id', [req.params.username]);

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

Usage:
  - To add a new user:
    ./manage_users.py --add --username <username> --email <email> --password <password> [--url <url>]

  - To delete a user (requires admin credentials):
    ./manage_users.py --del --username <username> --admin-username <admin> --admin-password <password> [--url <url>]

  - To attempt deleting a user without authentication (may not be supported by server):
    ./manage_users.py --del --username <username> [--url <url>]

Options:
  --add                  Add a new user
  --del                  Delete an existing user
  --username             Username for the account to add or delete
  --email                Email address (required for adding users)
  --password             Password (required for adding users)
  --admin-username       Admin username for authentication (optional for deletion)
  --admin-password       Admin password for authentication (optional for deletion)
  --url                  Base URL of the website (default: https://localhost)
  --verify-ssl           Verify SSL certificates (default: False)

Examples:
  ./manage_users.py --add --username jdoe --email john@example.com --password securepass
  ./manage_users.py --del --username jdoe
  ./manage_users.py --del --username jdoe --admin-username admin --admin-password adminpass
"""
import requests
import json
import argparse
import sys

def register_user(base_url, username, email, password, verify_ssl=False):
    """
    Register a new user on the VHS website
    """
    register_url = f"{base_url}/api/auth/register"

    # Prepare the registration data
    register_data = {
        "username": username,
        "email": email,
        "password": password
    }

    # Set headers
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Python-Registration-Script/1.0"
    }

    print(f"Attempting to register user: {username} with email: {email}")
    print(f"Sending request to: {register_url}")

    try:
        # Disable SSL warnings if verify_ssl is False
        if not verify_ssl:
            import urllib3
            urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

        # Make the registration request
        response = requests.post(
            register_url,
            json=register_data,
            headers=headers,
            verify=verify_ssl
        )

        # Check the response
        if response.status_code == 201 or response.status_code == 200:
            print("\033[92m" + "Registration successful!" + "\033[0m")
            try:
                print(json.dumps(response.json(), indent=2))
            except:
                print(f"Response: {response.text}")
            return True
        else:
            print("\033[91m" + f"Registration failed with status code: {response.status_code}" + "\033[0m")
            try:
                print(json.dumps(response.json(), indent=2))
            except:
                print(f"Response: {response.text}")

            # Additional debugging for 400 errors
            if response.status_code == 400:
                print("\nCommon 400 error causes:")
                print("- Username already exists")
                print("- Email already registered")
                print("- Password doesn't meet requirements")
                print("- Missing required fields")
            return False

    except requests.exceptions.RequestException as e:
        print("\033[91m" + f"Exception during registration: {str(e)}" + "\033[0m")
        return False

def delete_user(base_url, username, token, verify_ssl=False):
    """
    Delete a user from the VHS website
    """
    delete_url = f"{base_url}/api/auth/user/{username}"

    # Set headers with auth token
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Python-User-Management-Script/1.0",
        "Authorization": f"Bearer {token}"
    }

    print(f"Attempting to delete user: {username}")
    print(f"Sending request to: {delete_url}")

    try:
        # Disable SSL warnings if verify_ssl is False
        if not verify_ssl:
            import urllib3
            urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

        # Make the delete request
        response = requests.delete(
            delete_url,
            headers=headers,
            verify=verify_ssl
        )

        # Check the response
        if response.status_code == 200 or response.status_code == 204:
            print("\033[92m" + "User deletion successful!" + "\033[0m")
            try:
                print(json.dumps(response.json(), indent=2))
            except:
                print(f"Response: {response.text}")
            return True
        else:
            print("\033[91m" + f"User deletion failed with status code: {response.status_code}" + "\033[0m")
            try:
                print(json.dumps(response.json(), indent=2))
            except:
                print(f"Response: {response.text}")

            if response.status_code == 401:
                print("\nAuthentication error: Invalid or expired token")
            elif response.status_code == 403:
                print("\nPermission error: You don't have permission to delete this user")
            elif response.status_code == 404:
                print("\nUser not found error: The specified user does not exist")

            return False

    except requests.exceptions.RequestException as e:
        print("\033[91m" + f"Exception during user deletion: {str(e)}" + "\033[0m")
        return False

def login_user(base_url, username, password, verify_ssl=False):
    """
    Login to get authentication token
    """
    login_url = f"{base_url}/api/auth/login"

    # Prepare the login data
    login_data = {
        "username": username,
        "password": password
    }

    # Set headers
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Python-User-Management-Script/1.0"
    }

    print(f"Logging in as: {username}")

    try:
        # Disable SSL warnings if verify_ssl is False
        if not verify_ssl:
            import urllib3
            urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

        # Make the login request
        response = requests.post(
            login_url,
            json=login_data,
            headers=headers,
            verify=verify_ssl
        )

        # Check the response
        if response.status_code == 200:
            print("\033[92m" + "Login successful!" + "\033[0m")
            try:
                response_data = response.json()
                token = response_data.get('token')
                if token:
                    return token
                else:
                    print("\033[91m" + "Login succeeded but no token was returned" + "\033[0m")
                    return None
            except:
                print("\033[91m" + "Failed to parse login response" + "\033[0m")
                return None
        else:
            print("\033[91m" + f"Login failed with status code: {response.status_code}" + "\033[0m")
            try:
                print(json.dumps(response.json(), indent=2))
            except:
                print(f"Response: {response.text}")
            return None

    except requests.exceptions.RequestException as e:
        print("\033[91m" + f"Exception during login: {str(e)}" + "\033[0m")
        return None

def delete_user_without_auth(base_url, username, verify_ssl=False):
    """
    Attempt to delete a user from the VHS website without authentication.

    Note: This operation may not be supported by the server as most APIs require
    authentication for user deletion for security reasons.
    """
    # We're trying a standard RESTful endpoint pattern, but this may not be implemented on the server
    delete_url = f"{base_url}/api/auth/user/{username}"

    # Set headers
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Python-User-Management-Script/1.0"
    }

    print(f"Attempting to delete user: {username} without authentication")
    print(f"Warning: This operation may not be supported by the server")
    print(f"Sending request to: {delete_url}")

    try:
        # Disable SSL warnings if verify_ssl is False
        if not verify_ssl:
            import urllib3
            urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

        # Make the delete request
        response = requests.delete(
            delete_url,
            headers=headers,
            verify=verify_ssl
        )

        # Check the response
        if response.status_code == 200 or response.status_code == 204:
            print("\033[92m" + "User deletion successful!" + "\033[0m")
            try:
                print(json.dumps(response.json(), indent=2))
            except:
                print(f"Response: {response.text}")
            return True
        else:
            print("\033[91m" + f"User deletion failed with status code: {response.status_code}" + "\033[0m")
            try:
                print(json.dumps(response.json(), indent=2))
            except:
                print(f"Response: {response.text}")

            if response.status_code == 404:
                print("\nUser not found error: The specified user does not exist")

            return False

    except requests.exceptions.RequestException as e:
        print("\033[91m" + f"Exception during user deletion: {str(e)}" + "\033[0m")
        return False

def main():
    parser = argparse.ArgumentParser(description='Manage users on the VHS website')
    parser.add_argument('--url', type=str, default='https://localhost',
                       help='Base URL of the website (default: https://localhost)')
    parser.add_argument('--verify-ssl', action='store_true',
                       help='Verify SSL certificates (default: False)')

    # Add operation group
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--add', action='store_true', help='Add a new user')
    group.add_argument('--del', dest='delete', action='store_true', help='Delete an existing user')

    # User credentials
    parser.add_argument('--username', type=str, required=True,
                       help='Username for the account')
    parser.add_argument('--email', type=str,
                       help='Email address for the new account (required for --add)')
    parser.add_argument('--password', type=str,
                       help='Password (required for --add and for authentication when using --del)')
    parser.add_argument('--admin-username', type=str,
                       help='Admin username for deletion (optional for --del)')
    parser.add_argument('--admin-password', type=str,
                       help='Admin password for deletion (optional for --del)')

    args = parser.parse_args()

    # Validate arguments based on operation
    if args.add:
        if not args.email or not args.password:
            print("\033[91m" + "Error: --email and --password are required when using --add" + "\033[0m")
            parser.print_help()
            sys.exit(1)

        # Register the user
        success = register_user(
            args.url,
            args.username,
            args.email,
            args.password,
            args.verify_ssl
        )

    elif args.delete:
        # Check if admin credentials are provided
        if args.admin_username and args.admin_password:
            # Authenticate with admin credentials
            token = login_user(
                args.url,
                args.admin_username,
                args.admin_password,
                args.verify_ssl
            )

            if not token:
                print("\033[91m" + "Failed to authenticate. Cannot delete user with admin privileges." + "\033[0m")
                print("\033[93m" + "Trying to delete user without authentication (this may fail if not supported by the server)..." + "\033[0m")
                success = delete_user_without_auth(
                    args.url,
                    args.username,
                    args.verify_ssl
                )
            else:
                # Delete the user with authentication
                success = delete_user(
                    args.url,
                    args.username,
                    token,
                    args.verify_ssl
                )
        else:
            # Warn about deletion without admin authentication
            print("\033[93m" + "Warning: Attempting to delete user without authentication." + "\033[0m")
            print("\033[93m" + "This operation is likely to fail as most servers require authentication for user deletion." + "\033[0m")
            print("\033[93m" + "Consider using --admin-username and --admin-password arguments." + "\033[0m")

            # Delete without admin authentication
            success = delete_user_without_auth(
                args.url,
                args.username,
                args.verify_ssl
            )

    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
