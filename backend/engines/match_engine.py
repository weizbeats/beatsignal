import json
import os
from difflib import SequenceMatcher

DB_PATH = "database/beats.json"


def load_beats():

    if not os.path.exists(DB_PATH):
        return []

    with open(DB_PATH, "r") as f:
        return json.load(f)


def similarity(a, b):

    return SequenceMatcher(None, a, b).ratio()


def match_song(song_title, artist):

    beats = load_beats()

    best_match = None
    best_score = 0

    for beat in beats:

        score = similarity(
            song_title.lower(),
            beat["name"].lower()
        )

        if score > best_score:

            best_score = score
            best_match = beat

    if best_match and best_score > 0.6:

        return {
            "beat": best_match["name"],
            "producer": best_match["producer"],
            "score": round(best_score, 2)
        }

    return None
