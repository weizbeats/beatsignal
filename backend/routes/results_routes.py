from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Result
from auth_middleware import verify_token

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("/results")
def get_results(user_id: int = Depends(verify_token), db: Session = Depends(get_db)):

    results = db.query(Result).filter(Result.user_id == user_id).all()

    data = []

    for r in results:

        data.append({
            "song": r.song,
            "artist": r.artist,
            "score": r.score,
            "isrc": r.isrc,
            "spotify_url": r.spotify_url,
            "cover": r.cover,
            "date": r.date_found
        })

    return data
