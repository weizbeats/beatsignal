import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL")

# -------------------------
# FIX RAILWAY POSTGRES URL
# -------------------------

if DATABASE_URL:

    # Railway a veces entrega postgres://
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace(
            "postgres://",
            "postgresql+psycopg://",
            1
        )

    # SQLAlchemy default usa psycopg2
    if DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace(
            "postgresql://",
            "postgresql+psycopg://",
            1
        )

# -------------------------
# LOCAL SQLITE (DEV)
# -------------------------

if not DATABASE_URL:

    DATABASE_URL = "sqlite:///./database/beatsignal.db"

    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

# -------------------------
# PRODUCTION DATABASE
# -------------------------

else:

    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True
    )

# -------------------------
# SESSION
# -------------------------

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()
