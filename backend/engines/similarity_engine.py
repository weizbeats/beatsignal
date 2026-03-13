import librosa
import numpy as np
import json
import os

DB_PATH = "database/beats_db.json"


def load_db():

    if not os.path.exists(DB_PATH):
        return []

    with open(DB_PATH, "r") as f:
        return json.load(f)


def save_db(data):

    with open(DB_PATH, "w") as f:
        json.dump(data, f)


def create_fingerprint(audio_file):

    y, sr = librosa.load(audio_file)

    mfcc = librosa.feature.mfcc(y=y, sr=sr)

    fingerprint = np.mean(mfcc, axis=1)

    return fingerprint.tolist()


def add_beat(audio_file, name):

    db = load_db()

    fp = create_fingerprint(audio_file)

    db.append({
        "name": name,
        "fingerprint": fp
    })

    save_db(db)


def search_similar(audio_file):

    db = load_db()

    if len(db) == 0:
        return []

    query_fp = np.array(create_fingerprint(audio_file))

    matches = []

    for beat in db:

        stored = np.array(beat["fingerprint"])

        similarity = np.corrcoef(query_fp, stored)[0,1]

        if similarity > 0.80:

            matches.append({
                "beat": beat["name"],
                "similarity": float(similarity)
            })

    return matches
