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

FRONTEND_LOCAL = "http://localhost:3000"
FRONTEND_ONLINE = "https://beatsignal-2uec.vercel.app"

NETLIFY = "https://app.netlify.com"
VERCEL = "https://vercel.com/dashboard"
GITHUB = "https://github.com"
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
        r = requests.get(url, timeout=2)
        return r.status_code == 200
    except:
        return False


def check_ffmpeg():
    return shutil.which("ffmpeg") is not None


def check_ytdlp():
    return shutil.which("yt-dlp") is not None


def check_acrcloud():

    try:
        r = requests.get(ACRCLOUD, timeout=2)
        return r.status_code == 200
    except:
        return False


# =========================
# USERS
# =========================

def get_registered_users():

    try:
        r = requests.get(f"{BACKEND_LOCAL}/stats/users", timeout=2)
        return r.json()["registered_users"]
    except:
        return 0


def get_online_users():

    try:
        r = requests.get(f"{BACKEND_LOCAL}/stats/online", timeout=2)
        return r.json()["online_users"]
    except:
        return 0


# =========================
# STATUS UI
# =========================

def set_status(label, ok, ok_text, fail_text):

    if ok:
        label.configure(text=f"● {ok_text}", text_color="#22c55e")
    else:
        label.configure(text=f"● {fail_text}", text_color="#ef4444")


# =========================
# STATUS THREAD
# =========================

def update_status_thread():

    while True:

        try:

            frontend = check_url(FRONTEND_ONLINE)
            backend_online = check_url(BACKEND_ONLINE)
            backend_local = check_port(8000)

            ffmpeg = check_ffmpeg()
            ytdlp = check_ytdlp()
            acrcloud = check_acrcloud()

            users = get_registered_users()
            online = get_online_users()

            app.after(0, lambda: set_status(frontend_status, frontend, "ONLINE", "OFFLINE"))
            app.after(0, lambda: set_status(backend_online_status, backend_online, "ONLINE", "OFFLINE"))
            app.after(0, lambda: set_status(backend_local_status, backend_local, "ONLINE", "OFFLINE"))

            app.after(0, lambda: set_status(ffmpeg_status, ffmpeg, "OK", "MISSING"))
            app.after(0, lambda: set_status(ytdlp_status, ytdlp, "OK", "MISSING"))
            app.after(0, lambda: set_status(acrcloud_status, acrcloud, "OK", "FAIL"))

            app.after(0, lambda: registered_users.configure(text=str(users)))
            app.after(0, lambda: online_users.configure(text=str(online)))

        except:
            pass

        time.sleep(10)


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


# =========================
# DEPLOY
# =========================

def deploy_backend():

    def run():

        try:

            log("Deploying backend...")

            subprocess.run(["git", "add", "."])
            subprocess.run(["git", "commit", "-m", "backend deploy"])
            subprocess.run(["git", "push"])

            log("Backend pushed to GitHub")
            log("Render will redeploy")

        except Exception as e:

            log("Deploy failed")
            log(str(e))

    threading.Thread(target=run).start()


def redeploy_frontend():

    def run():

        try:

            log("Redeploying frontend...")

            subprocess.run(["git", "add", "."])
            subprocess.run(["git", "commit", "-m", "frontend redeploy"])
            subprocess.run(["git", "push"])

            log("Frontend pushed")
            log("Vercel redeploy started")

        except Exception as e:

            log("Redeploy failed")
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

app.geometry("800x700")


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
    "width": 140,
    "height": 36,
    "fg_color": "#1f2937",
    "hover_color": "#374151"
}


ctk.CTkButton(
    links_frame,
    text="OPEN FRONTEND LOCAL",
    command=lambda: open_url(FRONTEND_LOCAL),
    **button_style
).grid(row=0, column=0, padx=8, pady=8)


ctk.CTkButton(
    links_frame,
    text="OPEN FRONTEND ONLINE",
    command=lambda: open_url(FRONTEND_ONLINE),
    **button_style
).grid(row=0, column=1, padx=8)


ctk.CTkButton(
    links_frame,
    text="LOCAL API",
    command=lambda: open_url(BACKEND_LOCAL),
    **button_style
).grid(row=0, column=2, padx=8)


ctk.CTkButton(
    links_frame,
    text="ONLINE API",
    command=lambda: open_url(BACKEND_ONLINE),
    **button_style
).grid(row=1, column=0, padx=8, pady=8)


ctk.CTkButton(
    links_frame,
    text="NETLIFY",
    command=lambda: open_url(NETLIFY),
    **button_style
).grid(row=1, column=1, padx=8)


ctk.CTkButton(
    links_frame,
    text="VERCEL",
    command=lambda: open_url(VERCEL),
    **button_style
).grid(row=1, column=2, padx=8)


ctk.CTkButton(
    links_frame,
    text="GITHUB",
    command=lambda: open_url(GITHUB),
    **button_style
).grid(row=2, column=1, padx=8, pady=8)


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

registered_users = ctk.CTkLabel(
    users_frame,
    text="0",
    font=ctk.CTkFont(size=18, weight="bold")
)

registered_users.grid(row=1, column=0)


ctk.CTkLabel(users_frame, text="Online Users").grid(row=0, column=1, padx=30)

online_users = ctk.CTkLabel(
    users_frame,
    text="0",
    font=ctk.CTkFont(size=18, weight="bold")
)

online_users.grid(row=1, column=1)


# =========================
# CONTROLS
# =========================

controls = ctk.CTkFrame(app)
controls.pack(pady=20)


ctk.CTkButton(
    controls,
    text="START BACKEND",
    **button_style,
    command=start_backend
).grid(row=0, column=0, padx=10, pady=10)


ctk.CTkButton(
    controls,
    text="DEPLOY BACKEND",
    **button_style,
    command=deploy_backend
).grid(row=0, column=1, padx=10)


ctk.CTkButton(
    controls,
    text="REDEPLOY FRONTEND",
    **button_style,
    command=redeploy_frontend
).grid(row=0, column=2, padx=10)


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
