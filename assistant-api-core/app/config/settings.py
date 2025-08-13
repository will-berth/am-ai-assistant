
from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    PORT: int
    DATABASE_URL: str
    
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE: int = 10485760  # 10MB
    
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "ActivaMente AI Assistant Backend V1.0"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        os.makedirs(self.UPLOAD_DIR, exist_ok=True)

settings = Settings()