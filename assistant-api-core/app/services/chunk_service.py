from typing import List
from langchain.text_splitter import RecursiveCharacterTextSplitter
from ..config.settings import settings
import csv
import io

class ChunkService:
    def __init__(self):
        self.txt_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.TXT_CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )
        
        self.csv_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CSV_CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
            length_function=len,
            separators=["\n", ",", " "]
        )
    
    def create_chunks(self, content: str, file_type: str) -> List[str]:
        if file_type.lower() == 'txt':
            return self._process_txt_chunks(content)
        elif file_type.lower() == 'csv':
            return self._process_csv_chunks(content)
        else:
            return self.txt_splitter.split_text(content)
    
    def _process_txt_chunks(self, content: str) -> List[str]:
        return self.txt_splitter.split_text(content)
    
    def _process_csv_chunks(self, content: str) -> List[str]:
        try:
            csv_reader = csv.reader(io.StringIO(content))
            rows = list(csv_reader)
            
            if not rows:
                return []
            
            headers = rows[0]
            data_rows = rows[1:]
            
            text_content = ""
            for row in data_rows:
                row_text = ""
                for i, value in enumerate(row):
                    if i < len(headers):
                        row_text += f"{headers[i]}: {value}, "
                text_content += row_text.rstrip(", ") + "\n"
            
            return self.csv_splitter.split_text(text_content)
            
        except Exception as e:
            return self.csv_splitter.split_text(content)