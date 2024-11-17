from typing import Optional

def make_ui_component(intent: str, context: dict, component_code: Optional[str]) -> str:
    component_code = "Default generated component"
    if intent and "weather" in intent.lower():
        component_code = """
const DefaultComponent = () => {
    return (
        <Paper elevation={3} style={{ padding: '16px', textAlign: 'center' }}>
            <Typography variant="h6">Default Component</Typography>
            <Typography variant="body1">This is a dynamically generated component.</Typography>
        </Paper>
    );
};

export default DefaultComponent;
"""
    return component_code