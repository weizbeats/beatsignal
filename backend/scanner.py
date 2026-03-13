import yt_dlp
import subprocess
import os
import uuid

from engines.acrcloud_engine import recognize_audio

TEMP_FOLDER = "temp"


def scan_url(url):

    print("\n===== BEATSIGNAL SCAN START =====")

    os.makedirs(TEMP_FOLDER, exist_ok=True)

    uid = str(uuid.uuid4())

    audio_file = f"{TEMP_FOLDER}/{uid}.%(ext)s"
    sample_file = f"{TEMP_FOLDER}/{uid}_sample.mp3"

    print("1️⃣ Downloading audio from YouTube...")

    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": audio_file,
        "quiet": True,
        "noplaylist": True
    }

    try:

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:

            info = ydl.extract_info(url, download=True)

            downloaded_file = ydl.prepare_filename(info)

        print("✅ Audio downloaded")

        print("2️⃣ Creating 20 second sample...")

        subprocess.run([
            "ffmpeg",
            "-y",
            "-i",
            downloaded_file,
            "-t",
            "20",
            "-acodec",
            "mp3",
            sample_file
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL)

        if not os.path.exists(sample_file):

            print("🚨 Sample was not created")

            return []

        print("✅ Sample ready")

        print("3️⃣ Sending audio to ACRCloud...")

        matches = recognize_audio(sample_file)

        print("✅ Recognition finished")

        if matches:

            print(f"🎵 Matches found: {len(matches)}")

        else:

            print("❌ No matches found")

        print("4️⃣ Cleaning temp files...")

        try:

            if os.path.exists(downloaded_file):
                os.remove(downloaded_file)

            if os.path.exists(sample_file):
                os.remove(sample_file)

        except Exception as e:

            print("Temp cleanup error:", e)

        print("===== SCAN COMPLETE =====\n")

        return matches

    except Exception as e:

        print("🚨 SCAN ERROR:", e)

        return []
