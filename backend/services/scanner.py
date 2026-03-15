import yt_dlp
import subprocess
import os
import uuid

from engines.acrcloud_engine import recognize_audio

TEMP_FOLDER = "temp"
COOKIES_FILE = "cookies.txt"


def scan_url(url):

    print("\n===== BEATSIGNAL SCAN START =====")

    os.makedirs(TEMP_FOLDER, exist_ok=True)

    uid = str(uuid.uuid4())

    audio_file = f"{TEMP_FOLDER}/{uid}.%(ext)s"

    # SEGMENTOS
    segments = [0, 20, 60, 120]

    samples = []

    print("1️⃣ Downloading audio from YouTube...")

    ydl_opts = {
        "format": "bestaudio",
        "outtmpl": audio_file,
        "quiet": True,
        "noplaylist": True,
        "cookiefile": COOKIES_FILE,
        "extractor_args": {
            "youtube": {
                "player_client": ["web"]
            }
        },
        "http_headers": {
            "User-Agent": "Mozilla/5.0"
        }
    }

    try:

        if not os.path.exists(COOKIES_FILE):
            print("⚠ cookies.txt not found, attempting download without cookies")

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:

            info = ydl.extract_info(url, download=True)

            downloaded_file = ydl.prepare_filename(info)

        print("✅ Audio downloaded")

        print("2️⃣ Creating samples...")

        for i, start in enumerate(segments):

            sample_file = f"{TEMP_FOLDER}/{uid}_sample{i}.mp3"

            subprocess.run([
                "ffmpeg",
                "-y",
                "-ss",
                str(start),
                "-i",
                downloaded_file,
                "-t",
                "25",
                "-acodec",
                "mp3",
                sample_file
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL)

            if os.path.exists(sample_file):

                print(f"✔ Sample {i+1} created ({start}s)")

                samples.append(sample_file)

        print("3️⃣ Sending samples to ACRCloud...")

        matches = []

        for sample in samples:

            try:

                result = recognize_audio(sample)

                if result:
                    matches.extend(result)

            except Exception as e:

                print("ACRCloud error:", e)

        print("✅ Recognition finished")

        unique_matches = []
        seen = set()

        for track in matches:

            try:

                key = (track["song"], track["artist"])

                if key not in seen:

                    seen.add(key)
                    unique_matches.append(track)

            except:
                continue

        matches = unique_matches

        print(f"🎵 Unique matches found: {len(matches)}")

        print("4️⃣ Cleaning temp files...")

        try:

            if os.path.exists(downloaded_file):
                os.remove(downloaded_file)

            for sample in samples:
                os.remove(sample)

        except Exception as e:

            print("Cleanup error:", e)

        print("===== SCAN COMPLETE =====\n")

        return matches

    except Exception as e:

        print("🚨 SCAN ERROR:", str(e))

        return []
