import json
import os
from collections import defaultdict

DB = "database/fingerprints.json"


def load_db():

    if not os.path.exists(DB):
        return []

    with open(DB, "r") as f:
        return json.load(f)


def save_db(data):

    with open(DB, "w") as f:
        json.dump(data, f, indent=2)


def add_fingerprint(beat_name, producer, hashes):

    db = load_db()

    db.append({
        "beat": beat_name,
        "producer": producer,
        "hashes": hashes
    })

    save_db(db)


def match_fingerprint(hashes):

    db = load_db()

    matches = defaultdict(int)

    for beat in db:

        stored = beat["hashes"]

        stored_dict = {}

        for h, offset in stored:
            stored_dict.setdefault(h, []).append(offset)

        for h, offset in hashes:

            if h in stored_dict:

                for stored_offset in stored_dict[h]:

                    delta = stored_offset - offset
                    key = (beat["beat"], delta)

                    matches[key] += 1

    if not matches:
        return None

    best = max(matches, key=matches.get)

    beat_name = best[0]
    score = matches[best]

    if score < 10:
        return None

    for beat in db:

        if beat["beat"] == beat_name:

            return {
                "beat": beat["beat"],
                "producer": beat["producer"],
                "score": score
            }

    return None
