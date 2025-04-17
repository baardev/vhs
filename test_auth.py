#!/usr/bin/env python3
import requests
import json
import argparse
import logging
import sys
import urllib3
from urllib3.exceptions import InsecureRequestWarning

# Try to import colorama for colored output
try:
    from colorama import init, Fore, Style
    has_colorama = True
    # Initialize colorama
    init()
except ImportError:
    has_colorama = False

# Suppress the insecure request warning for self-signed certificates
urllib3.disable_warnings(InsecureRequestWarning)

# Custom logging formatter with colors
class ColorFormatter(logging.Formatter):
    """Logging formatter with colored output if colorama is available"""

    def __init__(self, fmt=None, datefmt=None, style='%'):
        super().__init__(fmt, datefmt, style)

    def format(self, record):
        message = super().format(record)

        if not has_colorama:
            return message

        if record.levelno == logging.INFO:
            if "successful" in message.lower() or "success" in message.lower():
                return f"{Fore.GREEN}{message}{Style.RESET_ALL}"
            else:
                return message
        elif record.levelno == logging.WARNING:
            return f"{Fore.YELLOW}{message}{Style.RESET_ALL}"
        elif record.levelno == logging.ERROR:
            return f"{Fore.RED}{message}{Style.RESET_ALL}"
        else:
            return message

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Clear any existing handlers
logger.handlers = []

# Add file handler
file_handler = logging.FileHandler('auth_test.log')
file_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(file_formatter)
logger.addHandler(file_handler)

# Add stream handler with color
stream_handler = logging.StreamHandler(sys.stdout)
stream_formatter = ColorFormatter('%(asctime)s - %(levelname)s - %(message)s')
stream_handler.setFormatter(stream_formatter)
logger.addHandler(stream_handler)

def test_login(base_url, username, password):
    """Test login functionality and return the session and token if successful."""
    login_url = f"{base_url}/api/auth/login"

    logger.info(f"Testing login with username: {username}")

    session = requests.Session()
    session.verify = False  # Skip SSL verification for self-signed certificates

    try:
        response = session.post(
            login_url,
            json={"username": username, "password": password},
            headers={"Content-Type": "application/json"}
        )

        if response.status_code == 200:
            logger.info("Login successful!")
            data = response.json()
            token = data.get('token')
            user = data.get('user')

            if token:
                # Add token to session headers for subsequent requests
                session.headers.update({"Authorization": f"Bearer {token}"})
                logger.info(f"User data: {json.dumps(user, indent=2)}")
                return session, token, user
            else:
                logger.error("Login succeeded but no token was returned")
                return None, None, None
        else:
            logger.error(f"Login failed with status code: {response.status_code}")
            logger.error(f"Response: {response.text}")
            return None, None, None

    except requests.exceptions.RequestException as e:
        logger.error(f"Exception during login: {str(e)}")
        return None, None, None

def test_protected_routes(base_url, session):
    """Test access to protected routes with an authenticated session."""
    protected_routes = [
        "/api/auth/profile",
        # Add other protected routes here
    ]

    results = {}

    for route in protected_routes:
        url = f"{base_url}{route}"
        logger.info(f"Testing protected route: {url}")

        try:
            response = session.get(url)

            if response.status_code == 200:
                logger.info(f"Successfully accessed {route}")
                results[route] = {
                    "status": "Success",
                    "status_code": response.status_code,
                    "data": response.json()
                }
            else:
                logger.error(f"Failed to access {route} with status code: {response.status_code}")
                results[route] = {
                    "status": "Failure",
                    "status_code": response.status_code,
                    "response": response.text
                }

        except requests.exceptions.RequestException as e:
            logger.error(f"Exception while accessing {route}: {str(e)}")
            results[route] = {
                "status": "Exception",
                "error": str(e)
            }

    return results

def test_logout(base_url, session):
    """Test logout functionality (if available)."""
    logout_url = f"{base_url}/api/auth/logout"

    logger.info("Testing logout")

    try:
        response = session.post(logout_url)

        if response.status_code == 200:
            logger.info("Logout successful!")
            return True
        else:
            logger.error(f"Logout failed with status code: {response.status_code}")
            logger.error(f"Response: {response.text}")
            return False

    except requests.exceptions.RequestException as e:
        logger.error(f"Exception during logout: {str(e)}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Test authentication on the website')
    parser.add_argument('--base-url', type=str, default='https://localhost',
                        help='Base URL of the site to test (default: https://localhost)')
    parser.add_argument('--username', type=str, default='jm42',
                        help='Username for login test (default: jm42)')
    parser.add_argument('--password', type=str, default='1q2w3e',
                        help='Password for login test (default: 1q2w3e)')
    parser.add_argument('--output', type=str, default='auth_test_results.json',
                        help='Output file for results (default: auth_test_results.json)')

    args = parser.parse_args()

    base_url = args.base_url
    username = args.username
    password = args.password
    output_file = args.output

    logger.info(f"Starting authentication tests with base URL: {base_url}")

    # Test login
    session, token, user = test_login(base_url, username, password)

    results = {
        "login": {
            "status": "Success" if token else "Failure",
            "user": user
        }
    }

    # Test protected routes if login was successful
    if session and token:
        protected_results = test_protected_routes(base_url, session)
        results["protected_routes"] = protected_results

        # Test logout if available
        logout_result = test_logout(base_url, session)
        results["logout"] = {"status": "Success" if logout_result else "Failure"}

    # Write results to file
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)

    logger.info(f"Results written to {output_file}")

    # Output colored summary
    if has_colorama:
        if results["login"]["status"] == "Success":
            logger.info(f"Login test: {Fore.GREEN}PASSED{Style.RESET_ALL}")
        else:
            logger.info(f"Login test: {Fore.RED}FAILED{Style.RESET_ALL}")

        if "protected_routes" in results:
            success_count = sum(1 for r in results["protected_routes"].values() if r["status"] == "Success")
            total_count = len(results["protected_routes"])
            if success_count == total_count:
                logger.info(f"Protected routes test: {Fore.GREEN}PASSED{Style.RESET_ALL} ({success_count}/{total_count})")
            else:
                logger.info(f"Protected routes test: {Fore.YELLOW}PARTIAL{Style.RESET_ALL} ({success_count}/{total_count})")

        if "logout" in results:
            if results["logout"]["status"] == "Success":
                logger.info(f"Logout test: {Fore.GREEN}PASSED{Style.RESET_ALL}")
            else:
                logger.info(f"Logout test: {Fore.RED}FAILED{Style.RESET_ALL}")
    else:
        logger.info(f"Login test: {'PASSED' if results['login']['status'] == 'Success' else 'FAILED'}")
        if "protected_routes" in results:
            success_count = sum(1 for r in results["protected_routes"].values() if r["status"] == "Success")
            total_count = len(results["protected_routes"])
            logger.info(f"Protected routes test: {'PASSED' if success_count == total_count else 'PARTIAL'} ({success_count}/{total_count})")
        if "logout" in results:
            logger.info(f"Logout test: {'PASSED' if results['logout']['status'] == 'Success' else 'FAILED'}")

if __name__ == "__main__":
    main()
