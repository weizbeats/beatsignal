from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import json
import os
import time

from services.scanner import scan_url
from services.paypal_service import create_order, capture_order

from jose import jwt
from datetime import datetime, timedelta

from passlib.hash import bcrypt

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

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"


# -------------------------
# TOKEN
# -------------------------

def create_token(email: str):

    payload = {
        "email": email,
        "exp": datetime.utcnow() + timedelta(days=7)
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str):

    if not token:
        return None

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except:
        return None


# -------------------------
# FILE INIT
# -------------------------

if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, "w") as f:
        json.dump([], f)

if not os.path.exists(BEATS_FILE):
    with open(BEATS_FILE, "w") as f:
        json.dump([], f)


# -------------------------
# STORAGE
# -------------------------

def load_users():

    try:
        with open(USERS_FILE, "r") as f:
            return json.load(f)
    except:
        return []


def save_users(users):

    with open(USERS_FILE, "w") as f:
        json.dump(users, f)


# -------------------------
# REGISTER
# -------------------------

@app.post("/register")
def register(data: dict):

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {"success": False}

    email = str(email).strip().lower()
    password = str(password).strip()

    users = load_users()

    for user in users:
        if user["email"] == email:
            return {"success": False}

    # bcrypt max 72 chars
    password = password[:72]

    try:
        hashed_password = bcrypt.hash(password)
    except Exception as e:
        print("bcrypt error:", e)
        return {"success": False}

    users.append({
        "email": email,
        "password": hashed_password,
        "plan": "trial",
        "credits": 5,
        "trial_used": True,
        "admin": email == "weizbeat@gmail.com"
    })

    save_users(users)

    return {"success": True}


# -------------------------
# LOGIN
# -------------------------

@app.post("/login")
def login(data: dict):

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {"success": False}

    email = str(email).strip().lower()
    password = str(password).strip()[:72]

    users = load_users()

    for user in users:

        if user["email"] == email:

            try:

                if bcrypt.verify(password, user["password"]):

                    token = create_token(email)

                    is_admin = user.get("admin", False)

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

            except Exception as e:

                print("bcrypt verify error:", e)
                return {"success": False}

    return {"success": False}


# -------------------------
# SCAN
# -------------------------

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


# -------------------------
# PAYPAL
# -------------------------

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
        return {"error": "invalid_plan"}

    order_id = create_order(price)

    return {"orderID": order_id}


@app.post("/capture-paypal-order")
def capture_paypal_order(data: dict):

    token = data.get("token")
    order_id = data.get("orderID")
    plan = data.get("plan")

    payload = verify_token(token)

    if not payload:
        return {"error": "invalid_token"}

    capture = capture_order(order_id)

    if capture.get("status") != "COMPLETED":
        return {"error": "payment_not_completed"}

    user_email = payload["email"]

    users = load_users()

    for user in users:

        if user["email"] == user_email:

            if plan == "50":
                user["credits"] += 50
                user["plan"] = "credits"

            elif plan == "100":
                user["credits"] += 100
                user["plan"] = "credits"

            elif plan == "unlimited":
                user["plan"] = "unlimited"

            save_users(users)

            break

    return {"success": True}
