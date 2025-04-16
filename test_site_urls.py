#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import urllib.parse
import logging
import argparse
import time
import sys
from requests.packages.urllib3.exceptions import InsecureRequestWarning

# Try to import colorama for colored output
try:
    from colorama import init, Fore, Style
    has_colorama = True
    # Initialize colorama
    init()
except ImportError:
    has_colorama = False

# Suppress the insecure request warning for self-signed certificates
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

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
            # Colorize success messages in green
            if 'OK' in message or 'completed' in message or 'success' in message.lower():
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
file_handler = logging.FileHandler('site_test.log')
file_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(file_formatter)
logger.addHandler(file_handler)

# Add stream handler with color
stream_handler = logging.StreamHandler(sys.stdout)
stream_formatter = ColorFormatter('%(asctime)s - %(levelname)s - %(message)s')
stream_handler.setFormatter(stream_formatter)
logger.addHandler(stream_handler)

def get_status_line(url, status):
    """Return a status line with color coding if colorama is available"""
    if not has_colorama:
        return f"{url}: {status}"

    if status.startswith('OK'):
        return f"{url}: {Fore.GREEN}{status}{Style.RESET_ALL}"
    elif status.startswith('Error'):
        return f"{url}: {Fore.RED}{status}{Style.RESET_ALL}"
    elif status.startswith('Exception'):
        return f"{url}: {Fore.RED}{status}{Style.RESET_ALL}"
    elif status.startswith('Skipped'):
        return f"{url}: {Fore.YELLOW}{status}{Style.RESET_ALL}"
    else:
        return f"{url}: {status}"

def test_url(url, session, visited_urls, base_url, delay=0.2):
    """Test a URL and recursively find and test all linked URLs within the same domain."""
    if url in visited_urls:
        return visited_urls

    # Normalize the URL
    if not url.startswith('http'):
        url = urllib.parse.urljoin(base_url, url)

    # Skip URLs that are not on the base domain
    if not url.startswith(base_url):
        visited_urls[url] = 'Skipped (external)'
        return visited_urls

    # Skip non-HTML content
    if any(url.endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.gif', '.css', '.js', '.ico']):
        visited_urls[url] = 'Skipped (asset)'
        return visited_urls

    logger.info(f"Testing: {url}")

    try:
        response = session.get(url, verify=False, timeout=10)
        status_code = response.status_code

        if status_code == 200:
            visited_urls[url] = f'OK ({status_code})'

            # Parse HTML content for links only if status code is 200
            if 'text/html' in response.headers.get('Content-Type', ''):
                soup = BeautifulSoup(response.text, 'html.parser')

                # Find all links
                links = []
                for a_tag in soup.find_all('a', href=True):
                    href = a_tag['href']
                    # Skip anchors, javascript, and mailto links
                    if href.startswith('#') or href.startswith('javascript:') or href.startswith('mailto:'):
                        continue
                    links.append(href)

                # Recursively check each link
                for link in links:
                    # Normalize link
                    full_link = urllib.parse.urljoin(url, link)
                    # Add a small delay to avoid hammering the server
                    time.sleep(delay)
                    visited_urls = test_url(full_link, session, visited_urls, base_url, delay)
        else:
            visited_urls[url] = f'Error ({status_code})'

    except requests.exceptions.RequestException as e:
        visited_urls[url] = f'Exception: {str(e)}'
        logger.error(f"Error testing {url}: {str(e)}")

    return visited_urls

def main():
    parser = argparse.ArgumentParser(description='Test all URLs on a website')
    parser.add_argument('--base-url', type=str, default='https://localhost',
                        help='Base URL of the site to test (default: https://localhost)')
    parser.add_argument('--delay', type=float, default=0.2,
                        help='Delay between requests in seconds (default: 0.2)')
    parser.add_argument('--output', type=str, default='site_test_results.txt',
                        help='Output file for results (default: site_test_results.txt)')

    args = parser.parse_args()

    base_url = args.base_url
    delay = args.delay
    output_file = args.output

    logger.info(f"Starting URL testing with base URL: {base_url}")

    # Create a session to maintain cookies across requests
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })

    # Start testing from the base URL
    visited_urls = {}
    visited_urls = test_url(base_url, session, visited_urls, base_url, delay)

    # Write results to file with colors stripped
    with open(output_file, 'w') as f:
        for url, status in visited_urls.items():
            f.write(f"{url}: {status}\n")

    # Summary
    ok_count = sum(1 for status in visited_urls.values() if status.startswith('OK'))
    error_count = sum(1 for status in visited_urls.values() if status.startswith('Error'))
    exception_count = sum(1 for status in visited_urls.values() if status.startswith('Exception'))
    skipped_count = sum(1 for status in visited_urls.values() if status.startswith('Skipped'))

    logger.info("Testing completed!")
    logger.info(f"Total URLs: {len(visited_urls)}")

    # Color the summary output
    if has_colorama:
        logger.info(f"OK: {Fore.GREEN}{ok_count}{Style.RESET_ALL}")
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
        logger.info(f"OK: {ok_count}")
        logger.info(f"Errors: {error_count}")
        logger.info(f"Exceptions: {exception_count}")
        logger.info(f"Skipped: {skipped_count}")

    logger.info(f"Results written to {output_file}")

    # Print the detailed results to the console with colors
    if has_colorama:
        print("\nDetailed Results:")
        for url, status in sorted(visited_urls.items()):
            print(get_status_line(url, status))

if __name__ == "__main__":
    main()