#!/usr/bin/env python3
"""
Convert course rating HTML tables (previously downloaded by g_course_get.py) into
CSV files.

Reads a list of local HTML filenames from   html.list  (one per line). For each
file it:
  • infers the courseID from the filename stem (e.g. 26860.html → 26860)
  • parses all <table class="tableBorderDisplay"> elements
  • writes their contents to <courseID>.csv   (one large table; multiple source
    tables are concatenated one after another with a blank row in between).

Dependencies:  beautifulsoup4
"""
from __future__ import annotations

import csv
import os
import sys
from pathlib import Path
from typing import List

from bs4 import BeautifulSoup

SCRIPT_DIR = Path(__file__).resolve().parent
LIST_FILE = SCRIPT_DIR / "html.list"


def extract_rows(table) -> List[List[str]]:
    """Return table rows as list-of-lists of strings."""
    rows: List[List[str]] = []
    for tr in table.find_all("tr"):
        cells = tr.find_all(["th", "td"])
        if not cells:
            continue
        row = [" ".join(c.get_text(strip=True).split()) for c in cells]
        rows.append(row)
    return rows


def write_csv(course_id: str, rows: List[List[str]]) -> None:
    out_path = SCRIPT_DIR / f"{course_id}.csv"
    with out_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        for r in rows:
            writer.writerow(r)
    print(f"[OK] {out_path.relative_to(SCRIPT_DIR)} written ({len(rows)} rows)")


def process_file(html_path: Path) -> None:
    course_id = html_path.stem  # "26860.html" -> "26860"
    try:
        html_text = html_path.read_text(encoding="utf-8", errors="ignore")
    except Exception as exc:
        print(f"[ERROR] Cannot read {html_path}: {exc}", file=sys.stderr)
        return

    soup = BeautifulSoup(html_text, "html.parser")
    tables = soup.find_all(class_="tableBorderDisplay")
    if not tables:
        print(f"[WARN] No tables found in {html_path.name}")
        return

    all_rows: List[List[str]] = []
    for idx, t in enumerate(tables):
        rows = extract_rows(t)
        if idx and rows:
            all_rows.append([])  # blank line to separate tables
        all_rows.extend(rows)

    write_csv(course_id, all_rows)


def main() -> None:
    if not LIST_FILE.exists():
        print(f"List file not found: {LIST_FILE}", file=sys.stderr)
        sys.exit(1)

    with LIST_FILE.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            html_path = (SCRIPT_DIR / line).resolve()
            if not html_path.is_file():
                print(f"[SKIP] Not found: {html_path}", file=sys.stderr)
                continue
            process_file(html_path)


if __name__ == "__main__":
    main()
