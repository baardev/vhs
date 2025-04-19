#!/usr/bin/env python3
import requests
import json
import logging
import argparse

# Set up detailed logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('login_debug.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger()

def debug_login(base_url, username, password, email=None, include_email=False):
    """Test login with detailed debugging."""
    login_url = f"{base_url}/api/auth/login"

    # Prepare request body based on options
    request_body = {"username": username, "password": password}
    if include_email:
        request_body["email"] = email or username  # Use provided email or username

    # Log request details
    logger.info(f"Attempting login to: {login_url}")
    logger.info(f"Request body: {json.dumps(request_body)}")

    try:
        # Make login request with detailed errors
        session = requests.Session()
        session.verify = False  # Skip SSL verification for self-signed certificates

        # Try with different Content-Type headers
        headers_options = [
            {"Content-Type": "application/json"},
            {"Content-Type": "application/x-www-form-urlencoded"},
            {}  # No Content-Type header
        ]

        for headers in headers_options:
            logger.info(f"Trying request with headers: {headers}")

            # Try direct request to backend (port 4000)
            try:
                backend_url = base_url.replace("localhost", "localhost:4000")
                if not backend_url.startswith("http"):
                    backend_url = f"http://{backend_url}"

                backend_login_url = f"{backend_url}/api/auth/login"
                logger.info(f"Trying direct backend request to: {backend_login_url}")

                response = session.post(
                    backend_login_url,
                    json=request_body,
                    headers=headers,
                    timeout=5
                )
                logger.info(f"Direct backend response status: {response.status_code}")
                logger.info(f"Direct backend response headers: {dict(response.headers)}")
                logger.info(f"Direct backend response body: {response.text}")
            except Exception as e:
                logger.warning(f"Direct backend request failed: {str(e)}")

            # Try the original URL
            response = session.post(
                login_url,
                json=request_body,
                headers=headers
            )

            logger.info(f"Response status: {response.status_code}")
            logger.info(f"Response headers: {dict(response.headers)}")
            logger.info(f"Response body: {response.text}")

            if response.status_code == 200:
                logger.info("Login successful!")
                return True

        # Try curl command for verification
        import subprocess
        logger.info("Trying with curl command...")

        curl_cmd = [
            "curl", "-k", "-X", "POST",
            "-H", "Content-Type: application/json",
            "-d", json.dumps(request_body),
            login_url
        ]

        logger.info(f"Executing: {' '.join(curl_cmd)}")

        try:
            result = subprocess.run(curl_cmd, capture_output=True, text=True)
            logger.info(f"Curl exit code: {result.returncode}")
            logger.info(f"Curl stdout: {result.stdout}")
            logger.info(f"Curl stderr: {result.stderr}")
        except Exception as e:
            logger.error(f"Error executing curl: {str(e)}")

        return False

    except requests.exceptions.RequestException as e:
        logger.error(f"Exception during login: {str(e)}")
        return False

def check_ports(base_host):
    """Check if key ports are open and accessible."""
    import socket

    ports_to_check = [80, 443, 3000, 4000]
    results = {}

    for port in ports_to_check:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(2)
        result = sock.connect_ex((base_host, port))
        sock.close()

        status = "Open" if result == 0 else f"Closed (Error code: {result})"
        results[port] = status
        logger.info(f"Port {port}: {status}")

    return results

def main():
    parser = argparse.ArgumentParser(description='Debug login issues')
    parser.add_argument('--base-url', type=str, default='https://localhost',
                        help='Base URL of the site (default: https://localhost)')
    parser.add_argument('--username', type=str, default='jm42',
                        help='Username for login (default: jm42)')
    parser.add_argument('--password', type=str, default='1q2w3e',
                        help='Password for login (default: 1q2w3e)')
    parser.add_argument('--email', type=str,
                        help='Email to use for login (defaults to username if not provided)')
    parser.add_argument('--include-email', action='store_true',
                        help='Include email field in login request')

    args = parser.parse_args()

    # Extract host for port checking
    from urllib.parse import urlparse
    parsed_url = urlparse(args.base_url)
    base_host = parsed_url.hostname or 'localhost'

    logger.info("==== System Information ====")

    # Check network connectivity
    logger.info("Checking network ports...")
    port_status = check_ports(base_host)

    # Try login with different options
    logger.info("\n==== Login Attempt ====")
    success = debug_login(args.base_url, args.username, args.password, args.email, args.include_email)

    if success:
        logger.info("Login debugging completed successfully!")
    else:
        logger.error("Login debugging completed with errors.")

    logger.info("Check login_debug.log for detailed information.")

if __name__ == "__main__":
    main()