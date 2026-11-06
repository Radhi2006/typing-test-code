# @codetype medium | Summarize sales per region from a CSV file
import csv
from collections import defaultdict


def sales_by_region(path: str) -> dict[str, float]:
    totals: dict[str, float] = defaultdict(float)
    with open(path, newline="", encoding="utf-8") as file:
        for row in csv.DictReader(file):
            totals[row["region"]] += float(row["amount"])
    return dict(sorted(totals.items(), key=lambda kv: kv[1], reverse=True))


if __name__ == "__main__":
    for region, total in sales_by_region("sales.csv").items():
        print(f"{region:<12}{total:>12,.2f}")
