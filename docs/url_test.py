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
import socket

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
    parser.add_argument('--timeout', '-t', type=int, default=30, help='Request timeout in seconds')
    parser.add_argument('--http', action='store_true', help='Force HTTP protocol')
    parser.add_argument('--https', action='store_true', help='Force HTTPS protocol')
    parser.add_argument('--host', default='libronico.com', help='Host to test (default: libronico.com)')
    parser.add_argument('--port', type=int, help='Port to use (default: 443 for HTTPS, 80 for HTTP)')
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
    
    now = datetime.now()
    print(now.strftime("%Y-%m-%d %H:%M:%S"))
    
    # Determine protocol and port
    if args.http:
        protocol = "http"
        default_port = 80
    elif args.https:
        protocol = "https"
        default_port = 443
    else:
        # Try to autodetect if port 443 is open, otherwise fallback to http
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            s.connect((args.host, 443))
            s.close()
            
            # If we're connecting directly to Next.js on port 3000, use HTTP
            # as Next.js doesn't typically serve HTTPS directly
            if args.port == 3000:
                protocol = "http"
                default_port = 3000
                print(f"{Fore.YELLOW}Detected port 3000, using HTTP protocol for direct Next.js connection")
            else:
                protocol = "https"
                default_port = 443
                print(f"{Fore.GREEN}Port 443 is open, using HTTPS")
        except:
            protocol = "http"
            default_port = 80
            print(f"{Fore.YELLOW}Port 443 is not responding, using HTTP")
        finally:
            if s:
                s.close()
    
    port = args.port if args.port else default_port
    
    # Check if it's a standard port (80 for HTTP, 443 for HTTPS)
    if (port == 80 and protocol == "http") or (port == 443 and protocol == "https"):
        base_url = f"{protocol}://{args.host}"
    else:
        base_url = f"{protocol}://{args.host}:{port}"
    
    # Always disable SSL verification for local testing
    verify_ssl = False
    
    print(f"{Fore.CYAN}Testing against: {base_url}")
    
    # Test connectivity before proceeding
    try:
        print(f"{Fore.YELLOW}Attempting connection to {base_url}...")
        # Increase timeout for initial test
        test_response = requests.get(f"{base_url}/", timeout=10, verify=verify_ssl)
        print(f"{Fore.GREEN}Basic connectivity test: {test_response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"{Fore.RED}Cannot connect to {base_url}: {e}")
        print(f"{Fore.YELLOW}Try one of these alternatives:")
        print(f"  - {sys.argv[0]} --http (force HTTP)")
        print(f"  - {sys.argv[0]} --https (force HTTPS)")
        print(f"  - {sys.argv[0]} --host localhost --port 3000")
        print(f"  - {sys.argv[0]} --host localhost --port 4000 (backend API)")
        print(f"  - Wait for services to fully initialize (try again in 30 seconds)")
        print(f"  - Check if Docker networks are properly configured")
        print(f"  - Check if Nginx is properly configured and running")
        
        # Try to get socket-level diagnostics
        try:
            print(f"\n{Fore.YELLOW}Running network diagnostics...")
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(2)
            host = args.host
            port = port
            print(f"Attempting direct socket connection to {host}:{port}...")
            result = s.connect_ex((host, port))
            if result == 0:
                print(f"{Fore.GREEN}TCP port {port} is open on {host}, but HTTP request timed out")
                print(f"This suggests the service is running but not responding properly to HTTP requests")
            else:
                print(f"{Fore.RED}TCP port {port} is not accessible on {host} (error: {result})")
            s.close()
        except Exception as sock_error:
            print(f"{Fore.RED}Socket diagnostics failed: {sock_error}")
            
        return
    
    try:
        response = requests.post(f"{base_url}/api/auth/login", json={"username": username, "password": userpw}, verify=verify_ssl)
        print(f"{Fore.CYAN}Login response status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"{Fore.RED}ERROR: Authentication failed. Status code: {response.status_code}")
            # Try alternative credentials
            alt_users = ["jwx", "editor", "testuser"]
            for alt_user in alt_users:
                print(f"{Fore.YELLOW}Trying {alt_user}/admin123 instead...")
                alt_response = requests.post(
                    f"{base_url}/api/auth/login", 
                    json={"username": alt_user, "password": userpw}, 
                    verify=verify_ssl
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
    
    # List of frontend URLs to test (updated for App Router with i18n)
    frontend_urls = [
        # Main page
        "/",
        # rerouted pages
        "/en/login",
        "/en/register",
        "/en/forgot-password",
        "/en/reset-password",
        "/en/profile",
        "/en/dashboard",
        "/en/change-password",
        "/en/about",
        "/en/privacy",
        "/en/terms",
        # Course-related pages
        "/en/courses",
        "/en/courses/create",
        "/en/courses/data",
        
        # Player cards
        "/en/player-cards",
        "/en/player-cards/create",
        
        # Admin and editor pages
        "/en/admin",
        "/en/admin/users",
        "/en/editor",
        "/en/editor/courses",
        
        # Utility pages
        "/en/admin/logs",  #placeholder
        "/en/admin/debug",  #placeholder
        "/en/admin/cache",  #placeholder
        "/en/handicap",     
        "/en/debug-logs", 
        "/en/video-logs",

        "/robots.txt",
        
    ]
    
    # Try some alternative path patterns (in case App Router structure is different)
    alt_frontend_urls = [
        # App Router with i18n paths
        # "/[lang]/login",
        # "/[lang]/register",
        # Legacy structure paths
        # "/auth/login",
        # "/auth/register",
        # "/login",
        # "/register",
        "/en/profile",
        # Other languages
        # "/es/login",
        # "/fr/login",
    ]
    
    # Additional dynamic URLs to test
    # These are patterns that would normally have an ID
    dynamic_urls = [
        "/en/courses/1",
        "/en//player-cards/1"
        # "/auth/reset-password/[token]"
    ]
    
    # Replace placeholder patterns with actual values for testing
    dynamic_urls = [url.replace('[id]', '1').replace('[token]', 'dummy-token') for url in dynamic_urls]
    
    # Combine all URLs
    all_urls = frontend_urls + alt_frontend_urls + dynamic_urls
    
    print(f"{Fore.YELLOW}Testing {len(all_urls)} frontend URLs...")
    results = []
    
    # Helper function to test a URL
    def test_url(url_path):
        url = f"{base_url}{url_path}"
        try:
            start_time = time.time()
            if token:
                response = requests.get(url, headers=auth_headers, verify=verify_ssl, timeout=args.timeout)
            else:
                response = requests.get(url, verify=verify_ssl, timeout=args.timeout)
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