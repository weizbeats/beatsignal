from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

import os
import secrets
import smtplib

from email.mime.text import MIMEText
from datetime import datetime, timedelta

from services.scanner import scan_url

from jose import jwt
from passlib.hash import bcrypt

from database.db import SessionLocal, engine
from database.models import Base, User

# RATE LIMIT
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware


app = FastAPI()

Base.metadata.create_all(bind=engine)


# -------------------------
# RATE LIMIT CONFIG
# -------------------------

limiter = Limiter(key_func=get_remote_address)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, lambda r,e: {"error":"Too many requests"})
app.add_middleware(SlowAPIMiddleware)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")
FRONTEND_URL = os.getenv("FRONTEND_URL")


# -------------------------
# CLEAN OLD USERS
# -------------------------

def delete_unverified_users():

    db = SessionLocal()

    limit_time = datetime.utcnow() - timedelta(hours=24)

    users = db.query(User).filter(
        User.verified == False
    ).all()

    for u in users:

        if u.verify_token and u.created_at < limit_time:
            db.delete(u)

    db.commit()


delete_unverified_users()


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
# EMAIL
# -------------------------

def generate_verify_token():

    return secrets.token_urlsafe(32)


def send_verification_email(email, token):

    link = f"{FRONTEND_URL}/verify?token={token}"

    body = f"""
Welcome to BeatSignal

Click the link below to verify your account:

{link}

If you didn't create this account you can ignore this email.
"""

    msg = MIMEText(body)

    msg["Subject"] = "Verify your BeatSignal account"
    msg["From"] = EMAIL_USER
    msg["To"] = email

    try:

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)

        server.sendmail(EMAIL_USER, email, msg.as_string())

        server.quit()

    except Exception as e:

        print("Email send error:", e)


# -------------------------
# REGISTER
# -------------------------

@limiter.limit("5/minute")
@app.post("/register")
def register(request: Request, data: dict):

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

    verify_token = generate_verify_token()

    new_user = User(
        email=email,
        password=hashed_password,
        plan="trial",
        credits=5,
        admin=email == "weizbeat@gmail.com",
        verified=False,
        verify_token=verify_token,
        created_at=datetime.utcnow()
    )

    db.add(new_user)
    db.commit()

    send_verification_email(email, verify_token)

    return {
        "success": True,
        "message": "Verification email sent"
    }


# -------------------------
# RESEND EMAIL
# -------------------------

@limiter.limit("3/minute")
@app.post("/resend-verification")
def resend_verification(request: Request, data: dict):

    email = data.get("email")

    db = SessionLocal()

    user = db.query(User).filter(User.email == email).first()

    if not user:
        return {"success": False}

    if user.verified:
        return {"success": False}

    verify_token = generate_verify_token()

    user.verify_token = verify_token

    db.commit()

    send_verification_email(email, verify_token)

    return {"success": True}


# -------------------------
# VERIFY EMAIL
# -------------------------

@app.get("/verify-email")
def verify_email(token: str):

    db = SessionLocal()

    user = db.query(User).filter(User.verify_token == token).first()

    if not user:

        return {"success": False}

    user.verified = True
    user.verify_token = None

    db.commit()

    return {"success": True}


# -------------------------
# LOGIN
# -------------------------

@limiter.limit("10/minute")
@app.post("/login")
def login(request: Request, data: dict):

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

    if not user.verified:

        return {
            "success": False,
            "error": "email_not_verified"
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
