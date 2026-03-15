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

    audio_file = f"{TEMP_FOLDER}/{uid}.mp3"

    segments = [0, 20, 60, 120]

    samples = []

    print("1️⃣ Getting YouTube stream URL...")

    stream_url = None

    ydl_opts = {
        "quiet": True,
        "format": "bestaudio",
        "noplaylist": True
    }

    try:

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:

            info = ydl.extract_info(url, download=False)

            formats = info.get("formats", [])

            for f in formats:

                if f.get("acodec") != "none":

                    stream_url = f.get("url")

                    break

    except Exception as e:

        print("🚨 STREAM ERROR:", e)

        return []

    if not stream_url:

        print("🚨 SCAN ERROR: Could not obtain stream URL")

        return []

    print("2️⃣ Downloading first 120 seconds via ffmpeg...")

    try:

        subprocess.run([
            "ffmpeg",
            "-y",
            "-ss",
            "0",
            "-i",
            stream_url,
            "-t",
            "120",
            "-vn",
            "-acodec",
            "mp3",
            audio_file
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL)

    except Exception as e:

        print("🚨 FFMPEG ERROR:", e)

        return []

    if not os.path.exists(audio_file):

        print("🚨 SCAN ERROR: Audio file not created")

        return []

    print("3️⃣ Creating samples...")

    for i, start in enumerate(segments):

        sample_file = f"{TEMP_FOLDER}/{uid}_sample{i}.mp3"

        subprocess.run([
            "ffmpeg",
            "-y",
            "-ss",
            str(start),
            "-i",
            audio_file,
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

    print("4️⃣ Sending samples to ACRCloud...")

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

    print("5️⃣ Cleaning temp files...")

    try:

        if os.path.exists(audio_file):

            os.remove(audio_file)

        for sample in samples:

            os.remove(sample)

    except Exception as e:

        print("Cleanup error:", e)

    print("===== SCAN COMPLETE =====\n")

    return matches
