from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import json
import os
import time

from scanner import scan_url
from paypal_service import create_order

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

USERS_FILE = "users.json"

# =========================
# ONLINE USERS TRACKER
# =========================

online_users = {}

def get_online_users():

    now = time.time()

    active = []

    for user, last_seen in online_users.items():

        if now - last_seen < 60:
            active.append(user)

    return len(active)


# =========================
# CREATE USERS FILE
# =========================

if not os.path.exists(USERS_FILE):

    with open(USERS_FILE, "w") as f:
        json.dump([], f)


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
        "plan": "free",
        "credits": 10
    })

    save_users(users)

    return {"success": True}


# =========================
# LOGIN
# =========================

@app.post("/login")
def login(data: dict):

    email = data.get("email")
    password = data.get("password")

    users = load_users()

    for user in users:

        if user["email"] == email and user["password"] == password:

            return {
                "success": True,
                "email": email,
                "plan": user.get("plan","free"),
                "credits": user.get("credits",0)
            }

    return {"success": False}


# =========================
# HEARTBEAT
# =========================

@app.post("/heartbeat")
def heartbeat(data: dict):

    user = data.get("user", "guest")

    online_users[user] = time.time()

    return {"status": "ok"}


# =========================
# STATS REGISTERED USERS
# =========================

@app.get("/stats/users")
def users_count():

    users = load_users()

    return {
        "registered_users": len(users)
    }


# =========================
# STATS ONLINE USERS
# =========================

@app.get("/stats/online")
def online_users_count():

    return {
        "online_users": get_online_users()
    }


# =========================
# SCAN
# =========================

@app.post("/scan")
def scan(data: dict):

    url = data.get("url")

    if not url:
        return {"results": []}

    return scan_url(url)


# =========================
# PAYPAL CREATE ORDER
# =========================

@app.post("/create-paypal-order")
def create_paypal_order(data: dict):

    plan = data.get("plan")

    if plan == "50":
        price = "2.49"

    elif plan == "100":
        price = "4.99"

    elif plan == "unlimited":
        price = "9.99"

    else:
        return {"error": "invalid plan"}

    order_id = create_order(price)

    return {
        "orderID": order_id
    }
