from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    query: str
    document_ids: Optional[List[int]] = None

class Source(BaseModel):
    filename: str
    content: str

class ChatResponse(BaseModel):
    summary: str
    key_points: List[str]
    explanation: str
    sources: List[Source]
