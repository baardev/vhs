#!/usr/bin/env python3
"""
Website Crawler and URL Extractor

This script crawls a website (localhost by default) using wget to discover all accessible URLs
and their HTTP response codes. It then parses the wget output and creates a CSV file with
the results.

Requirements:
    - Python 3.x
    - wget command-line tool installed and available in PATH

Usage:
    python3 crawl.py [--url START_URL] [--input INPUT_FILE] [--output OUTPUT_FILE]

Arguments:
    --url       Starting URL for crawling (default: http://localhost)
    --input     Path to wget output file (default: wget_output.txt)
    --output    Path to output CSV file (default: endpoints.csv)

Example:
    python3 crawl.py --url https://example.com --output site_urls.csv

Output:
    A CSV file containing two columns:
    - URL: The full URL of the discovered endpoint
    - Response Code: The HTTP response code returned (e.g., 200, 404, 500)

Note:
    This script is configured to crawl up to 5 levels deep from the starting point
    and will only follow links within the initial domain (--no-parent option).
"""
import argparse
import csv
import re
import subprocess


def run_wget(start_url="http://localhost"):
    # Define the wget command and its arguments
    cmd = [
        "wget",
        "--spider",
        "--recursive",
        "--no-parent",
        "--level=5",
        "--no-check-certificate",
        "-o", "wget_output.txt",
        start_url
    ]
    print(f"Running wget command to crawl {start_url}...")
    subprocess.run(cmd, check=True)
    print("wget command executed successfully.")


def parse_wget_output(input_file):
    data = []
    current_url = None
    with open(input_file, "r") as f:
        for line in f:
            line = line.strip()
            # Look for a line containing a URL with "https"
            if "https" in line:
                url_match = re.search(r"(https?://\S+)", line)
                if url_match:
                    # Remove any trailing punctuation or quotes
                    current_url = url_match.group(1).rstrip('",;')
            # Look for the HTTP response code line
            if "HTTP request sent, awaiting response" in line:
                code_match = re.search(
                    r"HTTP request sent, awaiting response\.*\s+(\d{3})", line
                )
                if code_match and current_url:
                    response_code = code_match.group(1)
                    data.append((current_url, response_code))
                    # Reset the current URL after logging the response code
                    current_url = None
    return data


def write_csv(data, output_file):
    # Remove duplicate entries by converting the list to a set, then back to a sorted list
    unique_data = list(set(data))
    unique_data.sort(key=lambda x: x[0])
    with open(output_file, "w", newline="") as csvfile:
        csvwriter = csv.writer(csvfile)
        # Write header row
        csvwriter.writerow(["URL", "Response Code"])
        for url, code in unique_data:
            csvwriter.writerow([url, code])


def main():
    parser = argparse.ArgumentParser(
        description="Run wget to generate output and parse it to create a CSV file with endpoint URLs and their response codes."
    )
    parser.add_argument(
        "--url",
        type=str,
        default="http://localhost",
        help="Starting URL for crawling (default: http://localhost)",
    )
    parser.add_argument(
        "--input",
        type=str,
        default="wget_output.txt",
        help="Input wget output file (default: wget_output.txt)",
    )
    parser.add_argument(
        "--output",
        type=str,
        default="endpoints.csv",
        help="Output CSV file (default: endpoints.csv)",
    )
    args = parser.parse_args()

    # Execute the wget command to generate the output file
    run_wget(args.url)

    # Parse wget output to extract endpoints and response codes
    endpoints = parse_wget_output(args.input)
    write_csv(endpoints, args.output)
    print(f"CSV file '{args.output}' generated with {len(endpoints)} endpoints (duplicates removed).")


if __name__ == "__main__":
    main()
