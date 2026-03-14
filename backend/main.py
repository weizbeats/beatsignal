from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import json
import os
import time

from services.scanner import scan_url
from services.paypal_service import create_order

from jose import jwt
from datetime import datetime, timedelta

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

USERS_FILE = "database/users.json"
BEATS_FILE = "database/beats.json"

AUTOPILOT_DAYS = 10
AUTOPILOT_SECONDS = AUTOPILOT_DAYS * 24 * 60 * 60


# =========================
# JWT CONFIG
# =========================

SECRET_KEY = "BEATSIGNAL_SECRET_KEY"
ALGORITHM = "HS256"


def create_token(email: str):

    payload = {
        "email": email,
        "exp": datetime.utcnow() + timedelta(days=7)
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str):

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except:
        return None


# =========================
# CREATE DATABASE FILES
# =========================

if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, "w") as f:
        json.dump([], f)

if not os.path.exists(BEATS_FILE):
    with open(BEATS_FILE, "w") as f:
        json.dump([], f)


# =========================
# USERS
# =========================

def load_users():

    try:
        with open(USERS_FILE, "r") as f:
            return json.load(f)
    except:
        return []


def save_users(users):

    with open(USERS_FILE, "w") as f:
        json.dump(users, f)


# =========================
# BEATS
# =========================

def load_beats():

    try:
        with open(BEATS_FILE, "r") as f:
            return json.load(f)
    except:
        return []


def save_beats(beats):

    with open(BEATS_FILE, "w") as f:
        json.dump(beats, f)


# =========================
# REGISTER
# =========================

@app.post("/register")
def register(data: dict):

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {"success": False}

    users = load_users()

    for user in users:
        if user["email"] == email:
            return {"success": False}

    users.append({

        "email": email,
        "password": password,
        "plan": "trial",
        "credits": 5,
        "trial_used": True,
        "admin": email == "weizbeat@gmail.com"

    })

    save_users(users)

    return {"success": True}


# =========================
# LOGIN (CON TOKEN)
# =========================

@app.post("/login")
def login(data: dict):

    email = data.get("email")
    password = data.get("password")

    users = load_users()

    for user in users:

        if user["email"] == email and user["password"] == password:

            token = create_token(email)

            is_admin = email == "weizbeat@gmail.com"

            if is_admin:

                return {
                    "success": True,
                    "token": token,
                    "plan": "admin",
                    "credits": -1,
                    "admin": True
                }

            return {
                "success": True,
                "token": token,
                "plan": user.get("plan", "trial"),
                "credits": user.get("credits", 0),
                "admin": False
            }

    return {"success": False}


# =========================
# SCAN WITH TOKEN
# =========================

@app.post("/scan")
def scan(data: dict):

    token = data.get("token")
    url = data.get("url")

    payload = verify_token(token)

    if not payload:
        return {"error": "invalid_token"}

    user_email = payload["email"]

    users = load_users()

    for user in users:

        if user["email"] == user_email:

            is_admin = user.get("admin", False)

            if not is_admin and user["plan"] != "unlimited":

                if user["credits"] <= 0:
                    return {"error": "no_credits"}

                user["credits"] -= 1
                save_users(users)

            break

    results = scan_url(url)

    return results


# =========================
# ADD BEAT AUTOPILOT
# =========================

@app.post("/beats/add")
def add_beat(data: dict):

    token = data.get("token")
    url = data.get("url")
    name = data.get("name", "beat")

    payload = verify_token(token)

    if not payload:
        return {"error": "invalid_token"}

    user_email = payload["email"]

    beats = load_beats()

    beats.append({

        "user": user_email,
        "url": url,
        "name": name,

        "last_check": None,
        "next_check": None,

        "autopilot": True,
        "matches": []

    })

    save_beats(beats)

    return {"success": True}


# =========================
# LIST USER BEATS
# =========================

@app.get("/beats/{user}")
def get_beats(user: str):

    beats = load_beats()

    return [b for b in beats if b["user"] == user]


# =========================
# AUTOPILOT
# =========================

@app.post("/beats/run-autopilot")
def run_autopilot():

    beats = load_beats()

    now = time.time()

    updated = False

    for beat in beats:

        if not beat.get("autopilot"):
            continue

        next_check = beat.get("next_check")

        if next_check and now < next_check:
            continue

        print("AUTOPILOT scanning:", beat["name"])

        results = scan_url(beat["url"])

        beat["matches"] = results

        beat["last_check"] = now
        beat["next_check"] = now + AUTOPILOT_SECONDS

        updated = True

    if updated:
        save_beats(beats)

    return {"status": "autopilot complete"}


# =========================
# PAYPAL
# =========================

@app.post("/create-paypal-order")
def create_paypal_order(data: dict):

    plan = data.get("plan")

    if plan == "50":

        price = "2.49"
        credits = 50

    elif plan == "100":

        price = "4.99"
        credits = 100

    elif plan == "unlimited":

        price = "9.99"
        credits = -1

    else:
        return {"error": "invalid plan"}

    order_id = create_order(price)

    return {

        "orderID": order_id,
        "credits": credits

    }


# =========================
# ADMIN PANEL
# =========================

@app.get("/admin")
def admin_panel(email: str):

    if email != "weizbeat@gmail.com":
        return {"error": "not_admin"}

    users = load_users()
    beats = load_beats()

    total_users = len(users)
    total_beats = len(beats)

    total_credits = sum(u.get("credits", 0) for u in users)

    return {

        "users": users,
        "beats_monitored": beats,

        "stats": {

            "total_users": total_users,
            "total_beats": total_beats,
            "total_credits": total_credits

        }

    }
