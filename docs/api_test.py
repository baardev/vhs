#!/usr/bin/env python3
import requests
import json
import sys
import argparse
import os.path
from colorama import Fore, Style, init
from datetime import datetime
import dotenv

dotenv.load_dotenv()
# After calling dotenv.load_dotenv(), all the variables in your .env file are loaded into the
# environment and can be accessed using os.getenv() or os.environ.
#
# For example, if your .env file contains:
#   API_KEY=abcd1234
#   DB_USER=admin
#
# You can access these variables as follows:
api_key = os.getenv("API_KEY", "default_api_key")
db_user = os.getenv("DB_USER", "admin")
db_password = os.getenv("DB_PASSWORD", "admin123")
userpw = os.getenv("USERPW")

# print(f"Loaded API_KEY: {api_key}")
# print(f"Loaded DB_USER: {db_user}")
# Avoid printing sensitive information like passwords in production environments.
# Initialize colorama
init(autoreset=True)

# Disable SSL warnings - for testing only
requests.packages.urllib3.disable_warnings()

def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Test API endpoints')
    parser.add_argument('username', nargs='?', default='adminuser', help='Username for authentication')
    parser.add_argument('password', nargs='?', default='admin123', help='Password for authentication')
    parser.add_argument('--parallel', '-p', action='store_true', help='Run tests in parallel')
    parser.add_argument('--timeout', '-t', type=int, default=10, help='Request timeout in seconds')
    parser.add_argument('--lang', '-l', type=str, default='en', help='Language for testing frontend routes')
    args = parser.parse_args()

    username = args.username
    userpw = args.password
    language = args.lang
    
    # Try to read password from password file
    # try:
    #     with open(os.path.expanduser(userpw), "r") as pw_file:
    #         userpw = pw_file.read().strip()
    # except Exception as e:
    #     print(f"{Fore.RED}Error reading password file: {e}")
    #     # Keep using the password from command line args
    
    #print(f"{Fore.YELLOW}Using credentials: username={username}, password={password}")
       #print(f"{Fore.YELLOW}Using credentials: username={username}, password={password}")
    now = datetime.now()
    print(now.strftime("%Y-%m-%d %H:%M:%S"))
    # Base URL for all API requests
    base_url = "https://libronico.com"
    
    # Login to get JWT token
    login_url = f"{base_url}/api/auth/login"
    login_data = {"username": username, "password": userpw}
    
    try:
        response = requests.post(login_url, json=login_data, verify=False, timeout=args.timeout)
        print(f"{Fore.CYAN}Full response: {response.text}")
        
        if response.status_code != 200:
            print(f"{Fore.RED}ERROR: Authentication failed. Status code: {response.status_code}")
            
            # Try alternative credentials if using defaults
            if username == "victoria" and userpw == "admin123":
                print(f"{Fore.YELLOW}Trying admin/admin123 instead...")
                alt_response = requests.post(
                    login_url, 
                    json={"username": "admin", "password": userpw}, 
                    verify=False,
                    timeout=args.timeout
                )
                print(f"{Fore.CYAN}New response: {alt_response.text}")
                response = alt_response
        
        # Try to parse the response
        try:
            data = response.json()
            print(f"{Fore.YELLOW}Available fields in response: {list(data.keys())}")
            
            # Try different fields to find the token
            token = None
            if 'token' in data:
                token = data['token']
                print(f"{Fore.YELLOW}Found token in .token")
            elif 'user' in data and 'token' in data['user']:
                token = data['user']['token']
                print(f"{Fore.YELLOW}Found token in .user.token")
            elif 'data' in data and 'token' in data['data']:
                token = data['data']['token']
                print(f"{Fore.YELLOW}Found token in .data.token")
            elif 'access_token' in data:
                token = data['access_token']
                print(f"{Fore.YELLOW}Found token in .access_token")
                
            if token:
                print(f"{Fore.YELLOW}TOKEN: {token}")
            else:
                print(f"{Fore.RED}No valid token found. Cannot continue with authenticated requests.")
                sys.exit(1)
                
        except json.JSONDecodeError:
            print(f"{Fore.RED}Failed to parse response as JSON")
            sys.exit(1)
            
    except requests.exceptions.RequestException as e:
        print(f"{Fore.RED}ERROR: Request failed: {e}")
        sys.exit(1)
    
    # If we got here, we have a token and can continue with tests
    print(f"{Fore.YELLOW}Token successfully retrieved. Continuing with API tests...")
    
    # Setup headers for authenticated requests
    auth_headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Helper function to make API requests and print results
    def test_endpoint(method, endpoint, headers=None, data=None, params=None):
        url = f"{base_url}{endpoint}"
        print(f"\n{Fore.YELLOW}=== Testing {method} {url} ===")
        
        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=headers, params=params, verify=False, timeout=args.timeout)
            elif method.upper() == 'POST':
                response = requests.post(url, headers=headers, json=data, verify=False, timeout=args.timeout)
            elif method.upper() == 'PUT':
                response = requests.put(url, headers=headers, json=data, verify=False, timeout=args.timeout)
            elif method.upper() == 'DELETE':
                response = requests.delete(url, headers=headers, verify=False, timeout=args.timeout)
            else:
                print(f"{Fore.RED}Unsupported method: {method}")
                return
                
            # Set color based on status code
            output_color = Fore.GREEN if response.status_code == 200 else Fore.RED
            
            # Print status with appropriate color
            print(f"{output_color}Status: {response.status_code}")
            
            # Try to pretty-print JSON response with the same color
            try:
                json_response = response.json()
                print(f"{output_color}Response: {json.dumps(json_response, indent=2)}")
            except:
                # For HTML responses, print just the first bit
                if response.headers.get('content-type', '').startswith('text/html'):
                    print(f"{output_color}HTML Response (first 200 chars): {response.text[:200]}...")
                else:
                    print(f"{output_color}Response: {response.text[:200]}...")
                
        except requests.exceptions.RequestException as e:
            print(f"{Fore.RED}Request failed: {e}")
    
    # Test frontend routes with App Router architecture
    print(f"\n{Fore.GREEN}=== Testing App Router Frontend Routes ===")
    
    # Test language route
    test_endpoint('GET', f'/{language}')
    
    # Test other language-specific routes
    test_endpoint('GET', f'/{language}/login')
    test_endpoint('GET', f'/{language}/register')
    test_endpoint('GET', f'/{language}/forgot-password')
    test_endpoint('GET', f'/{language}/about')
    
    # Test API endpoints
    print(f"\n{Fore.GREEN}=== Testing API Routes ===")
    
    # Test authentication endpoints
    test_endpoint('POST', '/api/auth/register', data={
        "username": "testuser", 
        "email": "test@example.com", 
        "password": "admin123"
    })
    
    test_endpoint('POST', '/api/auth/login', data={
        "username": username,
        "password": userpw
    })
    
    test_endpoint('POST', '/api/auth/forgot-password', data={
        "email": "victoria@example.com"
    })
    
    test_endpoint('GET', '/api/auth/profile', headers=auth_headers)
    
    # Admin APIs
    test_endpoint('GET', '/api/admin/users', headers=auth_headers)
    test_endpoint('GET', '/api/admin/users/1', headers=auth_headers)
    
    # Player Cards APIs
    test_endpoint('GET', '/api/player-cards')
    test_endpoint('GET', '/api/player-cards/player/1')
    test_endpoint('GET', '/api/player-cards/course/11')
    test_endpoint('GET', '/api/user/chart-data', headers=auth_headers)
    
    # Courses APIs
    test_endpoint('GET', '/api/courses')
    test_endpoint('GET', '/api/courses/list-names')
    test_endpoint('GET', '/api/courses/11')
    test_endpoint('GET', '/api/courses/11/tees')
    
    # Courses Data APIs
    test_endpoint('GET', '/api/coursesData/course-names')
    test_endpoint('GET', '/api/coursesData/course-data/11')
    test_endpoint('GET', '/api/coursesData/course-hole-data/11')
    test_endpoint('GET', '/api/coursesData/tee-types')
    
    # Handicap Calculation APIs
    test_endpoint('GET', '/api/handicap-calc')
    test_endpoint('GET', '/api/handicap-calc/view/1')
    
    # News APIs
    test_endpoint('GET', '/api/golf-news')
    
    # Miscellaneous APIs
    test_endpoint('GET', '/api/random-quote')
    
    print(f"\n{Fore.YELLOW}API testing completed!")

if __name__ == "__main__":
    main()
