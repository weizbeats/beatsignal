import json
import os

DB_PATH = "database/scans.json"


def save_scan(url, results):

    if not os.path.exists(DB_PATH):
        with open(DB_PATH, "w") as f:
            json.dump([], f)

    with open(DB_PATH, "r") as f:
        data = json.load(f)

    data.append({
        "url": url,
        "results": results
    })

    with open(DB_PATH, "w") as f:
        json.dump(data, f, indent=2)
