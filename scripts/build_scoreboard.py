#!/usr/bin/env python3
import json
import os

ROOT = os.path.dirname(os.path.dirname(__file__))
DATA_PATH = os.path.join(ROOT, "site", "data", "results.json")


def main():
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError("Run validate_results.py to generate site/data/results.json")
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    # Placeholder for future transformations; currently pass-through.
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"Wrote {os.path.relpath(DATA_PATH, ROOT)}")


if __name__ == "__main__":
    main()
