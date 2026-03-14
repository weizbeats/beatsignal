import customtkinter as ctk
import requests
import subprocess
import socket
import threading
import shutil
import os
import time
import sys
import webbrowser

ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("dark-blue")

BACKEND_LOCAL = "http://127.0.0.1:8000"
BACKEND_ONLINE = "https://beatsignal-production.up.railway.app"

FRONTEND_LOCAL = "http://localhost:3000"
FRONTEND_ONLINE = "https://beatsignal-2uec.vercel.app"

ACRCLOUD = "https://console.acrcloud.com"

backend_process = None


# =========================
# FAST CHECKS
# =========================

def check_port(port):

    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(1)

    result = s.connect_ex(("127.0.0.1", port))

    s.close()

    return result == 0


def check_url(url):

    try:
        r = requests.get(url, timeout=3)
        return r.status_code == 200
    except:
        return False


def check_ffmpeg():
    return shutil.which("ffmpeg") is not None


def check_ytdlp():
    return shutil.which("yt-dlp") is not None


def check_acrcloud():

    try:
        r = requests.get(ACRCLOUD, timeout=3)
        return r.status_code == 200
    except:
        return False


# =========================
# LOG
# =========================

def log(text):

    timestamp = time.strftime("%H:%M:%S")

    log_box.insert("end", f"[{timestamp}] {text}\n")
    log_box.see("end")


# =========================
# STATUS
# =========================

def set_status(label, ok, ok_text, fail_text):

    if ok:
        label.configure(text=f"● {ok_text}", text_color="#22c55e")
    else:
        label.configure(text=f"● {fail_text}", text_color="#ef4444")


def update_status_thread():

    while True:

        try:

            frontend = check_url(FRONTEND_ONLINE)
            backend_online = check_url(BACKEND_ONLINE)
            backend_local = check_port(8000)

            ffmpeg = check_ffmpeg()
            ytdlp = check_ytdlp()
            acrcloud = check_acrcloud()

            app.after(0, lambda: set_status(frontend_status, frontend, "ONLINE", "OFFLINE"))
            app.after(0, lambda: set_status(backend_online_status, backend_online, "ONLINE", "OFFLINE"))
            app.after(0, lambda: set_status(backend_local_status, backend_local, "ONLINE", "OFFLINE"))

            app.after(0, lambda: set_status(ffmpeg_status, ffmpeg, "OK", "MISSING"))
            app.after(0, lambda: set_status(ytdlp_status, ytdlp, "OK", "MISSING"))
            app.after(0, lambda: set_status(acrcloud_status, acrcloud, "OK", "FAIL"))

        except:
            pass

        time.sleep(10)


# =========================
# TEST PIPELINE
# =========================

def test_scan_pipeline():

    def run():

        log("===== SCAN PIPELINE TEST =====")

        try:

            r = requests.get(BACKEND_ONLINE + "/docs", timeout=5)

            if r.status_code == 200:
                log("✔ Backend reachable")
            else:
                log("❌ Backend not responding")
                return

        except Exception as e:

            log("❌ Backend connection failed")
            log(str(e))
            return

        log("Testing YouTube download...")

        try:

            test_video = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

            r = requests.post(
                BACKEND_ONLINE + "/scan",
                json={
                    "url": test_video,
                    "user": "weizbeat@gmail.com"
                },
                timeout=40
            )

            if r.status_code == 200:

                data = r.json()

                if data == []:
                    log("⚠ Scan returned empty result")
                else:
                    log("✔ Scan returned matches")

            else:

                log("❌ Scan request failed")

        except Exception as e:

            log("❌ Scan test crashed")
            log(str(e))

        log("===== TEST COMPLETE =====")

    threading.Thread(target=run).start()


# =========================
# BACKEND CONTROL
# =========================

def start_backend():

    global backend_process

    if check_port(8000):
        log("Backend already running on port 8000")
        return

    try:

        project_root = os.getcwd()
        backend_path = os.path.join(project_root, "backend")

        if not os.path.exists(backend_path):
            log("Backend folder not found")
            return

        log("Starting backend...")

        backend_process = subprocess.Popen(
            [
                sys.executable,
                "-m",
                "uvicorn",
                "main:app",
                "--host",
                "0.0.0.0",
                "--port",
                "8000",
                "--reload"
            ],
            cwd=backend_path
        )

        log("Backend started")

    except Exception as e:

        log("Backend start failed")
        log(str(e))


# =========================
# REDEPLOY FUNCTIONS
# =========================

def redeploy_backend():

    def run():

        try:

            log("Redeploying backend...")

            subprocess.run(["git", "add", "."], check=True)
            subprocess.run(["git", "commit", "-m", "backend redeploy"], check=True)
            subprocess.run(["git", "push"], check=True)

            log("Backend pushed to GitHub")
            log("Railway redeploy started")

        except Exception as e:

            log("Backend redeploy failed")
            log(str(e))

    threading.Thread(target=run).start()


def redeploy_frontend():

    def run():

        try:

            log("Redeploying frontend...")

            subprocess.run(["git", "add", "."], check=True)
            subprocess.run(["git", "commit", "-m", "frontend redeploy"], check=True)
            subprocess.run(["git", "push"], check=True)

            log("Frontend pushed to GitHub")
            log("Vercel redeploy started")

        except Exception as e:

            log("Frontend redeploy failed")
            log(str(e))

    threading.Thread(target=run).start()


# =========================
# LINKS
# =========================

def open_url(url):
    webbrowser.open(url)


# =========================
# UI
# =========================

app = ctk.CTk()

app.title("BeatSignal Control Center")
app.geometry("900x720")


title = ctk.CTkLabel(
    app,
    text="BeatSignal Control Center",
    font=ctk.CTkFont(size=28, weight="bold")
)

title.pack(pady=20)


# =========================
# LINKS
# =========================

links_frame = ctk.CTkFrame(app)
links_frame.pack(pady=10)

button_style = {
    "width": 150,
    "height": 36,
    "fg_color": "#1f2937",
    "hover_color": "#374151"
}


ctk.CTkButton(
    links_frame,
    text="OPEN FRONTEND",
    command=lambda: open_url(FRONTEND_ONLINE),
    **button_style
).grid(row=0, column=0, padx=8, pady=8)


ctk.CTkButton(
    links_frame,
    text="OPEN API",
    command=lambda: open_url(BACKEND_ONLINE + "/docs"),
    **button_style
).grid(row=0, column=1, padx=8)


ctk.CTkButton(
    links_frame,
    text="ACRCLOUD",
    command=lambda: open_url(ACRCLOUD),
    **button_style
).grid(row=0, column=2, padx=8)


# =========================
# STATUS PANEL
# =========================

status_frame = ctk.CTkFrame(app)
status_frame.pack(pady=20)


def status_row(parent, name, row):

    label_name = ctk.CTkLabel(parent, text=name, width=160, anchor="w")
    label_name.grid(row=row, column=0, padx=15, pady=6)

    label_status = ctk.CTkLabel(parent, text="● ...")
    label_status.grid(row=row, column=1, padx=15)

    return label_status


frontend_status = status_row(status_frame, "Frontend", 0)
backend_online_status = status_row(status_frame, "Backend Online", 1)
backend_local_status = status_row(status_frame, "Backend Local", 2)
ffmpeg_status = status_row(status_frame, "FFmpeg", 3)
ytdlp_status = status_row(status_frame, "yt-dlp", 4)
acrcloud_status = status_row(status_frame, "ACRCloud", 5)


# =========================
# CONTROLS
# =========================

controls = ctk.CTkFrame(app)
controls.pack(pady=15)


ctk.CTkButton(
    controls,
    text="START BACKEND",
    command=start_backend,
    **button_style
).grid(row=0, column=0, padx=10)


ctk.CTkButton(
    controls,
    text="TEST SCAN PIPELINE",
    command=test_scan_pipeline,
    **button_style
).grid(row=0, column=1, padx=10)


ctk.CTkButton(
    controls,
    text="REDEPLOY BACKEND",
    command=redeploy_backend,
    **button_style
).grid(row=1, column=0, padx=10, pady=10)


ctk.CTkButton(
    controls,
    text="REDEPLOY FRONTEND",
    command=redeploy_frontend,
    **button_style
).grid(row=1, column=1, padx=10, pady=10)


# =========================
# LOG
# =========================

log_frame = ctk.CTkFrame(app)
log_frame.pack(pady=10, fill="both", expand=True)

log_box = ctk.CTkTextbox(log_frame)
log_box.pack(fill="both", expand=True, padx=10, pady=10)


# =========================
# START STATUS THREAD
# =========================

threading.Thread(
    target=update_status_thread,
    daemon=True
).start()


app.mainloop()
