import pandas as pd
from typing import Dict, Any

class FileProcessor:
    
    async def read_txt_file(self, file_path: str) -> str:
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
            return content
        except Exception as e:
            raise Exception(f"Error reading TXT file: {str(e)}")
    
    async def read_csv_file(self, file_path: str) -> str:
        try:
            df = pd.read_csv(file_path)
            content = df.to_string(index=False)
            return content
        except Exception as e:
            raise Exception(f"Error reading CSV file: {str(e)}")
    
    async def read_file_content(self, file_path: str, file_type: str) -> str:
        if file_type.lower() == "txt":
            return await self.read_txt_file(file_path)
        elif file_type.lower() == "csv":
            return await self.read_csv_file(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
    
    def get_content_preview(self, content: str, max_length: int = 500) -> str:
        if len(content) <= max_length:
            return content
        return content[:max_length] + "..."
    
    def get_file_info(self, file_path: str) -> Dict[str, Any]:
        import os
        try:
            stat = os.stat(file_path)
            return {
                "size": stat.st_size,
                "exists": True
            }
        except Exception:
            return {"exists": False}