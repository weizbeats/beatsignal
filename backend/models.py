from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from database import Base


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String, unique=True, index=True)

    password = Column(String)

    created_at = Column(DateTime, default=datetime.utcnow)


class Beat(Base):

    __tablename__ = "beats"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    name = Column(String)

    producer = Column(String)

    url = Column(String)

    created_at = Column(DateTime, default=datetime.utcnow)

    last_scan = Column(DateTime, nullable=True)


class Result(Base):

    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer)

    beat_id = Column(Integer)

    song = Column(String)

    artist = Column(String)

    score = Column(Integer)

    isrc = Column(String)

    spotify_url = Column(String)

    cover = Column(String)

    date_found = Column(DateTime, default=datetime.utcnow)
