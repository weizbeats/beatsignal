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
BACKEND_ONLINE = "https://beatsignal-api.onrender.com"
FRONTEND = "https://beatsignal-2uec.vercel.app"

NETLIFY = "https://app.netlify.com"
VERCEL = "https://vercel.com/dashboard"
GITHUB = "https://github.com"
ACRCLOUD = "https://console.acrcloud.com"

backend_process = None


# =========================
# CHECKS
# =========================

def check_port(port):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = s.connect_ex(("127.0.0.1", port))
    s.close()
    return result == 0


def check_url(url):
    try:
        r = requests.get(url, timeout=5)
        return r.status_code == 200
    except:
        return False


def check_ffmpeg():
    return shutil.which("ffmpeg") is not None


def check_ytdlp():
    return shutil.which("yt-dlp") is not None


def check_acrcloud():
    try:
        r = requests.get(ACRCLOUD, timeout=5)
        return r.status_code == 200
    except:
        return False


# =========================
# USERS
# =========================

def get_registered_users():
    try:
        r = requests.get(f"{BACKEND_LOCAL}/stats/users", timeout=5)
        return r.json()["registered_users"]
    except:
        return 0


def get_online_users():
    try:
        r = requests.get(f"{BACKEND_LOCAL}/stats/online", timeout=5)
        return r.json()["online_users"]
    except:
        return 0


# =========================
# STATUS
# =========================

def set_status(label, ok, ok_text, fail_text):

    if ok:
        label.configure(text=f"● {ok_text}", text_color="#22c55e")
    else:
        label.configure(text=f"● {fail_text}", text_color="#ef4444")


def update_status():

    set_status(frontend_status, check_url(FRONTEND), "ONLINE", "OFFLINE")
    set_status(backend_online_status, check_url(BACKEND_ONLINE), "ONLINE", "OFFLINE")
    set_status(backend_local_status, check_port(8000), "ONLINE", "OFFLINE")

    set_status(ffmpeg_status, check_ffmpeg(), "OK", "MISSING")
    set_status(ytdlp_status, check_ytdlp(), "OK", "MISSING")
    set_status(acrcloud_status, check_acrcloud(), "OK", "FAIL")

    registered_users.configure(text=str(get_registered_users()))
    online_users.configure(text=str(get_online_users()))

    app.after(4000, update_status)


# =========================
# LOG
# =========================

def log(text):

    timestamp = time.strftime("%H:%M:%S")

    log_box.insert("end", f"[{timestamp}] {text}\n")
    log_box.see("end")


# =========================
# BACKEND CONTROL
# =========================

def start_backend():

    global backend_process

    if backend_process is None:

        try:

            project_root = os.getcwd()
            backend_path = os.path.join(project_root, "backend")

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
                    "8000"
                ],
                cwd=backend_path
            )

            log("Backend started")

        except Exception as e:

            log("Backend start failed")
            log(str(e))


def stop_backend():

    global backend_process

    if backend_process:

        backend_process.terminate()
        backend_process = None

        log("Backend stopped")


# =========================
# TEST SCAN
# =========================

def test_scan():

    def run():

        try:

            log("Running scan test...")

            r = requests.post(
                f"{BACKEND_LOCAL}/scan",
                json={"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"},
                timeout=60
            )

            if r.status_code == 200:

                results = r.json()

                log("SCAN OK")
                log(f"Matches: {len(results)}")

            else:

                log("SCAN ERROR")

        except Exception as e:

            log("SCAN FAILED")
            log(str(e))

    threading.Thread(target=run).start()


# =========================
# DEPLOY
# =========================

def deploy_platform():

    def run():

        try:

            log("Deploying...")

            subprocess.run(["git", "add", "."])
            subprocess.run(["git", "commit", "-m", "auto deploy"])
            subprocess.run(["git", "push"])

            log("Code pushed to GitHub")
            log("Deploy triggered")

        except Exception as e:

            log("Deploy failed")
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
app.geometry("780x650")

title = ctk.CTkLabel(
    app,
    text="BeatSignal Control Center",
    font=ctk.CTkFont(size=28, weight="bold")
)

title.pack(pady=25)


# =========================
# LINKS
# =========================

links_frame = ctk.CTkFrame(app)
links_frame.pack(pady=10)

button_style = {
    "width": 130,
    "height": 36,
    "fg_color": "#1f2937",
    "hover_color": "#374151"
}

ctk.CTkButton(links_frame, text="ONLINE APP", command=lambda: open_url(FRONTEND), **button_style).grid(row=0, column=0, padx=8, pady=8)
ctk.CTkButton(links_frame, text="LOCAL API", command=lambda: open_url(BACKEND_LOCAL), **button_style).grid(row=0, column=1, padx=8)
ctk.CTkButton(links_frame, text="ONLINE API", command=lambda: open_url(BACKEND_ONLINE), **button_style).grid(row=0, column=2, padx=8)

ctk.CTkButton(links_frame, text="NETLIFY", command=lambda: open_url(NETLIFY), **button_style).grid(row=1, column=0, padx=8, pady=8)
ctk.CTkButton(links_frame, text="VERCEL", command=lambda: open_url(VERCEL), **button_style).grid(row=1, column=1, padx=8)
ctk.CTkButton(links_frame, text="GITHUB", command=lambda: open_url(GITHUB), **button_style).grid(row=1, column=2, padx=8)


# =========================
# STATUS PANEL
# =========================

status_frame = ctk.CTkFrame(app)
status_frame.pack(pady=25)

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
# USERS
# =========================

users_frame = ctk.CTkFrame(app)
users_frame.pack(pady=15)

ctk.CTkLabel(users_frame, text="Registered Users").grid(row=0, column=0, padx=30)
registered_users = ctk.CTkLabel(users_frame, text="0", font=ctk.CTkFont(size=18, weight="bold"))
registered_users.grid(row=1, column=0)

ctk.CTkLabel(users_frame, text="Online Users").grid(row=0, column=1, padx=30)
online_users = ctk.CTkLabel(users_frame, text="0", font=ctk.CTkFont(size=18, weight="bold"))
online_users.grid(row=1, column=1)


# =========================
# CONTROLS
# =========================

controls = ctk.CTkFrame(app)
controls.pack(pady=25)

ctk.CTkButton(controls, text="START BACKEND", **button_style, command=start_backend).grid(row=0, column=0, padx=10, pady=10)
ctk.CTkButton(controls, text="STOP BACKEND", **button_style, command=stop_backend).grid(row=0, column=1, padx=10)

ctk.CTkButton(controls, text="TEST SCAN", **button_style, command=test_scan).grid(row=1, column=0, padx=10, pady=10)
ctk.CTkButton(controls, text="DEPLOY PLATFORM", **button_style, command=deploy_platform).grid(row=1, column=1, padx=10)


# =========================
# LOG
# =========================

log_frame = ctk.CTkFrame(app)
log_frame.pack(pady=10, fill="both", expand=True)

log_box = ctk.CTkTextbox(log_frame)
log_box.pack(fill="both", expand=True, padx=10, pady=10)


update_status()

app.mainloop()
