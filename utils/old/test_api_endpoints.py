#!/usr/bin/env python3
import requests
import json
import argparse
import logging
import sys
import urllib3

# Import from the correct location in urllib3
try:
    from urllib3.exceptions import InsecureRequestWarning
except ImportError:
    # For newer versions of urllib3
    from urllib3 import InsecureRequestWarning

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
            if "Success" in message:
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
file_handler = logging.FileHandler('api_test.log')
file_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(file_formatter)
logger.addHandler(file_handler)

# Add stream handler with color
stream_handler = logging.StreamHandler(sys.stdout)
stream_formatter = ColorFormatter('%(asctime)s - %(levelname)s - %(message)s')
stream_handler.setFormatter(stream_formatter)
logger.addHandler(stream_handler)

def test_api_endpoint(session, url, method='GET', data=None, headers=None):
    """Test an API endpoint with the specified method and data."""
    logger.info(f"Testing API endpoint: {url} with method {method}")

    try:
        if method.upper() == 'GET':
            response = session.get(url, headers=headers)
        elif method.upper() == 'POST':
            response = session.post(url, json=data, headers=headers)
        elif method.upper() == 'PUT':
            response = session.put(url, json=data, headers=headers)
        elif method.upper() == 'DELETE':
            response = session.delete(url, headers=headers)
        else:
            logger.error(f"Unsupported method: {method}")
            return {
                "status": "Error",
                "error": f"Unsupported method: {method}"
            }

        status_code = response.status_code

        result = {
            "status_code": status_code,
            "headers": dict(response.headers),
        }

        # Try to parse response as JSON
        try:
            result["data"] = response.json()
        except json.JSONDecodeError:
            # If not JSON, include text content (truncated if too large)
            content = response.text
            if len(content) > 1000:
                content = content[:1000] + "... [truncated]"
            result["data"] = content

        if 200 <= status_code < 300:
            logger.info(f"Success (Status {status_code})")
            result["status"] = "Success"
        else:
            logger.error(f"Failed with status code: {status_code}")
            result["status"] = "Error"

        return result

    except requests.exceptions.RequestException as e:
        logger.error(f"Exception: {str(e)}")
        return {
            "status": "Exception",
            "error": str(e)
        }

def get_auth_token(base_url, username, password):
    """Get authentication token by logging in."""
    login_url = f"{base_url}/api/auth/login"

    try:
        response = requests.post(
            login_url,
            json={"username": username, "password": password},
            headers={"Content-Type": "application/json"},
            verify=False
        )

        if response.status_code == 200:
            data = response.json()
            return data.get('token')
        else:
            logger.error(f"Login failed with status code: {response.status_code}")
            return None

    except requests.exceptions.RequestException as e:
        logger.error(f"Exception during login: {str(e)}")
        return None

def main():
    parser = argparse.ArgumentParser(description='Test API endpoints')
    parser.add_argument('--base-url', type=str, default='https://localhost',
                        help='Base URL of the API (default: https://localhost)')
    parser.add_argument('--username', type=str, default='jm42',
                        help='Username for authenticated requests (default: jm42)')
    parser.add_argument('--password', type=str, default='1q2w3e',
                        help='Password for authenticated requests (default: 1q2w3e)')
    parser.add_argument('--output', type=str, default='api_test_results.json',
                        help='Output file for results (default: api_test_results.json)')

    args = parser.parse_args()

    base_url = args.base_url
    username = args.username
    password = args.password
    output_file = args.output

    logger.info(f"Starting API tests with base URL: {base_url}")

    # Create a session with default headers
    session = requests.Session()
    session.verify = False  # Skip SSL verification for self-signed certificates
    session.headers.update({
        "Content-Type": "application/json",
        "User-Agent": "API-Tester/1.0"
    })

    # Get authentication token if username and password are provided
    token = None
    if username and password:
        logger.info(f"Getting authentication token for user: {username}")
        token = get_auth_token(base_url, username, password)
        if token:
            logger.info("Authentication successful")
            session.headers.update({"Authorization": f"Bearer {token}"})
        else:
            logger.warning("Failed to get authentication token, proceeding with unauthenticated requests")

    # Define the endpoints to test
    # Format: [endpoint, method, request_data, requires_auth]
    endpoints = [
        # Public endpoints
        ["/api/golf-news", "GET", None, False],
        ["/api/random-quote", "GET", None, False],

        # Auth endpoints
        ["/api/auth/login", "POST", {"username": username, "password": password}, False],
        ["/api/auth/register", "POST", {"username": f"test_{username}", "email": "test@example.com", "password": "password123"}, False],

        # Protected endpoints
        ["/api/auth/profile", "GET", None, True],

        # Add more endpoints as needed
    ]

    results = {}

    # Test each endpoint
    for endpoint, method, data, requires_auth in endpoints:
        url = f"{base_url}{endpoint}"

        # Skip authenticated endpoints if no token
        if requires_auth and not token:
            logger.warning(f"Skipping authenticated endpoint {endpoint} (no token)")
            results[endpoint] = {"status": "Skipped", "reason": "No authentication token"}
            continue

        # Test the endpoint
        result = test_api_endpoint(session, url, method, data)
        results[endpoint] = result

    # Write results to file
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)

    logger.info(f"Results written to {output_file}")

    # Summary
    success_count = sum(1 for result in results.values() if result.get("status") == "Success")
    error_count = sum(1 for result in results.values() if result.get("status") == "Error")
    exception_count = sum(1 for result in results.values() if result.get("status") == "Exception")
    skipped_count = sum(1 for result in results.values() if result.get("status") == "Skipped")

    logger.info("Testing completed!")
    logger.info(f"Total endpoints: {len(endpoints)}")

    # Color the summary output
    if has_colorama:
        logger.info(f"Success: {Fore.GREEN}{success_count}{Style.RESET_ALL}")
        if error_count > 0:
            logger.info(f"Errors: {Fore.RED}{error_count}{Style.RESET_ALL}")
        else:
            logger.info(f"Errors: {error_count}")
        if exception_count > 0:
            logger.info(f"Exceptions: {Fore.RED}{exception_count}{Style.RESET_ALL}")
        else:
            logger.info(f"Exceptions: {exception_count}")
        if skipped_count > 0:
            logger.info(f"Skipped: {Fore.YELLOW}{skipped_count}{Style.RESET_ALL}")
        else:
            logger.info(f"Skipped: {skipped_count}")
    else:
        logger.info(f"Success: {success_count}")
        logger.info(f"Errors: {error_count}")
        logger.info(f"Exceptions: {exception_count}")
        logger.info(f"Skipped: {skipped_count}")

if __name__ == "__main__":
    main()