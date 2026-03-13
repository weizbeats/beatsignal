import requests
import urllib.parse


def search_musicbrainz(title, artist):

    try:

        query = urllib.parse.quote(f'recording:"{title}" AND artist:"{artist}"')

        url = f"https://musicbrainz.org/ws/2/recording/?query={query}&fmt=json"

        r = requests.get(url, headers={"User-Agent": "BeatSignal/1.0"})

        data = r.json()

        recordings = data.get("recordings", [])

        if not recordings:
            return None

        rec = recordings[0]

        isrc = None
        release_id = None

        if "isrcs" in rec:
            isrc = rec["isrcs"][0]

        if "releases" in rec:
            release_id = rec["releases"][0]["id"]

        return {
            "isrc": isrc,
            "release_id": release_id
        }

    except:

        return None


def get_cover(release_id):

    if not release_id:
        return None

    try:

        url = f"https://coverartarchive.org/release/{release_id}/front"

        r = requests.get(url)

        if r.status_code == 200:
            return url

    except:
        pass

    return None


def search_deezer(title, artist):

    try:

        query = urllib.parse.quote(f"{title} {artist}")

        url = f"https://api.deezer.com/search?q={query}"

        r = requests.get(url)

        data = r.json()

        if not data["data"]:
            return None

        track = data["data"][0]

        return {
            "cover": track["album"]["cover_medium"],
            "album": track["album"]["title"],
            "artist": track["artist"]["name"]
        }

    except:

        return None
