from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from .settings import settings
from typing import Generator

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    from ..models.file_model import Base
    Base.metadata.create_all(bind=engine)