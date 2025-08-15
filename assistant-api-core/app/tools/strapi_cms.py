from pydantic import BaseModel, Field
from langchain.tools import StructuredTool, tool
from datetime import datetime
from ..config.settings import settings
import requests
import json

@tool
def create_note(note_data: str):
    """
    Creates a note in Strapi. Input must be a valid JSON string.
    
    Args:
        note_data (str): Note data as JSON string with required 'title' and 'content' fields.
                        Optional: 'added_at' (ISO date string).
                        Example: '{"title": "My Note", "content": "Note content", "added_at": "2025-08-14T22:00:00Z"}'
        
    Returns:
        dict: Strapi API response
    """
    
    try:
        cleaned_data = note_data.strip()
        if cleaned_data.startswith('"') and cleaned_data.endswith('"'):
            cleaned_data = cleaned_data[1:-1]
        
        cleaned_data = cleaned_data.replace('\\"', '"').replace('\\n', '\n')
        
        data = json.loads(cleaned_data)
    except json.JSONDecodeError as e:
        return {"error": f"Invalid JSON format: {str(e)}. Received: {note_data}"}
    
    title = data.get("title", "")
    content = data.get("content", "")
    added_at = data.get("added_at")
    
    if not added_at:
        added_at = datetime.utcnow().isoformat() + 'Z'
    
    url = f"{settings.STRAPI_URL}/api/notes"
    headers = {
        "Authorization": f"Bearer {settings.JWT_TOKEN}",
        "Content-Type": "application/json"
    }

    payload = {
        "data": {
            "title": title,
            "description": [
                {
                    "type": "paragraph",
                    "children": [{"type": "text", "text": content}]
                }
            ],
            "added_at": added_at
        }
    }
    
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code not in (200, 201):
        return {"error": f"Error creating note: {response.status_code} {response.text}"}
    
    return response.json()