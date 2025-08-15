from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from ..services.file_service import FileService
from ..models.schemas import ChatRequest, ChatResponse, ChatData
from ..utils.response_utils import ResponseUtils
from fastapi.responses import JSONResponse
from ..services.rag_service import RAGService

router = APIRouter(prefix="/assistant", tags=["Assistant"])
rag_service = RAGService()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not request.message.strip():
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "data": None,
                "error": "EMPTY_MESSAGE",
                "message": "Message cannot be empty"
            }
        )
    
    code, response = await rag_service.query_documents(request.message)
    
    if not response.success:
        return JSONResponse(
            status_code=code,
            content=response.model_dump()
        )

    return response