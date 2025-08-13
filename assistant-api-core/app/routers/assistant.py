from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from ..services.file_service import FileService
from ..models.schemas import ChatRequest, ChatResponse, ChatData
from ..utils.response_utils import ResponseUtils
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/assistant", tags=["Assistant"])
file_service = FileService()

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
    
    response = 'HOLA BRO'
    data = ChatData(
        response=response,
    )

    result = ResponseUtils.success(data=data, message="Assintan responded successfully")
    return result