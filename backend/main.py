from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

import os
import shutil
import subprocess

from datetime import datetime, timedelta
from urllib.parse import urlparse, parse_qs

from services.scanner import scan_url

from jose import jwt
from passlib.context import CryptContext

from database.db import SessionLocal, engine
from database.models import Base, User, ScanResult

from config.plans import PLANS

from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware


# -------------------------
# ENSURE FFMPEG
# -------------------------

def ensure_ffmpeg():

    if shutil.which("ffmpeg"):
        print("FFMPEG already installed")
        return

    print("Installing FFMPEG...")

    subprocess.run(["apt-get","update"])
    subprocess.run(["apt-get","install","-y","ffmpeg"])


ensure_ffmpeg()


# -------------------------
# APP
# -------------------------

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

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except:
        return None


# -------------------------
# EXTRACT VIDEO ID
# -------------------------

def extract_video_id(url):

    try:

        parsed = urlparse(url)

        if "youtube.com" in parsed.netloc:

            query = parse_qs(parsed.query)
            return query.get("v",[None])[0]

        if "youtu.be" in parsed.netloc:

            return parsed.path.strip("/")

    except:
        pass

    return None


# -------------------------
# REGISTER
# -------------------------

@limiter.limit("5/minute")
@app.post("/register")
def register(request: Request, data: dict):

    email = data.get("email")
    password = data.get("password")

    db = SessionLocal()

    if db.query(User).filter(User.email == email).first():

        return {"success":False,"error":"email_exists"}

    hashed = pwd_context.hash(password)

    user = User(
        email=email,
        password=hashed,
        plan="free",
        credits=PLANS["free"]["credits"],
        verified=True
    )

    db.add(user)
    db.commit()

    return {"success":True}


# -------------------------
# LOGIN
# -------------------------

@app.post("/login")
def login(data: dict):

    email = data.get("email")
    password = data.get("password")

    db = SessionLocal()

    user = db.query(User).filter(User.email == email).first()

    if not user:

        return {"success":False,"error":"user_not_found"}

    if not pwd_context.verify(password,user.password):

        return {"success":False,"error":"wrong_password"}

    token = create_token(email)

    return {
        "success":True,
        "token":token,
        "credits":user.credits
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
        return {"error":"invalid_token"}

    email = payload["email"]

    db = SessionLocal()

    user = db.query(User).filter(User.email == email).first()

    if not user:
        return {"error":"user_not_found"}

    video_id = extract_video_id(url)

    if not video_id:
        return {"error":"invalid_youtube_url"}

    # ----------------------------------
    # CHECK IF VIDEO ALREADY SCANNED
    # ----------------------------------

    existing_scan = db.query(ScanResult).filter(
        ScanResult.user_email == email,
        ScanResult.youtube_video_id == video_id
    ).first()

    if existing_scan:

        return {
            "success":False,
            "error":"already_scanned",
            "message":"You already scanned this video"
        }

    # ----------------------------------
    # RUN SCANNER
    # ----------------------------------

    results = scan_url(url)

    new_results = []

    for r in results:

        try:

            song = r.get("song")
            artist = r.get("artist")

            entry = ScanResult(
                user_email=email,
                youtube_video_id=video_id,
                title=song,
                channel=artist,
                youtube_url=url
            )

            db.add(entry)

            new_results.append(r)

        except:
            continue

    db.commit()

    return {
        "success":True,
        "results":new_results
    }


# -------------------------
# HISTORY
# -------------------------

@app.post("/scan-history")
def history(data: dict):

    token = data.get("token")

    payload = verify_token(token)

    if not payload:
        return {"error":"invalid_token"}

    email = payload["email"]

    db = SessionLocal()

    rows = db.query(ScanResult)\
        .filter(ScanResult.user_email == email)\
        .order_by(ScanResult.detected_at.desc())\
        .all()

    out = []

    for r in rows:

        out.append({
            "title":r.title,
            "artist":r.channel,
            "url":r.youtube_url,
            "date":r.detected_at
        })

    return {
        "success":True,
        "results":out
    }


# -------------------------
# USER INFO
# -------------------------

@app.post("/user-info")
def user_info(data: dict):

    token = data.get("token")

    payload = verify_token(token)

    if not payload:
        return {"error":"invalid_token"}

    email = payload["email"]

    db = SessionLocal()

    user = db.query(User).filter(User.email == email).first()

    if not user:
        return {"error":"user_not_found"}

    return {
        "success":True,
        "credits":user.credits,
        "plan":user.plan,
        "admin":user.admin
    }
