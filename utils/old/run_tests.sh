#!/bin/bash

# Install dependencies if not already installed
pip install -r requirements.txt

echo "==============================================="
echo "Running API endpoint tests..."
echo "==============================================="
./test_api_endpoints.py

echo -e "\n\n==============================================="
echo "Running authentication tests..."
echo "==============================================="
./test_auth.py

echo -e "\n\n==============================================="
echo "Running site URL tests..."
echo "==============================================="
./test_site_urls.py --delay 0.5

echo -e "\n\n==============================================="
echo "All tests completed!"
echo "Results available in:"
echo "- api_test_results.json"
echo "- auth_test_results.json"
echo "- site_test_results.txt"
echo "==============================================="