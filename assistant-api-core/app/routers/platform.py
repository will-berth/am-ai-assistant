from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Query
from sqlalchemy.orm import Session
from ..config.database import get_db
from ..services.file_service import FileService
from ..models.schemas import FileUploadResponse, FilesListResponse
from fastapi.responses import JSONResponse
from typing import Optional

router = APIRouter(prefix="/platform", tags=["Platform"])
file_service = FileService()

@router.post("/upload-file", response_model=FileUploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    code, result = await file_service.upload_file(file, db)

    if not result.success:
        return JSONResponse(
            status_code=code,
            content=result.model_dump()
        )
    
    return result 

@router.get("/files", response_model=FilesListResponse)
async def get_files(
    page: int = Query(1, ge=1, description="Page Number"),
    size: int = Query(10, ge=1, le=100, description="Size page"),
    query: Optional[str] = Query(None, description="Represent name file to search"),
    db: Session = Depends(get_db)
):
    code, result = file_service.get_files(db, page, size, query)

    if not result.success:
        return JSONResponse(
            status_code=code,
            content=result.model_dump()
        )
    
    return result 