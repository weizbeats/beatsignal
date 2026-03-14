import requests
import time
import json

FRONTEND = "https://beatsignal-2uec.vercel.app"
BACKEND = "https://beatsignal-production.up.railway.app"

SCAN = BACKEND + "/scan"
DOCS = BACKEND + "/docs"

TEST_VIDEO = "https://www.youtube.com/watch?v=jNQXAC9IVRw"

TOKEN = ""   # opcional si tu backend usa auth

log_file = open("diagnostic_log.txt","w",encoding="utf-8")


def log(msg):
    print(msg)
    log_file.write(msg+"\n")


def section(title):
    line = "="*60
    log("\n"+line)
    log(title)
    log(line)


def separator():
    log("-"*60)


def analyze_error(data):

    if not isinstance(data,dict):
        return

    if "error" not in data:
        return

    err = data["error"]

    section("ERROR ANALYSIS")

    log(f"Backend returned error: {err}")

    if err == "invalid_token":

        log("\nCause detected:")
        log("Authentication layer rejected the request.")

        log("\nSuggested fix:")
        log("Add Authorization token to the diagnostic tool.")

    elif err == "credits_exceeded":

        log("\nCause detected:")
        log("User ran out of scan credits.")

        log("\nSuggested fix:")
        log("Use admin account or refill credits.")

    elif err == "missing_url":

        log("\nCause detected:")
        log("Scan request did not include a video URL.")

    elif err == "scan_failed":

        log("\nCause detected:")
        log("Internal scanner failure.")

        log("\nPossible issues:")
        log("- yt-dlp not installed")
        log("- ffmpeg missing")
        log("- audio extraction failed")

    else:

        log("\nUnknown backend error.")
        log("Check backend logs for details.")


def test_frontend():

    section("FRONTEND TEST")

    try:

        r = requests.get(FRONTEND,timeout=10)

        log(f"URL: {FRONTEND}")
        log(f"Status: {r.status_code}")

        log(f"Content length: {len(r.text)}")

        if r.status_code==200:
            log("Frontend reachable ✓")

    except Exception as e:

        log(f"Frontend ERROR: {e}")


def test_backend():

    section("BACKEND ROOT TEST")

    try:

        r = requests.get(BACKEND,timeout=10)

        log(f"URL: {BACKEND}")
        log(f"Status: {r.status_code}")

    except Exception as e:

        log(f"Backend ERROR: {e}")


def test_docs():

    section("DOCS ENDPOINT TEST")

    try:

        r = requests.get(DOCS,timeout=10)

        log(f"URL: {DOCS}")
        log(f"Status: {r.status_code}")

        if r.status_code==200:
            log("Docs endpoint accessible")

    except Exception as e:

        log(f"/docs ERROR: {e}")


def test_scan():

    section("SCAN ENDPOINT TEST")

    payload = {
        "url": TEST_VIDEO
    }

    headers = {}

    if TOKEN:
        headers["Authorization"] = f"Bearer {TOKEN}"

    try:

        log(f"Scan URL: {SCAN}")
        log(f"Test video: {TEST_VIDEO}")

        start = time.time()

        r = requests.post(
            SCAN,
            json=payload,
            headers=headers,
            timeout=180
        )

        elapsed = time.time()-start

        separator()

        log("HTTP RESPONSE")

        log(f"Status code: {r.status_code}")
        log(f"Response time: {elapsed:.2f}s")

        separator()

        log("RAW RESPONSE")

        log(r.text)

        separator()

        try:

            data = r.json()

            size = len(json.dumps(data))

            log(f"JSON size: {size} chars")

            if isinstance(data,dict):

                log(f"Keys detected: {list(data.keys())}")

            analyze_error(data)

        except Exception as e:

            log("JSON parsing failed")
            log(str(e))

        separator()

        if elapsed < 2:

            log("WARNING: scan finished extremely fast")

            log("Possible causes:")
            log("- authentication rejected")
            log("- scanner returned early")
            log("- request validation failed")

    except Exception as e:

        section("SCAN REQUEST FAILED")

        log(str(e))

        log("\nPossible causes:")
        log("- backend crashed")
        log("- network timeout")
        log("- incorrect endpoint")


def summary():

    section("DIAGNOSTIC SUMMARY")

    log("Diagnostic completed.")

    log("\nIf scans return errors:")

    log("- Check authentication token")
    log("- Verify backend logs in Railway")
    log("- Confirm yt-dlp and ffmpeg availability")



def main():

    section("BEATSIGNAL DIAGNOSTIC V3")

    test_frontend()

    separator()

    test_backend()

    separator()

    test_docs()

    separator()

    test_scan()

    summary()


if __name__ == "__main__":

    main()

    log_file.close()

    print("\nDiagnostic saved to diagnostic_log.txt")

    print("\nPress ENTER to exit...")
    input()
