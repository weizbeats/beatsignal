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
