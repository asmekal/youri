# component_store.py
from typing import List, Dict, Optional
import re

class ComponentStore:
    def __init__(self):
        self._components: List[Dict] = []
    
    def add_component(self, component: Dict) -> None:
        self._components.append(component)
    
    def get_component(self, component_id: str) -> Optional[Dict]:
        return next((comp for comp in self._components if comp["component_id"] == component_id), None)
    
    def update_component(self, component_id: str, new_code: str) -> None:
        component = self.get_component(component_id)
        if component:
            component["code"] = new_code
    
    def get_all_components(self) -> List[Dict]:
        return self._components
    
    def extract_tags(self, intent: str) -> List[str]:
        # Simple tag extraction - split on spaces and common punctuation
        words = re.findall(r'\w+', intent.lower())
        # Filter out common words
        stop_words = {'a', 'an', 'the', 'in', 'on', 'at', 'for', 'to', 'of', 'with'}
        return [word for word in words if word not in stop_words]
    
    def find_similar_components(self, intent: str) -> List[Dict]:
        intent_tags = set(self.extract_tags(intent))
        similar_components = []
        
        for component in self._components:
            component_tags = set(component["tags"])
            if len(intent_tags.intersection(component_tags)) > 0:
                similar_components.append(component)
        
        return similar_components[:3]  # Return top 3 similar components


# Initialize with default components
DEFAULT_COMPONENTS = [
    {
        "component_id": "wather_widget",
        "name": "Weather Now",
        "tags": ["weather", "now"],
        "code": """
const WeatherWidget = () => {
    return (
        <Paper elevation={3} style={{ padding: '16px', textAlign: 'center' }}>
            <Typography variant="h6">Weather Widget</Typography>
            <Typography variant="body1">It's sunny and 25°C outside.</Typography>
        </Paper>
    );
};

export default WeatherWidget;
""",
    },
    {
        "component_id": "empty_component",
        "name": "Empty Component",
        "tags": ["default", "dynamic"],
        "code": """
const DefaultComponent = () => {
    return (
        <Paper elevation={3} style={{ padding: '16px', textAlign: 'center' }}>
            <Typography variant="h6">Default Component</Typography>
            <Typography variant="body1">This is a dynamically generated component.</Typography>
        </Paper>
    );
};

export default DefaultComponent;
""",
    },
]
