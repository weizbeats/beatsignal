from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import json
import os
from datetime import datetime, timedelta

from services.scanner import scan_url

from jose import jwt
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
# STORAGE
# -------------------------

def load_users():

    if not os.path.exists(USERS_FILE):

        with open(USERS_FILE, "w") as f:
            json.dump([], f)

    with open(USERS_FILE, "r") as f:
        return json.load(f)


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
        return {
            "success": False,
            "error": "missing_fields"
        }

    email = email.lower().strip()
    password = password.strip()[:72]

    users = load_users()

    for u in users:

        if u["email"] == email:

            return {
                "success": False,
                "error": "email_exists"
            }

    hashed = bcrypt.hash(password)

    new_user = {
        "email": email,
        "password": hashed,
        "plan": "trial",
        "credits": 5,
        "admin": email == "weizbeat@gmail.com"
    }

    users.append(new_user)

    save_users(users)

    token = create_token(email)

    return {
        "success": True,
        "token": token,
        "plan": new_user["plan"],
        "credits": new_user["credits"]
    }


# -------------------------
# LOGIN
# -------------------------

@app.post("/login")
def login(data: dict):

    email = data.get("email")
    password = data.get("password")

    if not email or not password:

        return {
            "success": False,
            "error": "missing_fields"
        }

    email = email.lower().strip()
    password = password.strip()[:72]

    users = load_users()

    for u in users:

        if u["email"] == email:

            if bcrypt.verify(password, u["password"]):

                token = create_token(email)

                if u.get("admin"):

                    return {
                        "success": True,
                        "token": token,
                        "plan": "admin",
                        "credits": -1
                    }

                return {
                    "success": True,
                    "token": token,
                    "plan": u["plan"],
                    "credits": u["credits"]
                }

            else:

                return {
                    "success": False,
                    "error": "wrong_password"
                }

    return {
        "success": False,
        "error": "user_not_found"
    }


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

    email = payload["email"]

    users = load_users()

    for u in users:

        if u["email"] == email:

            if not u.get("admin") and u["plan"] != "unlimited":

                if u["credits"] <= 0:
                    return {"error": "no_credits"}

                u["credits"] -= 1
                save_users(users)

            break

    results = scan_url(url)

    return {
        "success": True,
        "results": results
    }
