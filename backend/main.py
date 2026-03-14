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
BEATS_FILE = "beats.json"

AUTOPILOT_DAYS = 10
AUTOPILOT_SECONDS = AUTOPILOT_DAYS * 24 * 60 * 60


# =========================
# CREATE FILES
# =========================

if not os.path.exists(USERS_FILE):

    with open(USERS_FILE,"w") as f:
        json.dump([],f)

if not os.path.exists(BEATS_FILE):

    with open(BEATS_FILE,"w") as f:
        json.dump([],f)


# =========================
# USERS
# =========================

def load_users():

    try:
        with open(USERS_FILE,"r") as f:
            return json.load(f)
    except:
        return []


def save_users(users):

    with open(USERS_FILE,"w") as f:
        json.dump(users,f)


# =========================
# BEATS
# =========================

def load_beats():

    try:
        with open(BEATS_FILE,"r") as f:
            return json.load(f)
    except:
        return []


def save_beats(beats):

    with open(BEATS_FILE,"w") as f:
        json.dump(beats,f)


# =========================
# REGISTER
# =========================

@app.post("/register")
def register(data:dict):

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {"success":False}

    users = load_users()

    for user in users:

        if user["email"] == email:
            return {"success":False}

    users.append({

        "email":email,
        "password":password,

        "plan":"trial",

        "credits":5,

        "trial_used":True
    })

    save_users(users)

    return {"success":True}


# =========================
# LOGIN
# =========================

@app.post("/login")
def login(data:dict):

    email = data.get("email")
    password = data.get("password")

    users = load_users()

    for user in users:

        if user["email"] == email and user["password"] == password:

            return {
 "success": True,
 "plan": user.get("plan","trial"),
 "credits": user.get("credits",0),
 "admin": user.get("admin", False)
}

    return {"success":False}


# =========================
# SCAN WITH CREDITS
# =========================

@app.post("/scan")
def scan(data:dict):

    url = data.get("url")
    user_email = data.get("user")

    if not url or not user_email:
        return {"results":[]}

    users = load_users()

    for user in users:

        if user["email"] == user_email:

            if user["plan"] != "unlimited":

                if user["credits"] <= 0:

                    return {"error":"no_credits"}

                user["credits"] -= 1

                save_users(users)

            break

    results = scan_url(url)

    return results


# =========================
# ADD BEAT AUTOPILOT
# =========================

@app.post("/beats/add")
def add_beat(data:dict):

    user = data.get("user")
    url = data.get("url")
    name = data.get("name","beat")

    beats = load_beats()

    beats.append({

        "user":user,
        "url":url,
        "name":name,

        "last_check":None,
        "next_check":None,

        "autopilot":True,

        "matches":[]
    })

    save_beats(beats)

    return {"success":True}


# =========================
# LIST USER BEATS
# =========================

@app.get("/beats/{user}")
def get_beats(user:str):

    beats = load_beats()

    user_beats = [b for b in beats if b["user"] == user]

    return user_beats


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

        print("AUTOPILOT scanning:",beat["name"])

        results = scan_url(beat["url"])

        beat["matches"] = results

        beat["last_check"] = now
        beat["next_check"] = now + AUTOPILOT_SECONDS

        updated = True

    if updated:
        save_beats(beats)

    return {"status":"autopilot complete"}


# =========================
# PAYPAL
# =========================

@app.post("/create-paypal-order")
def create_paypal_order(data:dict):

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
        return {"error":"invalid plan"}

    order_id = create_order(price)

    return {

        "orderID":order_id,
        "credits":credits
    }
