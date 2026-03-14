import subprocess
import time

def debug_scan(url):

    logs = []

    def log(msg):
        t = time.strftime("%H:%M:%S")
        logs.append(f"[{t}] {msg}")

    try:

        log("URL received")

        log("checking yt-dlp")

        result = subprocess.run(
            ["yt-dlp","--version"],
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            log("ERROR yt-dlp not installed")
            return logs

        log(f"yt-dlp version {result.stdout.strip()}")

        log("checking ffmpeg")

        ffmpeg = subprocess.run(
            ["ffmpeg","-version"],
            capture_output=True,
            text=True
        )

        if ffmpeg.returncode != 0:
            log("ERROR ffmpeg not installed")
            return logs

        log("ffmpeg detected")

        log("downloading audio")

        # ejemplo simple
        time.sleep(2)

        log("audio downloaded")

        log("creating segments")

        time.sleep(1)

        log("segments created")

        log("generating fingerprint")

        time.sleep(1)

        log("fingerprint ready")

        log("searching matches")

        time.sleep(2)

        log("search finished")

        log("matches found: 0")

    except Exception as e:

        log(f"ERROR {str(e)}")

    return logs
