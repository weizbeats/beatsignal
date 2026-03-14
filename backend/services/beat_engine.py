import json
import os
from engines.fingerprint_engine import create_fingerprint

DB_PATH = "database/beats_db.json"


def load_beats():

    if not os.path.exists(DB_PATH):
        return []

    with open(DB_PATH, "r") as f:
        return json.load(f)


def save_beats(data):

    with open(DB_PATH, "w") as f:
        json.dump(data, f)


def add_beat(audio_file, name):

    beats = load_beats()

    fingerprint = create_fingerprint(audio_file)

    beats.append({
        "name": name,
        "fingerprint": fingerprint
    })

    save_beats(beats)


def get_beats():

    return load_beats()
