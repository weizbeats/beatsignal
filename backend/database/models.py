from sqlalchemy import Column, Integer, String, Boolean
from .db import Base

class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String, unique=True, index=True)
    password = Column(String)

    plan = Column(String, default="trial")
    credits = Column(Integer, default=5)

    admin = Column(Boolean, default=False)
