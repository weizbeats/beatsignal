from fastapi import APIRouter
from pydantic import BaseModel
import sqlite3
import uuid
import hashlib

router = APIRouter()

DB = "beatsignal.db"


class AuthData(BaseModel):
    email: str
    password: str


def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()


@router.post("/register")
def register(data: AuthData):

    conn = sqlite3.connect(DB)
    cur = conn.cursor()

    cur.execute(
        "CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, password TEXT, verified INTEGER, verify_token TEXT)"
    )

    cur.execute("SELECT * FROM users WHERE email=?", (data.email,))
    user = cur.fetchone()

    if user:
        return {"success": False, "error": "email_exists"}

    token = str(uuid.uuid4())

    cur.execute(
        "INSERT INTO users VALUES (?,?,?,?)",
        (data.email, hash_password(data.password), 0, token),
    )

    conn.commit()
    conn.close()

    print("VERIFY TOKEN:", token)

    return {
        "success": True,
        "verify_token": token
    }


@router.post("/verify")
def verify(token: str):

    conn = sqlite3.connect(DB)
    cur = conn.cursor()

    cur.execute(
        "SELECT email FROM users WHERE verify_token=?",
        (token,),
    )

    user = cur.fetchone()

    if not user:
        return {"success": False}

    cur.execute(
        "UPDATE users SET verified=1 WHERE verify_token=?",
        (token,),
    )

    conn.commit()
    conn.close()

    return {"success": True}


@router.post("/login")
def login(data: AuthData):

    conn = sqlite3.connect(DB)
    cur = conn.cursor()

    cur.execute(
        "SELECT password,verified FROM users WHERE email=?",
        (data.email,),
    )

    user = cur.fetchone()

    if not user:
        return {"success": False, "error": "user_not_found"}

    if user[0] != hash_password(data.password):
        return {"success": False, "error": "wrong_password"}

    if user[1] == 0:
        return {"success": False, "error": "email_not_verified"}

    token = str(uuid.uuid4())

    return {
        "success": True,
        "token": token
    }
