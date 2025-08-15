
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

    #CHUNKS
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    
    TXT_CHUNK_SIZE: int = 1000
    CSV_CHUNK_SIZE: int = 500

    #EMBEDDINGS
    OPENAI_API_KEY: str = "openai_api_key"
    EMBEDDING_MODEL: str = "text-embedding-ada-002"
    EMBEDDING_DIMENSIONS: int = 1536

    # Configuración para Chroma DB
    CHROMA_DB_PATH: str = "./chroma_db"
    CHROMA_COLLECTION_NAME: str = "documents"

    # Configuración para LLM
    LLM_MODEL: str = "gpt-3.5-turbo"
    LLM_TEMPERATURE: float = 0.1
    MAX_TOKENS: int = 1000
    MAX_CONTEXT_CHUNKS: int = 5

    # Strapi
    JWT_TOKEN: str = "my_api_key"
    STRAPI_URL: str = "http://localhost:1337"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        os.makedirs(self.UPLOAD_DIR, exist_ok=True)

settings = Settings()