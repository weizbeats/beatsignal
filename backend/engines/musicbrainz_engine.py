import requests


def get_isrc_and_date(title, artist):

    try:

        query = f'recording:"{title}" AND artist:"{artist}"'

        url = "https://musicbrainz.org/ws/2/recording"

        params = {
            "query": query,
            "fmt": "json",
            "limit": 1
        }

        headers = {
            "User-Agent": "BeatLock/1.0"
        }

        res = requests.get(url, params=params, headers=headers)

        data = res.json()

        if "recordings" in data and len(data["recordings"]) > 0:

            recording = data["recordings"][0]

            isrc = None
            release_date = None

            if "isrcs" in recording:
                isrc = recording["isrcs"][0]

            if "first-release-date" in recording:
                release_date = recording["first-release-date"]

            return {
                "isrc": isrc,
                "release_date": release_date
            }

        return None

    except Exception as e:

        print("MusicBrainz error:", e)

        return None
