from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "BEATSIGNAL_SECRET_KEY"
ALGORITHM = "HS256"

def create_token(data:dict):

    payload = data.copy()

    expire = datetime.utcnow() + timedelta(days=7)

    payload.update({"exp":expire})

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return token


def verify_token(token:str):

    try:

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        return payload

    except:

        return None
