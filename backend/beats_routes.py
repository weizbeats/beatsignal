from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Beat
from auth_middleware import verify_token

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/beats")
def add_beat(data: dict, user_id: int = Depends(verify_token), db: Session = Depends(get_db)):

    name = data.get("name")
    producer = data.get("producer")
    url = data.get("url")

    beat = Beat(
        user_id=user_id,
        name=name,
        producer=producer,
        url=url
    )

    db.add(beat)
    db.commit()

    return {"status": "ok"}


@router.get("/beats")
def get_beats(user_id: int = Depends(verify_token), db: Session = Depends(get_db)):

    beats = db.query(Beat).filter(Beat.user_id == user_id).all()

    result = []

    for b in beats:

        result.append({
            "id": b.id,
            "name": b.name,
            "producer": b.producer,
            "url": b.url,
            "last_scan": b.last_scan
        })

    return result
