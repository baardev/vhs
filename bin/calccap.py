#!/bin/env python
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# 1. Simulate course variables CSV
courses = pd.DataFrame([{
    "course_name": "Augusta National Golf Club",
    "par": 72,
    "yardage": 7485,
    "course_rating": 76.2,
    "slope_rating": 148
}])
courses.to_csv("courses.csv", index=False)

# 2. Simulate eight scorecards CSV
np.random.seed(42)
start_date = datetime.today() - timedelta(days=90)
scores = []
for i in range(1, 9):
    scores.append({
        "round_id": i,
        "date": (start_date + timedelta(days=i*7)).strftime("%Y-%m-%d"),
        "course_name": "Augusta National Golf Club",
        # Simulate gross scores around 85 (±5 strokes)
        "gross_score": int(np.random.normal(loc=85, scale=5))
    })
scores_df = pd.DataFrame(scores)
scores_df.to_csv("scores.csv", index=False)

# 3. Read CSVs and merge
courses_df = pd.read_csv("courses.csv")
scores_df = pd.read_csv("scores.csv")
df = scores_df.merge(courses_df, on="course_name")

# 4. Calculate score differentials: (Gross – Rating) × 113 / Slope
df["differential"] = (df["gross_score"] - df["course_rating"]) * 113 / df["slope_rating"]

# 5. Handicap Index calculation: average of best 8 diffs × 0.96
best_eight = df["differential"].nsmallest(8)
handicap_index = best_eight.mean() * 0.96

# 6. Output results
print("Augusta National Golf Club variables:\n", courses_df.to_string(index=False))
print("\nSimulated scores:\n", scores_df.to_string(index=False))
print("\nScore Differentials:\n", df[["round_id", "gross_score", "differential"]].to_string(index=False))
print(f"\nHandicap Index (best 8 of 8 × 0.96): {handicap_index:.1f}")
