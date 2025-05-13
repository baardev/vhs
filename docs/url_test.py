#!/usr/bin/env python3
import requests
import json
import sys
import argparse
import os.path
from colorama import Fore, Style, init
import concurrent.futures
import time
from datetime import datetime
import dotenv

dotenv.load_dotenv()
userpw = os.getenv("USERPW")
# Initialize colorama
init(autoreset=True)

# Disable SSL warnings - for testing only
requests.packages.urllib3.disable_warnings()

def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Test frontend URLs')
    parser.add_argument('username', nargs='?', default='adminuser', help='Username for authentication')
    parser.add_argument('password', nargs='?', default='admin123', help='Password for authentication')
    parser.add_argument('--parallel', '-p', action='store_true', help='Run tests in parallel')
    parser.add_argument('--timeout', '-t', type=int, default=10, help='Request timeout in seconds')
    args = parser.parse_args()

    username = args.username
    userpw = args.password
    
    # # Try to read password from password file
    # try:
    #     with open(os.path.expanduser(userpwites/vhs/.adminpw"), "r") as pw_file:
    #         password = pw_file.read().strip()
    # except Exception as e:
    #     print(f"{Fore.RED}Error reading password file: {e}")
    #     # Keep using the password from command line args
    
   #print(f"{Fore.YELLOW}Using credentials: username={username}, password={password}")
    now = datetime.now()
    print(now.strftime("%Y-%m-%d %H:%M:%S"))
    # Base URL for all requests
    base_url = "https://libronico.com"
    
    # Login to get JWT token
    login_url = f"{base_url}/api/auth/login"
    login_data = {"username": username, "password": userpw}
    
    try:
        response = requests.post(login_url, json=login_data, verify=False)
        print(f"{Fore.CYAN}Login response status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"{Fore.RED}ERROR: Authentication failed. Status code: {response.status_code}")
            # Try alternative credentials
            alt_users = ["jwx", "editor", "testuser"]
            for alt_user in alt_users:
                print(f"{Fore.YELLOW}Trying {alt_user}/admin123 instead...")
                alt_response = requests.post(
                    login_url, 
                    json={"username": alt_user, "password": userpw}, 
                    verify=False
                )
                if alt_response.status_code == 200:
                    print(f"{Fore.GREEN}Successfully authenticated with {alt_user}")
                    response = alt_response
                    break
        
        # Try to parse the response
        try:
            data = response.json()
            
            # Try different fields to find the token
            token = None
            if 'token' in data:
                token = data['token']
            elif 'user' in data and 'token' in data['user']:
                token = data['user']['token']
            elif 'data' in data and 'token' in data['data']:
                token = data['data']['token']
            elif 'access_token' in data:
                token = data['access_token']
                
            if token:
                print(f"{Fore.GREEN}Token successfully retrieved.")
            else:
                print(f"{Fore.RED}No valid token found. Will test without authentication.")
                token = None
                
        except json.JSONDecodeError:
            print(f"{Fore.RED}Failed to parse response as JSON. Will test without authentication.")
            token = None
            
    except requests.exceptions.RequestException as e:
        print(f"{Fore.RED}ERROR: Login request failed: {e}")
        token = None
    
    # Setup headers for authenticated requests
    auth_headers = {
        "Authorization": f"Bearer {token}" if token else "",
        "Content-Type": "application/json"
    }
    
    # List of frontend URLs to test
    frontend_urls = [
        # Main pages
        "/",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/profile",
        "/dashboard",
        "/change-password",
        "/about",
        "/privacy",
        "/terms",
        "/robots.txt",
        
        # Course-related pages
        "/courses",
        "/courses/new",
        "/course-data",
        
        # Player cards
        "/player-cards",
        "/player-cards/new",
        
        # Admin and editor pages
        "/admin",
        "/administration",
        "/editor",
        "/editor/courses",
        
        # Utility pages
        "/view-logs",
        "/debug-logs",
        "/clear-cache",
        "/handicap",
    ]
    
    # Additional dynamic URLs to test
    # These are patterns that would normally have an ID
    dynamic_urls = [
        "/courses/1",
        "/player-cards/1", 
        "/reset-password/dummy-token"
    ]
    
    # Combine all URLs
    all_urls = frontend_urls + dynamic_urls
    
    print(f"{Fore.YELLOW}Testing {len(all_urls)} frontend URLs...")
    results = []
    
    # Helper function to test a URL
    def test_url(url_path):
        url = f"{base_url}{url_path}"
        try:
            start_time = time.time()
            if token:
                response = requests.get(url, headers=auth_headers, verify=False, timeout=args.timeout)
            else:
                response = requests.get(url, verify=False, timeout=args.timeout)
            elapsed = time.time() - start_time
            
            # Determine status color
            if response.status_code < 300:
                status_color = Fore.GREEN
            elif response.status_code < 400:
                status_color = Fore.YELLOW
            elif response.status_code < 500:
                status_color = Fore.RED
            else:
                status_color = Fore.MAGENTA
                
            result = {
                'url': url_path,
                'status': response.status_code,
                'time': elapsed,
                'content_type': response.headers.get('Content-Type', 'unknown'),
                'content_length': len(response.content)
            }
            
            # Print result immediately
            print(f"{status_color}[{response.status_code}] {url_path} - {elapsed:.2f}s - {result['content_length']} bytes")
            
            return result
        except requests.exceptions.Timeout:
            print(f"{Fore.RED}[TIMEOUT] {url_path} - Timed out after {args.timeout}s")
            return {'url': url_path, 'status': 'TIMEOUT', 'time': args.timeout, 'content_type': 'unknown', 'content_length': 0}
        except requests.exceptions.RequestException as e:
            print(f"{Fore.RED}[ERROR] {url_path} - {str(e)}")
            return {'url': url_path, 'status': 'ERROR', 'time': 0, 'content_type': 'unknown', 'content_length': 0}
    
    # Run tests in parallel or sequentially
    if args.parallel:
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            future_to_url = {executor.submit(test_url, url): url for url in all_urls}
            for future in concurrent.futures.as_completed(future_to_url):
                results.append(future.result())
    else:
        for url in all_urls:
            results.append(test_url(url))
    
    # Summarize results
    success_count = sum(1 for r in results if isinstance(r['status'], int) and r['status'] < 400)
    redirect_count = sum(1 for r in results if isinstance(r['status'], int) and 300 <= r['status'] < 400)
    client_error_count = sum(1 for r in results if isinstance(r['status'], int) and 400 <= r['status'] < 500)
    server_error_count = sum(1 for r in results if isinstance(r['status'], int) and r['status'] >= 500)
    error_count = sum(1 for r in results if not isinstance(r['status'], int))
    
    print("\n" + "="*50)
    print(f"{Fore.YELLOW}URL Testing Results Summary:")
    print(f"{Fore.GREEN}Success: {success_count}")
    print(f"{Fore.YELLOW}Redirects: {redirect_count}")
    print(f"{Fore.RED}Client Errors (4xx): {client_error_count}")
    print(f"{Fore.MAGENTA}Server Errors (5xx): {server_error_count}")
    print(f"{Fore.RED}Connection Errors: {error_count}")
    print("="*50)
    
    # List all URLs with errors
    if client_error_count + server_error_count + error_count > 0:
        print(f"\n{Fore.YELLOW}URLs with errors:")
        for r in results:
            if (isinstance(r['status'], int) and r['status'] >= 400) or not isinstance(r['status'], int):
                status_display = r['status']
                if isinstance(r['status'], int) and 400 <= r['status'] < 500:
                    color = Fore.RED
                elif isinstance(r['status'], int) and r['status'] >= 500:
                    color = Fore.MAGENTA
                else:
                    color = Fore.RED
                print(f"{color}{r['url']} - {status_display}")

if __name__ == "__main__":
    main()