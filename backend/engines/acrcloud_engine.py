import requests
import time
import hashlib
import hmac
import base64
import os
import re

from engines.metadata_engine import search_deezer
from engines.spotify_engine import get_track_by_isrc
from engines.spotify_engine import search_spotify_track


HOST = "identify-eu-west-1.acrcloud.com"

ACCESS_KEY = os.getenv("ACR_KEY")
ACCESS_SECRET = os.getenv("ACR_SECRET")

if not ACCESS_KEY or not ACCESS_SECRET:
    raise Exception("ACRCloud credentials not loaded from .env")


def clean_title(title):

    title = re.sub(r"\(.*?\)", "", title)
    title = re.sub(r"\[.*?\]", "", title)
    title = re.sub(r"official|video|audio", "", title, flags=re.IGNORECASE)

    return title.strip()


def recognize_audio(audio_file):

    http_method = "POST"
    http_uri = "/v1/identify"
    data_type = "audio"
    signature_version = "1"

    timestamp = str(int(time.time()))

    string_to_sign = "\n".join([
        http_method,
        http_uri,
        ACCESS_KEY,
        data_type,
        signature_version,
        timestamp
    ])

    sign = base64.b64encode(
        hmac.new(
            ACCESS_SECRET.encode("ascii"),
            string_to_sign.encode("ascii"),
            digestmod=hashlib.sha1
        ).digest()
    ).decode("ascii")

    sample_bytes = os.path.getsize(audio_file)

    try:

        with open(audio_file, "rb") as f:

            files = {"sample": f}

            data = {
                "access_key": ACCESS_KEY,
                "sample_bytes": sample_bytes,
                "timestamp": timestamp,
                "signature": sign,
                "data_type": data_type,
                "signature_version": signature_version
            }

            url = f"https://{HOST}{http_uri}"

            response = requests.post(url, files=files, data=data)

        result = response.json()

        if result.get("status", {}).get("msg") != "Success":
            return []

        metadata = result.get("metadata")

        if not metadata:
            return []

        music_list = metadata.get("music")

        if not music_list:
            return []

        matches = []

        for music in music_list:

            title = music.get("title", "")
            clean = clean_title(title)

            artist = ""

            if music.get("artists"):
                artist = music["artists"][0].get("name", "")

            score = music.get("score", 100)

            isrc = None
            release_date = None
            spotify_url = None
            cover = None

            if "external_ids" in music:
                isrc = music["external_ids"].get("isrc")

            if isrc:

                spotify = get_track_by_isrc(isrc)

                if spotify:

                    spotify_url = spotify.get("spotify_url")
                    release_date = spotify.get("release_date")
                    cover = spotify.get("cover")

            if not isrc:

                spotify = search_spotify_track(clean, artist)

                if spotify:

                    isrc = spotify.get("isrc")
                    spotify_url = spotify.get("spotify_url")
                    release_date = spotify.get("release_date")
                    cover = spotify.get("cover")

            if not cover:

                meta = search_deezer(title, artist)

                if meta:
                    cover = meta.get("cover")

            matches.append({
                "song": title,
                "artist": artist,
                "score": score,
                "cover": cover,
                "isrc": isrc,
                "release_date": release_date,
                "spotify_url": spotify_url
            })

        return matches

    except Exception as e:

        print("ACRCloud error:", e)

        return []
