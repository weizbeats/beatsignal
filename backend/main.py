from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

import os
import secrets
import requests

from datetime import datetime, timedelta

from services.scanner import scan_url

from jose import jwt
from passlib.context import CryptContext

from database.db import SessionLocal, engine
from database.models import Base, User, ScanResult

from config.plans import PLANS

# RATE LIMIT
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware


app = FastAPI()

Base.metadata.create_all(bind=engine)


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


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

FRONTEND_URL = os.getenv("FRONTEND_URL")
RESEND_API_KEY = os.getenv("RESEND_API_KEY")


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

    data = {
        "from": "BeatSignal <onboarding@resend.dev>",
        "to": [email],
        "subject": "Verify your BeatSignal account",
        "html": f"""
        <h2>Verify your BeatSignal account</h2>
        <p>Click the link below to activate your account:</p>
        <a href="{link}">{link}</a>
        """
    }

    try:

        requests.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {RESEND_API_KEY}",
                "Content-Type": "application/json"
            },
            json=data
        )

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

    hashed_password = pwd_context.hash(password)

    plan = "free"
    credits = PLANS[plan]["credits"]

    verify_token = generate_verify_token()

    new_user = User(
        email=email,
        password=hashed_password,
        plan=plan,
        credits=credits,
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

    if not pwd_context.verify(password, user.password):

        return {
            "success": False,
            "error": "wrong_password"
        }

    token = create_token(email)

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
        return {"error": "invalid_token"}

    email = payload["email"]

    db = SessionLocal()

    user = db.query(User).filter(User.email == email).first()

    if not user:
        return {"error": "user_not_found"}

    if not user.admin:

        if user.credits == 0:
            return {"error": "no_credits"}

        if user.credits > 0:
            user.credits -= 1
            db.commit()

    results = scan_url(url)

    new_results = []

    for r in results:

        try:

            song = r.get("song")
            artist = r.get("artist")

            exists = db.query(ScanResult).filter(
                ScanResult.user_email == email,
                ScanResult.title == song,
                ScanResult.channel == artist
            ).first()

            if exists:
                continue

            new_entry = ScanResult(
                user_email=email,
                youtube_video_id=f"{song}-{artist}",
                title=song,
                channel=artist,
                youtube_url=url
            )

            db.add(new_entry)

            new_results.append(r)

        except:
            continue

    db.commit()

    return {
        "success": True,
        "results": new_results
    }


# -------------------------
# SCAN HISTORY
# -------------------------

@app.post("/scan-history")
def scan_history(data: dict):

    token = data.get("token")

    payload = verify_token(token)

    if not payload:
        return {"error": "invalid_token"}

    email = payload["email"]

    db = SessionLocal()

    results = db.query(ScanResult)\
        .filter(ScanResult.user_email == email)\
        .order_by(ScanResult.detected_at.desc())\
        .all()

    output = []

    for r in results:

        output.append({
            "title": r.title,
            "artist": r.channel,
            "url": r.youtube_url,
            "views": r.views,
            "date": r.detected_at
        })

    return {
        "success": True,
        "results": output
    }


# -------------------------
# USER INFO
# -------------------------

@app.post("/user-info")
def user_info(data: dict):

    token = data.get("token")

    payload = verify_token(token)

    if not payload:
        return {"error": "invalid_token"}

    email = payload["email"]

    db = SessionLocal()

    user = db.query(User).filter(User.email == email).first()

    if not user:
        return {"error": "user_not_found"}

    return {
    "success": True,
    "token": token,
    "plan": user.plan,
    "credits": user.credits,
    "admin": user.admin
}
