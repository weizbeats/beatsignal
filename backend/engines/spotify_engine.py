import requests
import os
import re

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")


def get_access_token():

    url = "https://accounts.spotify.com/api/token"

    response = requests.post(
        url,
        data={"grant_type": "client_credentials"},
        auth=(CLIENT_ID, CLIENT_SECRET)
    )

    data = response.json()

    return data.get("access_token")


def clean_title(title):

    title = re.sub(r"\(.*?\)", "", title)
    title = re.sub(r"\[.*?\]", "", title)
    title = re.sub(r"official|video|audio", "", title, flags=re.IGNORECASE)

    return title.strip()


def get_track_by_isrc(isrc):

    token = get_access_token()

    headers = {
        "Authorization": f"Bearer {token}"
    }

    url = f"https://api.spotify.com/v1/search?q=isrc:{isrc}&type=track"

    r = requests.get(url, headers=headers)

    data = r.json()

    items = data.get("tracks", {}).get("items", [])

    if not items:
        return None

    track = items[0]

    return {
        "spotify_url": track["external_urls"]["spotify"],
        "release_date": track["album"]["release_date"],
        "isrc": track["external_ids"]["isrc"],
        "cover": track["album"]["images"][0]["url"] if track["album"]["images"] else None
    }


def search_spotify_track(title, artist):

    token = get_access_token()

    headers = {
        "Authorization": f"Bearer {token}"
    }

    clean = clean_title(title)

    query = f"{clean} {artist}".strip()

    url = f"https://api.spotify.com/v1/search?q={query}&type=track&limit=5"

    r = requests.get(url, headers=headers)

    data = r.json()

    items = data.get("tracks", {}).get("items", [])

    if not items:
        return None

    track = items[0]

    return {
        "spotify_url": track["external_urls"]["spotify"],
        "release_date": track["album"]["release_date"],
        "isrc": track["external_ids"]["isrc"],
        "cover": track["album"]["images"][0]["url"] if track["album"]["images"] else None
    }
