from sqlalchemy import Column, Integer, String, Boolean, DateTime
from .db import Base
from datetime import datetime


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String, unique=True, index=True)
    password = Column(String)

    plan = Column(String, default="trial")
    credits = Column(Integer, default=5)

    admin = Column(Boolean, default=False)

    verified = Column(Boolean, default=False)
    verify_token = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)


# -----------------------------------------
# SCAN RESULTS TABLE
# -----------------------------------------

class ScanResult(Base):

    __tablename__ = "scan_results"

    id = Column(Integer, primary_key=True, index=True)

    user_email = Column(String, index=True)

    youtube_video_id = Column(String, index=True)

    title = Column(String)
    channel = Column(String)

    views = Column(Integer, default=0)

    youtube_url = Column(String)

    detected_at = Column(DateTime, default=datetime.utcnow)

    status = Column(String, default="detected")
