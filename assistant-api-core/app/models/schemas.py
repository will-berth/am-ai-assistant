from fastapi import File, UploadFile
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Generic, TypeVar, List, Any
from enum import Enum

T = TypeVar('T')
class ApiResponse(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    error: Optional[str] = None
    message: Optional[str] = None

class FileType(str, Enum):
    TXT = "txt"
    CSV = "csv"

class FileInfo(BaseModel):
    id: int
    file_id: str
    original_filename: str
    file_type: str
    file_size: int
    upload_date: datetime
    content_preview: Optional[str]

class ChatRequest(BaseModel):
    message: str
    # file: UploadFile = File(...) # TODO: add functionality after set the RAG LangChain

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None

class FileUploadData(BaseModel):
    file: FileInfo

class PaginationInfo(BaseModel):
    page: int
    size: int
    total: int

class FilesListData(BaseModel):
    files: List[FileInfo]
    pagination: PaginationInfo

class ChatData(BaseModel):
    response: str

FileUploadResponse = ApiResponse[FileUploadData]
FilesListResponse = ApiResponse[FilesListData]
ChatResponse = ApiResponse[ChatData]