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

    sample1 = f"{TEMP_FOLDER}/{uid}_sample1.mp3"
    sample2 = f"{TEMP_FOLDER}/{uid}_sample2.mp3"

    print("1️⃣ Downloading audio from YouTube...")

    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": audio_file,
        "quiet": True,
        "noplaylist": True,
        "cookiefile": COOKIES_FILE,
        "http_headers": {
            "User-Agent": "Mozilla/5.0"
        }
    }

    try:

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:

            info = ydl.extract_info(url, download=True)

            downloaded_file = ydl.prepare_filename(info)

        print("✅ Audio downloaded")

        print("2️⃣ Creating samples...")

        # SAMPLE 1 (0 → 20s)

        subprocess.run([
            "ffmpeg",
            "-y",
            "-i",
            downloaded_file,
            "-t",
            "20",
            "-acodec",
            "mp3",
            sample1
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL)

        # SAMPLE 2 (40 → 60s)

        subprocess.run([
            "ffmpeg",
            "-y",
            "-i",
            downloaded_file,
            "-ss",
            "40",
            "-t",
            "20",
            "-acodec",
            "mp3",
            sample2
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL)

        print("✅ Samples ready")

        print("3️⃣ Sending samples to ACRCloud...")

        matches = []

        if os.path.exists(sample1):

            r1 = recognize_audio(sample1)

            if r1:
                matches.extend(r1)

        if os.path.exists(sample2):

            r2 = recognize_audio(sample2)

            if r2:
                matches.extend(r2)

        print("✅ Recognition finished")

        # =========================
        # REMOVE DUPLICATES
        # =========================

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

        print(f"🎵 Unique matches: {len(matches)}")

        print("4️⃣ Cleaning temp files...")

        try:

            if os.path.exists(downloaded_file):
                os.remove(downloaded_file)

            if os.path.exists(sample1):
                os.remove(sample1)

            if os.path.exists(sample2):
                os.remove(sample2)

        except Exception as e:

            print("Cleanup error:", e)

        print("===== SCAN COMPLETE =====\n")

        return matches

    except Exception as e:

        print("🚨 SCAN ERROR:", str(e))

        return []
