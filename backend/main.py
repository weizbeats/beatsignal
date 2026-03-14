from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import os
from datetime import datetime, timedelta

from services.scanner import scan_url

from jose import jwt
from passlib.hash import bcrypt

from database.db import SessionLocal, engine
from database.models import Base, User


app = FastAPI()

Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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

    db = SessionLocal()

    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:

        return {
            "success": False,
            "error": "email_exists"
        }

    hashed_password = bcrypt.hash(password)

    new_user = User(
        email=email,
        password=hashed_password,
        plan="trial",
        credits=5,
        admin=email == "weizbeat@gmail.com"
    )

    db.add(new_user)
    db.commit()

    token = create_token(email)

    return {
        "success": True,
        "token": token,
        "plan": new_user.plan,
        "credits": new_user.credits
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

    db = SessionLocal()

    user = db.query(User).filter(User.email == email).first()

    if not user:

        return {
            "success": False,
            "error": "user_not_found"
        }

    if not bcrypt.verify(password, user.password):

        return {
            "success": False,
            "error": "wrong_password"
        }

    token = create_token(email)

    if user.admin:

        return {
            "success": True,
            "token": token,
            "plan": "admin",
            "credits": -1
        }

    return {
        "success": True,
        "token": token,
        "plan": user.plan,
        "credits": user.credits
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

        return {
            "error": "invalid_token"
        }

    email = payload["email"]

    db = SessionLocal()

    user = db.query(User).filter(User.email == email).first()

    if not user:

        return {
            "error": "user_not_found"
        }

    if not user.admin and user.plan != "unlimited":

        if user.credits <= 0:

            return {
                "error": "no_credits"
            }

        user.credits -= 1
        db.commit()

    results = scan_url(url)

    return {
        "success": True,
        "results": results
    }
