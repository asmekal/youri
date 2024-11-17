# backend/main.py

from fastapi import FastAPI, HTTPException, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from models import ComponentResponse
from component_generator import make_ui_component
from component_store import ComponentStore, DEFAULT_COMPONENTS
from dotenv import load_dotenv
import tempfile
import os
import json
from typing import Optional, List
from uuid import uuid4

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
async def generate_component(
    component_id: Optional[str] = Form(None),
    intent: Optional[str] = Form(None),
    context: Optional[str] = Form('{}'),  # Default to empty JSON
    files: Optional[List[UploadFile]] = File(None)
):
    try:
        # Parse context JSON string to dictionary
        try:
            context_dict = json.loads(context)
        except json.JSONDecodeError:
            context_dict = {}

        # Handle file contents if provided
        file_paths = []
        if files:
            for file in files:
                # Create temporary file from uploaded file
                with tempfile.NamedTemporaryFile(delete=False, suffix='.txt') as temp_file:
                    content = await file.read()
                    temp_file.write(content)
                    file_paths.append(temp_file.name)
        
        # If files are provided but no intent, analyze files
        if file_paths and not intent:
            from parse_files import summarize_all_files
            file_summary = summarize_all_files(file_paths)
            intent = "Create UI component based on uploaded files"
            context_dict["file_contents"] = file_summary
        
        # Generate or update component code
        if component_id:
            component = component_store.get_component(component_id)
            if not component:
                raise HTTPException(status_code=404, detail="Component not found")
            component_code = make_ui_component(intent, context_dict, component["code"])
            component_store.update_component(component_id, component_code)
            # component_id remains the same
        else:
            # Find similar components and add to context
            similar_components = component_store.find_similar_components(intent)
            if similar_components:
                context_dict["similar_components"] = similar_components
            
            component_code = make_ui_component(intent, context_dict, None)
            component_id = str(uuid4())
            component_store.add_component({
                "component_id": component_id,
                "name": intent,
                "tags": component_store.extract_tags(intent),
                "code": component_code,
            })
        
        # Clean up temporary files
        for file_path in file_paths:
            try:
                os.unlink(file_path)
            except Exception as e:
                print(f"Error deleting temporary file {file_path}: {e}")

        print(f"Returning component with id: ${component_id}")
        print(f"And code:\n${component_code}")
        
        return ComponentResponse(
            component_id=component_id,
            code=component_code,
            requires_confirmation=False
        )
        
    except HTTPException as he:
        raise he  # Re-raise HTTP exceptions as is
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/list_components")
def list_components():
    return {"components": component_store.get_all_components()}
