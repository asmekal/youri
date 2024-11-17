# models.py
from pydantic import BaseModel
from typing import Optional, List, Dict

class FileContent(BaseModel):
    filename: str
    content: str  # base64 encoded content

class ComponentRequest(BaseModel):
    intent: Optional[str] = None
    component_id: Optional[str] = None
    files: Optional[List[FileContent]] = None
    context: Dict = {}

class ComponentResponse(BaseModel):
    component_id: str
    code: str
    requires_confirmation: bool

class Component(BaseModel):
    component_id: str
    name: str
    tags: List[str]
    code: str