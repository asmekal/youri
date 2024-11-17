from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import ComponentRequest, ComponentResponse

app = FastAPI()

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory component store (for demo purposes)
component_store = {}

@app.get("/")
def read_root():
    return {"message": "Backend is running"}

@app.post("/generate_component", response_model=ComponentResponse)
def generate_component(request: ComponentRequest):
    # For simplicity, we'll return a hardcoded component based on the request
    if "weather" in request.intent.lower():
        component_code = """
const WeatherWidget = (props) => {
    const { Paper, Typography } = props;
    return (
        <Paper elevation={3} style={{ padding: '16px', textAlign: 'center' }}>
            <Typography variant="h6">Weather Widget</Typography>
            <Typography variant="body1">It's sunny and 25°C outside.</Typography>
        </Paper>
    );
};

export default WeatherWidget;
"""
        component_id = "WeatherWidget"
        component_store[component_id] = component_code
        return ComponentResponse(
            component_id=component_id,
            code=component_code,
            requires_confirmation=False,
        )
    else:
        raise HTTPException(status_code=404, detail="Component not found")
