from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import ComponentRequest, ComponentResponse
from component_generator import make_ui_component
from component_store import ComponentStore, DEFAULT_COMPONENTS
from dotenv import load_dotenv
import tempfile
import os
import base64

load_dotenv()

app = FastAPI()
component_store = ComponentStore()
for component in DEFAULT_COMPONENTS:
    component_store.add_component(component)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Backend is running"}

@app.post("/generate_component", response_model=ComponentResponse)
async def generate_component(request: ComponentRequest):
    try:
        # Handle file contents if provided
        file_paths = []
        if request.files:
            for file in request.files:
                # Create temporary file from base64 content
                with tempfile.NamedTemporaryFile(delete=False, suffix='.txt') as temp_file:
                    content = base64.b64decode(file.content)
                    temp_file.write(content)
                    file_paths.append(temp_file.name)
        
        # If files are provided but no intent, analyze files
        context_dict = dict(request.context)  # Create mutable copy
        if file_paths and not request.intent:
            from parse_files import summarize_all_files
            file_summary = summarize_all_files(file_paths)
            request.intent = "Create UI component based on uploaded files"
            context_dict["file_contents"] = file_summary
        
        # Generate or update component code
        if request.component_id:
            component = component_store.get_component(request.component_id)
            if not component:
                raise HTTPException(status_code=404, detail="Component not found")
            component_code = make_ui_component(request.intent, context_dict, component["code"])
            component_store.update_component(request.component_id, component_code)
            component_id = request.component_id
        else:
            # Find similar components and add to context
            similar_components = component_store.find_similar_components(request.intent)
            if similar_components:
                context_dict["similar_components"] = similar_components
            
            component_code = make_ui_component(request.intent, context_dict, None)
            from uuid import uuid4
            component_id = str(uuid4())
            component_store.add_component({
                "component_id": component_id,
                "name": request.intent,
                "tags": component_store.extract_tags(request.intent),
                "code": component_code,
            })
        
        # Clean up temporary files
        for file_path in file_paths:
            try:
                os.unlink(file_path)
            except Exception as e:
                print(f"Error deleting temporary file {file_path}: {e}")
        
        return ComponentResponse(
            component_id=component_id,
            code=component_code,
            requires_confirmation=False
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/list_components")
def list_components():
    return {"components": component_store.get_all_components()}