#!/usr/bin/env python3
import argparse
import datetime


def main():
    parser = argparse.ArgumentParser(description="Generate a sitemap.xml for the site.")
    parser.add_argument("--base-url", type=str, default="https://localhost", help="Base URL of the site (default: https://localhost)")
    args = parser.parse_args()

    base_url = args.base_url.rstrip('/')
    # Define endpoints including the homepage
    endpoints = [
        "/",  # homepage
        "/api/golf-news",
        "/api/random-quote",
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/profile"
    ]

    today = datetime.date.today().isoformat()

    sitemap_lines = []
    sitemap_lines.append('<?xml version="1.0" encoding="UTF-8"?>')
    sitemap_lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

    for endpoint in endpoints:
        sitemap_lines.append("  <url>")
        sitemap_lines.append(f"    <loc>{base_url}{endpoint}</loc>")
        sitemap_lines.append(f"    <lastmod>{today}</lastmod>")
        changefreq = "daily" if endpoint == "/" else "monthly"
        priority = "1.0" if endpoint == "/" else "0.5"
        sitemap_lines.append(f"    <changefreq>{changefreq}</changefreq>")
        sitemap_lines.append(f"    <priority>{priority}</priority>")
        sitemap_lines.append("  </url>")

    sitemap_lines.append("</urlset>")

    sitemap_content = "\n".join(sitemap_lines)

    with open("sitemap.xml", "w") as f:
        f.write(sitemap_content)

    print("sitemap.xml generated.")


if __name__ == "__main__":
    main()