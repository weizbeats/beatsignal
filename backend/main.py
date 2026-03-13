from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import json
import os

from scanner import scan_url


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
# Crear archivo de usuarios si no existe
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
        "password": password
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
                "email": email
            }

    return {"success": False}


# =========================
# SCAN
# =========================
@app.post("/scan")
def scan(data: dict):

    url = data.get("url")

    if not url:
        return {"results": []}

    return scan_url(url)
