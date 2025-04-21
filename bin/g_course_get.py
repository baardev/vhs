#!/usr/bin/env python3
"""
Fetch course rating tables from the USGA NCRDB.

Reads a list of URLs from   course_links.txt   (one per line, optionally prefixed
with "@") that look like:
    https://ncrdb.usga.org/courseTeeInfo?CourseID=26860

For each link it:
  1. Extracts the CourseID query parameter.
  2. Downloads the page.
  3. Extracts all HTML elements with class  tableBorderDisplay  (the ratings
     tables) and writes them to  <CourseID>.html  next to this script.

Requires:  requests, beautifulsoup4
"""
from __future__ import annotations

import os
import sys
import urllib.parse as up
import random
import time

import requests
from bs4 import BeautifulSoup

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
LINKS_FILE = os.path.join(SCRIPT_DIR, "course_links.txt")


def extract_course_id(url: str) -> str | None:
    """Return the CourseID value from the query string (case insensitive)."""
    parsed = up.urlparse(url)
    qs = up.parse_qs(parsed.query)
    # handle CourseID or courseID
    for key in ("CourseID", "courseID", "courseId"):
        if key in qs and qs[key]:
            return qs[key][0]
    return None


def fetch_and_save(url: str, course_id: str) -> None:
    try:
        resp = requests.get(url, timeout=20)
        resp.raise_for_status()
    except Exception as exc:
        print(f"[ERROR] Failed to fetch {url}: {exc}", file=sys.stderr)
        return

    soup = BeautifulSoup(resp.text, "html.parser")
    tables = soup.find_all(class_="tableBorderDisplay")
    if not tables:
        print(f"[WARN] No tableBorderDisplay elements found for CourseID={course_id}")
        content = resp.text  # fall back to full body just in case
    else:
        content = "\n".join(str(t) for t in tables)

    out_path = os.path.join(SCRIPT_DIR, f"{course_id}.html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"[OK] Saved {out_path}")


def main() -> None:
    if not os.path.isfile(LINKS_FILE):
        print(f"Links file not found: {LINKS_FILE}", file=sys.stderr)
        sys.exit(1)

    with open(LINKS_FILE, "r", encoding="utf-8") as f:
        for line in f:
            url = line.strip()
            if not url:
                continue  # skip blanks
            if url.startswith("@"):  # strip optional leading '@'
                url = url[1:]

            course_id = extract_course_id(url)
            if not course_id:
                print(f"[SKIP] Cannot find CourseID in: {url}", file=sys.stderr)
                continue
            fetch_and_save(url, course_id)
            # Pause between 5 and 20 seconds to be polite to the server
            pause = random.uniform(50, 150)
            print(f"[PAUSE] Sleeping {pause:.1f}s...")
            time.sleep(pause)


if __name__ == "__main__":
    main()
