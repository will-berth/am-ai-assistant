from typing import List, Dict, Any
from langchain_openai.embeddings import OpenAIEmbeddings
from ..config.settings import settings
import asyncio

class EmbeddingService:
    def __init__(self):
        print(settings.OPENAI_API_KEY, settings.EMBEDDING_MODEL, settings.EMBEDDING_DIMENSIONS)
        self.embeddings = OpenAIEmbeddings(
            openai_api_key=settings.OPENAI_API_KEY,
            model=settings.EMBEDDING_MODEL,
            dimensions=settings.EMBEDDING_DIMENSIONS
        )
    
    async def create_embeddings(self, texts: List[str]) -> List[List[float]]:
        try:
            valid_texts = [text.strip() for text in texts if text.strip()]
            
            if not valid_texts:
                return []
            
            embeddings = await asyncio.to_thread(
                self.embeddings.embed_documents, 
                valid_texts
            )
            
            return embeddings
            
        except Exception as e:
            print(f"Embedding creation failed: {str(e)}")
            raise e
    
    def prepare_document_embeddings(self, file_id: int, chunks: List[str]) -> List[Dict[str, Any]]:
        documents = []
        
        for i, chunk in enumerate(chunks):
            if chunk.strip():
                documents.append({
                    "content": chunk.strip(),
                    "metadata": {
                        "file_id": file_id,
                        "chunk_index": i,
                        "chunk_length": len(chunk.strip())
                    }
                })
        
        return documents