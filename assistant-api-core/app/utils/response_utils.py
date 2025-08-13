from typing import Optional, Any
from ..models.schemas import ApiResponse, T

class ResponseUtils:
    @staticmethod
    def success(data: Any = None, message: Optional[str] = None) -> ApiResponse:
        return ApiResponse(
            success=True,
            data=data,
            message=message
        )
    
    @staticmethod
    def error(error: str, message: Optional[str] = None) -> ApiResponse:
        return ApiResponse(
            success=False,
            error=error,
            message=message
        )