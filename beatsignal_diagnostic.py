import requests
import time
import traceback
from datetime import datetime

BACKEND = "https://beatsignal-production.up.railway.app"
FRONTEND = "https://beatsignal-2uec.vercel.app"

TEST_VIDEO = "https://www.youtube.com/watch?v=jNQXAC9IVRw"

LOG_FILE = "diagnostic.log"


# ==========================================
# LOGGER
# ==========================================

def log(message):

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    line = f"[{timestamp}] {message}"

    print(line)

    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line + "\n")


log("\n============================================================")
log("BEATSIGNAL DIAGNOSTIC V5 START")
log("============================================================\n")


# ==========================================
# FRONTEND TEST
# ==========================================

log("FRONTEND TEST")

try:

    r = requests.get(FRONTEND, timeout=10)

    log(f"Status: {r.status_code}")
    log(f"Content length: {len(r.text)}")

    if r.status_code == 200:
        log("Frontend reachable ✓")

except Exception as e:

    log("Frontend ERROR")
    log(str(e))
    log(traceback.format_exc())

log("------------------------------------------------------------\n")


# ==========================================
# BACKEND TEST
# ==========================================

log("BACKEND ROOT TEST")

try:

    r = requests.get(BACKEND, timeout=10)

    log(f"Status: {r.status_code}")

except Exception as e:

    log("Backend ERROR")
    log(str(e))
    log(traceback.format_exc())

log("------------------------------------------------------------\n")


# ==========================================
# DOCS TEST
# ==========================================

log("DOCS ENDPOINT TEST")

try:

    r = requests.get(BACKEND + "/docs", timeout=10)

    log(f"Status: {r.status_code}")

    if r.status_code == 200:
        log("Docs endpoint accessible ✓")

except Exception as e:

    log("Docs ERROR")
    log(str(e))
    log(traceback.format_exc())

log("------------------------------------------------------------\n")


# ==========================================
# SCAN DIAGNOSTIC
# ==========================================

log("SCAN DIAGNOSTIC ENDPOINT")

try:

    r = requests.get(BACKEND + "/scan-diagnostic", timeout=10)

    if r.status_code == 200:

        data = r.json()

        log(f"Backend: {data.get('backend')}")
        log(f"FFMPEG: {data.get('ffmpeg')}")
        log(f"YT-DLP: {data.get('yt_dlp')}")
        log(f"Scanner: {data.get('scanner')}")

    else:

        log("Diagnostic endpoint returned unexpected status")

except Exception as e:

    log("Diagnostic ERROR")
    log(str(e))
    log(traceback.format_exc())

log("------------------------------------------------------------\n")


# ==========================================
# SCAN TEST
# ==========================================

log("SCAN ENDPOINT TEST")

payload = {
    "url": TEST_VIDEO,
    "token": "test_token"
}

try:

    start = time.time()

    r = requests.post(BACKEND + "/scan", json=payload, timeout=60)

    elapsed = round(time.time() - start, 2)

    log(f"HTTP status: {r.status_code}")
    log(f"Response time: {elapsed}s")

    log("RAW RESPONSE:")
    log(r.text)

    try:

        data = r.json()

        if data.get("error") == "invalid_token":

            log("AUTHENTICATION FAILED")
            log("Scan rejected due to invalid token")

        elif data.get("status") == "error":

            log("SCAN ENGINE ERROR")
            log(str(data))

        elif data.get("status") == "success":

            results = data.get("results", [])

            log(f"SCAN SUCCESS")
            log(f"Matches found: {len(results)}")

        else:

            log("UNKNOWN RESPONSE FORMAT")

    except:

        log("Response is not JSON")

except Exception as e:

    log("SCAN REQUEST FAILED")
    log(str(e))
    log(traceback.format_exc())

log("------------------------------------------------------------\n")


log("DIAGNOSTIC COMPLETE")
log("Results saved to diagnostic.log")
