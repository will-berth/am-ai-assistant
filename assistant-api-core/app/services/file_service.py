import os
import aiofiles
from typing import List, Optional
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from ..models.file_model import FileRecord
from ..models.schemas import FileUploadResponse, FileInfo, FileUploadData, PaginationInfo, FilesListData
from ..utils.file_processor import FileProcessor
from .chunk_service import ChunkService
from ..config.settings import settings
from ..utils.response_utils import ResponseUtils
from .embedding_service import EmbeddingService
from .vector_db_service import VectorDBService

class FileService:
    
    def __init__(self):
        self.file_processor = FileProcessor()
        self.chunk_service = ChunkService()
        self.embedding_service = EmbeddingService()
        self.vector_db_service = VectorDBService()
        self.upload_dir = settings.UPLOAD_DIR
        self.max_file_size = settings.MAX_FILE_SIZE
        os.makedirs(self.upload_dir, exist_ok=True)
    
    async def upload_file(self, file: UploadFile, db: Session):
        try:
            if not file.filename:
                raise HTTPException(status_code=400, detail="No filename provided")
            
            file_extension = file.filename.split('.')[-1].lower()
            if file_extension not in ['txt', 'csv']:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Unsupported file type. Only TXT and CSV files are allowed."
                )
            
            content = await file.read()
            if len(content) > self.max_file_size:
                raise HTTPException(
                    status_code=413,
                    detail=f"File size exceeds maximum allowed size"
                )
            
            file_record = FileRecord(
                original_filename=file.filename,
                file_path="",
                file_type=file_extension,
                file_size=len(content)
            )
            
            db.add(file_record)
            db.commit()
            db.refresh(file_record)
            
            file_path = os.path.join(self.upload_dir, f"{file_record.file_id}_{file.filename}")
            file_record.file_path = file_path
            
            async with aiofiles.open(file_path, 'wb') as f:
                await f.write(content)
            
            try:
                file_content = await self.file_processor.read_file_content(
                    file_path, file_extension
                )
                file_record.content_preview = self.file_processor.get_content_preview(file_content)

                chunks = self.chunk_service.create_chunks(file_content, file_extension)
                embeddings = await self.embedding_service.create_embeddings(chunks)
                documents = self.embedding_service.prepare_document_embeddings(file_record.file_id, chunks)
                
                chunks_data = {
                    "chunks": chunks,
                    "embeddings": embeddings,
                    "documents": documents,
                    "total_chunks": len(chunks)
                }

                storage_result = await self.vector_db_service.store_document_chunks(file_record.file_id, chunks_data)
                
            except Exception as e:
                print(f"Warning: Could not process file content: {e}")
            
            db.commit()
            
            file_info = FileInfo(
                file_id=file_record.file_id,
                original_filename=file_record.original_filename,
                file_type=file_record.file_type,
                file_size=file_record.file_size,
                upload_date=file_record.upload_date,
                content_preview=file_record.content_preview,
                id=file_record.id
            )

            data = FileUploadData(file=file_info)
            return 200, ResponseUtils.success(data=data, message="File uploaded successfully")
        except HTTPException as http_exc:
            return http_exc.status_code, ResponseUtils.error(
                error="FILE_UPLOAD_FAILED",
                message=str(http_exc.detail)
            )
        except Exception as e:
            return 500, ResponseUtils.error(
                error="FILE_UPLOAD_FAILED",
                message=f"Error al subir el archivo: {str(e)}"
            )
    
    def get_files(self, db: Session, page: int = 1, size: int = 10, search: Optional[str] = None):
        try:
            offset = (page - 1) * size

            query = db.query(FileRecord)

            print(f"Fetching files: page={page}, size={size}, search={search}")

            if search:
                query = query.filter(FileRecord.original_filename.ilike(f"%{search}%"))

            total = query.count()

            files = query.order_by(FileRecord.upload_date.desc())\
                        .offset(offset)\
                        .limit(size)\
                        .all()
            
            file_responses = [
                FileInfo(
                    id=f.id,
                    file_id=f.file_id,
                    original_filename=f.original_filename,
                    file_type=f.file_type,
                    file_size=f.file_size,
                    upload_date=f.upload_date,
                    content_preview=f.content_preview
                ) for f in files
            ]

            pagination = PaginationInfo(
                page=page,
                size=size,
                total=total,
            )

            data = FilesListData(files=file_responses, pagination=pagination)

            return 200, ResponseUtils.success(
                data=data,
                message="Files founded"
            )
            
        except Exception as e:
            return 500, ResponseUtils.error(
                error="FILES_RETRIEVAL_FAILED",
                message=f"Error in retrieving files: {str(e)}"
            )
    
