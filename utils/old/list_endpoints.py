#!/usr/bin/env python3
import argparse


def main():
    parser = argparse.ArgumentParser(description="List all endpoint URLs.")
    parser.add_argument("--base-url", type=str, default="https://localhost",
                        help="Base URL of the endpoints (default: https://localhost)")
    args = parser.parse_args()

    base_url = args.base_url.rstrip('/')
    endpoints = [
        "/api/golf-news",
        "/api/random-quote",
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/profile"
    ]

    full_urls = [f"{base_url}{endpoint}" for endpoint in endpoints]

    print("Endpoint URLs:")
    for url in full_urls:
        print(url)


if __name__ == "__main__":
    main()