from pydantic import BaseModel

class ComponentRequest(BaseModel):
    user_id: str
    intent: str
    context: dict = {}

class ComponentResponse(BaseModel):
    component_id: str
    code: str
    requires_confirmation: bool
