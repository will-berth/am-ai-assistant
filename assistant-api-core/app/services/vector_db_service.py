from typing import List, Dict, Any, Optional
import chromadb
from chromadb.config import Settings as ChromaSettings
from langchain_chroma import Chroma
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain.schema import Document
from ..config.settings import settings
import os

class VectorDBService:
    def __init__(self):
        os.makedirs(settings.CHROMA_DB_PATH, exist_ok=True)
        
        self.embeddings = OpenAIEmbeddings(
            openai_api_key=settings.OPENAI_API_KEY,
            model=settings.EMBEDDING_MODEL,
            dimensions=settings.EMBEDDING_DIMENSIONS
        )
        
        self.chroma_client = chromadb.PersistentClient(
            path=settings.CHROMA_DB_PATH,
            settings=ChromaSettings(
                anonymized_telemetry=False,
                allow_reset=True
            )
        )
        
        self.vector_store = Chroma(
            client=self.chroma_client,
            collection_name=settings.CHROMA_COLLECTION_NAME,
            embedding_function=self.embeddings,
            persist_directory=settings.CHROMA_DB_PATH
        )
    
    async def store_document_chunks(self, file_id: int, chunks_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            documents = []
            for i, chunk in enumerate(chunks_data['chunks']):
                if chunk.strip():
                    doc = Document(
                        page_content=chunk.strip(),
                        metadata={
                            "file_id": str(file_id),
                            "chunk_index": i,
                            "chunk_length": len(chunk.strip()),
                            "source": f"file_{file_id}_chunk_{i}"
                        }
                    )
                    documents.append(doc)
            
            if documents:
                doc_ids = [f"file_{file_id}_chunk_{i}" for i in range(len(documents))]
                
                self.vector_store.add_documents(
                    documents=documents,
                    ids=doc_ids
                )
                
                return {
                    "success": True,
                    "message": f"Save {len(documents)} chunks in Chroma DB",
                    "stored_chunks": len(documents),
                    "file_id": file_id
                }
            else:
                return {
                    "success": False,
                    "message": "Dont have chunks to store",
                    "stored_chunks": 0,
                    "file_id": file_id
                }
                
        except Exception as e:
            return {
                "success": False,
                "message": f"Error in storing chunks in Chroma DB: {str(e)}",
                "stored_chunks": 0,
                "file_id": file_id
            }
    
    async def similarity_search(self, query: str, k: int = 5, file_id: Optional[int] = None) -> List[Dict[str, Any]]:
        try:
            filter_dict = None
            if file_id is not None:
                filter_dict = {"file_id": str(file_id)}
            
            if filter_dict:
                results = self.vector_store.similarity_search(
                    query=query,
                    k=k,
                    filter=filter_dict
                )
            else:
                results = self.vector_store.similarity_search(
                    query=query,
                    k=k
                )
            
            formatted_results = []
            for doc in results:
                formatted_results.append({
                    "content": doc.page_content,
                    "metadata": doc.metadata,
                    "file_id": doc.metadata.get("file_id"),
                    "chunk_index": doc.metadata.get("chunk_index"),
                    "source": doc.metadata.get("source")
                })
            
            return formatted_results
            
        except Exception as e:
            return []
    
    async def similarity_search_with_scores(self, query: str, k: int = 5, file_id: Optional[int] = None) -> List[Dict[str, Any]]:

        try:
            filter_dict = None
            if file_id is not None:
                filter_dict = {"file_id": str(file_id)}
            
            if filter_dict:
                results = self.vector_store.similarity_search_with_score(
                    query=query,
                    k=k,
                    filter=filter_dict
                )
            else:
                results = self.vector_store.similarity_search_with_score(
                    query=query,
                    k=k
                )
            
            formatted_results = []
            for doc, score in results:
                formatted_results.append({
                    "content": doc.page_content,
                    "metadata": doc.metadata,
                    "similarity_score": float(score),
                    "file_id": doc.metadata.get("file_id"),
                    "chunk_index": doc.metadata.get("chunk_index"),
                    "source": doc.metadata.get("source")
                })
            
            return formatted_results
            
        except Exception as e:
            return []